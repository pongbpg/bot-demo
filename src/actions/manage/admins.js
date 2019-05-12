import firestore from '../../firebase/firebase';
export const startGetAdmins = () => {
    return (dispatch) => {
        return firestore.collection('admins').get()
            .then(snapShot => {
                let admins = [];
                snapShot.forEach(admin => {
                    admins.push({ userId: admin.id, ...admin.data() })
                })
                return dispatch(setAdmins(admins))
            })
    }
}
export const startUpdateAdmin = (admin) => {
    return (dispatch) => {
        return firestore.collection('admins').doc(admin.userId).update({ ...admin })
            .then(() => {
                return dispatch(setAdmin(admin))
            })
    }
}
export const setAdmins = (admins) => ({
    type: 'SET_MANAGE_ADMINS',
    admins
});

export const setAdmin = (admin) => ({
    type: 'SET_MANAGE_ADMIN',
    admin
});