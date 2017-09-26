// user commands module

statsCommand = function (args, user) {
    return "Stats for: " + user.name + '\n' +
           "Level: " + user.level;
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