const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'say',
    category: 'Testing',
    description: 'Send a message annonymously using the bot',

    Permissions: ['MANAGE_MESSAGES'],
    minArgs: 2,
    expectedArgs: '<Channel mention> <Text>',
    callback: ({ message, args }) => {
        // get the target channel
        var targetchannel = message.mentions.channels.first()
        if (!targetchannel) {
            message.reply('Please specify a channel to send the embed in')
        return
        }
        
        try {
            // removes the channel mention
            args.shift()
            // send the embed
            targetchannel.send(args.join(' '))
        } catch(error) {
            message.reply(`Invalid JSON: ${error.message}`)
        }
    }
}