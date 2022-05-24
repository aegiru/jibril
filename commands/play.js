const botconfig = require("./botconfig.json");
const ytdl = require("ytdl-core");
const Discord = require("discord.js");
const request = require("request");
const yt_api_key = botconfig.yapi;
const youtubedl = require("youtube-dl");

exports.run = async (bot, message, args) => {
    if (args[0].includes("youtube.com")) {
        message.channel.startTyping();
        if (message.member.voiceChannel || guilds[message.guild.id].voiceChannel !== null) {
            youtubedl.getInfo(`${args[0]}`,[] , { maxBuffer: Infinity }, function (err, info) {
                if (err) throw new Error(err);
                        if (guilds[message.guild.id].queue.length > 0 || guilds[message.guild.id].isPlaying) {
                            add_to_queue(info.id, message);
                            let duration = formatS(info._duration_raw);
                            let queueEmbed = new Discord.RichEmbed()
                                .setTitle(`Added to Queue: ${info.title}`)
                                .setURL(`https://www.youtube.com/watch?v=${info.id}`)
                                .setColor(0xec2ff9)
                                .setDescription(`\`${duration}\` - **Requested by** \`${message.author.username}\``)
                                .setThumbnail(`https://img.youtube.com/vi/${info.id}/hqdefault.jpg?width=80&height=60`);
                            msg.edit(queueEmbed);
                            guilds[message.guild.id].queueNames.push(info.title);
                            guilds[message.guild.id].queueLengths.push(duration);
                            reply.delete();
                        } else {
                            isPlaying = true;
                            guilds[message.guild.id].queue.push(info.id);
                            guilds[message.guild.id].queueUsers.push(message.author.id);
                            let duration = formatS(info._duration_raw);
                            guilds[message.guild.id].queueLengths.push(duration);
                            guilds[message.guild.id].queueNames.push(info.title);
                            let nowPlayEmbed = new Discord.RichEmbed()
                                .setColor(3447003)
                                .setTitle(`Now Playing: ${guilds[message.guild.id].queueNames[0]}`)
                                .setURL(`https://www.youtube.com/watch?v=${info.id}`)
                                .setDescription(`\`${duration}\` - **Requested by** \`${message.author.username}\``)
                                .setThumbnail(`https://img.youtube.com/vi/${info.id}/hqdefault.jpg?width=80&height=60`);                      
                            playMusic(info.id, message);
                            message.channel.send(nowPlayEmbed);
                            message.channel.stopTyping();
                        }
                });
        } else {
        message.reply(" you need to be in a voice channel!");
        message.channel.stopTyping();
    }
    } else {
    message.channel.startTyping();
    if (message.member.voiceChannel || guilds[message.guild.id].voiceChannel !== null) {
        message.channel.send(`**Searching** \`${args.join(' ')}\``).then((msg) => {
            youtubedl.getInfo(`ytsearch6:${args.join(' ')}`,[] , { maxBuffer: Infinity }, function (err, info) {
                if (err) throw new Error(err);
                let potvid = ``;
                for (var d = 0; d < info.length; d++) {
                    var temp = `\`${d + 1}:\`` + " " + `[${info[d].title}](https://www.youtube.com/watch?v=${info[d].id}) | \`${formatS(info[d]._duration_raw)}\`` + "\n" + "\n";
                    potvid += temp;
                }
                let pv = new Discord.RichEmbed()
                    .setTitle(`Results for \`${args.join(' ')}\``)
                    .setDescription(potvid);
                msg.edit(pv);
                message.channel.stopTyping();
                const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 120000 });
                collector.on('collect', reply => {
                    message.channel.startTyping();
                    if (between(reply.content, 1, 6)) {
                        let repn = reply.content - 1;
                        if (guilds[message.guild.id].queue.length > 0 || guilds[message.guild.id].isPlaying) {
                            add_to_queue(info[repn].id, message);
                            let duration = formatS(info[repn]._duration_raw);
                            let queueEmbed = new Discord.RichEmbed()
                                .setTitle(`Added to Queue: ${info[repn].title}`)
                                .setURL(`https://www.youtube.com/watch?v=${info[repn].id}`)
                                .setColor(0xec2ff9)
                                .setDescription(`\`${duration}\` - **Requested by** \`${message.author.username}\``)
                                .setThumbnail(`https://img.youtube.com/vi/${info[repn].id}/hqdefault.jpg?width=80&height=60`);
                            msg.edit(queueEmbed);
                            guilds[message.guild.id].queueNames.push(info[repn].title);
                            guilds[message.guild.id].queueLengths.push(duration);
                            reply.delete();
                            message.channel.stopTyping();
                        } else {
                            guilds[message.guild.id].isPlaying = true;
                            guilds[message.guild.id].queue.push(info[repn].id);
                            guilds[message.guild.id].queueUsers.push(message.author.id);
                            let duration = formatS(info[repn]._duration_raw);
                            guilds[message.guild.id].queueLengths.push(duration);
                            guilds[message.guild.id].queueNames.push(info[repn].title);
                            let nowPlayEmbed = new Discord.RichEmbed()
                                .setColor(3447003)
                                .setTitle(`Now Playing: ${guilds[message.guild.id].queueNames[0]}`)
                                .setURL(`https://www.youtube.com/watch?v=${info[repn].id}`)
                                .setDescription(`\`${duration}\` - **Requested by** \`${message.author.username}\``)
                                .setThumbnail(`https://img.youtube.com/vi/${info[repn].id}/hqdefault.jpg?width=80&height=60`);                      
                            playMusic(info[repn].id, message);
                            msg.edit(nowPlayEmbed);
                            reply.delete();
                            message.channel.stopTyping();
                        }
                    }
                });
            });
        });
        } else {
        message.reply(" you need to be in a voice channel!");
        message.channel.stopTyping();
    }
    }
    function between(x, min, max) {
        return x >= min && x <= max;
    }

    function playMusic(id, message) {
        guilds[message.guild.id].voiceChannel = message.member.voiceChannel;
        guilds[message.guild.id].voiceChannel.join().then(function (connection) {
            stream = ytdl("https://www.youtube.com/watch?v=" + id, {
                quality: "highestaudio", filter: 'audioonly'
            });
            guilds[message.guild.id].skipReq = 0;
            guilds[message.guild.id].skippers = [];
            guilds[message.guild.id].dispatcher = connection.playStream(stream, { volume: 0.05 });
            guilds[message.guild.id].dispatcher.on('end', function () {
                guilds[message.guild.id].skipReq = 0;
                guilds[message.guild.id].skippers = [];
                guilds[message.guild.id].queue.shift();
                guilds[message.guild.id].queueNames.shift();
                guilds[message.guild.id].queueUsers.shift();
                guilds[message.guild.id].queueLengths.shift();
                if (guilds[message.guild.id].queue.length === 0) {
                    guilds[message.guild.id].queue = [];
                    guilds[message.guild.id].queueNames = [];
                    guilds[message.guild.id].isPlaying = false;
                    setTimeout(function () { guilds[message.guild.id].voiceChannel.leave(); }, 500);
                } else {
                    setTimeout(function () {
                        playNext(guilds[message.guild.id].queue[0], connection);
                    }, 500);
                }
            });
        });
    }
    function formatS(time) {        
        var hrs = ~~(time / 3600);
        var mins = ~~((time % 3600) / 60);
        var secs = time % 60;
        var ret = "";
        if (hrs > 0) {
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }
        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;    
    }

    function getID(str, cb) {
        if (isYoutube(str)) {
            cb(getYouTubeID(str));
        } else {
            search_video(str, function (id) {
                cb(id);
            });
        }
    }
    function playNext(id, connection) {
        stream = ytdl("https://www.youtube.com/watch?v=" + id, {
            quality: "highestaudio", filter: 'audioonly'
        });
        guilds[message.guild.id].skipReq = 0;
        guilds[message.guild.id].skippers = [];
        guilds[message.guild.id].dispatcher = connection.playStream(stream, { volume: 0.01 });
        let nextPlayEmbed = new Discord.RichEmbed()
            .setColor(3447003)
            .setTitle(`Now Playing: ${guilds[message.guild.id].queueNames[0]}`)
            .setURL(`https://www.youtube.com/watch?v=${id}`)
            .setDescription(`\`${guilds[message.guild.id].queueLengths[0]}\` - **Requested by** \`${bot.users.get(guilds[message.guild.id].queueUsers[0]).username}\``)
            .setThumbnail(`https://img.youtube.com/vi/${id}/hqdefault.jpg?width=80&height=60`);
        message.channel.send(nextPlayEmbed);
        guilds[message.guild.id].dispatcher.on('end', function () {
            guilds[message.guild.id].skipReq = 0;
            guilds[message.guild.id].skippers = [];
            guilds[message.guild.id].queue.shift();
            guilds[message.guild.id].queueNames.shift();
            guilds[message.guild.id].queueUsers.shift();
            guilds[message.guild.id].queueLengths.shift();
            if (guilds[message.guild.id].queue.length === 0) {
                guilds[message.guild.id].queue = [];
                guilds[message.guild.id].queueNames = [];
                guilds[message.guild.id].isPlaying = false;
            } else {
                setTimeout(function () {
                    playNext(guilds[message.guild.id].queue[0], connection);
                }, 500);
            }
        });
    }

    function add_to_queue(strID, message) {
        guilds[message.guild.id].queueUsers.push(message.author.id);
        if (isYoutube(strID)) {
            guilds[message.guild.id].queue.push(getYouTubeID(strID));
        } else {
            guilds[message.guild.id].queue.push(strID);
        }
    }

    function search_video(query, callback) {
        request("https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=" + encodeURIComponent(query) + "&key=" + yt_api_key, function (error, response, body) {
            var json = JSON.parse(body);
            if (!json) callback("3_-a9nVZYjk");
            else {
                callback(json.items[0].id.videoId);
            }
        });
    }

    function isYoutube(str) {
        return str.toString().toLowerCase().indexOf("youtube.com") > -1;
    }
};

exports.cfg = {
    command: "play",
    enabled: true,
    guildOnly: true,
    aliases: ['music']
};
exports.help = {
    name: "play",
    description: "Connects to same voice channel as you and plays song based on youtube search",
    usage: "play [youtube url/name of song]",
    show: true
};
