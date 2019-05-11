export default (apps, user) => {
    // if (user.apps.length > 0) {
    return apps
        .filter(f => {
            return f.isActive &&
                (
                    (f.access === 'public' ?
                        true :
                        (
                            f.access === 'refuse' ?
                                (f.blacklists.filter(id => id.idcard === user.idcard).length === 0) :
                                (f.blacklists.filter(id => id.idcard === user.idcard).length > 0) //f.access==='permit'
                        )
                    )
                    || user.role !== 'user'
                )
        })
        .map((app) => {
            const p = user.apps.filter((a) => {
                return a.appId === app.id
            });
            return {
                ...app,
                hasPin: p.length > 0,
                pin: (p.length > 0 ? p[0].pin : undefined)
            }
        }).sort((a, b) => {
            var nameA = a.appName.toUpperCase(); // ignore upper and lowercase
            var nameB = b.appName.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            // names must be equal
            return 0;
        });
};  