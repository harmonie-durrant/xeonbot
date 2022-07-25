const fs = require('fs');
const { MessageEmbed, MessageAttachment } = require('discord.js')
const Canvas = require('canvas')
const { registerFont } = require('canvas')
const path = require('path')

module.exports = {
    event: "guildMemberAdd",
    once: false,
  
    run(member) {
      fs.readFile('data.json', 'utf-8', async (err, data) => {
        if (err) {
          throw err
        }
        var data = JSON.parse(data.toString());
        const welcomeString = `${member} has joined the server!`
        const welcomeStringImg = `${member.user.username} has joined the server!`
        const { guild } = member
        const channel = guild.channels.cache.get(data.welcome_channel)
        // Create a canvas and access the 2d context
        const canvas = Canvas.createCanvas(700, 250)
        const ctx = canvas.getContext('2d')
        // Load the background image and draw it to the canvas
        const background = await Canvas.loadImage('background.png')
        ctx.drawImage(background, 0, 0)
        // Load the user's profile picture and draw it
        const pfp = await Canvas.loadImage(
          member.displayAvatarURL({
            format: 'png',
          })
        )
        x = canvas.width / 2 - pfp.width / 2
        y = 25
        ctx.drawImage(pfp, x, y)
        
        // Display welcome text
        ctx.fillStyle = '#ffffff'
        registerFont('./fonts/OpenSans-Regular.ttf', { family: 'sans-serif' })
        ctx.font = '35px sans-serif'
        let text = welcomeStringImg
        x = canvas.width / 2 - ctx.measureText(text).width / 2
        ctx.fillText(text, x, 60 + pfp.height)
        // Display member count
        ctx.font = '30px sans-serif'
        text = `Member #${guild.memberCount}`
        x = canvas.width / 2 - ctx.measureText(text).width / 2
        ctx.fillText(text, x, 100 + pfp.height)
        // Attach the image to a message and send it
        const attachment = new MessageAttachment(canvas.toBuffer())
        channel.send({
          content: welcomeString,
          files: [attachment]
        })
      })
        
    }
};