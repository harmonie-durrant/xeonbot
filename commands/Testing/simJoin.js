module.exports = {
  name: "simJoin",
  aliases: ['sj', 'sjoin', 'testjoin'],
  category: 'Testing',
  description: 'Simulates you joining the server',
  requiredPermissions: ['ADMINISTRATOR'],
  
  callback: ({ message, client }) => {
    client.emit('guildMemberAdd', message.member)
    // message.channel.send("Success: Simulated Join")
  },
}