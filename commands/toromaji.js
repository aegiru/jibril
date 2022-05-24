const Discord = require("discord.js");
const wanakana = require('wanakana');

exports.run = async (bot, message, args) => {

    message.reply('Transforming to romaji...').then((msg) => {
        let m = args.toString();
        if (wanakana.isKana(m) === true) {
            msg.edit(`<@${message.author.id}>, ${wanakana.toKana(m)}`);
        } else {
            msg.edit(`<@${message.author.id}>, That's not kana!`);
        }
    });
};

exports.cfg = {
    command: "toromaji",
    enabled: true,
    guildOnly: false,
    aliases: ['tr']
};
exports.help = {
    name: 'toromaji',
    description: "Transforms given kana to romaji - use KANA and not whole kanji, otherwise the result will be bugged.",
    usage: 'toromaji [kana]',
    show: true
};
