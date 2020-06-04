const discord = require("discord.js")

module.exports.run = async (client, message, args) => {

    var target = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    var reason = args.slice(1).join(' ');
    var reports = message.guild.channels.find('name', "reports");

    if (!target) return message.reply('Wie wil je reporten?');
    if (!reason) return message.reply('Voor welke reden?');
    if (!reports) return message.reply(`Maak aan kanaal aan genaamd: #reports!`);

    var embed = new discord.RichEmbed()
        .setColor('RANDOM')
        .setThumbnail(target.user.avatarURL)
        .addField('Reported Member', `${target.user.username} with an ID: ${target.user.id}`)
        .addField('Reported By', `${message.author.username} with an ID: ${message.author.id}`)
        .addField('Reported Time', message.createdAt)
        .addField('Reported In', message.channel)
        .addField('Reported Reason', reason)
        .setFooter(message.member.displayName, message.author.displayAvatarURL)
        .setTimestamp()
        .setFooter("Made By vNetix#4581");

    message.channel.send(`${target} is gereport door ${message.author} voor ${reason}`).then(msg => msg.delete(2000));
    reports.send(embed);

};


module.exports.help = {
    name: 'report'
};