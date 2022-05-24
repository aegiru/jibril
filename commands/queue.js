const botconfig = require("./botconfig.json");
const request = require("request");

exports.run = async (bot, message, args) => {

    let queueLength;
    if (guilds[message.guild.id].queueNames.length <= 10) {
        queueLength = guilds[message.guild.id].queueNames.length;
    } else {
        queueLength = 10;
    }
    if (queueLength === 0) return message.channel.send(`Nothing in queue! Use \`play\` to play music!`);

    var message2 = "";
    for (var i = 1; i < queueLength; i++) {
        var temp = `\`${i}:\`` + " " + `[${guilds[message.guild.id].queueNames[i]}](https://www.youtube.com/watch?v=${guilds[message.guild.id].queue[i]}) | \`${guilds[message.guild.id].queueLengths[i]}\` - **Requested by:** \`${bot.users.get(guilds[message.guild.id].queueUsers[i]).username}\`` + "\n" + "\n";
        message2 += temp;
    }

    if (queueLength === 1) {
        let queueEmbed = new Discord.RichEmbed()
            .setAuthor(`Queue for ${message.guild.name}`)
            .setTitle('__**Now playing:**__')
            .setDescription(`[${guilds[message.guild.id].queueNames[0]}](https://www.youtube.com/watch?v=${guilds[message.guild.id].queue[0]}) | \`${guilds[message.guild.id].queueLengths[0]}\` - **Requested by:** \`${bot.users.get(guilds[message.guild.id].queueUsers[0]).username}\``);
        message.channel.send(queueEmbed);
    } else if (guilds[message.guild.id].queueNames.length > 10) {
        let queueEmbed = new Discord.RichEmbed()
            .setAuthor(`Queue for ${message.guild.name}`)
            .setTitle('__**Now playing:**__')
            .setDescription(`[${guilds[message.guild.id].queueNames[0]}](https://www.youtube.com/watch?v=${guilds[message.guild.id].queue[0]}) | \`${guilds[message.guild.id].queueLengths[0]}\` - **Requested by:** \`${bot.users.get(guilds[message.guild.id].queueUsers[0]).username}\``)
            .addField('**Next in queue:**', message2)
            .setFooter(`And ${guilds[message.guild.id].queueNames.length - 10} more!`);
        message.channel.send(queueEmbed);
    } else {
        let queueEmbed = new Discord.RichEmbed()
            .setAuthor(`Queue for ${message.guild.name}`)
            .setTitle('__**Now playing:**__')
            .setDescription(`[${guilds[message.guild.id].queueNames[0]}](https://www.youtube.com/watch?v=${guilds[message.guild.id].queue[0]}) | \`${guilds[message.guild.id].queueLengths[0]}\` - **Requested by:** \`${bot.users.get(guilds[message.guild.id].queueUsers[0]).username}\``)
            .addField("**Next in queue:**", message2);
        message.channel.send(queueEmbed);
    }
};

exports.cfg = {
    command: "queue",
    enabled: true,
    guildOnly: true,
    aliases: ['q']
};
exports.help = {
    description: "Shows songs queue",
    usage: "queue",
    name: "queue",
    show: true
};
