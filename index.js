//require discord js, dotenv
const DiscordJS = require('discord.js')
const { Client, Collection } = require("discord.js");
const WOKCommands = require('wokcommands')
const path = require('path')
const mongoose = require('mongoose')
var cron = require("cron");
var wd = require("word-definition");
var randomWords = require('random-words');
const Canvas = require('canvas')

//keep online
var http = require('http'); http.createServer(function(req, res) { res.write("I'm alive"); res.end(); }).listen(8080);

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

// EVENT HANDLER //

const fs = require('fs');
const { readdirSync } = require("fs")
for (const file of readdirSync("./events")) {
  if (file.endsWith(".js")) {
    const content = require(`./events/${file}`)
    const key = file.substring(0, file.length - 3);
    client.on(key, content.bind(null, client));
  }
}

// - \\

const conf = JSON.parse(fs.readFileSync('conf.json'))
let latestActivityID = fs.existsSync('.latestActivityID') ? fs.readFileSync('.latestActivityID') : 0

const Trello = require('trello-events')
const events = new Trello({
  pollFrequency: conf.pollInterval, // milliseconds
  minId: latestActivityID, // auto-created and auto-updated
  start: true,
  trello: {
    boards: conf.boardIDs, // array of Trello board IDs 
    key: process.env['trelloAPIkey'], // your public Trello API key
    token: process.env['trelloToken'] // your private Trello token for Trellobot
  }
})

function getdef() {
  wd.getDef(randomWords(), "en", null, function(definition) {
    return definition
  })
}

client.on('ready', async () => {
  let guild = client.guilds.cache.get(conf.serverID)
  let channel = client.channels.cache.get(conf.channelID)
  if (!guild) {
    process.exit()
  } else if (!channel) {
    process.exit()
  } else if (!conf.boardIDs || conf.boardIDs.length < 1) {
    console.log(`No board IDs provided! Please add at least one to your conf file. Check the readme if you need help finding a board ID.`)
  }
  conf.guild = guild
  conf.channel = channel

  if (!conf.contentString) conf.contentString = ""
  if (!conf.enabledEvents) conf.enabledEvents = []
  if (!conf.userIDs) conf.userIDs = {}
  if (!conf.realNames) conf.realNames = true

  events.start()
  let wotdSchedule = new cron.CronJob('0 12 * * *', () => {
    fs.readFile('data.json', 'utf-8', (err, data) => {
      if (err) {
        throw err
      }
      var word = JSON.parse(data.toString());
      if (word.wotd_list.length <= 0) {
        word = randomWords()
      } else {
        var new_data = word
        word = word.wotd_list[0]
        new_data.wotd_list.shift()
      }
      wd.getDef(word, "en", null, function(definition) {
        let channel = client.guilds.cache.get('797631789682262038').channels.cache.get("865816936386527252");
        let embed = new DiscordJS.MessageEmbed()
          .setTitle(`Word Of The Day: ${String(definition.word)}`)
          .setColor('#0000ff')
          .addField('Definition:', `${String(definition.definition)}`)
        channel.send({ content: `<@&925406205227175977>`, embeds: [embed] })
      });
      new_data = JSON.stringify(new_data);
      fs.writeFile('data.json', new_data, (err) => {
        if (err) {
          throw err;
        }
      });
    })
  })

  wotdSchedule.start();

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
    .setDisplayName('Xeon Bot')
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

const mySecret = process.env['TOKEN']
client.login(mySecret);

events.on('createCard', (event, board) => {
  //if (!eventEnabled(`cardCreated`)) return
  let embed = getEmbedBase(event)
    .setTitle(`New card created under __${event.data.list.name}__!`)
    .setDescription(`**CARD:** ${event.data.card.name} — **[CARD LINK](https://trello.com/c/${event.data.card.shortLink})**\n\n**EVENT:** Card created under __${event.data.list.name}__ by **[${conf.realNames ? event.memberCreator.fullName : event.memberCreator.username}](https://trello.com/${event.memberCreator.username})**`)
  send(addDiscordUserData(embed, event.memberCreator))
})

events.on('createList', (event, board) => {
  //if (!eventEnabled(`listCreated`)) return
  let embed = getEmbedBase(event)
    .setTitle(`New list created!`)
    .setDescription(`**EVENT:** List __${event.data.list.name}__ created by **[${conf.realNames ? event.memberCreator.fullName : event.memberCreator.username}](https://trello.com/${event.memberCreator.username})**`)
  send(addDiscordUserData(embed, event.memberCreator))
})

const send = (embed, content = ``) => conf.channel.send({ embeds: [embed] }).catch(err => console.error(err))

const eventEnabled = (type) => conf.enabledEvents.length > 0 ? conf.enabledEvents.includes(type) : true

const logEventFire = (event) => console.log(`${new Date(event.date).toUTCString()} - ${event.type} fired`)

const getEmbedBase = (event) => new DiscordJS.MessageEmbed()
  .setFooter(`XeonBot • ${event.data.board.name} `, client.user.displayAvatarURL)
  .setTimestamp(event.hasOwnProperty(`date`) ? event.date : Date.now())
  .setColor("#127ABD")

// adds thumbanil and appends user mention to the end of the description, if possible
const addDiscordUserData = (embed, member) => {
  if (conf.userIDs[member.username]) {
    let discordUser = conf.message.guild.members.cache.get(conf.userIDs[member.username])
    if (discordUser) embed
      .setThumbnail(discordUser.user.displayAvatarURL)
      .setDescription(`${embed.description} / ${discordUser.toString()}`)
  }
  return embed
}

// logs initialization data (stuff loaded from conf.json) - mostly for debugging purposes
const logInitializationData = () => console.log(`== INITIALIZING WITH:
    latestActivityID - ${latestActivityID}
    boardIDs --------- ${conf.boardIDs.length + " [" + conf.boardIDs.join(", ") + "]"}
    serverID --------- ${conf.serverID} (${conf.guild.name})
    channelID -------- ${conf.channelID} (#${conf.channel.name})
    pollInterval ----- ${conf.pollInterval} ms (${conf.pollInterval / 1000} seconds)
    prefix ----------- "${conf.prefix}"${conf.prefix === "." ? " (default)" : ""}
    contentString ---- ${conf.contentString !== "" ? "\"" + conf.contentString + "\"" : "none"}
    enabledEvents ---- ${conf.enabledEvents.length > 0 ? conf.enabledEvents.length + " [" + conf.enabledEvents.join(", ") + "]" : "all"}
    userIDs ---------- ${Object.getOwnPropertyNames(conf.userIDs).length}`)