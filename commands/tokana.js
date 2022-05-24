const Discord = require("discord.js");
const wanakana = require('wanakana');

exports.run = async (bot, message, args) => {

    message.reply('Transforming to kana...').then((msg) => {
        let m = args.toString();
        if (wanakana.isRomaji(m) === true) {
            msg.edit(`<@${message.author.id}>, ${wanakana.toKana(m)}`);
        } else {
            msg.edit(`<@${message.author.id}>, That's not romaji!`);
        }
    });
};

exports.cfg = {
    command: "tokana",
    enabled: true,
    guildOnly: false,
    aliases: ['tk']
};
exports.help = {
    name: 'tokana',
    description: 'Transforms given text into kana',
    usage: 'tokana [romaji]',
    show: true
};
