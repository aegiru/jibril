const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const db = require('quick.db');

exports.run = async (bot, message, args) => {

        db.fetchObject(`guildPrefix_${message.guild.id}`).then(i => {
            let prefix;
            if (i.text) {
                prefix = i.text;
            } else {
                prefix = '~';
            }

            if (!args.join(" ")) return message.channel.send(`Current prefix: ${prefix}`);
            if (!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send(`You don't have Guild Management permission.`);

            db.updateText(`guildPrefix_${message.guild.id}`, args.join().trim()).then(i => {
                message.channel.send(`Prefix changed to ${i.text}`);
            });
        });
};

exports.cfg = {
    command: "prefix",
    enabled: true,
    guildOnly: true,
    aliases: ['pfx', 'px']
};
exports.help = {
    name: "prefix",
    description: "Shows current prefix. You can also change the prefix if you have permissions",
    usage: "prefix {new prefix}",
    show: true,
    example: "prefix >>"
};
