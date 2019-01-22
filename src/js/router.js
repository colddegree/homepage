const modules = {
    '^/$': () => import('./weather.js'),
    '^/index.html$': () => import('./weather.js'),
};

export default class Router {
    static get modules() {
        return modules;
    }

    static load() {
        let url = window.location.pathname;

        for (let page in modules) {
            if (new RegExp(page).test(url)) {
                modules[page]().then(p => p.loadPage());
            }
        }
    }
}
