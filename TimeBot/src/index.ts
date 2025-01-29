import { Client, GatewayIntentBits, REST, Routes, Collection } from 'discord.js';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { loadCommands } from './handlers/commandHandler';
import { handleInteraction } from './handlers/interactionHandler';
import { Command } from './types/discord';

dotenv.config();
const prisma = new PrismaClient();

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection<string, Command>();

client.once('ready', async () => {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);
    
    console.log('🗑️ Removing old commands...');
    await rest.put(
        Routes.applicationCommands(client.user!.id),
        { body: [] }
    );
    
    const commands = await loadCommands();
    client.commands = commands;

    const commandData = Array.from(commands.values()).map(cmd => cmd.data.toJSON());
    await rest.put(
        Routes.applicationCommands(client.user!.id),
        { body: commandData }
    );
    
    console.log('✅ Commands refreshed successfully!');
});
client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: 'Er ging iets mis bij het uitvoeren van dit command!', 
                ephemeral: true 
            });
        }
    } else {
        handleInteraction(interaction);
    }
});

client.login(process.env.DISCORD_TOKEN);

const OWNER_ID = '1262173932128309425'; // Replace with your Discord ID

client.on('guildCreate', async (guild) => {
    await prisma.guild.create({
        data: {
            id: guild.id,
            name: guild.name
        }
    });

    const owner = await client.users.fetch(OWNER_ID);
    await owner.send(`✅ Bot toegevoegd aan: ${guild.name} (${guild.id})\nDoor: ${guild.ownerId}`);
});

client.on('guildDelete', async (guild) => {
    await prisma.guild.delete({
        where: { id: guild.id }
    });

    const owner = await client.users.fetch(OWNER_ID);
    await owner.send(`❌ Bot verwijderd uit: ${guild.name} (${guild.id})\nDoor: ${guild.ownerId}`);
});

client.once('ready', async () => {
    const guilds = client.guilds.cache;
    console.log(`📊 Syncing ${guilds.size} guilds...`);

    for (const [guildId, guild] of guilds) {
        await prisma.guild.upsert({
            where: { id: guildId },
            update: { name: guild.name },
            create: {
                id: guildId,
                name: guild.name
            }
        });
        console.log(`✅ Synced guild: ${guild.name}`);
    }
});