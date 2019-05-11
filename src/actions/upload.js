import firestore from '../firebase/firebase';
export const startUploadTracks = (cutoffDate, tracks) => {
    return (dispatch) => {
        return firestore.collection('orders').where('cutoffDate', '==', cutoffDate).get()
            .then(querySnapshot => {
                querySnapshot.forEach(function (doc) {
                    if (tracks.filter(f => f.tel == doc.data().tel).length > 0) {
                        firestore.collection('orders').doc(doc.id).update({
                            tracking: tracks.find(f => f.tel == doc.data().tel).tracking,
                            expressName: 'KERRY',
                            expressLink: 'https://th.kerryexpress.com/th/track/?track'
                        })
                    }
                })
                firestore.collection('cutoffs').doc(cutoffDate).update({ tracking: true })
                return 'ok'
            });
    }
}