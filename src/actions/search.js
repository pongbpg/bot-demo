import firestore from '../firebase/firebase';

export const setSearch = (search) => ({
    type: 'SET_SEARCH',
    search
});

export const startSearchTracking = (search) => {
    return (dispatch) => {
        return firestore.collection('orders').doc(search).get()
            .then(doc => {
                if (doc.exists) {
                    return dispatch(setSearch([{ id: doc.id, ...doc.data() }]))
                } else {
                    return firestore.collection('orders').where('tel', '==', search)
                        .get()
                        .then(snapShot => {
                            let lists = [];
                            snapShot.forEach(list => {
                                lists.push({ id: list.id, ...list.data() })
                            })
                            return dispatch(setSearch(lists.sort((a, b) => a.id < b.id ? 1 : -1)));
                        })
                }
            })
    }
}