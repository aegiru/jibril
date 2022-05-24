exports.run = async (bot, message, args) => {
    const Discord = require("discord.js");
    const booru = require('booru');
    const sfwsites = ['kn', 'sb', 'do'];
    const nsfwsites = ['db', 'yd', 'gb', 'r34'];
    const tags = args.slice(1);
    console.log(tags);

    if (args[0] === "sfw") {
        var randomsfw = sfwsites[Math.floor(Math.random() * sfwsites.length)];
        booru.search(randomsfw, tags, { random: true })
            .then(booru.commonfy)
            .then(images => {
                for (let image of images) {
                    message.channel.send(image.common.file_url);
                }
            }).catch(err => {
                if (err.name === 'BooruError') {
                    console.log(err.message);
                } else {
                    console.log(err);
                }
            });
    } else if (args[0] === "nsfw") {
        if (message.channel.nsfw === false) {
            return message.channel.send({
                embed: {
                    title: "Search for NSFW images in NSFW channels please.",
                    color: 0xd61926
                }
            });
        } else {
            var randomnsfw = nsfwsites[Math.floor(Math.random() * nsfwsites.length)];
            booru.search(randomnsfw, tags, { random: true })
                .then(booru.commonfy)
                .then(images => {
                    for (let image of images) {
                        message.channel.send(image.common.file_url);
                    }
                }).catch(err => {
                    if (err.name === 'BooruError') {
                        console.log(err.message);
                    } else {
                        console.log(err);
                    }
                });
        }
    } else {
        message.channel.send({
            embed: {
                title: "Something went wrong. Make sure you use command correctly",
                color: 0xd61926,
                description: "pics <sfw/nsfw> <tag1> <tag2>"
            }
        });
    }
};
exports.cfg = {
    command: "pics",
    enabled: true,
    guildOnly: false,
    aliases: ['pic', 'pictures']
};
exports.help = {
    name: "pics",
    description: "Returns random image from a random booru based on tags",
    usage: "pics [sfw/nsfw] {tag1} {tag2}",
    example: "pics sfw megane hatsune_miku",
    show: true
};
