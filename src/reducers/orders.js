export default (state = [], action) => {
    switch (action.type) {
        case 'SET_LIST_ORDERS':
            return action.orders;
        default:
            return state;
    }
};