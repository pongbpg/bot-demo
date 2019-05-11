export default (state = [], action) => {
    switch (action.type) {
        case 'SET_LIST_COSTS':
            return action.costs;
        default:
            return state;
    }
};