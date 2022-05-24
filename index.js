const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const sql = require("sqlite");
const fs = require("fs");
const db = require('quick.db');
const osu = require("node-osu");
const osuApi = new osu.Api(botconfig.osuapitoken);
const bot = new Discord.Client({disableEveryone: true, autoReconnect: true});
sql.open("./score.sqlite");
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
global.guilds = {};
global.commands = {};
global.reactMessages = [];
global.yt_cred = require("./client_secret.json");
const scoms = ['emojivote', 'play', 'purge', 'queue', 'serverinfo', 'skip'];
const log = (msg) => {
    console.log(msg);
};
var loadCommands = function () {
    fs.readdir('./commands/', (err, files) => {
        if (err) console.error(err);
        files.forEach(f => {
            if (!f.endsWith(".js")) return;
            let props = require(`./commands/${f}`);
            bot.commands.set(props.help.name, props);
            props.cfg.aliases.forEach(alias => {
                bot.aliases.set(alias, props.help.name);
            });
        });
    });
    console.log("All commands loaded!");
};


bot.on("ready", async () => {
    loadCommands();
    let statuses = ["~help | z.nani.tf", "v0.1.15 | z.nani.tf", `${bot.guilds.size} servers | z.nani.tf`, "Hosted by Zaulek#6558 | z.nani.tf"];
    console.log(`${bot.user.username} is ready!`);
    setInterval(function () {
        let status = statuses[Math.floor(Math.random() * statuses.length)];
        bot.user.setActivity(status);
    }, 60000);
});
bot.on("message", message => {
    if (message.author.bot) return;
    if (message.content.startsWith('https://osu.ppy.sh/')) {
        let id;
        let tn;
        let t = message.content.slice(19);
        if (t.startsWith('b/')) {
            tn = t.slice(0, -4);
        } else if (t.startsWith('beatmapsets/')) {
            tn = t.slice(11, -(t.length - t.lastIndexOf('#')));
        } else {
            tn = t;
        }
        let protid = tn.lastIndexOf('/');
        id = tn.substring(protid + 1);
        if (!isNaN(id)) {
            if (t.startsWith('s/') || t.startsWith('beatmapsets/')) {
                osuApi.getBeatmaps({ s: id }).then(beatmaps => {
                    let setEmbed = new Discord.RichEmbed()
                        .setAuthor(`${message.author.username} mentioned:`, message.author.avatarURL)
                        .setTitle(`**${beatmaps[0].artist}** - **${beatmaps[0].title}** | Mapped by ${beatmaps[0].creator}`)
                        .setDescription(`${beatmaps.length} difficulties | ${TF(beatmaps[0].time.total)} | ${beatmaps[0].bpm} BPM`)
                        .setFooter(beatmaps[0].approvalStatus, `http://asash.io/ikoner/${beatmaps[0].approvalStatus.toLowerCase()}.png`)
                        .setThumbnail(`https://b.ppy.sh/thumb/${beatmaps[0].beatmapSetId}.jpg`);
                    for (let b = 0; b < beatmaps.length; b++) {
                        setEmbed.addField(beatmaps[b].version, `**${rTT(beatmaps[b].difficulty.rating)}★** | **${TF(beatmaps[b].time.drain)}** drain | Max combo: **${beatmaps[b].maxCombo}**\n CS: **${beatmaps[b].difficulty.size}** | AR: **${beatmaps[b].difficulty.approach}** | OD: **${beatmaps[b].difficulty.overall}** | HP: **${beatmaps[b].difficulty.drain}**`);
                    }
                    message.channel.send(setEmbed);
                });
            } else {
                osuApi.getBeatmaps({ b: id }).then(beatmaps => {
                    let infoEmbed = new Discord.RichEmbed()
                        .setAuthor(`${message.author.username} mentioned:`, message.author.avatarURL)
                        .setTitle(`**${beatmaps[0].artist}** - **${beatmaps[0].title}** | Mapped by ${beatmaps[0].creator}`)
                        .setDescription(`${TF(beatmaps[0].time.total)} | ${beatmaps[0].bpm} BPM\n ** ${rTT(beatmaps[0].difficulty.rating)}★** | ** ${TF(beatmaps[0].time.drain)} ** drain | Max combo: ** ${beatmaps[0].maxCombo} **\n CS: ** ${beatmaps[0].difficulty.size} ** | AR: ** ${beatmaps[0].difficulty.approach} ** | OD: ** ${beatmaps[0].difficulty.overall} ** | HP: ** ${beatmaps[0].difficulty.drain} **`)
                        .setFooter(beatmaps[0].approvalStatus, `http://asash.io/ikoner/${beatmaps[0].approvalStatus.toLowerCase()}.png`)
                        .setThumbnail(`https://b.ppy.sh/thumb/${beatmaps[0].beatmapSetId}.jpg`);
                    message.channel.send(infoEmbed);
                });
            }
        } else {
            return;
        }
        return;    
    }
    let cmd;
    if (message.channel.type === "dm") {
        db.fetchObject(`dmPrefix_${message.channel.id}`).then(i => {
            let prefix;
            if (i.text) {
                prefix = i.text;
            } else {
                prefix = "~";
            }
            if (message.content.startsWith(prefix)) {
                message.channel.send("You don't have to use prefix in DMs, you know? I can tell you're talking with me.");
                global.messageArray = message.content.slice(prefix.length).toLowerCase().split(" ");
                global.args = message.content.slice(prefix.length).trim().split(/ +/g).slice(1);
                global.command = messageArray[0];
            } else {
                global.messageArray = message.content.toLowerCase().split(" ");
                global.args = message.content.trim().split(/ +/g).slice(1);
                global.command = messageArray[0];
            }
            if (!isNaN(command)) return;
            if (bot.commands.has(command)) {
                cmd = bot.commands.get(command);
            } else if (bot.aliases.has(command)) {
                cmd = bot.commands.get(bot.aliases.get(command));
            }
            if (cmd.cfg.guildOnly) {
                message.channel.send(`I can only use \`${command}\` on servers, use it there, please!`);
                return;
            }
            if (cmd) {
                cmd.run(bot, message, args);
            }
        });
        } else {
        db.fetchObject(`guildPrefix_${message.guild.id}`).then(i => {
            if (i.text) {
                prefix = i.text;
            } else {
                prefix = '~';
            }
            let tempA;
            if (message.content.startsWith(prefix)) {
                tempA = message.content.slice(prefix.length).toLowerCase().split(" ");
            } else if (message.isMentioned(bot.user)) {
                tempA = message.content.slice(22).toLowerCase().split(" ");
            } else {
                sql.get(`SELECT * FROM scores WHERE userId = ${message.author.id} AND guildId = ${message.channel.guild.id}`).then(row => {
                    if (!row) {
                        sql.run("INSERT INTO scores (guildId, userId, points, level) VALUES (?, ?, ?, ?)", [message.channel.guild.id, message.author.id, 1, 0]);
                    } else {
                        let curLevel = Math.floor(0.1 * Math.sqrt(row.points + 1));
                        if (curLevel > row.level) {
                            row.level = curLevel;
                            sql.run(`UPDATE scores SET points = ${row.points + 1}, level = ${row.level} WHERE userId = ${message.author.id} AND guildId = ${message.channel.guild.id}`);
                            message.reply(`You've leveled up to level **${curLevel}**! Ain't that dandy?`);
                        }
                        sql.run(`UPDATE scores SET points = ${row.points + 1} WHERE userId = ${message.author.id} AND guildId = ${message.channel.guild.id}`);
                    }
                }).catch(() => {
                    sql.run("CREATE TABLE IF NOT EXISTS scores (guildId TEXT, userId TEXT, points INTEGER, level INTEGER)").then(() => {
                        sql.run("INSERT INTO scores (guildId, userId, points, level) VALUES (?, ?, ?, ?)", [message.channel.guild.id, message.author.id, 1, 0]);
                    });
                    });
                return;
            } 
            global.command = tempA[0];
            if (bot.commands.has(command)) {
                cmd = bot.commands.get(command);
            } else if (bot.aliases.has(command)) {
                cmd = bot.commands.get(bot.aliases.get(command));
            }
            if (command === "vote" || command === "poll" || command === "createrolemessage") {
                global.messageArray = message.content.slice(prefix.length).split(" ");
                if (message.content.startsWith(prefix)) {
                    global.args = message.content.slice(prefix.length).trim().split(/ +/g).slice(1);
                } else if (message.isMentioned(bot.user)) {
                    global.args = message.content.slice(22).trim().split(/ +/g).slice(1);
                }
            } else {
                global.messageArray = message.content.slice(prefix.length).toLowerCase().split(" ");
                if (message.content.startsWith(prefix)) {
                    global.args = message.content.slice(prefix.length).trim().split(/ +/g).slice(1);
                } else if (message.isMentioned(bot.user)) {
                    global.args = message.content.slice(22).trim().split(/ +/g).slice(1);
                } 
            }
            if (!guilds[message.guild.id]) {
                guilds[message.guild.id] = {
                    queue: [],
                    queueNames: [],
                    queueUsers: [],
                    queueLengths: [],
                    isPlaying: false,
                    dispatcher: null,
                    voiceChannel: null,
                    skipReq: 0,
                    skippers: [],
                    volume: 1
                };
            }
            if (cmd) {
                cmd.run(bot, message, args);
            }
            sql.get(`SELECT * FROM scores WHERE userId = ${message.author.id} AND guildId = ${message.channel.guild.id}`).then(row => {
                if (!row) {
                    sql.run("INSERT INTO scores (guildId, userId, points, level) VALUES (?, ?, ?, ?)", [message.channel.guild.id, message.author.id, 1, 0]);
                } else {
                    console.log(row);
                    let point = Math.floor((Math.random() * 10) + 1);
                    let curLevel = Math.floor(0.1 * Math.sqrt(row.points + point));
                    if (curLevel > row.level) {
                        row.level = curLevel;
                        sql.run(`UPDATE scores SET points = ${row.points + point}, level = ${row.level} WHERE userId = ${message.author.id} AND guildId = ${message.channel.guild.id}`);
                        message.reply(`You've leveled up to level **${curLevel}**! Ain't that dandy?`);
                    }
                    sql.run(`UPDATE scores SET points = ${row.points + point} WHERE userId = ${message.author.id} AND guildId = ${message.channel.guild.id}`);
                }
            }).catch(() => {
                sql.run("CREATE TABLE IF NOT EXISTS scores (guildId TEXT, userId TEXT, points INTEGER, level INTEGER)").then(() => {
                    sql.run("INSERT INTO scores (guildId, userId, points, level) VALUES (?, ?, ?, ?)", [message.channel.guild.id, message.author.id, 1, 0]);
                });
            });
        });
    }
});
bot.on('raw', event => {
    if (event.t === 'MESSAGE_REACTION_ADD' || event.t === "MESSAGE_REACTION_REMOVE") {
        if (event.d.user_id === bot.user.id) return;
        let channel = bot.channels.get(event.d.channel_id);
        let reactId = channel.fetchMessage(event.d.message_id).then(msg => {
            sql.get(`SELECT * FROM reactMessages WHERE guildId = "${msg.guild.id}" AND messageId = "${msg.id}" AND type = 0 `).then(mId => {
                let eAr = mId.emojis.split(",");
                let oAr = mId.roles.split(",");
                if (eAr.includes(event.d.emoji.name)) {
                    let member = msg.guild.members.get(event.d.user_id);
                    let role = member.guild.roles.find('name', oAr[eAr.indexOf(event.d.emoji.name)]);
                    

                    if (event.t === 'MESSAGE_REACTION_ADD') {
                        member.addRole(role);
                        member.user.sendMessage(`**${member.guild.name}**: ${role.name} - Gave you the role!`);
                    } else {
                        member.removeRole(role);
                        member.user.sendMessage(`**${member.guild.name}**: ${role.name} - Took away the role!`);
                    }
                }
            });
        });
    }
});
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});
function rTT(num) {
    return +(Math.round(num + "e+2") + "e-2");
}
function TF(time) {

    var hrs = ~~(time / 3600);
    var mins = ~~(time % 3600 / 60);
    var secs = time % 60;

    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}
bot.login(botconfig.token);