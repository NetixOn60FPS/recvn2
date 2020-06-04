const discord = require("discord.js")

module.exports.run = async (client, message, args) => {

    if (message.deletable) {
        message.delete();
    }

    if (!message.member.hasPermission("MANAGE_MESSAGES")) {
        return message.reply("Jij kan geen berichten verwijderen....").then(m => m.delete(5000));
    }

    if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
        return message.reply("Yeah.... Dat is geen nummer? Ik kan ook 0 berichten verwijderen trouwens.").then(m => m.delete(5000));
    }

    if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
        return message.reply("Sorryy... Ik kan geen berichten verwijderen.").then(m => m.delete(5000));
    }

    var deleteAmount;

    if (parseInt(args[0]) > 100) {
        deleteAmount = 100;
    } else {
        deleteAmount = parseInt(args[0]);
    }

    message.channel.bulkDelete(deleteAmount, true)
        .then(deleted => message.channel.send(`Ik heb \`${deleted.size}\` berichten verwijderd.`))
        .catch(err => message.reply(`Er is iets fout gegaan... ${err}`));
}


module.exports.help = {
    name: "delete"
}