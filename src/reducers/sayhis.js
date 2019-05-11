export default (state = [], action) => {
    switch (action.type) {
        case 'SET_LIST_SAYHIS':
            return action.sayhis;
        default:
            return state;
    }
};