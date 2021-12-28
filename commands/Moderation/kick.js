module.exports = {
    name: 'clear',
    aliases: ['cc', 'clean', 'clearchannel'],
    category: 'Moderation',
    description: 'Clears all messages in current channel',

    permissions: ['KICK_MEMBERS'],

    slash: 'both',
    testOnly: true,
    guildOnly: true,

    minArgs: 2,
    expectedArgs: '<user> <reason>',
    expectedArgsTypes: ['USER', 'STRING'],

    callback: ({ message, interaction, args }) => {
        const target = message ? message.mentions.members.first() : interaction.options.getMember('user')
        if (!target) {
            return {
                custom: true,
                content: 'Please mention a user!',
                ephmeral: true
            }
        }
        if (!target.kickable) {
            return {
                custom: true,
                content: 'I cannot kick this user!',
                ephmeral: true
            }
        }

        args.shift()
        const reason = args.join(' ')

        target.kick(reason)
        
        return {
            custom: true,
            content: `Kicked ${target.user.tag} for ${reason}`,
            ephmeral: true
        }

    },
}