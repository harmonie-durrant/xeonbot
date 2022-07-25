const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "serverinfo",
  category: 'Utility',
  aliases: ['sinfo', 'si', 'info'],
  description: 'Fetch servers information', // Required for slash commands

  slash: 'both', // Create both a slash and legacy command
  testOnly: true, // Only register a slash command for the testing guilds

  callback: ({ message, interaction, client }) => {
    var guild;
    if(message) {
      guild = message.guild;
    } else {
      guild = interaction.guild
    }
    
    const User = guild.members.cache.filter(member => !member.user.bot).size;
    const Bots = guild.members.cache.filter(member => member.user.bot).size;
    const Text = guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT').size;
    const Voice = guild.channels.cache.filter(channel => channel.type === 'GUILD_VOICE').size;
    const Category = guild.channels.cache.filter(channel => channel.type === 'GUILD_CATEGORY').size;
    const Stage = guild.channels.cache.filter(channel => channel.type === 'GUILD_STAGE_VOICE').size;
    const Channel = Text + Voice + Category + Stage
    const Emoji = guild.emojis.cache.size;
    const Roles = guild.roles.cache.size;

    let embed = new MessageEmbed()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
      .setDescription(`
      **Name** : ${guild.name}
      **Server ID** : ${guild.id}
      **Owner** : "myxrne#1919"
      **Total Members** : ${guild.memberCount} [${User} Users | ${Bots} Bots]
      **Total Emojis** : ${Emoji}
      **Total Roles** : ${Roles}
      **Total Channels** : ${Channel} [${Text} Text | ${Voice} Voice | ${Category} Category | ${Stage} Stage]
      `)
      .setThumbnail(guild.iconURL())

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