const Discord = require("discord.js");
const eball = require("8ball")();

exports.run = async (bot, message, args) => {
    if (!args) return message.reply(", you need to ask the 8 Ball something.");
    message.reply(` ${eball}`);
};

exports.cfg = {
    command: "8ball",
    enabled: true,
    guildOnly: false,
    aliases: ['8b']
};
exports.help = {
    name: '8ball',
    description: "Ask the Magic 8 Ball to give you advice or to tell your fortune.",
    usage: '8ball [question]',
    show: true
};