const { MessageEmbed } = require('discord.js');

module.exports = {
  
    event: "messageCreate",
    once: false,
  
    run(message, client) {
      if(message.author.bot) return;
      if (message.channel.id == "933925036543316048"){ // suggestions
        const firstWord = message.content.split(' ')[0].toLowerCase()
        if(firstWord == "suggestion:") {
          message.react('👍')
          message.react('👎')
          message.react('❓')
        }
      } else if (message.channel.id == "934321460875517972"){ // bug reports
        const firstWord = message.content.split(' ')[0].toLowerCase()
        if(firstWord == "bug:") {
          message.react('🐞')
          let embed = new MessageEmbed()
            .setTitle(`New BugReport from: ${message.author.username}`)
            .setDescription(message.content)
          message.channel.send("Your Message has been sent to the devs! ✅")
          message.guild.channels.cache.get(`865780511786926093`).send({
            embeds: [embed]
          })
        }
      } else {
        console.log("none")
      }
    }
};