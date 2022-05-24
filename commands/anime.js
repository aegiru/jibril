const Discord = require("discord.js");
const malScraper = require('mal-scraper');
const search = malScraper.search;

exports.run = async (bot, message, args) => {
    message.channel.send(`Searching for ${args.join(" ")}...`).then(msg => {
        search.search("anime", {
            maxResults: 6,
            term: args.join(" ")
        }).then(j => {
            console.log(j);
            let al = "";
            for (var d = 0; d < 6; d++) {
                var temp = `\`${d + 1}:\`` + " " + `[${j[d].title}](https://myanimelist.net/anime/${j[d].url.slice(30)}) | \`${j[d].type}\` **-** \`${j[d].nbEps}\` | \`${j[d].score}\`` + "\n" + "\n";
                al += temp;
            }
            let pv = new Discord.RichEmbed()
                .setTitle(`Results for \`${args.join(' ')}\``)
                .setDescription(al);
            msg.edit(pv);
            const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 100000 });
            collector.on('collect', reply => {
                if (between(reply.content, 1, 6)) {
                    let repn = reply.content - 1;
                    let description;
                    if (j[repn].shortDescription.endsWith("read more.")) {
                        description = j[repn].shortDescription.slice(0, -10);
                    } else {
                        description = j[repn].shortDescription;
                    }
                    let aembb = new Discord.RichEmbed()
                        .setThumbnail(j[repn].image_url)
                        .setAuthor(`${message.author.username} mentioned: `, message.author.avatarURL)
                        .setFooter(`The command works thanks to MyAnimeList.net`)
                        .addField("Description:", `**[${j[repn].title}](${j[repn].url})**\n\n${description}`, false)
                        .addField("Info:", `\`${j[repn].type}\` **-** \`${j[repn].nbEps}\` | \`${j[repn].score}\` | **Members:** \`${j[repn].members}\``, false);
                    message.channel.send(aembb);
                    reply.delete;
                }
            });
        });
    });

};

function between(x, min, max) {
    return x >= min && x <= max;
}

exports.cfg = {
    command: "anime",
    enabled: true,
    guildOnly: false,
    aliases: ['anm']
};
exports.help = {
    description: "Shows info about an anime",
    usage: "anime [name]",
    name: "anime",
    show: true,
    example: "anime Hellsing Ultimate"
}