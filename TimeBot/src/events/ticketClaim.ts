import { ButtonInteraction, PermissionFlagsBits, GuildMember, TextChannel } from 'discord.js';
import prisma from '../database/db';

export const handleTicketClaim = async (interaction: ButtonInteraction) => {
    const ticketData = await prisma.ticket.findFirst({
        where: {
            channelId: interaction.channelId,
            claimed: false
        }
    });

    if (!ticketData) {
        return interaction.reply({ content: 'Dit ticket is al geclaimd!', ephemeral: true });
    }

    const settings = await prisma.ticketSettings.findUnique({
        where: { guildId: interaction.guildId! }
    });

    const member = interaction.member as GuildMember;
    if (!member.roles.cache.has(settings!.staffRoleId)) {
        return interaction.reply({ content: 'Je hebt geen permissies om tickets te claimen!', ephemeral: true });
    }

    const channel = interaction.channel as TextChannel;
    await channel.permissionOverwrites.set([
        {
            id: interaction.guild!.id,
            deny: [PermissionFlagsBits.ViewChannel],
        },
        {
            id: ticketData.userId,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
        },
        {
            id: interaction.user.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
        }
    ]);

    await prisma.ticket.update({
        where: { id: ticketData.id },
        data: { 
            claimed: true,
            claimedBy: interaction.user.id
        }
    });

    const unclaimButton = {
        type: 1,
        components: [
            {
                type: 2,
                label: "Unclaim Ticket",
                style: 4,
                custom_id: "unclaim_ticket",
                emoji: "🔓"
            }
        ]
    };

    await interaction.reply({
        content: `Ticket geclaimd door ${interaction.user}`,
        components: [unclaimButton]
    });
};