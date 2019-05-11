import firestore from '../firebase/firebase';
import selectPages from '../selectors/pages';
export const startListPages = (auth) => {
    return (dispatch) => {
        return firestore.collection('pages')
            .get()
            .then(querySnapshot => {
                let pages = [];
                querySnapshot.forEach(function (doc) {
                    if (doc.id.indexOf('@') == -1) {
                        pages.push({
                            id: doc.id,
                            ...doc.data()
                        })
                    }
                });
                pages = selectPages(pages, auth)
                return dispatch(setListPages(pages))
            })
    }
}
export const setListPages = (pages) => ({
    type: 'SET_LIST_PAGES',
    pages
});