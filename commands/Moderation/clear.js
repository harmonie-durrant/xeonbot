module.exports = {
    name: 'clear',
    aliases: ['cc', 'clean', 'clearchannel'],
    category: 'Moderation',
    description: 'Clears all messages in current channel',

    callback: ({ message, args }) => {
        //does user have permission to delete messages
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.channel.send('You do not have permission to use this command!')
        }
        //delete all messages in current channel
        message.channel.bulkDelete(100)
    },
}