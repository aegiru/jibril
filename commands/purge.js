const Discord = require("discord.js");

exports.run = async (bot, message, args) => {

    async function purge() {
        message.delete();

        if (message.member.hasPermission("MANAGE_GUILD") === "false") return message.reply(", you don't have Guild Management permission.");

        if (isNaN(args[0])) return message.reply("specify a number please.");

        message.channel.send(`Deleting ${args} message(s), please wait...`);

        const fetched = await message.channel.fetchMessages({ limit: parseInt(args[0]) });

        await message.channel.bulkDelete(fetched)
            .catch(error => console.log(`Error: ${error}`));
    }

    purge();

    const purged = new Discord.RichEmbed()
        .setDescription(`\`${args[0]}\``)
        .setColor(0x018e02)
        .setAuthor("Total messages deleted");

    message.channel.send(purged);
};
exports.cfg = {
    command: "purge",
    enabled: true,
    guildOnly: true,
    aliases: ['prune', 'delet']
};
exports.help = {
    description: "Deletes specified amount of messages if you have permissions",
    usage: "purge [amount]",
    name: "purge",
    show: true
};
