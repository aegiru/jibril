const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
    if (message.mentions.everyone) return message.channel.reply(", do not mention everyone in the message, I can't get everyone's avatars at once, you know?");
    bot.fetchUser(message.mentions.users.first()).then(uId => {

        let embed = new Discord.RichEmbed()
            .setAuthor(uId.tag)
            .setTitle("Direct Image Link")
            .setURL(uId.avatarURL)
            .setImage(uId.avatarURL);

        message.channel.send(embed);
    });
};

exports.cfg = {
    command: "avatar",
    enabled: true,
    guildOnly: false,
    aliases: ['av']
};
exports.help = {
    name: 'avatar',
    description: "Sends avatar picture of user you mention.",
    usage: 'avatar [mention]',
    example: 'avatar @Zaulek',
    show: true
};