const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'launches',
    description: 'Displays information about upcoming space launches.',
    aliases: ['missions'],
  
    async execute(message, args) {
        // Set the API endpoint
        const endpoint = 'https://ll.thespacedevs.com/2.2.0/launch/upcoming/';

        try {
            // Fetch data from the API
            const response = await fetch(endpoint);
            const data = await response.json();

            // Check if there are any upcoming launches
            if (data.count === 0) {
                message.channel.send('There are no upcoming launches.');
                return;
            }
          

            // Create an embed
            const embed = new EmbedBuilder()
                .setTitle('Upcoming Launches')
                .setColor('#0099ff');

            for (const launch of data.results) {
                const launchName = launch.name;
                const launchDescription = launch.mission.description;
                const launchDate = launch.net.substring(0, 10);
                const location = launch.pad.location.name;
                const mission = launch.mission;
                const missionName = launch.mission.name;
              
                embed.addFields({ name: launchName, value: `Date: ${launchDate}\nLocation: ${location}\nMission: ${mission ? missionName : 'N/A'}\n\n*Description:* ${launchDescription}` });
            }

            // Send the embed to the user
            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.log(error);
            message.reply('There was an error retrieving launch information.');
        }
    },
};
