//new line bitch
// Load up the discord.js library
const Discord = require("discord.js");

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");

const commandMap = {};
const usersMap = {};

pingExecute = function () {
    return "Pong";
}

printMessage = function (message) {
    return message;
};

setupCommands = function () {
    commandMap["test"] = {
        argumentCount: 0,
        wait: 5,
        execute: printMessage("I exist")
    };
    commandMap["test2"] = {
        argumentCount: 1,
        wait: 10,
        execute: printMessage("I exist as well")
    };
    commandMap["ping"] = {
        argumentCount: 0,
        wait: 3,
        execute: pingExecute()
    }
};

client.on("ready", () => {
    setupCommands();

  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setGame(`on ${client.guilds.size} servers`);
});


client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.
  
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;
  
  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (commandMap[command] != null) {
      if (args.length == commandMap[command].argumentCount) {
          if (usersMap[message.author.id] == null) {
              usersMap[message.author.id] = {
                  name: message.author.username,
                  commandTimestamps: {}
              }
          }
          
          if (usersMap[message.author.id].commandTimestamps[command] == null) {
              usersMap[message.author.id].commandTimestamps[command] = { time: Date.now() };
              message.channel.send(commandMap[command].execute);
          } else if (usersMap[message.author.id].commandTimestamps[command].time + (commandMap[command].wait * 1000) < Date.now()) {
              usersMap[message.author.id].commandTimestamps[command].time = Date.now();
              message.channel.send(commandMap[command].execute);
          } else {
              var timeLeft = usersMap[message.author.id].commandTimestamps[command].time + (commandMap[command].wait * 1000) - Date.now();
              message.channel.send("You cant do that yet you son of a bitch! Wait " + Math.ceil(timeLeft / 1000) + " seconds");
          }

          
      } else {
          message.channel.send("Invalid argument count for " + command + ". Should be of length: " + commandMap[command].argumentCount);
      }
  }

});

client.login(config.token);