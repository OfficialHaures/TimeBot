import { Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { Command } from '../types/discord';

export async function loadCommands() {
    const commands = new Collection<string, Command>();
    const commandsPath = join(__dirname, '../commands');
    const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

    for (const file of commandFiles) {
        const filePath = join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            commands.set(command.data.name, command);
            console.log(`✅ Loaded command: ${command.data.name}`);
        }
    }

    return commands;
}