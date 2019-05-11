import firestore from '../../firebase/firebase';
export const startGetStock = () => {
    // console.log('get stock')
    return (dispatch) => {
        return firestore.collection('products')
            //.get()
            .onSnapshot(snapShot => {
                let stock = [];
                snapShot.forEach(product => {
                    stock.push({ id: product.id, ...product.data() })
                })
                return dispatch(setStock(stock))
            })
    }
}
// export const startChangeStock = (stock) => {
//     return (dispatch) => {
//         return firestore.collection('products').doc(stock.id).get()
//             .then(doc => {
//                 let amount = 0;
//                 if (stock.action == 'plus') amount = doc.data().amount + stock.amount
//                 if (stock.action == 'minus') amount = doc.data().amount - stock.amount
//                 if (amount <= 0) {
//                     return firestore.collection('products').doc(stock.id).delete()
//                 } else {
//                     return firestore.collection('products').doc(stock.id).update({ amount })
//                 }
//             })
//     }
// }
export const setStock = (stock) => ({
    type: 'SET_STOCK',
    stock
});
