import firestore, { auth } from '../../firebase/firebase';

export const startUpdatePage = (page) => {
    return (dispatch) => {
        return firestore.collection('pages').doc(page.id).update({ ...page })
            .then(() => {
                return dispatch(setPage(page))
            })
    }
}
export const startPushPage = (page) => {
    return (dispatch) => {
        return firestore.collection('pages').doc(page.id).set({ ...page })
            .then(() => {
                // console.log(page)
                return dispatch(pushPage(page))
            })
    }
}
export const startDeletePage = (page) => {
    return (dispatch) => {
        return firestore.collection('pages').doc(page.id).delete()
            .then(() => {
                return dispatch(deletePage(page))
            })
    }
}
export const setPage = (page) => ({
    type: 'SET_PAGE',
    page
});

export const pushPage = (page) => ({
    type: 'PUSH_PAGE',
    page
});

export const deletePage = (page) => ({
    type: 'REMOVE_PAGE',
    page
});