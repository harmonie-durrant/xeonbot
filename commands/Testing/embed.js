const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'embed',
    aliases: ['e', 'createembed'],
    category: 'Testing',
    description: 'Creates a stylish embed',

    Permissions: ['ADMINISTRATOR'],

    minArgs: 2,
    expectedArgs: '<Channel mention> <JSON>',
    callback: ({ message, text }) => {
        const json = JSON.parse(text)
        const embed = new MessageEmbed(json)

        return embed
    },
}