export default (path, userApps) => {
    // console.log('start', path, userApps);
    if (userApps && path !== '/') {
        return userApps.filter((userApp) => {
            // console.log(userApp.callbackUrl, path, userApp.callbackUrl === path)
            return userApp.callbackUrl === path
        }).length > 0 ? path : '/';
    } else {
        return '/';
    }
}