const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "pfp",
  category: 'Utility',
  aliases: ['profilepic', 'ppic'],
  description: 'Fetch a user\'s profile picture', // Required for slash commands

  slash: 'both', // Create both a slash and legacy command
  testOnly: true, // Only register a slash command for the testing guilds

  callback: ({ message, interaction, client }) => {
    var mentioned;
    var guild;
    if(message) {
      mentioned = message.mentions.members.first();
      guild = message.guild;
    } else {
      mentioned = interaction.mentions.members.first();
      guild = interaction.guild;
    }
    
    let embed = new MessageEmbed()
      .setAuthor({ name: message.author.tag, iconURL: guild.iconURL() })
      .setDescription(``)
      .setImage(mentioned.displayAvatarURL())

    if (message) {
      message.reply({
      embeds: [embed]
    })
    } else {
      interaction.reply({
        embeds: [embed]
      })
    }
  }
}