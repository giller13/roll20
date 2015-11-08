on("ready", function() {
    Ghouls.LoadPageGhouls();
    Ghouls.RegisterEventHandlers();
    // Ghouls.ToggleChatter("on", 5000);
    // Filter/router for chat messages directed to the API layer
    // Use instead of registering the message interceptors on each glass
    on("chat:message", function (msg) {
        if (msg.type != "api") {
            debugLog("not an api command", "");
            return;
        }
        var content = msg.content;
        var hasContent = (content != undefined && content != null && content != "");
        if (!hasContent) return;
        var tokenizedMsg = msg.content.split(" ");
        var command = tokenizedMsg[0];
        switch (command) {
            case "!ghouls":
                if (playerIsGM(msg.playerid)) {
                    Ghouls.HandleInput(_.rest(tokenizedMsg), msg);
                }
                break;
            case "!env":
                if(playerIsGM(msg.playerid)) {
                    GillersSREnv.HandleInput(_.rest(tokenizedMsg), msg);
                }
                break;
            default:
                return;
        }
    });
});