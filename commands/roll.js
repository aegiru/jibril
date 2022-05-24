const Discord = require("discord.js");

exports.run = async (bot, message, args) => {

    let userVar = message.author;
    let number;
    let n = Number(args);
    
    if (!isNaN(Number(args))) {
        number = Math.random() * (Number(args) - 0) + 0;
    } else {
        number = Math.random() * (100 - 0) + 0;
    }
    if (message.guild) {
        message.channel.send(`${userVar} rolled \`${Math.round(number)}\`!`);
    } else {
        message.channel.send(`You rolled \`${Math.round(number)}\`!`);
    }
    
};

exports.cfg = {
    command: "roll",
    enabled: true,
    guildOnly: false,
    aliases: ['randomnumber']
};
exports.help = {
    description: "Rolls a random number between 0 and 100 or specified number.",
    usage: "roll [Max Value/Comment]",
    name: "roll",
    show: true
}