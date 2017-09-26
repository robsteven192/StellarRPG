const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const commandModule = require("./commands.js");
const userModule = require("./users.js");


client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
    // Example of changing the bot's playing game to something useful. `client.user` is what the
    // docs refer to as the "ClientUser".
    client.user.setGame(`with cool kids.`);
});

client.on("message", async message => {
    //Ignore bot messages
    if (message.author.bot) return;
    //Ignore messages that do not start with the given prefix
    if (message.content.indexOf(config.prefix) !== 0) return;
  
    // command = ping
    // args = ["Is", "this", "the", "real", "life?"]
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (!userModule.doesUserExist(message.author.id) && commandModule.isCommandCreate(command)) {
        message.channel.send(commandModule.createCharacter(message.author));
    }
    else if (!userModule.doesUserExist(message.author.id)) {
        message.channel.send("You have not setup your character. Use s!create");
    }
    else if (commandModule.doesCommandExist(command)) {
        var user = userModule.getUser(message.author.id);
        var commandCheck = commandModule.checkValid(command, args, user);

        if (commandCheck.isValid) {
            message.channel.send(commandModule.executeCommand(command, args, user));
        } else {
            if (commandCheck.errorMessage != null) {
                message.channel.send(commandCheck.errorMessage);
            } else {
                message.channel.send("An error occured trying to execute the command");
            }
        }
    }
});

//Execute the login for the Bot
client.login(config.token);