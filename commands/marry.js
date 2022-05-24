const Discord = require("discord.js");
const sql = require("sqlite");

exports.run = async (bot, message, args) => {
    if (message.mentions.everyone) {
        message.channel.send("You can't marry everyone!");
    } else if (message.mentions.roles.size >= 1) {
        message.channel.send("You can't marry a role...");
    } else if (message.mentions.members > 1) {
        message.channel.send("You can't mutliple people!");
    } else if (message.mentions.users > 1) {
        message.channel.send("You can't mutliple people!");
    } else {
        
        let userA = message.author;
        let key = Array.from(message.mentions.users.keys())[message.mentions.users.size - 1];
        let userB = message.mentions.users.get(key);
        console.log(userA.id);
        sql.get(`SELECT * FROM marriages WHERE user1 = ${userA.id} OR user2 = ${userA.id}`).then(row => {
            console.log(row);
            if (!row) {
                secondLevel(userA, userB);
            } else {
                return message.channel.send(`<@${userA.id}>, you're married already!`);
            }
        }).catch(() => {
            return message.channel.send(`Something went wrong, please try again later.`);
        }); 
    }
      

   
    function secondLevel(userA, userB) {
        sql.run(`SELECT * FROM marriages WHERE user1 = ${userB.id} OR user2 = ${userB.id}`).then(brow => {
            console.log(brow);
            if (!brow) {
                marriage(userA, userB);
            } else {
                return message.channel.send(`Looks like **${userB.username}#${userB.discriminator}** is married already...`);
            }
        }).catch(() => {
            return message.channel.send(`Something went wrong, please try again later.`);
        });
    }        

    function marriage(userA, userB) {
        if (userA.id === userB.id) {
            return message.channel.send(":heavy_multiplication_x: You can't marry yourself, as much as you want to.");
        }
        if (userB.id === bot.user.id) {
            if (userA.id === "217682683030011904") {
                message.channel.send(`Of course, I'll gladly marry you, my master!`);
                sql.run("INSERT INTO marriages (user1, user2) VALUES (?, ?)", [userA.id, userB.id])
                    .catch(() => {
                        sql.run("CREATE TABLE IF NOT EXISTS marriages (user1 TEXT, user2 TEXT)").then(() => {
                            sql.run("INSERT INTO marriages (user1, user2) VALUES (?, ?)", [userA.id, userB.id]);
                        });
                    });
            }
            let d = Math.random();
            if (d < 0.01) {
                message.channel.send(`:tada: **${userA.username}#${userA.discriminator}** is now married to **${userB.username}#${userB.discriminator}**! :tada:`);
                sql.run("INSERT INTO marriages (user1, user2) VALUES (?, ?)", [userA.id, userB.id])
                    .catch(() => {
                        sql.run("CREATE TABLE IF NOT EXISTS marriages (user1 TEXT, user2 TEXT)").then(() => {
                            sql.run("INSERT INTO marriages (user1, user2) VALUES (?, ?)", [userA.id, userB.id]);
                        });
                    });
            } else {
                return message.channel.send(`Sorry **${userA.username}#${userA.discriminator}**, but you aren't that special to me.`);
            }
        }
        message.channel.send(`**${userA.username}** wants to marry **${userB.username}**\n<@${userB.id}> type \`yes\` to accept!`).then((msg) => {
            const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 120000 });
            collector.on("collect", reply => {
                if (reply.toString().toLowerCase() === "yes" || reply.toString().toLowerCase() === "yeah" || reply.toString().toLowerCase() === "sure") {
                    message.channel.send(`:tada: **${userA.username}#${userA.discriminator}** is now married to **${userB.username}#${userB.discriminator}**! :tada:`);
                    sql.run("INSERT INTO marriages (user1, user2) VALUES (?, ?)", [userA.id, userB.id])
                        .catch(() => {
                            sql.run("CREATE TABLE IF NOT EXISTS marriages (user1 TEXT, user2 TEXT)").then(() => {
                                sql.run("INSERT INTO marriages (user1, user2) VALUES (?, ?)", [userA.id, userB.id]);
                            });
                        });
                } else if (reply.toString().toLowerCase() === "no" || reply.toString().toLowerCase() === "fuck no" || reply.toString().toLowerCase() === "ewww") {
                    let a = Math.random();
                    let answer;
                    if (a < 0.1) {
                        answer = `Sorry, **${userA.username}**, but **${userB.username}** doesn't want to marry you. ~~Maybe send them nudes first?~~`;
                    } else {
                        answer = `Sorry, **${userA.username}**, but **${userB.username}** doesn't want to marry you.`;
                    }
                    return message.channel.send(answer);
                }
            });
        });
    }

    function cFL(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
};

exports.cfg = {
    command: "marry",
    enabled: false,
    guildOnly: true,
    aliases: ['giveyoursoulto','gvurslto']
};
exports.help = {
    show: false,
    name: 'marry',
    description: "Ask a user if they want to marry you!",
    usage: `marry [mention]`,
    example: `marry @Zaulek`
};