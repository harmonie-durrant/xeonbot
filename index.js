//require discord js, dotenv
const DiscordJS = require('discord.js')
const WOKCommands = require('wokcommands')
const path = require('path')
const mongoose = require('mongoose')
const fs = require('fs')

require('dotenv').config();

const { Intents } = DiscordJS

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
})

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.on('ready', async () => {

    const dbOptions = {
        keepAlive: true,
    }

    client.user.setPresence({
        status: 'online',
        game: {
            name: ';help',
            type: "STREAMING"
        }
    })

    const wok = new WOKCommands(client, {
        commandsDir: path.join(__dirname, 'commands'),
        ignoreBots: true,
        testServers: ['797631789682262038'],
        botOwners: ['554747424757907483'],
        dbOptions,
        mongoUri: process.env.MONGO_URI,
    })
        .setDefaultPrefix(';')
        .setColor(0xE9497D)
        .setDisplayName('Mysti')
        .setCategorySettings([
            {
                name: 'Configuration',
                emoji: '⚙️',
                hidden: true
            },
            {
                name: 'Moderation',
                emoji: '🔨'
            },
            {
                name: 'Testing',
                emoji: '🚧',
                hidden: true
            },
            {
                name: 'Verification',
                emoji: '✅',
            },
        ])

    wok.on('databaseConnected', (connection, state) => {
        console.log(`The connection state is "${state}"`)
    })

})

client.login(process.env.TOKEN);