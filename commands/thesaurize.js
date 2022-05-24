const Discord = require("discord.js");
const saurizeLib = require("../lib/saurizelib");

exports.run = async (bot, message, args) => {
    let newWord = saurizeLib.process(args.join(" "));
    message.reply(` a synonym for \`${args.join(" ")}\` is \`${newWord}\``);
};

exports.cfg = {
    command: "thesaurize",
    enabled: true,
    guildOnly: false,
    aliases: ['synonym', 'synonyms']
};
exports.help = {
    name: "thesaurize",
    description: "Gets a word's synonym from thesaurus.",
    usage: "thesaurize [word]",
    example: "thesaurize yeet",
    show: true
};