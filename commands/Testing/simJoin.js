module.exports = {
  name: "simJoin",
  category: 'Testing',
  description: 'Simulates you joining the server',
  requiredPermissions: ['ADMINISTRATOR'],
  
  callback: ({ message, args, text, client }) => {
    client.emit('guildMemberAdd', message.member)
  },
}