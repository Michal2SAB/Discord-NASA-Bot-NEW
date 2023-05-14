module.exports = {
    name: 'help',
    description: 'Displays a list of available commands.',
  
    execute(message, args, commands) {
      // Get an array of command names
      
      const commandNames = Array.from(commands.keys());

      // Construct the help message
      const helpMessage = `Available commands: ${commandNames.join(', ')}`;

      // Send the help message to the user
      message.channel.send(helpMessage);
    },
};
