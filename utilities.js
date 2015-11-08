var Debug = Debug || {
    enabled: true
}

var debugLog = function(lbl, msg) {
    if(Debug.enabled) {
        log("debug output: " + lbl);
        log(msg);
    }
}
