export default class Router {

    static get modules() {
        return {
            '^/$': () => import('./weather.js'),
            '^/index.html$': () => import('./weather.js'),
        };
    }

    static load() {
        let url = window.location.pathname;

        for (let page in Router.modules) {
            if (new RegExp(page).test(url)) {
                Router.modules[page]().then(p => p.loadPage());
            }
        }
    }

}
