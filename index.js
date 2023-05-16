// Necessary discord.js classes
const { Client, Collection, Events, GatewayIntentBits, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Load the bot configuration
const config = require('./config.json');

// Creating a new client instance
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
    
  ]});

const commands = new Collection();
const commandPrefix = config.prefix;

const commandWhitelist = ['help', 'insight', 'marsimage', 'jwstnews'];

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

// Prevent user input attacks
function sanitizeInput(input) {
  return input.replace(/[^a-z0-9]/gi, '');
}

// Confirm login
client.once(Events.ClientReady, c => {
  console.log(`Logged in as ${c.user.tag}`);
  
  // Set the bot's nickname and presence using the config settings
  client.user.setUsername(config.nickname);
  client.user.setPresence({
    activities: [{ name: config.activity.name, type: ActivityType[config.activity.type] }],
    status: config.status
  });
});

// Handle commands
client.on('messageCreate', message => {
  if (!message.content.startsWith(commandPrefix) || message.author.bot) return;
  
  let args = message.content.slice(1).trim().split(/ +/);
  args = args.map(arg => sanitizeInput(arg));
	
  const commandName = args.shift().toLowerCase();

  const command = commands.get(commandName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  try {
      command.execute(message, args, commands);
  } catch (error) {
      console.log(error);
      message.reply('There was an error executing that command.');
  }
  
});

// Attempt login with bot token, using environment variables or config.token
client.login(process.env.DISCORD_TOKEN);
