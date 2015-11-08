var Ghouls = Ghouls || {
    pageGhouls: [],
    ghoulChatter: ["*garbled sounds*", "*unintelligible grunting*", "Nrraaagghh! I smell Elf flesh!", "*hissing*"],
    chatterInterval: {},
    ToggleChatter: function (mode, interval) {
      if(mode == "on") {
        Ghouls.chatterInterval = setInterval(function () {
          var slot = Math.floor(Math.random() * 4);
          var speechText = Ghouls.ghoulChatter[slot];
          var ghoulSlot = Math.floor(Math.random() * Ghouls.pageGhouls.length);
          var ghoul = Ghouls.pageGhouls[ghoulSlot];
          sendChat("Ghoul", speechText);
          var textObject = createObj("text", {
            _pageid: Campaign().get("playerpageid"),
            layer: "objects",
            text: speechText,
            color: "rgb(255, 0, 0)",
            font_size: 22,
            top: ghoul.get("top"),
            left: ghoul.get("left")
          });
          // Function prototype to remove the text
          var removeFunc = function() {
            this.remove();
          }
          // Set a timeout to remove the text from the screen
          // Use bind to bind the textObject returned from create
          // to this instance of the removeFunc.
          setTimeout(removeFunc.bind(textObject), 2000);
        }, interval);
      }
      else if(mode == "off") {
        if (Ghouls.chatterInterval != undefined && Ghouls.chatterInterval != null) {
          clearInterval(Ghouls.chatterInterval);
        }
      }
    },
    LoadPageGhouls: function() {
      // Decided to do this at start-up so I have a list of ghouls on a page
      // Should consider writing to state?
      // Also, filter already goes over the entire list one time
      // Is there a single property we can set on tokens to mark them with a tag?
      var ghouls = filterObjs(function(obj) {
            return (obj.get("_pageid") == Campaign().get("playerpageid") &&
            obj.get("_type") == "graphic" &&
            obj.get("_subtype") == "token" &&
            obj.get("name").toLowerCase().indexOf("ghoul") > -1);
        });
        _.each(ghouls, function(ghoul) {
          ghoul.hideMe = function() {
            this.set("layer", "gmlayer");
            this.set("status_ninja-mask");
          };
          ghoul.showMe = function() {
            this.set("layer", "objects");
            this.set("status_ninja-mask", false);
          }
        });
        Ghouls.pageGhouls = ghouls;
        debugLog("pageGhouls", Ghouls.pageGhouls);
    },
    ToggleVisibleForSelected: function(state, selected) {
      var hasSelected = (selected != undefined && selected != null && selected != "");
      if(!hasSelected) {
        return;
      }
      // Since this has selected, we need only verify that it is a ghoul
      // selected only has _id and _type. Run _id against pageGhouls
      // and perform the action on the ones that match
      var selectedObject = JSON.parse(JSON.stringify(selected));
      var match;
      _.each(selectedObject, function (sel) {
        match = _.find(Ghouls.pageGhouls, function(ghoul) {
          return ghoul.get("_id") == sel._id;
        });
        // Assume only one match on _id
        if(match != undefined) {
          if (state == "show") {
            match.showMe();
          }
          else if (state == "hide") {
            match.hideMe();
          }
        }
      });
    },
    ToggleVisibleForNamed: function (state, names) {
      var match;
      _.each(names, function(gn) {
        match = _.find(Ghouls.pageGhouls, function (ghoul) {
          return ghoul.get("name") == gn;
        });
        if (match != undefined) {
          if (state == "show") {
            match.showMe();
          }
          else if (state == "hide") {
            match.hideMe();
          }
        }
      });
    },
    // Given a msg, perform actions based on the
    // message
    HandleInput: function(command, msg) {
        switch(command[0]) {
            case "showall":
                // Loop the local pageGhouls list and set their layer to objects
                _.each(Ghouls.pageGhouls, function(ghoul) {
                    ghoul.showMe();
                });
                break;
            case "hideall":
                _.each(Ghouls.pageGhouls, function(ghoul) {
                    ghoul.hideMe();
                });
              break;
            case "hide":
            case "show":
              Ghouls.ToggleVisibleForSelected(command[0], msg.selected);
              break;
            case "showbyname":
              Ghouls.ToggleVisibleForNamed("show", _.rest(command));
              break;
            case "hidebyname":
              Ghouls.ToggleVisibleForNamed("hide", _.rest(command));
              break;
          case "chatteroff":
              Ghouls.ToggleChatter("off", 0);
              break;
          case "chatteron":
            var intervalParam = _.rest(command);
            if(intervalParam == undefined) {
              break;
            }
            var interval = parseInt(intervalParam);
            if(isNaN(interval)) {
              break;
            }
            Ghouls.ToggleChatter("on", interval);
            break;
          case "burn":
            Ghouls.Burn(msg.selected);
            break;
            default:
                break;
        }
    },
    RegisterEventHandlers: function() {
        on("change:graphic:statusmarkers", function(tkn, prev) {
            var name = tkn.get("name");

            if(name.indexOf("ghoul") > -1) {
                var currentMarkers = tkn.get("statusmarkers");
                var previousMarkers = prev["statusmarkers"];
                var hasNinja = currentMarkers.indexOf("ninja") > -1;
                var hadNinja = previousMarkers.indexOf("ninja") > -1;
                if(hasNinja) {
                    // if we add the ninja, hide them
                    tkn.set("layer", "gmlayer");
                }
                else if (hadNinja && !hasNinja) {
                    tkn.set("layer", "objects");
                }
            }
        });
    }
};