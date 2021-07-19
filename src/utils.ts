export function getAnchor() {
    if (window.location.hash) {
        var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
        return hash;
        // hash found
    } else {
        return "";
    }
}