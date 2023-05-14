// Necessary classes and modules
const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');

// Prevent input attacks
function sanitizeInput(input) {
  return input.replace(/[^a-z0-9]/gi, '');
}

module.exports = {
    name: 'marsimage',
    description: 'Get a random image from a random sol of a random Mars rover using NASA\'s Mars Rover Photos API',
  
    async execute(message, args, commands) {
        // Remove illegal characters from args
        args = args.map(arg => sanitizeInput(arg));
      
        const rovers = ['curiosity', 'opportunity', 'spirit', 'perseverance'];
      
        let rover;
        
        // Choose random rover if not specified
        if (args.length > 0 && rovers.includes(args[0].toLowerCase())) {
            rover = args[0].toLowerCase();
        } else {
            rover = rovers[Math.floor(Math.random() * rovers.length)];
        }
        
        // Check the most recent SOL available
        const manifestResponse = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=${process.env.NASA_API}`);
        const manifestData = await manifestResponse.json();
      
        const maxSol = manifestData.photo_manifest.max_sol;
        
        let sol;
        
        // Choose random sol up to the most recent if not specified
        if (args.length > 1 && !isNaN(args[1]) && parseInt(args[1]) >= 0 && parseInt(args[1]) <= maxSol) {
            sol = parseInt(args[1]);
        } else {
            sol = Math.floor(Math.random() * (maxSol + 1));
        }
        
        // Get random image from the NASA api
        const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=${process.env.NASA_API}`);
        const data = await response.json();
      
        if (data.photos.length === 0) {
            message.channel.send(`No photos found for ${rover.charAt(0).toUpperCase() + rover.slice(1)} Rover on sol ${sol}.`);
            return;
        }
      
        const photo = data.photos[Math.floor(Math.random() * data.photos.length)];
        
        // Create embed object
        const embed = new EmbedBuilder()
          .setTitle(`${rover.charAt(0).toUpperCase() + rover.slice(1)} Rover`)
          .setDescription(`Random image from the ${rover} rover. Max sol: ${maxSol}`)
          .setImage(photo.img_src)
          .setFooter({text: `Sol: ${sol} | Earth Date: ${photo.earth_date}`});
        
        // Send the response
        message.channel.send({ embeds: [embed] });
    }
};
