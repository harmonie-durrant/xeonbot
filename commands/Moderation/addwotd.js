const fs = require('fs');
const { MessageEmbed } = require('discord.js')


module.exports = {
  name: 'addwotd',
  category: 'Moderation',
  description: 'Adds a new word to the word of the day queue',
  permissions: ['MANAGE_MESSAGES'],
  minArgs: 1,
  maxArgs: 1,
  expectedArgs: '<word>',
  expectedArgsTypes: ['string'],

  callback: ({ message, args }) => {
    // read JSON object from file
    fs.readFile('data.json', 'utf-8', (err, data) => {
      if (err) {
        throw err;
      }

      const wotd_list_json = JSON.parse(data.toString());
      var word = args[0].split(" ")[0]

      wotd_list_json.wotd_list.push()
      const new_data = JSON.stringify(wotd_list_json);
      fs.writeFile('data.json', new_data, (err) => {
        if (err) {
          throw err;
        }
      });
      var embed = new MessageEmbed()
        .setTitle('New WOTD added')
        .setColor('#00ff00')
        .addField('Word:', `${word}`)
      message.guild.channels.cache.find(c => c.id === '865780332984139776').send({ embeds: [embed] })

      embed = new MessageEmbed()
        .setTitle('Word Added!')
        .setColor('#00ff00')
        .addField('Word:', `${word}`)
      message.channel.send({ embeds: [embed] })
    });
  },
}