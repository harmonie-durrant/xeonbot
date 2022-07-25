module.exports = {
  name: 'roadmap',
  category: 'Moderation',
  description: 'Shows the future of the bot.',
  permissions: ['MANAGE_MESSAGES'],

  callback: ({ message, args }) => {
    const reply = `The roadmap is still being worked on.`
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