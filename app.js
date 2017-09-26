const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const commandModule = require("./commands.js");
const userModule = require("./users.js");


client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
    client.user.setGame(`with those kids.`);
});

client.on("message", async message => {
    if (message.author.bot) return;
    if (message.content.indexOf(config.prefix) !== 0) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (!userModule.doesUserExist(message.author.id) && commandModule.isCommandCreate(command)) {
        message.channel.send(commandModule.createCharacter(message.author));
    }
    else if (!userModule.doesUserExist(message.author.id)) {
        message.channel.send("You have not set up your character. Use s!create");
    }
    else if (commandModule.doesCommandExist(command)) {
        var user = userModule.getUser(message.author.id);
        var request = {
            command: command,
            user: user,
            args: args
        };
        var commandCheck = commandModule.checkValid(request);

        if (commandCheck.isValid) {
            message.channel.send(commandModule.executeCommand(request));
        } else {
            if (commandCheck.errorMessage != null) {
                message.channel.send(commandCheck.errorMessage);
            } else {
                message.channel.send("An error occured trying to execute the command");
            }
        }
    }
});

client.login(config.token);