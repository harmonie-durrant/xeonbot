module.exports = {
  name: "simJoin",
  category: 'Testing',
  description: 'Simulates you joining the server',
  requiredPermissions: ['ADMINISTRATOR'],
  
  callback: ({ message, client }) => {
    client.emit('guildMemberAdd', message.member)
  },
}