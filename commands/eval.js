const Discord = require("discord.js");
const db = require('quick.db');
const request = require('request');
const xml2JS = require('xml2js');

exports.run = async (bot, message, args) => {

    if (message.author.id !== '217682683030011904') return;
    try {
        let code = args.join(" ");
        let evaled = eval(code);

        if (typeof evaled !== "string")
            evaled = require("util").inspect(evaled);

        message.reply(`*executed in ${eval(new Date().getTime() - message.createdTimestamp)} ms*\n\`\`\`${evaled}\`\`\`\n`);
    } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
    }
};

exports.cfg = {
    command: "eval",
    enabled: true,
    guildOnly: false,
    aliases: ['ev']
};
exports.help = {
    show: false,
    name: "eval"
};
