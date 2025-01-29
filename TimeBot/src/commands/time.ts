import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import prisma from '../database/db';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('time')
        .setDescription('Laat de huidige tijd zien'),
    async execute(interaction: ChatInputCommandInteraction) {
        const currentTime = new Date().toLocaleTimeString();
        await interaction.reply(`De huidige tijd is: ${currentTime}`);
    }
};