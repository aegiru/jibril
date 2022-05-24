const Discord = require("discord.js");
const fs = require("fs");
exports.run = async (bot, message, args) => {

    if (message.author.id !== "217682683030011904") return message.reply("You ain't Zaulek, I ain't reloading");

    delete bot.commands;
    delete bot.aliases;  
    bot.commands = new Discord.Collection();
       bot.aliases = new Discord.Collection();
       fs.readdir('./commands/', (err, files) => {
           if (err) console.error(err);
           files.forEach(f => {
               delete require.cache[require.resolve(`./${f}`)];
               if (!f.endsWith(".js")) return;
               let props = require(`./${f}`);
               bot.commands.set(props.help.name, props);
               props.cfg.aliases.forEach(alias => {
                   bot.aliases.set(alias, props.help.name);
               });
           });
       });
   console.log("All commands reloaded!");
   message.channel.send("All commands reloaded!");
   return;

};

exports.cfg = {
    command: "reload",
    enabled: true,
    guildOnly: false,
    aliases: ['rld']
};
exports.help = {
    show: false,
    name: "reload"
};
