import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, TextChannel } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-ticket')
        .setDescription('Maak een ticket panel aan')
        .addChannelOption(option => 
            option.setName('channel')
            .setDescription('Kanaal voor het ticket panel')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)),

    async execute(interaction: ChatInputCommandInteraction) {
        const channel = interaction.options.getChannel('channel') as TextChannel;

        const ticketEmbed = new EmbedBuilder()
            .setColor('#2ecc71')
            .setTitle('🎫 Support Ticket Systeem')
            .setDescription('Selecteer hieronder het type ticket dat je wilt openen')
            .addFields(
                { name: '🛠️ Algemene Support', value: 'Voor algemene vragen en hulp', inline: true },
                { name: '🐛 Bug Report', value: 'Meld een probleem of bug', inline: true },
                { name: '💡 Suggestie', value: 'Deel je ideeën met ons', inline: true }
            )
            .setFooter({ text: 'Tickets worden binnen 24 uur behandeld' })
            .setTimestamp();

        const buttons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('ticket_support')
                    .setLabel('Support')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🛠️'),
                new ButtonBuilder()
                    .setCustomId('ticket_bug')
                    .setLabel('Bug Report')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('🐛'),
                new ButtonBuilder()
                    .setCustomId('ticket_suggestion')
                    .setLabel('Suggestie')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('💡')
            );

        await channel.send({
            embeds: [ticketEmbed],
            components: [buttons]
        });

        await interaction.reply({ content: `Ticket panel aangemaakt in ${channel}!`, ephemeral: true });
    }
};
