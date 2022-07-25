module.exports = {
    name: 'clear',
    aliases: ['cc', 'clean', 'clearchannel'],
    category: 'Moderation',
    description: 'Clears x amount of messages in the current channel. (Defaults to 100)',
    permissions: ['MANAGE_MESSAGES'],
    maxArgs: 1,
    expectedArgs: '<amount>',

    callback: ({ message, args }) => {
        const reply = `Cleared messages! ✅`
        var amount = 100
        if(args.length > 0) {
          amount = parseInt(args[0])
        }
        
        
        // delete all messages in the channel that are less than 14 days old
        message.channel.bulkDelete(amount, true).then(() => {
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