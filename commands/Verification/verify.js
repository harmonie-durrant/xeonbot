const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js")

const verify = async (msg, message, client, msgInt, user) => {
    //check if user has the 797637841059446794 role
    if (message.member.roles.cache.some(role => role.id === '797637841059446794')) {
        //delete message
        await message.delete()
        //send message saying they are already verified
        await msg.channel.send('You are already verified!')
            .then(msg => setTimeout(() => msg.delete(), 10000))
            .catch(err => console.log(err))
        let embed = new MessageEmbed()
            .setTitle('Verification Error')
            .setDescription('Already verified!')
            .addField('User:', `${user.username} *(${user.name}#${user.discriminator})*`)
            .setColor('#ff0000')
        await msg.guild.channels.cache.find(c => c.id === '924991704757575720').send({ embeds: [embed] })
        await msg.delete()
        return
    }
    //give role 797637841059446794 to user
    try {
        const role = message.guild.roles.cache.find(r => r.id === '797637841059446794')
        await message.member.roles.add(role)
    } catch (error) {
        await message.delete()
        //send message saying user has not been verified or unable to verify
        await msg.channel.send('Unable to verify!')
            .then(msg => setTimeout(() => msg.delete(), 10000))
            .catch(err => console.log(err))
        let embed = new MessageEmbed()
            .setTitle('Verification Error')
            .setDescription('cannot be verified! (Role not found or cannot add role)')
            .addField('User:', `${user.username} *(${user.name}#${user.discriminator})*`)
            .setColor('#ff0000')
        await msg.guild.channels.cache.find(c => c.id === '924991704757575720').send({ embeds: [embed] })
        await msg.delete()
        return
    }

    //remove old roles [865824666274234398, 925251784837050408] if the have them
    const oldRoles = ['865824666274234398', '925251784837050408']
    for (let i = 0; i < oldRoles.length; i++) {
        if (message.member.roles.cache.some(role => role.id === oldRoles[i])) {
            await message.member.roles.remove(oldRoles[i])
        }
    }
    //delete message
    await message.delete()
    //send message saying user has been verified
    await msg.channel.send('You have been verified!')
        .then(msg => setTimeout(() => msg.delete(), 10000))
        .catch(err => console.log(err))
    let embed = new MessageEmbed()
        .setTitle('New Verification')
        .setColor('#00ff00')
        .addField('User:', `${user.username} *(${user.name}#${user.discriminator})*`)
    await msg.guild.channels.cache.find(c => c.id === '924991704757575720').send({ embeds: [embed] })
    await msg.delete()
}

module.exports = {
    name: "verify",
    description: 'Verify to gain access to the server!',
    category: 'Verification',

    slash: 'both',
    testOnly: true,

    callback: async ({ interaction: msgInt, message, channel, client }) => {

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel("Verify")
                    .setCustomId("verify_verify")
                    .setEmoji("✅")
                    .setStyle("SUCCESS")
            )
            .addComponents(
                new MessageButton()
                    .setLabel("Cancel")
                    .setCustomId("cancel_verify")
                    .setEmoji("❌")
                    .setStyle("DANGER")
            )

        if (message) {
            msgInt = message
            msgInt.user = message.author
            msgInt.editReply = message.edit
            if (message.channel.id != '924990746736623647') {
                message.reply("You can only use this command in the verification channel!")
            }
        }

        await msgInt.reply({
            content: "Click on the verify button to verify and gain access to the server!",
            components: [row],
            ephemeral: true,
        }).then(async msg => {
            const filter = (btnInt) => {
                return msgInt.user.id === btnInt.user.id
            }

            const collector = channel.createMessageComponentCollector({
                filter,
                max: 1,
                time: 1000 * 15,
            })

            collector.on("end", async (collection) => {
                collection.forEach((click) => {
                })

                if (collection.first()?.customId === "verify_verify") {
                    verify(msg, message, client, msgInt, msgInt.user)
                } else if (collection.first()?.customId === "verify_cancel") {
                    if (message) {
                        await msg.edit({
                            content: "Verification cancelled!",
                            components: [],
                            ephemeral: true,
                        })
                    } else {
                        await msgInt.editReply({
                            content: "Verification cancelled!",
                            components: [],
                        })
                    }
                } else {
                    if (message) {
                        await msg.edit({
                            content: 'Verification Ended!',
                            components: [],
                        })
                    } else {
                        await msgInt.editReply({
                            content: 'Verification Ended!',
                            components: [],
                            ephemeral: true,
                        })
                    }
                }
            })
        })
    },
}