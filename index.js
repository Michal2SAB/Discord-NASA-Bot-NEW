// Necessary discord.js classes
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Creating a new client instance
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
    
  ]});

const commands = new Collection();

const commandWhitelist = ['help', 'insight'];

const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => {
    // Validate the file name to prevent directory traversal attacks
    const isValidFileName = /^[a-z0-9_]+\.js$/i.test(file);
  
    // Extract the command name from the file name
    const commandName = file.slice(0, -3);

    // Check if the command is in the whitelist
    const isInWhitelist = commandWhitelist.includes(commandName);
    
    return isValidFileName && isInWhitelist;
});

for (const file of commandFiles) {
    const command = require(path.join(__dirname, 'commands', file));
    commands.set(command.name, command);
}

// Confirm login
client.once(Events.ClientReady, c => {
	console.log(`Logged in as ${c.user.tag}`);
});

// Handle commands
client.on('messageCreate', message => {
  if (!message.content.startsWith('!') || message.author.bot) return;
  
  const args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = commands.get(commandName);

  if (!command) return;

  try {
      command.execute(message, args, commands);
  } catch (error) {
      console.log(error);
      message.reply('There was an error executing that command.');
  }
  
});

// Attempt login with bot token
client.login(process.env.BOT_TOKEN);
