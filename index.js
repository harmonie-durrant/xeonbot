//require discord js, dotenv
const DiscordJS = require('discord.js')
const { Client, Collection } = require("discord.js");
const WOKCommands = require('wokcommands')
const path = require('path')
const mongoose = require('mongoose')
var cron = require("cron");
var wd = require("word-definition");
var randomWords = require('random-words');

//keep online
var http = require('http'); http.createServer(function(req, res) { res.write("I'm alive"); res.end(); }).listen(8080);

require('dotenv').config();

const client = new DiscordJS.Client({
  intents: [
    DiscordJS.Intents.FLAGS.GUILDS,
    DiscordJS.Intents.FLAGS.GUILD_MESSAGES,
    DiscordJS.Intents.FLAGS.GUILD_MEMBERS,
    DiscordJS.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
})

const fs = require('fs');
var conf = JSON.parse(fs.readFileSync('conf.json'))
let latestActivityID = fs.existsSync('.latestActivityID') ? fs.readFileSync('.latestActivityID') : 0


client.on('ready', async () => {
  const dbOptions = {
    keepAlive: true,
  }

  // COMMAND HANDLER //

  const wok = new WOKCommands(client, {
    commandsDir: path.join(__dirname, 'commands'),
    ignoreBots: true,
    testServers: ['797631789682262038'],
    botOwners: ['554747424757907483'],
    dbOptions,
    mongoUri: process.env['MONGO_URI'],
  })
    .setDefaultPrefix(';')
    .setColor(0xE9497D)
    .setDisplayName('Chronet Bot')
    .setCategorySettings([
      {
        name: 'Utility',
        emoji: '📋',
        hidden: false
      },
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

  client.user.setPresence({
    activity: { name: ";help", type: "WATCHING" },
    status: "dnd",
  })

})

fs.readdir('./events/', (err, files) => { 
    if (err) return console.error(err); 
    files.forEach(file => {
        const eventFunction = require(`./events/${file}`); 
        if (eventFunction.disabled) return; 
        const event = eventFunction.event || file.split('.')[0]; 
        const emitter = (typeof eventFunction.emitter === 'string' ? client[eventFunction.emitter] : eventFunction.emitter) || client; 
        const once = eventFunction.once; 

        try {
            emitter[once ? 'once' : 'on'](event, (...args) => eventFunction.run(...args)); 
        } catch (error) {
            console.error(error.stack); 
        }
    });
});

client.login(process.env['TOKEN']);