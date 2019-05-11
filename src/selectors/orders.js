export default (orders, search) => {
    return orders.filter((order) => {
        const nameMatch = order.name.toLowerCase().includes(search.toLowerCase());
        const idMatch = order.id.toLowerCase().includes(search.toLowerCase());
        const pageMatch = order.page.toLowerCase().includes(search.toLowerCase());
        const adminMatch = order.admin.toLowerCase().includes(search.toLowerCase());
        return nameMatch || idMatch || pageMatch || adminMatch;
    })
        .sort((a, b) => {
            const aName = a.cutoffDate + a.name.substr(0, 1) + a.id;
            const bName = b.cutoffDate + b.name.substr(0, 1) + b.id;
            return aName > bName ? 1 : -1;
        })
};
