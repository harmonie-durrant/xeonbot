module.exports = async (message) => {
  message.channel.send("Test")
  if (message.channel.id == "933925036543316048"){
    message.channel.send("Success")
  }
};