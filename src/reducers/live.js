export default (state = { id: '-', name: '-', price: '-' }, action) => {
    switch (action.type) {
        case 'SET_LIVE':
            return action.live;
        default:
            return state;
    }
};