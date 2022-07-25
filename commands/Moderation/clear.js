module.exports = {
    name: 'clear',
    aliases: ['cc', 'clean', 'clearchannel'],
    category: 'Moderation',
    description: 'Clears all messages in current channel',
    permissions: ['MANAGE_MESSAGES'],

    callback: ({ message, args }) => {
        const reply = `Cleared messages`
        // delete all messages in the channel that are less than 14 days old
        message.channel.bulkDelete(100, true).then(() => {
            message.channel.send(reply)
        })
    },
    
    error: ({ error, command, message, info }) => {
      const embed = new MessageEmbed()
        .setTitle('Command Error')
        .setDescription(`Error: ${error}`) 
        .setColor(0xff0000)
  
      message.reply({
        embeds: [embed]
      })
    },
}