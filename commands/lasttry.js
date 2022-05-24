const Discord = require("discord.js");
const osu = require("node-osu");
const osuApi = new osu.Api('74b3e0a2cc56964ab8006b8d22d0ba571ec3421e');
const moment = require('moment-timezone');
const osumods = require('./osumods.json');
const request = require("request-promise");
const omods = "";

exports.run = async (bot, message, args) => {

    message.channel.send(`Obtaining ${args.join(" ")}'s last play...`).then((msg) => {
        osuApi.getUserRecent({ u: args.join(" ") }).then(scores => {
            osuApi.getBeatmaps({ b: scores[0].beatmapId }).then(beatmaps => {
                const time = moment.tz(scores[0].raw_date, "Australia/Perth");
                const localtime = time.clone().tz('Atlantic/Azores');
                const tsu = scores[0].counts['300'];
                const ich = scores[0].counts['100'];
                const zero = scores[0].counts['50'];
                const gotscore = eval(`6 * ${tsu} + 2 * ${ich} + ${zero}`);
                const maxscore = eval(`6 * (${tsu} + ${ich} + ${zero} + ${scores[0].counts.miss})`);
                const acc = eval('gotscore / maxscore * 100').toFixed(2);
                const bmods = Number(scores[0].raw_mods).toString(2).split('').reverse();

                const score = scores[0].score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                if (bmods.length > 1 || bmods[1] == 1) {
                    var mods = `**+`;
                    for (var i = 0; i < bmods.length; i++) {
                        if (bmods[i] == 1) {
                            var tempMods = osumods[i];
                            if (tempMods === "DT") {
                                if (bmods[9] == 1) {} else {
                                    mods += tempMods;
                                }
                            } else {
                                mods += tempMods;
                            }
                        }
                    }
                    mods += `**`;
                } else {
                    mods = "";
                }
                
                
                const osuRecentEmbed = new Discord.RichEmbed()
                    .setAuthor(`${args[0]} | ${localtime.format().toString().replace(/[A-Z]/g, ' ')} UTC`, `https://a.ppy.sh/${scores[0].user.id}`)
                    .setDescription(`▸[${beatmaps[0].artist} - ${beatmaps[0].title} [${beatmaps[0].version}]](https://osu.ppy.sh/b/${beatmaps[0].id}&m=0) ${mods}
▸${scores[0].maxCombo}/${beatmaps[0].maxCombo} • ${scores[0].rank} • ${score} • ${acc}% • ${scores[0].counts.miss} miss(es)`)
                    .setThumbnail(`https://b.ppy.sh/thumb/${beatmaps[0].beatmapSetId}l.jpg?width=80&height=60`);
                msg.edit(osuRecentEmbed);
            });

        });
    });
};
exports.cfg = {
    command: "lasttry",
    enabled: true,
    guildOnly: false,
    aliases: ['last']
};
exports.help = {
    name: "lasttry",
    description: "Shows last osu play of specified user",
    usage: "lasttry [username]",
    show: true,
    example: "lasttry Rafis"
};
