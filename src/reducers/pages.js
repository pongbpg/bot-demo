export default (state = [], action) => {
    switch (action.type) {
        case 'SET_LIST_PAGES':
            return action.pages;
        default:
            return state;
    }
};