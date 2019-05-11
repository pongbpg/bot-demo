export default (state = { role: '', pages: [] }, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                uid: action.uid,
                email: action.email
            };
        case 'LOGOUT':
            return {};
        case 'SET_AUTH':
            return {
                uid: action.uid,
                email: action.email,
                role: action.role,
                pages: action.pages
            }
        default:
            return state;
    }
};