// user commands module

statsCommand = function (request) {
    return "Stats for: " + request.user.name + '\n' +
           "Level: " + request.user.level;
};

exports.getCommands = function () {
    var commandMap = {};

    commandMap["stats"] = {
        argumentCount: 0,
        wait: 4,
        execute: statsCommand,
        isValid: isCommandValid
    };

    return commandMap;
};