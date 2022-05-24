const Discord = require("discord.js");
const ud = require('urban-dictionary');

exports.run = async (bot, message, args) => {
    let emojiList = ['⏪', '⏩', '🇽'];
    var page = 0;
    ud.term(args.join(" "), (error, entries, tags, sounds) => {
        if (error) {
            message.channel.send(`<@${message.author.id}>, ${error}`);
        } else {
            
            let embed = new Discord.RichEmbed()
                .setTitle(`Page ${page + 1}/10`)
                .addField(`Word`, entries[page].word)
                .addField(`Definition`, entries[page].definition)
                .addField(`Author`, entries[page].author)
                .addField(`Rating`, "\`" + entries[page].thumbs_up + "\` \:thumbsup: **/** \`" + entries[page].thumbs_down + "\` \:thumbsdown:")
                .setFooter(`Use emotes to change pages.`, "https://i.imgur.com/F9vAQPg.png");
            message.channel.send(embed).then((msg) => {
                react(msg);
                reactionWait(msg);   
            });
        }
        async function pagePlus(msg) {
            console.log(page);
            if (page === 9) {
                page = 0;
            } else {
                page += 1;
            }
            console.log(page);
            let newEmbed = new Discord.RichEmbed()
                .setTitle(`Page ${page + 1}/10`)
                .addField(`Word`, entries[page].word)
                .addField(`Definition`, entries[page].definition)
                .addField(`Author`, entries[page].author)
                .addField(`Rating`, "\`" + entries[page].thumbs_up + "\` \:thumbsup: **/** \`" + entries[page].thumbs_down + "\` \:thumbsdown:")
                .setFooter(`Use emotes to change pages.`, "https://i.imgur.com/F9vAQPg.png");
            msg.edit("", newEmbed).then((mesg) => {
                react(mesg);
            });
        }
        async function pageMinus(msg) {
            console.log(page);
            if (page === 0) {
                page = 9;
            } else {
                page -= 1;
            }
            console.log(page);
            let newEmbed = new Discord.RichEmbed()
                .setTitle(`Page ${page + 1}/10`)
                .addField(`Word`, entries[page].word)
                .addField(`Definition`, entries[page].definition)
                .addField(`Author`, entries[page].author)
                .addField(`Rating`, "\`" + entries[page].thumbs_up + "\` \:thumbsup: **/** \`" + entries[page].thumbs_down + "\` \:thumbsdown:")
                .setFooter(`Use emotes to change pages.`, "https://i.imgur.com/F9vAQPg.png");
            msg.edit("", newEmbed).then((mesg) => {
                react(mesg);
            });
        }
        async function pageCancel(msg) {
            console.log(page);
            let newEmbed = new Discord.RichEmbed()
                .setTitle(`Page ${page + 1}/10`)
                .addField(`Word`, entries[page].word)
                .addField(`Definition`, entries[page].definition)
                .addField(`Author`, entries[page].author)
                .addField(`Rating`, "\`" + entries[page].thumbs_up + "\` \:thumbsup: **/** \`" + entries[page].thumbs_down + "\` \:thumbsdown:");
            msg.edit("", newEmbed).then((mesg) => {
                mesg.clearReactions();
            });
        }
        async function reactionWait(msg) {
            bot.on('raw', event => {
                if (event.t === "MESSAGE_REACTION_ADD") {
                    if (event.d.user_id === message.author.id) {
                        if (event.d.user_id !== bot.user.id) {
                if (event.d.message_id === msg.id) {
                    if (event.d.emoji.name === "⏪") {
                        pageMinus(msg);

                    } else if (event.d.emoji.name === "⏩") {
                        pagePlus(msg);

                    } else if (event.d.emoji.name === "🇽") {
                        pageCancel(msg);

                    }
                }
            }
                    }
                }
            });
            
        }
    });
    async function react(msg) {
        await msg.clearReactions();
        await msg.react("⏪");
        await msg.react("⏩");
        await msg.react("🇽");
    }
    
};

exports.cfg = {
    command: "urban",
    enabled: true,
    guildOnly: false,
    aliases: ['ud', 'urbandictionary']
};
exports.help = {
    name: 'urban',
    description: 'Searches for a given term on urban-dictionary',
    usage: 'urban [term]',
    show: true,
    example: 'urban home'
};