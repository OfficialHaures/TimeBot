import { ModalSubmitInteraction, EmbedBuilder } from 'discord.js';
import prisma from '../database/db';

export const handleTicketSetupModal = async (interaction: ModalSubmitInteraction) => {
    if (interaction.customId === 'ticket_setup_modal') {
        const categoryId = interaction.fields.getTextInputValue('category_id');
        const staffRoleId = interaction.fields.getTextInputValue('staff_role_id');

        await prisma.ticketSettings.upsert({
            where: { guildId: interaction.guildId! },
            update: {
                categoryId,
                staffRoleId
            },
            create: {
                guildId: interaction.guildId!,
                categoryId,
                staffRoleId
            }
        });

        const setupEmbed = new EmbedBuilder()
            .setColor('#2ecc71')
            .setTitle('🎫 Ticket Systeem Setup')
            .setDescription('Setup succesvol afgerond!')
            .addFields(
                { name: '📁 Categorie ID', value: categoryId, inline: true },
                { name: '👥 Staff Role ID', value: staffRoleId, inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [setupEmbed], ephemeral: true });
    }
};
