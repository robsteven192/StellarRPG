// Command module
const userModule = require("./users.js");
const userCommandModule = require('./commands/userCommands.js');

isCommandValid = function (request) {
    var checkCommand = {};

    if (request.args.length >= commandMap[request.command].argumentCount) {
        if (request.user.commandTimestamps[request.command] == null) {
            request.user.commandTimestamps[request.command] = { time: Date.now() };
            checkCommand.isValid = true;
        } else if (request.user.commandTimestamps[request.command].time + (commandMap[request.command].wait * 1000) < Date.now()) {
            request.user.commandTimestamps[request.command].time = Date.now();
            checkCommand.isValid = true;
        } else {
            var timeLeft = request.user.commandTimestamps[request.command].time + (commandMap[request.command].wait * 1000) - Date.now();
            checkCommand.isValid = false;
            checkCommand.errorMessage = "You cant do that yet you son of a bitch! Wait " + Math.ceil(timeLeft / 1000) + " seconds";
        }
    } else {
        checkCommand.isValid = false;
        checkCommand.errorMessage = "Command arguments are not valid: " + request.args;
    }

    return checkCommand;
};

pingExecute = function (request) {
    return "Pong " + request.user.name + request.args[0];
}

printMessage = function (request) {
    return "I exist " + request.user.name + " " + request.args[0];
};

printMessage2 = function (request) {
    return "I also exist " + request.user.name + " " + request.args[0];
};

createExecute = function (author) {
    userModule.setupNewUser(author);
    return "Character has been setup for " + author.username + ". Welcome to the Stellar Discord Universe!";
};

taken = function (request) {
    return "You already have a character, " + request.user.name + "!";
}

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
        execute: printMessage2,
        isValid: isCommandValid
    };
    commandMap["ping"] = {
        argumentCount: 0,
        wait: 3,
        execute: pingExecute,
        isValid: isCommandValid
    };
    commandMap["create"] = {
        argumentCount: 0,
        wait: 0,
        execute: taken,
        isValid: isCommandValid
    };
    Object.assign(commandMap, userCommandModule.getCommands());
    return commandMap;
};

doesCommandExist = function (command) {
    return commandMap[command] != null;
};

checkValid = function (request) {
    return commandMap[request.command].isValid(request);
};

executeCommand = function (request) {
    
    return commandMap[request.command].execute(request);
};

getCommandMap = function () {
    return commandMap;
};

isCommandCreate = function (command) {
    return command == "create";
};

createCharacter = function (author) {
    return createExecute(author);
};

module.exports = {
    doesCommandExist: doesCommandExist,
    checkValid: checkValid,
    executeCommand: executeCommand,
    getCommandMap: getCommandMap,
    isCommandCreate: isCommandCreate,
    createCharacter: createCharacter
}

const commandMap = setupCommands();