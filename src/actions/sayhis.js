import firestore from '../firebase/firebase';
export const startListSayhis = (year, month, page) => {
    return (dispatch) => {
        return firestore.collection('sayhis')
            .where('year', '==', year)
            .where('month', '==', month)
            .where('page', '==', page)
            .get()
            .then(querySnapshot => {
                let sayhis = [];
                const amountDays = new Date(year, month, 0).getDate();
                querySnapshot.forEach(function (doc) {
                    sayhis.push({
                        id: doc.id,
                        ...doc.data()
                    })
                });
                if (sayhis.length != amountDays) {
                    for (let day = 1; day <= amountDays; day++) {
                        const data = sayhis.find(f => f.day == day)
                        if (!data) {
                            sayhis.push({
                                day,
                                month,
                                year,
                                page,
                                fb: 0,
                                line: 0,
                                date: year.toString() + twoDigit(month) + twoDigit(day)
                            })
                        }
                    }
                }
                return dispatch(setListSayhis(sayhis.sort((a, b) => a.day > b.day ? 1 : -1)))
            })
    }
}
export const setListSayhis = (sayhis) => ({
    type: 'SET_LIST_SAYHIS',
    sayhis
});
function twoDigit(n) { return (n < 10 ? '0' : '') + n; }

export const startSaveSayhi = (sayhi) => {
    return dispatch => {
        return firestore.collection('sayhis').doc(sayhi.date + sayhi.page)
            .set(sayhi)
            .then(() => {
                return dispatch(startListSayhis(sayhi.year, sayhi.month, sayhi.page))
            })
    }

}