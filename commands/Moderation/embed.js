const { MessageEmbed } = require("discord.js")

module.exports = {
  name: 'embed',
  aliases: ['e', 'createembed'],
  category: 'Moderation',
  description: 'Creates a stylish embed',

  requiredPermissions: ['ADMINISTRATOR'],
  minArgs: 2,
  expectedArgs: '<Channel mention> <JSON>',
  callback: ({ message, args }) => {
    // get the target channel
    var targetchannel = message.mentions.channels.first()
    if (!targetchannel) {
        message.reply('Please specify a channel to send the embed in')
      return
    }
    // removes the channel mention
    args.shift()
    try {
      // get the JSON data
      const json = JSON.parse(args.join(' '))
      // send the embed
      targetchannel.send({
        embeds: [json],
      })
    } catch(error) {
      message.reply(`Invalid JSON: ${error.message}`)
    }
  }
}