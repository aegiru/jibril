const Discord = require("discord.js");
const fs = require("fs");
exports.run = async (bot, message, args) => {
    if (message.author.id != 217682683030011904) return message.reply("You ain't Zaulek, I ain't reloading");

    if (!args || args.size < 1) return message.reply("Must provide a command name to reload.");
    let cmd = args.toString();
    let prop;
    fs.readdir("./commands/", (err, files) => {
        if (err) console.error(err);
        if (files.includes(`${cmd}.js`)) {
            files.forEach(f => {
                if (!f.endsWith(".js")) return;
                if (f !== `${cmd}.js`) return;
                prop = f;
            });
            let props = require(`./${prop}`);
            bot.commands.set(props.help.name, props);
            props.cfg.aliases.forEach(alias => {
                bot.aliases.set(alias, props.help.name);
            });
            message.reply("Command loaded.");
        } else {
             return message.reply("File doesn't exist.");
        }
    });

};

exports.cfg = {
    command: "load",
    aliases: ['ld']
}
exports.help = {
    name: "load",
    show: false
}