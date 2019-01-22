import * as ElementUtils from "./element-utils";

function showLoadingSpinner() {
    const spinner = document.getElementById("loading-spinner");
    ElementUtils.show(spinner);
}

function hideLoadingSpinner() {
    const spinner = document.getElementById("loading-spinner");
    ElementUtils.hide(spinner);
}

export {
    showLoadingSpinner as show,
    hideLoadingSpinner as hide
}
