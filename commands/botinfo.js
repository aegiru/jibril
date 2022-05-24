const Discord = require("discord.js");

exports.run = async (bot, message, args) => {

    let bicon = bot.user.displayAvatarURL;
    let botembed = new Discord.RichEmbed()
        .setDescription("Bot Information")
        .setColor(`#ef6bde`)
        .setThumbnail(bicon)
        .addField("Bot Name", bot.user.username)
        .addField("Created On", bot.user.createdAt);

    return message.channel.send(botembed);

};

exports.cfg = {
    command: "botinfo",
    enabled: true,
    guildOnly: false,
    aliases: ['bi', 'boti']
};

exports.help = {
    name: "botinfo",
    description: "Returns info about the bot",
    usage: "botinfo",
    show: true,
    example: "botinfo"
};
