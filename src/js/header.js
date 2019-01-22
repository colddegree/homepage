const navbarPathToAnchorIdsMap = {
    "^(/|/index.html)$": ["index", "index-brand"],
    "^/weather.html$": ["weather"],
    "^/crypto.html$": ["crypto"],
    "^/contact.html$": ["contact"]
};

export default function initNavbar() {
    let currentPath = window.location.pathname;

    for (let path in navbarPathToAnchorIdsMap) {
        if (new RegExp(path).test(currentPath)) {

            navbarPathToAnchorIdsMap[path].forEach(elementId => {
                let a = document.getElementById(elementId);
                a.removeAttribute("href");

                if (a.parentElement.nodeName === "LI") {
                    let li = a.parentElement;
                    li.classList.add("active");
                }
            });

        }
    }
}
