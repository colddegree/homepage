function clearElement(element) {
    element.innerHTML = "";
}

function showElement(element) {
    element.classList.remove("hidden");
}

function hideElement(element) {
    element.classList.add("hidden");
}

export {
    clearElement as clear,
    showElement as show,
    hideElement as hide
}
