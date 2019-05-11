export default (pages, auth) => {
    return ['owner', 'stock'].indexOf(auth.role) > -1 ? pages : pages.filter(f => auth.pages.indexOf(f.id) > -1);
    // return pages.filter((page) => {
    //     return 
    // })
    //     .sort((a, b) => {
    //         const aName = a.id.substr(0, 8) + a.name.substr(0, 1) + a.id;
    //         const bName = b.id.substr(0, 8) + b.name.substr(0, 1) + b.id;
    //         return aName > bName ? 1 : -1;
    //     })
};
