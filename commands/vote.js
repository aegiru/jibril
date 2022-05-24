const Discord = require("discord.js");
const sql = require("sqlite");

exports.run = async (bot, message, args) => {
    let que = args.join(" ").substring(args.toString().indexOf('"') + 1);
    let quefu = que.substring(0, que.indexOf('"'));
    let de = que.substring(que.indexOf('"') + 1);
    let detwo = de.substring(de.indexOf('"') + 1);
    let defu = detwo.substring(0, detwo.indexOf('"'));
    let int = Number(de.substring(de.lastIndexOf('"') + 1));
    let time;
    if (int > 60) {
        let hours = Math.floor(int / 60);
        let minutes = Math.floor(int - hours * 60);
        time = hours + " hour(s) and " + minutes + " minute(s)";
    } else {
        time = int + " minute(s)";
    }
    
    let emojiList = ['👍', '👎', '🤷'];
    let embed = new Discord.RichEmbed()
        .setTitle(cFL(quefu))
        .setDescription(cFL(defu))
        .setAuthor(message.author.username, message.author.displayAvatarURL)
        .setColor(0x00AE86)
        .setTimestamp()
        .setFooter(`The vote has started and will last ${time}`);

    message.delete();

    message.channel.send(embed)
        .then(async function (msg) {
            let reactionArray = [];
            reactionArray[0] = await msg.react(emojiList[0]);
            reactionArray[1] = await msg.react(emojiList[1]);
            reactionArray[2] = await msg.react(emojiList[2]);

            setTimeout(() => {
                msg.channel.fetchMessage(msg.id)
                    .then(async function (mesg) {
                        var reactionCountsArray = [];
                        for (let i = 0; i < reactionArray.length; i++) {
                            reactionCountsArray[i] = mesg.reactions.get(emojiList[i]).count - 1;
                        }

                        var max = -Infinity, indexMax = [];
                        for (let i = 0; i < reactionCountsArray.length; ++i)
                            if (reactionCountsArray[i] > max) max = reactionCountsArray[i], indexMax = [i];
                            else if (reactionCountsArray[i] === max) indexMax.push(i);                       
                        let winnersText = "";
                        if (reactionCountsArray[indexMax[0]] == 0) {
                            winnersText = "No one voted!";
                        } else {
                            for (var i = 0; i < indexMax.length; i++) {
                                winnersText += emojiList[indexMax[i]] + ` - **${reactionCountsArray[indexMax[i]]} ${reactionCountsArray[indexMax[i]] > 1 ? "votes" : "vote"}**`;
                            }
                        }
                        embed.addField("**Winner(s):**", winnersText);
                        embed.setFooter(`The vote is now closed! It lasted ${time}`);
                        embed.setTimestamp();
                        mesg.edit("", embed);
                    });
            }, int * 60 * 1000);
        });

    function cFL(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
};

exports.cfg = {
    command: "vote",
    enabled: true,
    guildOnly: true,
    aliases: ['vt']
};
exports.help = {
    show: true,
    name: 'vote',
    description: "Starts a yes/no/I don't know vote.",
    usage: `vote "[question]" "[description]" [amount of minutes the voting will be held for]`,
    example: `vote "Do you hate anime?" "Or are you a weeb?" 60`
};