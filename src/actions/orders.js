import firestore from '../firebase/firebase';
export const startListOrders = () => {
    return (dispatch) => {
        return firestore.collection('orders')
            .where('cutoff', '==', true)
            .where('tracking', '==', '')
            .orderBy('name', 'asc')
            // .onSnapshot()
            .get()
            .then(querySnapshot => {
                let orders = [];
                querySnapshot.forEach(function (doc) {
                    orders.push({
                        id: doc.id,
                        ...doc.data()
                    })
                });
                dispatch(setListOrders(orders))
            })
    }
}
export const setListOrders = (orders) => ({
    type: 'SET_LIST_ORDERS',
    orders
});



export const startSaveTracking = (orders) => {
    orders = orders.filter(f => {
        if ([5, 7, 8, 12].indexOf(f.tracking.length) > -1) {
            return true;
        } else if (f.tracking.substr(0, 1).toUpperCase() == 'K' && f.tracking.length == 13) {
            return true;
        } else if (f.tracking.indexOf('TH') > -1 && f.tracking.length == 13) {
            return true;
        } else {
            return false;
        }
    })
    return (dispatch) => {
        let update = firestore.collection('orders');
        for (let x = 0; x < orders.length; x++) {
            let expressLink = '', expressName = '';
            if ([5, 7, 8, 12].indexOf(orders[x].tracking.length) > -1) {
                expressName = 'ALPHA FAST';
                expressLink = 'https://www.alphafast.com/th/track-alpha';
            } else if (orders[x].tracking.substr(0, 1).toUpperCase() == 'K' && orders[x].tracking.length == 13) {
                expressName = 'KERRY';
                expressLink = 'https://th.kerryexpress.com/th/track/?track';
            } else if (orders[x].tracking.indexOf('TH') > -1 && orders[x].tracking.length == 13) {
                expressName = 'EMS';
                expressLink = 'http://track.thailandpost.co.th/tracking/default.aspx';
            }
            update.doc(orders[x].id).set({
                tracking: orders[x].tracking,
                expressName,
                expressLink
            }, { merge: true })
        }
        dispatch(startListOrders())
    }
}