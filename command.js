const { prefix } = require('./config.json')
//
const addReactions = (message, reactions) => {
  console.log(reactions)

  message.react(reactions[0])
  reactions.shift()
  if(reactions.length > 0) {
    setTimeout(() => addReactions(message, reactions), 750)
  }
}
  
module.exports.type1 = (client, aliases, callback) => {
  if(typeof aliases === "string") {
    aliases = [aliases]
  }
  client.on('message', message => {
    if(message.author.id == '782855296858193951');
    else {
      const { content } = message;
      aliases.forEach(alias => {
        const command = `${prefix}${alias}`
        const args = message.content.slice(prefix.length).trim().split(' ');
        const func = message.content.split(' ');

        if(content.startsWith(`$(command}`) || func[0] === command) {
          console.log(`Running the command ${command}`)
          callback({ message, args })
        }
      })
    }
  })
},

  module.exports.type2 = async (client, id, text, reactions = []) => {
    const channel = await client.channels.fetch(id)
    console.log('balls2')
    channel.messages.fetch().then((messages) => {
      if(messages.size === 0) {
        // send hew mesasage
        channel.send(text).then((message) => {
          addReactions(message, reactions)
        })
      }
      else {
        // edit existing message
        for(const message of messages) {
          message[1].edit(text)
          addReactions(message[1], reactions)
        }
      }
    })
  }

module.exports.type3 = async (client, triggerText, replytext) => {
  client.on('message', message => {
    console.log(message.channel.type)
    if(message.channel.type == 'DM' && message.content.toLowerCase() === triggerText) {
      message.author.send("Ok this is DM")
    }
    else if(message.content.toLowerCase() === triggerText) {
      message.author.send(replytext)
    }
  })
}

module.exports.type4 = async (client, id) => {

  client.users.fetch(id).then((user) => {
    user.send("Deez Nuts !! wanna talk")
  }).catch(console.error);


}
