const { MessageEmbed } = require('discord.js')
module.exports = {
    name: 'clear',
    aliases: ['cc', 'clean', 'clearchannel'],
    category: 'Moderation',
    description: 'Clears all messages in current channel',
    permissions: ['MANAGE_MESSAGES'],

    callback: ({ message, args }) => {
        message.channel.bulkDelete(100)
    },
}