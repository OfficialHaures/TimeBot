import { ButtonInteraction } from 'discord.js';
import prisma from '../database/db';

export const handleTicketClose = async (interaction: ButtonInteraction) => {
    const ticket = await prisma.ticket.findFirst({
        where: {
            channelId: interaction.channelId,
            closed: false
        }
    });

    if (ticket) {
        await prisma.ticket.delete({
            where: { id: ticket.id }
        });

        await interaction.channel!.delete();
        
        const user = await interaction.client.users.fetch(ticket.userId);
        await user.send('Je ticket is gesloten en verwijderd.').catch(() => {
        });
    }
};