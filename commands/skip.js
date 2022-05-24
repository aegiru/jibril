const Discord = require("discord.js");

exports.run = async (bot, message, args) => {

  if (guilds[message.guild.id].skippers.indexOf(message.author.id) === -1) {
           guilds[message.guild.id].skippers.push(message.author.id);
           guilds[message.guild.id].skipReq++;
           if (guilds[message.guild.id].skipReq >= Math.ceil((guilds[message.guild.id].voiceChannel.members.size - 1) / 2)) {
               skip_song(message);
               message.reply(" your skip has been acknowledged. Skipping now!");
           } else {
               message.reply(" your skip has been acknowledged. You need **" + Math.ceil((guilds[message.guild.id].voiceChannel.members.size - 1) / 2) - guilds[message.guild.id].skipReq) = "**  more skip votes!";
           }
       } else {
           message.reply(" you already voted to skip!");
}

function skip_song(message) {
    guilds[message.guild.id].dispatcher.end();
    if (guilds[message.guild.id].queue.length < 1) {
        let endEmbed = new Discord.RichEmbed()
            .setColor(15158332)
            .setTitle(`The playlist has ended!`)
            .setDescription(`Jibril, signing out!`)
        message.channel.send(endEmbed);
    }
}

}

exports.cfg = {
    command: "skip",
    enabled: true,
    guildOnly: false,
    aliases: ['nextsong']
};
exports.help = {
    description: "Votes to skip current song",
    usage: "skip",
    name: "skip",
    show: true
}
