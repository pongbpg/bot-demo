import firestore from '../firebase/firebase';
// import { startListOrders } from './orders';
import moment from 'moment';
moment.locale('th');
export const setCutOff = (cutoffs) => ({
    type: 'SET_CUTOFF',
    cutoffs
});
export const startGetCutOff = () => {
    return (dispatch) => {
        return firestore.collection('cutoffs')
            // .get()
            .onSnapshot(snapShot => {
                let cutoffs = [];
                snapShot.forEach(doc => {
                    cutoffs.push({ id: doc.id, ...doc.data() })
                })
                dispatch(setCutOff(cutoffs))
            })
    }
}
export const startCutOff = (id) => {
    return (dispatch) => {
        firestore.collection('counter').doc('orders').update({ cutoff: true })
        firestore.collection('cutoffs').doc(id).update({ cutoff: true })
        return firestore.collection('orders').where('cutoffDate', '==', id).get()
            .then(querySnapshot => {
                querySnapshot.forEach(function (doc) {
                    firestore.collection('orders').doc(doc.id).update({ cutoff: true })
                })
                return firestore.collection('groups').get()
                    .then(snapShot => {
                        let boardcasts = [];
                        snapShot.forEach(group => {
                            boardcasts.push({
                                to: group.id,
                                messages: [
                                    {
                                        "type": "text",
                                        "text": `${emoji(0x100035)}วันที่ ${moment(id).format('ll')} ปิดรอบแล้วจ้า${emoji(0x100035)}`
                                    }
                                ]
                            })
                        })
                        fetch('./api/boardcast', {
                            body: JSON.stringify({ boardcasts }),
                            headers: {
                                // 'user-agent': 'Mozilla/4.0 MDN Example',
                                'Content-Type': 'application/json'
                            },
                            method: 'post'
                        })
                            .then(response => response.json())
                            .then(result => {
                                console.log(result);
                            })
                    })

            });
    }
}
export const startCutOn = (id) => {
    return (dispatch) => {
        firestore.collection('counter').doc('orders').update({ cutoff: false, cutoffDate: id })
        firestore.collection('cutoffs').doc(id).set({ cutoff: false, tracking: false })
        return firestore.collection('groups').get()
            .then(snapShot => {
                let boardcasts = [];
                snapShot.forEach(group => {
                    boardcasts.push({
                        to: group.id,
                        messages: [
                            {
                                "type": "text",
                                "text": `${emoji(0x100041)}วันที่ ${moment(id).format('ll')} เปิดรอบแล้วจ้า${emoji(0x100041)}`
                            }
                        ]
                    })
                })
                fetch('./api/boardcast', {
                    body: JSON.stringify({ boardcasts }),
                    headers: {
                        // 'user-agent': 'Mozilla/4.0 MDN Example',
                        'Content-Type': 'application/json'
                    },
                    method: 'post'
                })
                    .then(response => response.json())
                    .then(result => {
                        console.log(result);
                    })
            })
    }
}
const tomorrow = () => {
    function twoDigit(n) { return (n < 10 ? '0' : '') + n; }
    var now = new Date();
    now.setDate(now.getDate() + 1);
    return '' + now.getFullYear() + twoDigit(now.getMonth() + 1) + twoDigit(now.getDate());
}
const today = () => {
    function twoDigit(n) { return (n < 10 ? '0' : '') + n; }
    var now = new Date();
    return '' + now.getFullYear() + twoDigit(now.getMonth() + 1) + twoDigit(now.getDate());
}
const emoji = (hex) => { return String.fromCodePoint(hex) };