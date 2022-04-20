const Discord = require('discord.js')
const { Client, MessageEmbed } = require('discord.js');
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"] });
const config = require('./config.json')
const command = require('./command');
const role_claim = require('./Role_reaction')
const server = require('json-server');
const command1 = command.type1
const command2 = command.type2
const command3 = command.type3
const command4 = command.type4
const puppeteer = require('puppeteer');

global.talkRoom = []
global.talkIndex = new Map()
global.talkRoomFlag = 0

client.on('ready', () => {
  console.log('The client is online!')

  //role_claim
  role_claim(client); 
  //Does not have a callback
  // command2(client, '955449198722031696', 'hello world', ['😀'])
  //basic stuff
  command1(client, 'ping', ({ message, args }) => {
    message.channel.send(`Hey ${message.author} hows it going?`);
  })
  command1(client, 'servers', ({ message, args }) => {
    const exampleEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Servers :')

    client.guilds.cache.forEach((guild) => {
      exampleEmbed.addFields(
        { name: `${guild.name} (${guild.id})`, value: `${guild.memberCount}` }
      )
    })
    message.channel.send({ embeds: [exampleEmbed] });
  })

  command1(client, 'serverinfo', ({ message, args }) => {
    const  guild = message.guild
    const{name,memberCount,afkTimeout} = guild
    const icon = guild.iconURL()
    console.log(icon)
    const exampleEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle(`Server : ${name}`)
      .setThumbnail(icon)
      .addFields(
        {
          name: 'Members',
          value: memberCount.toString(),
        },
        {
          name: 'TimeOut',
          value: (afkTimeout/60).toString(),
        }
      )
    message.channel.send({ embeds: [exampleEmbed] });
  })

  //CLear
  command1(client, ['cc', 'clear'], ({ message, args }) => {
    if(message.member.permissions.has('ADMINISTRATOR')) {
      message.channel.messages.fetch({ limit: 100 }).then((results) => {
        results.forEach((msg) => {
          var gap = (Date.now() - msg.createdTimestamp) / 1000;
          if(gap < args[1] * 24 * 3600) {
            msg.delete()
              .then(msg => console.log(`Deleted message from ${msg.author.username}`))
              .catch(console.error);
            console.log(msg.content)
          }
        })
      })
    }
    else {
      message.reply("You do not have the required permissions !!")
    }
  })
  //talk in room
  //{
  command1(client, 'createRoom', ({ message, args }) => {
    message.channel.send("Room Created use addTalk to add people to room")
    talkRoomFlag = 1;
  })
  command1(client, 'addtalk', ({ message, args }) => {
    if(talkRoomFlag == 0) {
      message.channel.send("To talk Create a room")
      return;
    }
    client.users.fetch(args[1]).then((user) => {
      const name = user.username.toLowerCase()
      user.send("Deez Nuts !! wanna talk bitch")
      talkIndex.set(user.username.toLowerCase(), user.id);
      talkRoom.push(user.id)
      console.log('The talk room is :')
      console.log(talkRoom);
      console.log(talkIndex);
    })
    message.channel.send("Added")
  })

  command1(client, 'reply', ({ message, args }) => {
    if(talkRoomFlag == 0) {
      message.channel.send("To talk Create a room")
      return;
    }
    var user = talkIndex.get(args[1]);
    console.log(user);
    var msg = ''
    for(let i = 2; i < args.length; i++)  msg += args[i] + ' ';
    client.users.fetch(user).then((user) => {
      user.send(msg)
    })
  })

  command1(client, 'deleteRoom', ({ message, args }) => {
    talkRoom = []
    talkIndex = new Map()

    message.channel.send("room has been deleted")
    talkRoomFlag = 0;
  })
  //}

  //Create channel
  //{
  command1(client, 'createtextchannel', ({ message, args }) => {
    // lol now thats an way to do it kek
    const name = message.content.replace('!createtextchannel', '')
    message.guild.channels
      .create(name, {
        type: 'text',
      })
      .then((channel) => {
        console.log(channel)
        // const categoryId ='<categoryID>'
        // channel.setParent(categoryId)
      })
  })

  command1(client, 'createvoicechannel', ({ message, args }) => {
    // lol now thats an way to do it kek
    const name = message.content.replace('!createvoicechannel', '')
    message.guild.channels
      .create(name, {
        type: 'voice',
      })
      .then((channel) => {
        console.log(channel)
        // const categoryId ='<categoryID>'
        // channel.setParent(categoryId)
      })
  })

  command1(client, 'search', ({ message, args }) => {
    // lol now thats an way to do it kek
    const text = message.content.replace('!search', '');
    (async() =>{
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto("https://www.google.com/", {waitUntil: "domcontentloaded"});
      await page.waitForSelector('input[aria-label="Search"]', {visible: true});
      await page.type('input[aria-label="Search"]', searchQuery);

    })
  })
})

client.on('message', message => {
  // console.log(message.content)
  let arr =["uronto", "boka","boko","lodu", "jesus"]
  if(message.author.id=="775952191742672928"){
    console.log(message.content);
    for( i in arr){
      if(message.content.includes(arr[i])){
        message.author.send("Gand Mara");
        message.delete();
        message.channel.send("hehe ...")
      }
    }
  }
  if(message.author.id == '782855296858193951');
  else if(message.channel.type == 'DM') {
    if(talkRoom.includes(message.author.id)) {
      // console.log(message.author)
      const chanel = client.channels.cache.get('955050565342208031')
      const exampleEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`${message.author.username} :`)
        .setDescription(`${message.content}`)
      chanel.send({ embeds: [exampleEmbed] });
    }
  }
  // ok thts is fine
  else if(talkRoomFlag == 1) {
    const args = message.content.split(' ')
    if(args[0] != "!reply") {
      // default lets keep it many-1
      if(message.author.id != '782855296858193951') {
        for(const id of talkRoom) {
          console.log(id)
          console.log(message.author)
          client.users.fetch(id).then((user) => {
            user.send(message.content)
          }).catch(console.error);
        }
      }
      // allow others to see boths messages in others dm
    }
  }
})
client.login(config.token)


//embed
// const exampleEmbed = new MessageEmbed()
// 	.setColor('#0099ff')
// 	.setTitle('Some title')
// 	.setURL('https://discord.js.org/')
// 	.setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
// 	.setDescription('Some description here')
// 	.setThumbnail('https://i.imgur.com/AfFp7pu.png')
// 	.addFields(
// 		{ name: 'Regular field title', value: 'Some value here' },
// 		{ name: '\u200B', value: '\u200B' },
// 		{ name: 'Inline field title', value: 'Some value here', inline: true },
// 		{ name: 'Inline field title', value: 'Some value here', inline: true },
// 	)
// 	.addField('Inline field title', 'Some value here', true)
// 	.setImage('https://i.imgur.com/AfFp7pu.png')
// 	.setTimestamp()
// 	.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

// channel.send({ embeds: [exampleEmbed] });
