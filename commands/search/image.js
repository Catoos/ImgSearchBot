const { SlashCommandBuilder } = require('discord.js');
const cheerio = require("cheerio"); 
const axios = require('axios');



module.exports = {
    data: new SlashCommandBuilder()
    .setName('image')
    .setDescription( 'I will find you an image')
    .addStringOption(option =>
        option.setName('query')
        .setDescription('The input to echo back')
        .setRequired(true)),

        async execute( interaction ){
            const imgInput = interaction.options.getString('query');

            async function performImageSearch(query) {
                try {
                    const response = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`);
                    const imageSearchResult = response.data;
                    const imageUrls = extractImageUrls(imageSearchResult);
                    return imageUrls;
                } catch (error) {
                    console.error(error);
                    return null;
                }
            }
            
            function extractImageUrls(html) {
                const $ = cheerio.load(html);
                const imgElements = $('img');
                const imageUrls = imgElements.map((_, element) => $(element).attr('src')).get();
                return imageUrls;
            }
            
            const imageUrls = await performImageSearch(imgInput);
            
            if (imageUrls && imageUrls.length > 0) {
                const randomImageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
                await interaction.reply(randomImageUrl);
            } else {
                await interaction.reply('No results found.');
            }
        }
    }