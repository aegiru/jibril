const Discord = require("discord.js");
const hcom = require('./hcom.json');
var commands = ["8ball", "anime", "avatar", "ban", "botinfo", "createrolemessage", "currency", "help", "kick", "lasttry", "manga", "pics", "ping", "play", "poll", "prefix", "purge", "queue", "roll", "serverinfo", "skip", "tokana", "toromaji", "urban", "vote", "weather"];
var dcommands = ["8ball", "anime", "avatar", "botinfo", "currency", "help", "lasttry", "manga", "pics", "ping", "prefix", "roll", "tokana", "toromaji", "urban", "weather"];
exports.run = async (bot, message, args) => {
    if (message.channel.type === "dm") {
        if (!args[0]) {
            let commanderinos = [];
            for (let i in dcommands) {
                let c = `\`${dcommands[i]}\``;
                commanderinos.push(c);
            }
            var dcommandsString = commanderinos.join(" ");
            let noHelpEmbed = new Discord.RichEmbed()
                .setAuthor(`Commands working in DM channels`)
                .setTitle('For further details use `help [command]`')
                .setDescription(dcommandsString)
                .setColor(0x018e02);
            message.channel.send(noHelpEmbed);
        } else if (commands.includes(args[0])) {
            let helpCommand = bot.commands.get(args[0]).help;
            let helpEmbed = new Discord.RichEmbed()
                .setTitle(`Command: ${args[0]}`)
                .setColor(0x018e02)
                .addField(helpCommand.description, `Usage: \`${helpCommand.usage}\``)
                .addField("Exapmle:", helpCommand.example)
                .setFooter(`[information] stands for essential data, while {options} stands for optional data`, "https://i.imgur.com/F9vAQPg.png");
            message.channel.send(helpEmbed);
        } else {
            message.channel.send("This command doesn't exist");
        }
    } else {
        if (!args[0]) {
            let commanderinos = [];
            for (let i in commands) {
                let c = `\`${commands[i]}\``;
                commanderinos.push(c);
            }
            var commandsString = commanderinos.join(" ");
            let noHelpEmbed = new Discord.RichEmbed()
                .setAuthor(`Commands working on: ${message.guild.name}`)
                .setTitle('For further details use `help [command]`')
                .setDescription(commandsString)
                .setColor(0x018e02);
            message.channel.send(noHelpEmbed);
        } else if (commands.includes(args[0])) {
            let helpCommand = bot.commands.get(args[0]).help;
            let helpEmbed = new Discord.RichEmbed()
                .setTitle(`COMMAND: ${args[0]}`)
                .setColor(0x018e02)
                .addField(helpCommand.description, `USAGE: \`${helpCommand.usage}\`\nEXAMPLE: \`${helpCommand.example}\``)
                .setFooter(`[information] stands for essential data, while {options} stands for optional data`, "https://i.imgur.com/F9vAQPg.png");
            message.channel.send(helpEmbed);
        } else {
            message.channel.send("This command doesn't exist");
        }
    }
};

exports.cfg = {
    command: "help",
    enabled: true,
    guildOnly: false,
    aliases: ["halp"]
};

exports.help = {
    name: "help",
    description: "Helps you with a command",
    usage: "help {command}",
    show: true
};
