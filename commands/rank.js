const Discord = require("discord.js");
const sql = require("sqlite");
sql.open("./score.sqlite");

exports.run = async (bot, message, args) => {

    if (message.mentions.members.size === 1) {
        console.log("0");
        console.log(message.mentions.members.size);
    } else {
        sql.get(`SELECT * FROM scores WHERE userId = ${message.author.id} AND guildId = ${message.channel.guild.id}`).then(row => {
            if (!row) {
                sql.run("INSERT INTO scores (guildId, userId, points, level) VALUES (?, ?, ?, ?)", [message.channel.guild.id, message.author.id, 1, 0]);
            
            } else {
                let curLevel = Math.floor(0.1 * Math.sqrt(row.points));
                let nextLevel = row.level + 1;
                let nextPoints = Math.pow(nextLevel * 10, 2);
                let curLvlPoints = row.points - Math.pow(row.level * 10, 2);
                let leftPoints = nextPoints - row.points;
                let percentPoints = nextPoints - Math.pow(row.level * 10, 2);
                message.channel.send(`${row.points} - ${row.level} - ${nextPoints} - ${nextLevel} - ${curLvlPoints} - ${leftPoints} - ${percentPoints}`);
                let rankEmbed = new Discord.RichEmbed()
                    .setAuthor(`Points for ${message.author.username}:`, message.author.avatarURL)
                    .setColor(0x00AE86)
                    .addField(`Your current level: ${row.level}`, `\`${curLvlPoints}\` / \`${percentPoints}\` XP`, true);
                message.channel.send(rankEmbed);

            }
        }).catch(() => {
            sql.run("CREATE TABLE IF NOT EXISTS scores (guildId TEXT, userId TEXT, points INTEGER, level INTEGER)").then(() => {
                sql.run("INSERT INTO scores (guildId, userId, points, level) VALUES (?, ?, ?, ?)", [message.channel.guild.id, message.author.id, 1, 0]);
            });
        });
    }

};

exports.cfg = {
    command: "rank",
    enabled: true,
    guildOnly: true,
    aliases: ['rnk', 'points']
};
exports.help = {
    show: true,
    name: "rank",
    example: "rank @Zaulek",
    usage: "rank {nickname}"
};