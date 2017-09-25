// Command module

isCommandValid = function (command, args, user) {
    var checkCommand = {};

    if (args.length >= commandMap[command].argumentCount) {
        if (user.commandTimestamps[command] == null) {
            user.commandTimestamps[command] = { time: Date.now() };
            checkCommand.isValid = true;
        } else if (user.commandTimestamps[command].time + (commandMap[command].wait * 1000) < Date.now()) {
            user.commandTimestamps[command].time = Date.now();
            checkCommand.isValid = true;
        } else {
            var timeLeft = user.commandTimestamps[command].time + (commandMap[command].wait * 1000) - Date.now();
            checkCommand.isValid = false;
            checkCommand.errorMessage = "You cant do that yet you son of a bitch! Wait " + Math.ceil(timeLeft / 1000) + " seconds";
        }
    } else {
        checkCommand.isValid = false;
        checkCommand.errorMessage = "Command arguments are not valid: " + args;
    }

    return checkCommand;
};

pingExecute = function (args, user) {
    return "Pong " + user.name + args[0];
}

printMessage = function (args, user) {
    return "I exist " + user.name + args[0];
};

printMessage2 = function (args, user) {
    return "I also exist " + user.name + args[0];
};

setupCommands = function () {
    var commandMap = {};
    commandMap["test"] = {
        argumentCount: 0,
        wait: 5,
        execute: printMessage,
        isValid: isCommandValid
    };
    commandMap["test2"] = {
        argumentCount: 1,
        wait: 10,
        execute: printMessage,
        isValid: isCommandValid
    };
    commandMap["ping"] = {
        argumentCount: 0,
        wait: 3,
        execute: pingExecute,
        isValid: isCommandValid
    }
    return commandMap;
};

exports.doesCommandExist = function (command) {
    return commandMap[command] != null;
};

exports.checkValid = function (command, args, user) {
    return commandMap[command].isValid(command, args, user);
};

exports.executeCommand = function (command, args, user) {
    return commandMap[command].execute(args, user);
};

exports.getCommandMap = function () {
    return commandMap;
};

const commandMap = setupCommands();