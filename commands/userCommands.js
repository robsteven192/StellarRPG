// user commands module

statsCommand = function (request) {
    return "!-- Stats for: " + request.user.name + ' --!\n' +
           "Level: " + request.user.level;
};
invCommand = function (request) {
    var overview = "!-- Inventory for: " + request.user.nameCredits + ' --!\n' +
                   "Credits: "+ request.user.inventory["Credits"] + '\n';
    for (var i in request.user.inventory) {
        if (i != "Credits") {
            overview += i + ": " + request.user.inventory[i] + '\n';
        }
    }
    return overview;
};

exports.getCommands = function () {
    var commandMap = {};

    commandMap["stats"] = {
        argumentCount: 0,
        wait: 4,
        execute: statsCommand,
        isValid: isCommandValid
    };
    commandMap["inv"] = {
        argumentCount: 0,
        wait: 4,
        execute: invCommand,
        isValid: isCommandValid
    };

    return commandMap;
};
