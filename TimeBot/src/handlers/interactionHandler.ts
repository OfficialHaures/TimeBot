import { Interaction } from 'discord.js';
import { handleTicketCreate } from '../events/ticketCreate';
import { handleTicketClose } from '../events/ticketClose';

export const handleInteraction = async (interaction: Interaction) => {
    if (interaction.isButton()) {
        switch (interaction.customId) {
            case 'create_ticket':
                await handleTicketCreate(interaction);
                break;
            case 'close_ticket':
                await handleTicketClose(interaction);
                break;
        }
    }
};
