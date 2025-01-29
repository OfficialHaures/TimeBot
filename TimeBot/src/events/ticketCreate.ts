import { ButtonInteraction, ChannelType, PermissionFlagsBits, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';
import prisma from '../database/db';

export const handleTicketCreate = async (interaction: ButtonInteraction) => {
    const ticketTypes = {
        ticket_support: { title: 'Support Ticket', color: '#3498db' },
        ticket_bug: { title: 'Bug Report', color: '#e74c3c' },
        ticket_suggestion: { title: 'Suggestie', color: '#2ecc71' }
    };

    const type = ticketTypes[interaction.customId as keyof typeof ticketTypes];
    
    const modal = new ModalBuilder()
        .setCustomId(`ticket_modal_${interaction.customId}`)
        .setTitle(type.title);

    const titleInput = new TextInputBuilder()
        .setCustomId('ticket_title')
        .setLabel('Onderwerp')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setPlaceholder('Kort onderwerp van je ticket');

    const descriptionInput = new TextInputBuilder()
        .setCustomId('ticket_description')
        .setLabel('Beschrijving')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setPlaceholder('Geef een duidelijke beschrijving...');

    const row1 = new ActionRowBuilder<TextInputBuilder>().addComponents(titleInput);
    const row2 = new ActionRowBuilder<TextInputBuilder>().addComponents(descriptionInput);

    modal.addComponents(row1, row2);
    await interaction.showModal(modal);
};