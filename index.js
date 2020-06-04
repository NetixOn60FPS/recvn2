const discord = require ("discord.js");
const botConfig = require ("./botconfig.json");

const fs = require("fs")
const api = require("imageapi.js")

const client = new discord.Client();

client.login(process.env.token);
client.commands = new discord.Collection();

fs.readdir("./commands/", (err, files) => {

    if (err) console.log(err);

    var jsFiles = files.filter(f => f.split(".").pop() == "js");

    if (jsFiles.lenght <= 0) {
        console.log("Can't find any files");
        return;
    }

    jsFiles.forEach((f, i) => {
        
        var fileGet = require(`./commands/${f}`);
        console.log(`${f} is loaded`)

        client.commands.set(fileGet.help.name, fileGet);
    })
});

client.on("ready", async() => {

    console.log(`${client.user.username} is ready post video's.`);
    client.user.setActivity("Recvn", {type: "WATCHING"});
    
    });

    client.on("guildMemberAdd", member => {

        var role = member.guild.roles.find("name", "Community");
    
        if (!role) return;
    
        member.addRole(role);
    
        const channel = member.guild.channels.find("name", "welkom");
    
        if (!channel) return;
    
        channel.send(`Welkom in de server ${member}`);
    
    });

    var swearWords = ["kanker", "kkr" , "kk", "pussy", "psy", "pssy", "homo", "gay", "piemel", "kutje", "sperma", "🤡"];

    client.on("message", async message => {
    
        if (message.author.bot) return;
    
        if (message.channel.type === "dm") return;
    
        var msg = message.content.toLowerCase();
    
        for (var i = 0; i < swearWords.length; i++) {
    
            if (msg.includes(swearWords[i])) {
    
                message.delete();
            }
        }
        var prefix = botConfig.prefix;
    
        var messageArray = message.content.split(" ");

        var command = messageArray[0];
    
        if(!message.content.startsWith(prefix)) return;
    
        var arguments = messageArray.slice(1);
    
        var commands = client.commands.get(command.slice(prefix.length));
    
        if(commands) commands.run(client, message, arguments);

        if(command === `${prefix}`) {
            message.channel.send("Hulp nodig? Gebruik $help")
        }

        if (command === `${prefix}youtube`) {

        var embed = new discord.RichEmbed()
        .setTitle("__**YouTube**__")
        .addField("YouTube Channel", "https://www.youtube.com/channel/UCsPBJFB_rahWtXvn1Q2DFZA")
        .setTimestamp()
        .setFooter("Made By vNetix#4581")
        .setColor("RANDOM")

        return message.channel.send(embed)

    }


        if (command === `${prefix}help`) {

        var embed = new discord.RichEmbed()
        .setTitle("__**Help**__")
        .addField("$meme", "Laat een meme zien")
        .addField("$youtube", "Laat het kanaal van recvn zien")
        .addField("Meer", "Komt binnekort....")
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter("Made By vNetix#4581")

        return message.channel.send(embed)
        }

        if (command === `${prefix}meme`) {
    
            var subreddits = [
                "meme",
                "memes"
            ]
            var subreddit = subreddits[Math.floor(Math.random()*(subreddits.length)-1)]
            var img = await api(subreddit)
            var Embed = new discord.RichEmbed()
            .setTitle(`A meme from ${subreddit}`)
            .setURL(`https://reddit.com/r/${subreddit}`)
            .setColor('RANDOM')
            .setImage(img)
            .setFooter("Made By vNetix#4581")
            .setTimestamp();
            message.channel.send(Embed)
        }
        if (command === `${prefix}kick`) {
 
            const args = message.content.slice(prefix.length).split(/ +/);
    
            var kickChannel = message.guild.channels.find('name', "modlogs");
    
            if(!kickChannel) return message.reply("Maak een kanaal genaamd: modlogs.")
     
            if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("Jij kan dit niet.");
     
            if (!message.guild.me.hasPermission("KICK_MEMBERS")) return message.reply("Ik kan hem niet kicken");
     
            if (!args[1]) return message.reply("geef een user");
     
            if (!args[2]) return message.reply("geef een reden");
     
            var kickUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1]));
            
            if(kickUser.hasPermission("KICK_MEMBERS")) return message.reply("I kan hem niet kicken")
     
            var reason = args.slice(2).join(" ");
     
            if (!kickUser) return message.reply("Ik kan hem niet vinden");
     
            var embed = new discord.RichEmbed()
                .setColor("#f5e642")
                .setThumbnail(kickUser.user.displayAvatarURL)
                .setFooter(message.member.displayName, message.author.displayAvatarURL)
                .setTimestamp()
                .setTitle("__**Kicked Member**__")
                .setDescription(`** Kicked member:** ${kickUser} with the ID: ${kickUser.id}
                
                ** Kicked by:** ${message.member} with the ID: ${message.member.id}
                
                ** Reason:** ${reason}`)
                .setTimestamp()
                .setFooter("Made By vNetix#4581");
     
            var embedPrompt = new discord.RichEmbed()
                .setColor("#f5e642")
                .setAuthor("React in 30 seconds.")
                .setDescription(`Kick ${kickUser}?`);
     
     
            message.channel.send(embedPrompt).then(async msg => {
     
                var emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);
     
     
                if (emoji === "✅") {
     
                    msg.delete();
     
                    kickUser.kick(reason).catch(err => {
                        if (err) return console.log(err)
                    });
     
                    kickChannel.send(embed);
     
                } else if (emoji === "❌") {
     
                    msg.delete();
     
                }
     
            });
        }
     
     
        if (command === `${prefix}ban`) {
     
            const args = message.content.slice(prefix.length).split(/ +/);
    
            var banChannel = message.guild.channels.find('name', "modlogs");
    
            if(!banChannel) return message.reply("Maak een kanaal genaamd modlogs.")
    
            if(!message.member.hasPermission("BAN_MEMBERS")) return message.reply("you don't have perms to use this command")
     
            if (!args[1]) return message.reply("geef een user");
     
            if (!args[2]) return message.reply("geef een reden");
     
            if (!message.guild.me.hasPermission("ADMINISTRATOR")) return message.reply("Ik kan hem niet bannen");
     
            var banUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1]));
    
            if(banUser.hasPermission("KICK_MEMBERS")) return message.reply("Ik kan hem niet bannen")
     
            var reason = args.slice(2).join(" ");
     
            if (!banUser) return message.reply("Ik kan hem niet vinden");
     
            var embed = new discord.RichEmbed()
                .setThumbnail(banUser.user.displayAvatarURL)
                .setColor("RED")
                .setFooter(message.member.displayName, message.author.displayAvatarURL)
                .setTimestamp()
                .setTitle("__**Banned Member**__")
                .setDescription
            (`** Banned member:** ${banUser} with the ID: ${banUser.id}
            
            ** Banned by:** ${message.member} with the ID: ${message.member.id}
            
            ** Reason:** ${reason}`)
                .setTimestamp()
                .setFooter("Made By vNetix#4581");
     
            var embedPrompt = new discord.RichEmbed()
                .setColor("RED")
                .setAuthor("Please react in 30 seconds.")
                .setDescription(`Ban ${banUser}?`);
     
     
            message.channel.send(embedPrompt).then(async msg => {
     
                var emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);
     
     
    
                 message.channel.awaitMessages(m => m.author.id == message.author.id,
                     { max: 1, time: 30000 }).then(collected => {
     
                        if (collected.first().content.toLowerCase() == 'yes') {
                
                             message.reply('Ban player.');
                         }
                         else
                             message.reply('Canceled');
                     });
     
     
                if (emoji === "✅") {
     
                    msg.delete();
     
                   
                    banUser.ban(reason).catch(err => {
                        if (err) return message.channel.send(`❌ Something went wrong. ❌`);
                    });
     
                    banChannel.send(embed);
     
                } else if (emoji === "❌") {
     
                    msg.delete();
     
                    message.reply("Ban canceled").then(m => m.delete(5000));
     
                }
     
            });
        }
     
    
    async function promptMessage(message, author, time, reactions) {
        time *= 1000;
     
        for (const reaction of reactions) {
            await message.react(reaction);
        }
     
        const filter = (reaction, user) => reactions.includes(reaction.emoji.name) && user.id === author.id;
    
        return message.awaitReactions(filter, { max: 1, time: time }).then(collected => collected.first() && collected.first().emoji.name)
    
    }
        
    
    });