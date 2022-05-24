const Discord = require("discord.js");

exports.run = async (bot, message, args) => {

    let sicon = message.guild.iconURL;
    let serverembed = new Discord.RichEmbed()
        .setDescription("Server Information")
        .setColor("#ef6bde")
        .setThumbnail(sicon)
        .addField("Server Name", message.guild.name, true)
        .addField("Created on", message.guild.createdAt, true)
        .addField("You Joined", message.member.joinedAt, true)
        .addField("Total Members", message.guild.memberCount, true);

    return message.channel.send(serverembed);

};

exports.cfg = {
    command: "serverinfo",
    enabled: true,
    guildOnly: true,
    aliases: ['si', 'serveri', 'sinfo']
};
exports.help = {
    description: "Returns info about server on which the command was sent",
    usage: "serverinfo",
    name: "serverinfo",
    show: true
};
