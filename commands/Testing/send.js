module.exports = {
    name: "send",
    description: 'sends a message',
    category: 'Testing',

    permissions: ['ADMINISTRATOR'],

    minArgs: 2,
    expectedArgs: '<channel> <text>',
    expectedArgTypes: ['CHANNEL', 'STRING'],

    slash: 'both',
    testOnly: true,

    callback: ({ message, interaction, args }) => {
        const channel = message 
            ? message.mentions.channels.first() 
            : interaction.options.getChallen('channel')
        if (!channel || channel.type !== 'GUILD_TEXT') {
            return 'Please tag a text channel.'
        }
        args.shift()
        const text = args.join(' ')

        channel.send(text)

        if (interaction) {
            interaction.reply({
                content: 'Send Message!',
                ephemeral: true,
            })
        }
    }
}