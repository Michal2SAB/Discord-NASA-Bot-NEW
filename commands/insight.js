// Necessary modules and classes
const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'insight',
    description: 'Provides most recent weather information for Mars',
    aliases: ['marsweather', 'mw'],

    async execute(message, args, commands) {
        try {
            // Collect weather data from NASA website
            const response = await fetch('https://mars.nasa.gov/rss/api/?feed=weather&category=mars2020&feedtype=json');
            const data = await response.json();
            const latestSol = data.sols[data.sols.length - 1];
            
            // Create beautiful embed object
            const marsEmbed = new EmbedBuilder()
            .setColor(0xFF8413)
            .setTitle(`Mars Weather Report (${latestSol.terrestrial_date})`)
            .setURL('https://mars.nasa.gov/mars2020/weather/')
            .setAuthor(
              {name: 'NASA', iconURL: 'https://gpm.nasa.gov/sites/default/files/document_files/NASA-Logo-Large.png', URL: 'https://www.nasa.gov'}
            )
            .setThumbnail('https://gpm.nasa.gov/sites/default/files/document_files/NASA-Logo-Large.png')
            .setDescription(`Sol: ${latestSol.sol}`)
            .addFields(
              { name: 'Highest Temperature', value: latestSol.max_temp.toString(), inline: true },
              { name: 'Lowest Temperature', value: latestSol.min_temp.toString(), inline: true },
              { name: 'Pressure', value: latestSol.pressure + ' Pa', inline: false }
            )
            .addFields(
              { name: 'Sunrise', value: latestSol.sunrise, inline: true },
              { name: 'Sunset', value: latestSol.sunset, inline: true }
            );
            
            // Send the embed
            message.channel.send({ embeds: [marsEmbed] });
        } catch (error) {
            console.error(error);
            message.reply('There was an error fetching the weather information for Mars.');
        }
    },
};
