import database, { auth, facebookAuthProvider } from '../firebase/firebase';
// import moment from 'moment';

export const startLoginWithFacebook = () => {
    return () => {
        return auth.signInWithPopup(facebookAuthProvider);
    };
};
export const startLoginLocal = (username, password) => {
    return (dispatch) => {
        const email = username;//+ '@season.com';
        return auth.signInWithEmailAndPassword(email, password)
            .then((user) => {
                return { code: false }
            })
            .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                return error;
            });
    }
}
export const startGetAuth = (user) => {
    return (dispatch) => {
        return database.collection('emails').doc(user.uid).get()
            .then(doc => {
                return dispatch(setAuth({
                    ...user,
                    ...doc.data()
                }))
            })
    }
}

export const changePasswordLocal = (uid, password) => {
    return (dispatch) => {
        // console.log(uid, newPassword)
        fetch('./api/password/update', {
            body: JSON.stringify({ uid, password }),
            headers: {
                // 'user-agent': 'Mozilla/4.0 MDN Example',
                'Content-Type': 'application/json'
            },
            method: 'post'
        })
            .then(response => response.json())
            .then(result => {
                console.log(result.result);
            })

    };
}

export const login = (auth) => ({
    type: 'LOGIN',
    ...auth
});
export const setAuth = (auth) => ({
    type: 'SET_AUTH',
    ...auth
});

export const logout = () => ({
    type: 'LOGOUT'
});
export const startLogout = () => {
    return () => {
        return auth.signOut();
    }
};
