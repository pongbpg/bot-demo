import firestore from '../../firebase/firebase';
export const startGetLive = () => {
    // console.log('get stock')
    return (dispatch) => {
        return firestore.collection('counter').doc('live')
            .onSnapshot(doc => {
                const live = doc.data()
                return dispatch(setLive(live))
            })
    }
}
export const startSetLive = (live) => {
    return (dispatch) => {
        return firestore.collection('counter').doc('live').update(live)
    }
}
export const setLive = (live) => ({
    type: 'SET_LIVE',
    live
});