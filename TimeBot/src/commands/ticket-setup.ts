import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, TextChannel } from 'discord.js';
import prisma from '../database/db';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-setup')
        .setDescription('Setup het ticket systeem')
        .addChannelOption(option => 
            option.setName('channel')
            .setDescription('Kanaal voor het ticket panel')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText))
        .addRoleOption(option =>
            option.setName('support-role')
            .setDescription('De role die tickets kan behandelen')
            .setRequired(true)),

    async execute(interaction: ChatInputCommandInteraction) {
        const channel = interaction.options.getChannel('channel') as TextChannel;
        const supportRole = interaction.options.getRole('support-role');

        await prisma.ticketSettings.upsert({
            where: { guildId: interaction.guildId! },
            update: { supportRole: { connect: { id: supportRole!.id } } },
            create: {
                guildId: interaction.guildId!,
                supportRole: { connect: { id: supportRole!.id } }
            }
        });

        const ticketEmbed = new EmbedBuilder()
            .setColor('#2ecc71')
            .setTitle('🎫 Support Tickets')
            .setDescription('Klik op de knop hieronder om een ticket aan te maken')
            .setFooter({ text: `Support Team: ${supportRole!.name}` });

        const button = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('create_ticket')
                    .setLabel('Open Ticket')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🎫')
            );

        await channel.send({
            embeds: [ticketEmbed],
            components: [button]
        });

        await interaction.reply({ content: `Ticket systeem ingesteld in ${channel} met ${supportRole} als support team!`, ephemeral: true });
    }};