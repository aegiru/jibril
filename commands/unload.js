const Discord = require("discord.js");

exports.run = async (bot, message, args) => {

    if (message.author.id !== "217682683030011904") return message.reply("You ain't Zaulek, I ain't reloading");

    if (!args || args.size < 1) return message.reply("Must provide a command name to reload.");
    let cmd = args.toString();
    if (!bot.commands.has(cmd) && !bot.aliases.has(cmd)) return message.reply("Command doesn't exist.");

    bot.commands.delete(cmd);
    message.reply(`The command \`${args}\` has been unloaded`);

};

exports.cfg = {
    command: "unload",
    enabled: true,
    guildOnly: false,
    aliases: ['ul']
};
exports.help = {
    show: false,
    name: "unload"
};