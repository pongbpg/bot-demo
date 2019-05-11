export default (costs, pages, date) => {
    // console.log('select costs',costs)
    // console.log('select pages',pages)
    if (costs.length != pages.length) {
        for (let p = 0; p < pages.length; p++) {
            // console.log(pages[p])
            const data = costs.find(f => f.page == pages[p].id)
            // console.log('data',data)
            if (!data) {
                costs.push({
                    page: pages[p].id,
                    admin: pages[p].admin,
                    fb: 0,
                    line: 0,
                    delivery: 0,
                    date,
                    year: date.substr(0, 4),
                    month: date.substr(2, 2),
                    day: date.substr(4, 2)
                })
            }
        }
    }
    return costs.sort((a, b) => a.page > b.page ? 1 : -1)
};