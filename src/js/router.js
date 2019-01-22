export default class Router {

    static get modules() {
        return {
            "^/$": () => import("./index.js"),
            "^/index.html$": () => import("./index.js"),
            "^/weather.html$": () => import("./weather.js"),
            "^/crypto.html$": () => import("./crypto.js"),
            "^/contact.html$": () => import("./contact.js")
        };
    }

    static load() {
        let currentPath = window.location.pathname;

        for (let page in Router.modules) {
            if (new RegExp(page).test(currentPath)) {
                Router.modules[page]().then(p => p.loadPage());
            }
        }
    }

}
