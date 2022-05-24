const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
    if (message.mentions.everyone) return message.channel.reply(", do not mention everyone in the message, I can't just kick everyone, you know?");
    let uId = message.mentions.members.first();
    if (!isNaN(args[1]) && args.length < 3) {
        uId.kick(args[1]);
        message.channel.send(uId + "has been kicked!");
    } else if (!isNaN(args[1]) && args.length > 2) {
        uId.kick(args[1], args.slice(2).join(" "));
        message.channel.send(uId + "has been kicked for \`" + args.slice(2).join(" ") + "\`!");
    } else if (isNaN(args[1])) {
        if (args.length < 3) {
            uId.kick(args[1]);
            message.channel.send(uId + "has been kicked!");
        } else {
            uId.kick(args[1], args.slice(2).join(" "));
            message.channel.send(uId + "has been kicked for \`" + args.slice(2).join(" ") + "\`!");
        }
    }
};

exports.cfg = {
    command: "ban",
    enabled: true,
    guildOnly: true,
    aliases: ['bn']
};
exports.help = {
    show: true,
    name: 'ban',
    description: "Bans a mentioned user for a specific amount of time and reason. Or without a reason. Your choice.",
    usage: `ban [user mention] [number of days] [reason]`,
    example: `ban @Zaulek he's a weeb`
};