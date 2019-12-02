const path = require('path');
const request = require('request-promise');
const express = require('express');
const app = express();
const publicPath = path.join(__dirname, '..', 'public');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser')
const admin = require('firebase-admin');
const moment = require('moment');
moment.locale('th');
const serviceAccount = require('./key.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
    // credential: admin.credential.cert({
    //     "type": "service_account",
    //     "project_id": "demodb-26ade",
    //     "private_key_id": process.env.ADMIN_PRIVATE_KEY_ID,
    //     "private_key": process.env.ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
    //     "client_email": process.env.CLIENT_EMAIL,
    //     "client_id": process.env.CLIENT_ID,
    //     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    //     "token_uri": "https://oauth2.googleapis.com/token",
    //     "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    // })
});
var db = admin.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true };
db.settings(settings);
const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';
const LINE_HEADER = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer hlF5sNoo0lO2bbTMn7uwbhXNz5KoNx7iUqVIDvUSFs5orA86LQCJ7OpLPJLV5Gt/xWryxeiVk5WAuqvwdwnYSVox4U59vs2wmhNKOnHxXrlLZhPTadvni08Mp3E8hMoZxh8HN8SwX190m2nPOkjUwQdB04t89/1O/w1cDnyilFU=`
};
var jsonParser = bodyParser.json();
app.post('/api/linebot', jsonParser, (req, res) => {
    const request = req.body.events[0];
    const msg = request.message.text;
    const userId = request.source.userId;

    let obj = {
        replyToken: request.replyToken,
        messages: []
    };

    if (msg.indexOf('#shop') > -1) {
        const msgs = msg.split('#');
        let data = {};
        msgs.map(msg => {
            if (msg.split(':').length == 2) {
                const key = msg.split(':')[0];
                const value = key != 'shop' && key != 'payout'
                    ? Number(msg.split(':')[1])
                    : msg.split(':')[1];
                data[key] = value;
            }
        })
        if (data.shop) {
            const date = '20' + data.shop.substr(0, 2) + '-' + data.shop.substr(2, 2) + '-' + data.shop.substr(4, 2)
            data.payouts = 0;
            if (data.payout) {
                data.payout = data.payout.split(',')
                    .map(pay => {
                        if (pay.split('=').length == 2) {
                            const value = pay.split('=')[1];
                            if (!isNaN(value)) {
                                data.payouts += Number(value)
                                return {
                                    detail: pay.split('=')[0],
                                    value: Number(value)
                                }
                            }
                        }
                    })
            }
            data.balance = ((data.net || 0) + data.payouts) - (data.cash || 0);
            // console.log(data.sale, data.net, data.payouts)
            if (moment(date).isValid()) {
                db.collection('shops').doc(date).set({
                    ...data, date
                }).then(doc => {
                    const walRef = db.collection('aggregation').doc('wallet')
                    walRef.get()
                        .then(doc => {
                            const OldCash = doc.data().cash;
                            const cash = doc.data().cash + data.net;
                            const OldDebit = doc.data().debit;
                            const debit = doc.data().debit + data.debit;
                            walRef.set({ cash, debit })
                            obj.messages.push({
                                type: 'text',
                                text: `สรุปยอดวันที่ ${moment(date).format('ll')}
ยอดขายทั้งหมด ${data.sale}

+++เงินสด+++
ยอดขาย ${data.cash}
นับได้จริง ${data.net}
ค่าใช้จ่ายทั้งหมด ${data.payouts}
${data.payout.map(p => '-' + p.detail + ' ' + p.value)}
---------------------
ยอดเงินสดทั้งหมด ${OldCash} + ${data.net} = ${cash}

+++เดบิต+++
ยอดขาย ${data.debit}
--------------------
ยอดเดบิตทั้งหมด ${OldDebit} + ${data.debit} = ${debit}

`})
                            reply(obj);
                            // res.send(doc)
                        })
                })
            } else {
                obj.messages.push({
                    type: 'text',
                    text: 'วันที่ไม่ถูกต้อง เช่น วันที่ 1 ธันวาคม 2019 => 191201'
                })
                reply(obj);
            }
        }
    }
})

app.use(express.static(publicPath));
app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'))
});
app.listen(port, () => {
    console.log('Server is up!')
});

const reply = (obj) => {
    return request({
        method: `POST`,
        uri: `${LINE_MESSAGING_API}/reply`,
        headers: LINE_HEADER,
        body: JSON.stringify({
            replyToken: obj.replyToken,
            messages: obj.messages
        })
    });
};
const push = (obj) => {
    return request({
        method: `POST`,
        uri: `${LINE_MESSAGING_API}/push`,
        headers: LINE_HEADER,
        body: JSON.stringify(obj)
    });
};
const formatMoney = (amount, decimalCount = 2, decimal = ".", thousands = ",") => {
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
        console.log(e)
    }
};
const yyyymmdd = () => {
    function twoDigit(n) { return (n < 10 ? '0' : '') + n; }
    var now = new Date();
    return '' + now.getFullYear() + twoDigit(now.getMonth() + 1) + twoDigit(now.getDate());
}
const fourDigit = (n) => {
    if (n < 10) {
        return '000' + n.toString();
    } else if (n < 100) {
        return '00' + n.toString();
    } else if (n < 1000) {
        return '0' + n.toString()
    } else {
        return n.toString();
    }
}
const emoji = (hex) => { return String.fromCodePoint(hex) };