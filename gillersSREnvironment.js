var GillersSREnvironment = GillersSREnvironment || {
    // A dictionary<String, List<Object>>
    environmentItems: [],
    // create a list of light sources and add them to the environmentItems
    InitializeLightSource: function () {
      var lightSource = {};

    }
    // Given a list of tokens, perform actions based on the
    // message
    HandleInput: function(tokens, msg) {
        log(tokens);
        log(msg);
    }
};