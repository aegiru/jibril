const Discord = require("discord.js");
const request = require('request');
const { URL } = require('url');
const fetch = require('isomorphic-fetch');

exports.run = async (bot, message, args) => {
    message.channel.startTyping();
    let sub = args[0];
    let beta = await fetchRandomPost(sub);
    message.channel.send(beta[0].data.children[0].data.url);
    message.channel.stopTyping();
};
async function fetchRandomPost(sub){
    let url = new URL(`https://reddit.com/r/${sub}/random.json?count=1`);
    let res = await fetch(url.toString()).then(r => r.json()).catch(err => {
        if (err) console.log(`whatever went wrong: ${err}`);
    });
    return res;
}
exports.cfg = {
    command: "reddit",
    enabled: true,
    guildOnly: false,
    aliases: ['randomreddit']
};
exports.help = {
    description: "Gets a random post from specified subreddit.",
    usage: "reddit [subreddit]",
    name: "reddit",
    show: true
}