const Discord = require("discord.js");
const swap = require("node-currency-swap");
const isCurrencyCode = require('is-currency-code');

exports.run = async (bot, message, args) => {
    if (isNaN(args[0])) {
        return message.reply("\`" + args[0] + "\` is not a number.");     
    } else if (!isCurrencyCode(args[1])) {
        return message.reply("\`" + args[1] + "\` is not a correct currency. Please check the list at https://www.xe.com/iso4217.php");
    } else if (!isCurrencyCode(args[2])) {
        return message.reply("\`" + args[2] + "\` is not a correct currency. Please check the list at https://www.xe.com/iso4217.php"); 
    } else {
        swap.addProvider(new swap.providers.GoogleFinance());
        swap.addProvider(new swap.providers.YahooFinance({ timeout: 2000 }));
        console.log(args[0] + args[1] + args[2]);
        swap.quote({ currency: `${args[1]}/${args[2]}` }, async function (err, rate) {
            console.log(rate[0].value);
            let moneyEmbed = new Discord.RichEmbed()
                .setAuthor(message.author.username, message.author.avatarURL)
                .addField("Input currency", `**${args[0]}** ${args[1]}`, true)
                .addField("New currency", `**${args[0] * rate[0].value}** ${args[2]}`, true)
                .setFooter("Currency changing available thanks to generosity of [Open Exchange Rates](https://openexchangerates.org)");
            message.channel.send(moneyEmbed);
        });
        
    } 
};

exports.cfg = {
    command: "currency",
    enabled: true,
    guildOnly: false,
    aliases: ['cur']
};
exports.help = {
    show: false,
    name: 'currency',
    description: "Converts one currency to another",
    usage: `currency [amount] [input currency] [desired currency]`,
    example: `currency 100 EUR USD`
};