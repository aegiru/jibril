const Discord = require("discord.js");

exports.run = async (bot, message, args) => {

    message.channel.send('Checking ping...').then((msg) => {
        let pingEmbed = new Discord.RichEmbed()
            .setTitle("Jibril's reaction time")
            .setDescription(`\`${Math.round(message.client.ping)}\` ms`);

        msg.edit(pingEmbed);
    });
};

exports.cfg = {
    command: "ping",
    enabled: true,
    guildOnly: false,
    aliases: ['pong', 'pingpong', 'pingu']
};
exports.help = {
    name: "ping",
    description: "Shows bot's reaction time to commands",
    usage: "ping",
    show: true
};
