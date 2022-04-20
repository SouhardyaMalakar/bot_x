const command = require('./command');
const server = require('json-server');
const { handle } = require('express/lib/application');
const command2 = command.type2
const addReactions = (message, reactions) => {
  message.react(reactions[0])
  reactions.shift()
  if(reactions.length > 0) {
    setTimeout(() => addReactions(message, reactions), 750)
  }
}
module.exports = (client) => {
  const channelId = '955449198722031696'

  const getEmoji = (emojiName) =>
    client.emojis.cache.find((emoji) => emoji.name === emojiName)

  let emojis = {
    '🔴': 'CrackShot / Sniper',
    '🟠': 'Scrambler / Shotgun',
    '🟡': 'Whipper / P90',
  };
  let emojiText = "**GUN ROLES**\n\n";
  let reactions = [];
  Object.entries(emojis).forEach(([emoji, role]) => {
    reactions.push(emoji);
    emojiText += `${emoji} = ${role}\n`;
  });
  console.log(emojiText)
  console.log(reactions)
  command2(client, channelId, emojiText, reactions)

  const handleReaction =(reaction, user, add) =>{
    if(user.id==='782855296858193951'){
      return
    }
    // wtf is that shit
    const emoji = reaction._emoji.name

    const { guild } = reaction.message

    const roleName = emojis[emoji]
    if(!roleName) {
      return
    }

    const role = guild.role.cache.find(role => role.name === roleName)
    // seeing use as member of a guild cause role cant be given direvtly to an user
    const member = guild.members.cache.find(member => member.id === user.id)

    if(add) {
      member.roles.add(role)
    } else {
      member.roles.remove(role)
    }
  }

  client.on('messageReactionAdd', (reaction, user) => {
    if(reaction.message.channel.id === channelId){
      handleReaction(reaction.user,true)
    }
  })
  client.on('messageReactionRemove', (reaction, user) => {
    if(reaction.message.channel.id === channelId){
      handleReaction(reaction.user,false)
    }
  })

}