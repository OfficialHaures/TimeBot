import { Collection } from 'discord.js';

export interface Command {
    data: any;
    execute: (interaction: any) => Promise<void>;
}

declare module 'discord.js' {
    export interface Client {
        commands: Collection<string, Command>;
    }
}
