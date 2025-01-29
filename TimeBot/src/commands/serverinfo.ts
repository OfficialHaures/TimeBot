import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import prisma from '../database/db';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Toont server informatie uit de database'),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guildId) {
            return interaction.reply('Dit command kan alleen in een server gebruikt worden!');
        }

        const guildData = await prisma.guild.findUnique({
            where: {
                id: interaction.guildId
            }
        });

        if (!guildData) {
            return interaction.reply('Deze server staat niet in de database!');
        }

        await interaction.reply(`
Server: ${guildData.name}
Joined: ${guildData.joinedAt}
Timezone: ${guildData.timezone}
        `);
    }
};