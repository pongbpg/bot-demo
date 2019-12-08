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
// const serviceAccount = require('./key.json');
admin.initializeApp({
    // credential: admin.credential.cert(require('./key.json'))
    credential: admin.credential.cert({
        "type": "service_account",
        "project_id": "demodb-26ade",
        "private_key_id": process.env.ADMIN_PRIVATE_KEY_ID,
        "private_key": process.env.ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
        "client_email": process.env.CLIENT_EMAIL,
        "client_id": process.env.CLIENT_ID,
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    })
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

const walRef = db.collection('aggregation').doc('wallet')
app.post('/api/linebot', jsonParser, (req, res) => {
    const request = req.body.events[0];
    const msg = request.message.text;
    // const userId = request.source.userId;

    let obj = {
        replyToken: request.replyToken,
        messages: []
    };

    if (msg.indexOf('#shop') > -1) {
        let data = MapProps({ sale: 0, cash: 0, payouts: 0, balance: 0, net: 0, debit: 0 }, msg, ['shop', 'payout'])

        if (data.shop) {
            const date = convertDate(data.shop)
            // data.payouts = 0;
            if (data.payout) {
                data.payout = MapDetails(data.payout);
                data.payouts = data.payout.reduce((a, b) => a + b.value, 0)
            }
            data.balance = ((data.net || 0) + data.payouts) - (data.cash || 0);

            if (moment(date).isValid()) {
                db.collection('shops').doc(date)
                    .get()
                    .then(docShop => {
                        walRef.get()
                            .then(docWal => {
                                let befCash = docWal.data().cash;
                                let cash = 0;
                                let befDebit = docWal.data().debit;
                                let debit = 0;
                                if (docShop.exists) {
                                    befCash -= docShop.data().net;
                                    befDebit -= docShop.data().debit;
                                }
                                cash = befCash + data.net;
                                debit = befDebit + data.debit;
                                data.curCash = cash;
                                data.curDebit = debit;
                                data.befCash = befCash;
                                data.befDebit = befDebit;
                                db.collection('shops').doc(date).set({ ...data, date })
                                walRef.set({ cash, debit })
                                obj.messages.push({
                                    type: 'text',
                                    text: textShop(date, data)
                                })
                                reply(obj);
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
    } else if (msg.indexOf('#trans') > -1) {
        let data = MapProps({ payouts: 0 }, msg, ['trans', 'payout'])
        if (data.trans) {
            const date = convertDate(data.trans);
            if (data.payout) {
                data.payout = MapDetails(data.payout);
                data.payouts = data.payout.reduce((a, b) => a + b.value, 0)
            }

            if (moment(date).isValid()) {
                db.collection('trans').doc(date)
                    .get().then(docTran => {
                        walRef.get()
                            .then(docWal => {
                                let OldWalDebit = docWal.data().debit;
                                if (docTran.exists) {
                                    const oldTranData = { ...docTran.data() };
                                    if (data.no && data.payout) { //edited
                                        data.payout = oldTranData.payout.map((m, i) => {
                                            if (i == (data.no - 1)) {
                                                OldWalDebit += m.value
                                                OldWalDebit -= data.payout[0].value
                                                return {
                                                    ...data.payout[0]
                                                }
                                            } else {
                                                return m
                                            }
                                        })
                                        data.payouts = data.payout.reduce((a, b) => a + b.value, 0)
                                    } else if (data.no && !data.payout) { //removed
                                        const removed = oldTranData.payout.splice(data.no - 1, 1)[0];
                                        OldWalDebit += removed.value;
                                        data.payout = oldTranData.payout;
                                        data.payouts = data.payout.reduce((a, b) => a + b.value, 0)
                                        // console.log('removed', data)
                                    } else if (!data.no && data.payout) { //inserted
                                        data.payout = oldTranData.payout.concat(data.payout)
                                        OldWalDebit -= data.payouts;
                                        data.payouts += oldTranData.payouts;
                                        // console.log('insert', data)
                                    }
                                } else { //create
                                    if (data.payout) {
                                        OldWalDebit -= data.payouts;
                                    } else {

                                    }
                                }

                                if (data.no) delete data.no;
                                data.curDebit = OldWalDebit;
                                data.befDebit = OldWalDebit + data.payouts;
                                docTran.ref.set({ ...data })
                                docWal.ref.update({ debit: OldWalDebit })

                                obj.messages.push({
                                    type: 'text',
                                    text: `รายการโอนค่าใช้จ่ายวันที่ ${moment(date).format('ll')}

${data.payout ? data.payout.map((p, i) => '\n' + (i + 1) + '. ' + p.detail + ' ' + formatMoney(p.value, 0)) : ''}

รวม ${formatMoney(data.payouts, 0)} บาท
-----------------------
ยอดเดบิตคงเหลือ ${formatMoney(data.befDebit, 0)} - ${formatMoney(data.payouts, 0)} = ${formatMoney(data.curDebit, 0)}

`})
                                reply(obj);
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
    } else if (msg.indexOf('@shop') > -1) {
        const msgs = msg.split(':');
        if (msgs.length == 2) {
            const dates = msgs[1].split('-').map(m => {
                return {
                    valid: moment(convertDate(m)).isValid(),
                    date: convertDate(m)
                }
            }).filter(f => f.valid);
            if (dates.length == 1) {
                const date = dates[0].date;
                db.collection('shops').doc(date)
                    .get().then(doc => {
                        obj.messages.push({
                            type: 'text',
                            text: textShop(moment(date).format('ll'), { ...doc.data() })
                        })
                        reply(obj);
                        // res.send(textShop(moment(date).format('ll'), { ...doc.data() }))
                    })
            } else if (dates.length == 2) {
                obj.messages.push({
                    type: 'text',
                    text: 'ฟังชั่นนี้ยังไม่เสร็จจ้า'
                })
                reply(obj);
            }
            // res.json(dates)
        }
    }
})
const MapProps = (model, msg, notNumber = [], sign = '#') => {
    let data = model;
    const msgs = msg.split(sign);
    msgs.map(m => {
        if (m.split(':').length == 2) {
            const key = m.split(':')[0];
            const value = notNumber.indexOf(key) == -1
                ? Number(m.split(':')[1])
                : m.split(':')[1];
            data[key] = value;
        }
    })
    return data;
}
const MapDetails = (data) => {
    return data.split(',').map(d => {
        if (d.split('=').length == 2) {
            const value = d.split('=')[1];
            if (!isNaN(value)) {
                return {
                    detail: d.split('=')[0],
                    value: Number(value)
                }
            }
        }
        return {}
    }).filter(f => Object.keys(f).length > 0) || []
}

const convertDate = (date) => {
    return '20' + date.substr(0, 2) + '-' + date.substr(2, 2) + '-' + date.substr(4, 2)
}
const textShop = (date, data) => {
    return `สรุปยอดวันที่ ${date}
ยอดขายทั้งหมด ${formatMoney(data.sale, 0)}

+++เงินสด+++
ยอดขาย ${formatMoney(data.cash, 0)}
นับได้จริง ${formatMoney(data.net, 0)}
ค่าใช้จ่ายทั้งหมด ${formatMoney(data.payouts, 0)} ${data.payout ? data.payout.map(p => '\n-' + p.detail + ' ' + formatMoney(p.value, 0)) : ''}
เงิน${data.balance < 0 ? 'หาย' : 'เกิน'} ${formatMoney(data.balance, 0)}
---------------------
ยอดเงินสดทั้งหมด ${formatMoney(data.befCash, 0)} + ${formatMoney(data.net, 0)} = ${formatMoney(data.curCash, 0)}

+++เดบิต+++
ยอดขาย ${formatMoney(data.debit, 0)}
--------------------
ยอดเดบิตทั้งหมด ${formatMoney(data.befDebit, 0)} + ${formatMoney(data.debit, 0)} = ${formatMoney(data.curDebit, 0)}
`
}

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