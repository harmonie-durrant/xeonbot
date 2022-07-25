module.exports = {
  name: 'roadmap',
    aliases: ['rm', 'rmap', 'newfeatures', 'nf', '#soon'],
  category: 'Moderation',
  description: 'Shows the future of the bot.',
  permissions: ['MANAGE_MESSAGES'],

  callback: ({ message, args }) => {
    const reply = `**Features in the works:** \`\`\` ✅ A number argument to ;clearchat command \n ✅ ;serverinfo command \n 📋 Some minigames commands \n ✅ ;pfp \n 📋 ;whois \n 📋 ;bal and other economy commands \n 📋 More aliases (see ;help for current aliases)\`\`\``
    // ✅📋
    message.channel.send(reply)
  },

  error: ({ error, command, message, info }) => {
    // "error" holds one of the strings mentioned in the above list
    if (error === 'COMMAND DISABLED') {
      // For example we can now create and send a custom embed
      const embed = new MessageEmbed()
        .setTitle('Command disabled')
        .setColor(0xff0000)

      message.reply({
        embeds: [embed]
      })
    } else {
      const embed = new MessageEmbed()
        .setTitle('Command Error')
        .setDescription(`Error: ${error}`)
        .setColor(0xff0000)

      message.reply({
        embeds: [embed]
      })
    }
  },
}