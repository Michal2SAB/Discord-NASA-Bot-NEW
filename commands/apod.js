const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');
const { getColorFromURL } = require('color-thief-node');


module.exports = {
    name: 'apod',
    description: 'Displays the Astronomy Picture of the Day. Today\'s, random or specific date.',
  
    async execute(message, args) {
        // Set the API endpoint and parameters
        const endpoint = 'https://api.nasa.gov/planetary/apod';
        let apodDate = args[0];
      
        if (apodDate === "random") {
            const minDate = new Date("1995-06-16");
            const maxDate = new Date();
            apodDate = new Date(minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime())).toISOString().slice(0, 10);
        } else if (!apodDate) {
            apodDate = new Date().toISOString().slice(0, 10);
        } else {
            try {
              apodDate = new Date(apodDate.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3')).toISOString().slice(0, 10);
              console.log(apodDate);
            } catch (error) {
              console.log(error);
            }
        }
          
        const params = new URLSearchParams({
            api_key: process.env.NASA_API,
            date: apodDate,
        });

        try {
            // Fetch data from the API
            const response = await fetch(`${endpoint}?${params}`);
            const data = await response.json();

            // Check if there was an error
            if (data.error) {
                message.channel.send(data.error.message);
                return;
            } else if (data.code) {
                message.channel.send(data.msg);
                message.channel.send("As a reminder: proper date format is yyyy-mm-dd");
                return;
            }

            // Extract the dominant color from the image
            const dominantColor = await getColorFromURL(data.url);
            const embedColor = dominantColor.reduce((acc, cur) => acc + cur.toString(16).padStart(2, '0'), '');

            // Create an embed
            const embed = new EmbedBuilder()
                .setTitle(data.title)
                .setDescription(data.explanation)
                .setImage(data.url)
                .setFooter({ text: `Date: ${data.date}` })
                .setColor(`#${embedColor}`);

            // Send the embed to the user
            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.log(error);
            message.reply('There was an error retrieving the Astronomy Picture of the Day.');
        }
    },
};
