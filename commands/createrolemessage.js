const Discord = require("discord.js");
const sql = require("sqlite");

exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send(`You don't have Guild Management permission.`);
    let que = args.join(" ").substring(args.toString().indexOf('"') + 1);
    let quefu = que.substring(0, que.indexOf('"'));
    let de = que.substring(que.indexOf('"') + 1);
    let detwo = de.substring(de.indexOf('"') + 1);
    let defu = detwo.substring(0, detwo.indexOf('"'));
    let em = detwo.substring(detwo.indexOf('"') + 1);
    let emo = em.substring(em.indexOf('"') + 1);
    let emoji = emo.substring(0, emo.indexOf('"'));

    let emojiList = emoji.split(",");
    optionsList = defu.split(",");

    if (emojiList.length !== optionsList.length) return message.channel.send("The amount of options and emotes isn't equal. Please check and try again.");
    let optionsText = "";
    for (let i = 0; i < optionsList.length; i++) {
        console.log(optionsList[i]);
        console.log(message.guild.roles.has(optionsList[i])); 
        optionsText += "\n" + emojiList[i] + ": \`" + optionsList[i] + "\`\n";
    }
    let embed = `**${quefu}** - **React to give yourself a role.** \n ${optionsText} \n<@${message.author.id}>, remember to check if the roles you specified are present in the server.`;
    message.delete();
    
    message.channel.send(embed)
        .then(async function (msg) {
            var reactionArray = [];
            for (var i = 0; i < optionsList.length; i++) {
                reactionArray[i] = await msg.react(emojiList[i]);
            }
            sql.run("INSERT INTO reactMessages (guildId, messageId, type, roles, emojis) VALUES (?, ?, ?, ?, ?)", [msg.channel.guild.id, msg.id, 0, optionsList.join(","), emojiList.join(",")])
                .catch(() => {
                    sql.run("CREATE TABLE IF NOT EXISTS reactMessages (guildId TEXT, messageId TEXT, type INTEGER, roles TEXT, emojis TEXT)").then(() => {
                        sql.run("INSERT INTO reactMessages (guildId, messageId, type, roles, emojis) VALUES (?, ?, ?, ?, ?)", [msg.channel.guild.id, msg.id, 0, optionsList.join(","), emojiList.join(",")]);
                });
                });
            setTimeout(function () {
                msg.edit(`**${quefu}** - **React to give yourself a role.** \n ${optionsText}`);
            }, 120000);
        });

    function cFL(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
};

exports.cfg = {
    command: "createrolemessage",
    enabled: true,
    guildOnly: true,
    aliases: ['crm']
};
exports.help = {
    show: true,
    name: 'createrolemessage',
    description: "Creates a message that assigns roles based on users' reactions.",
    usage: `createrolemessage "[question]" "[option1],[option2],[option3]..." "[emote1],[emote2],[emote3]..."`,
    example: `createrolemessage "What games do you play?" "CS:GO,Sea of Thieves,For Honor,Microsoft Flight Simulator" "\:gun:,\:skull_crossbones:,\:crossed_swords:,\:airplane:"`
};