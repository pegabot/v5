/*
 * Copyright (c) 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import {
  ApplicationCommandChoicesOption,
  ApplicationCommandData,
  ApplicationCommandPermissionData,
  ChatInputApplicationCommandData,
  CommandInteraction,
  Guild,
  GuildApplicationCommandPermissionData,
  OAuth2Guild,
  PermissionString,
} from "discord.js";
import { getRolesByPermissionsAndGuild } from "../../utils/getRolesByPermissionsAndGuild";
import { getGuildLocale } from "../../utils/guildLocale";
import { Bot } from "../bot";
import { BotCommand } from "../structures/BotCommand";

export class InteractionManager {
  commands: Map<string, BotCommand> = new Map();
  commandCallbacks: Map<string, BotCommand["callback"]> = new Map();

  constructor(private bot: Bot) {}

  register(
    // TODO: This needs some love, create a seperate structure!!
    command: ApplicationCommandData & { permissions?: PermissionString[] },
    callback: (interaction: CommandInteraction, locale: string) => Promise<void>,
  ) {
    this.bot.logger.info(`registering command (${command.name})`);

    // if we have a specific permission set, we need to disable the command for all users
    if (command.permissions) command.defaultPermission = false;

    // register the command
    this.commands.set(command.name, { command, callback });
  }

  async deploy(guildID?: string) {
    // if we have a guilID we want to deploy to the server with the id = guildID only
    // then we get the guild(s) from cache first.
    // if guilds are not present in cache, fetch from API.
    let guilds: Guild[] | OAuth2Guild[] = [];
    if (guildID) {
      let guild = this.bot.client.guilds.cache.get(guildID);
      if (guild) {
        guilds = [guild];
      } else {
        guilds = [await this.bot.client.guilds.fetch(guildID)];
      }

      this.bot.logger.info(`deploying ${this.commands.size} commands on server (${guilds[0].name})`);
    } else {
      guilds = [...this.bot.client.guilds.cache.values()];

      if (!guilds || guilds.length < 1) {
        guilds = [...(await this.bot.client.guilds.fetch()).values()];
      }

      this.bot.logger.info(`deploying ${this.commands.size} commands on ${guilds.length} servers`);
    }

    // we need to set a callback for every translation of the command name
    this.commands.forEach((c) => {
      this.bot.i18n.getLocales().forEach((locale) => {
        const name = this.bot.i18n.__({ phrase: c.command.name, locale });
        if (this.commandCallbacks.has(name)) return;
        this.commandCallbacks.set(name, c.callback);
      });
    });

    // deploy the commands on the guilds(s)
    await Promise.all(
      guilds.map(async (guild) => {
        return new Promise(async (resolve, reject) => {
          const locale = await getGuildLocale(guild.id);

          // transalate the data from all commands
          const data = this.localizeCommandData(
            [...this.commands.values()].map((e) => e.command),
            locale,
          );

          // we need to store the id of the commands returned by the API
          const createdCommands = await (guild as Guild)?.commands.set(data);
          createdCommands.forEach((createdCommand) => {
            const command = this.commands.get(createdCommand.name);
            if (!command) return;
            command.id = createdCommand.id;
          });
          resolve(true);
        });
      }),
    );

    // we deployed the commands, stored their ids => let's deploy the permissions on the guilds
    return this.deployPermissions(guilds as Guild[]);
  }

  private async deployPermissions(guilds: Guild[]): Promise<void> {
    // we have to deploy the permissions for every guild separately because
    // we only use guild specific commands
    guilds.forEach(async (guild) => {
      let fullPermissions: GuildApplicationCommandPermissionData[] = [];

      try {
        this.commands.forEach(({ id, command }) => {
          // if the command has no permissions set or the id of the
          // command returned by the API is undefined go to the next
          // command
          if (!command.permissions || command.permissions.length < 1) return;
          if (!id) return;

          let permissions: ApplicationCommandPermissionData[] = [];

          // get the roles from the guild related to the set permissions
          const RolesByPermissions = getRolesByPermissionsAndGuild(guild, command.permissions);

          permissions = permissions.concat(
            RolesByPermissions.sort((a, b) => b.position - a.position)
              .slice(0, 10)
              .map((role) => {
                return {
                  id: role.id,
                  type: "ROLE",
                  permission: true,
                };
              }),
          );

          fullPermissions.push({
            id,
            permissions: permissions,
          });
        });

        // deploy the permissions on the guilds
        await guild.commands.permissions.set({ fullPermissions });
      } catch (error: any) {
        this.bot.logger.error((error as Error).message);
      }
    });
  }

  private localizeCommandData(commands: ApplicationCommandData[], locale: string): ApplicationCommandData[] {
    const localized: ApplicationCommandData[] = commands.map((command) => {
      return {
        ...command,
        name: this.bot.i18n.__({ phrase: command.name, locale }),
        description: (command as ChatInputApplicationCommandData).description
          ? this.bot.i18n.__({ phrase: (command as ChatInputApplicationCommandData).description, locale })
          : "",
        options: (command as ChatInputApplicationCommandData).options
          ? (command as ChatInputApplicationCommandData).options?.map((option) => {
              return {
                ...option,
                name: this.bot.i18n.__({ phrase: option.name, locale }),
                description: this.bot.i18n.__({ phrase: option.description, locale }),
                choices: (option as ApplicationCommandChoicesOption).choices?.map((choice) => {
                  return {
                    ...choice,
                    name: this.bot.i18n.__({ phrase: choice.name, locale }),
                  };
                }),
              };
            })
          : [],
      };
    });

    return localized;
  }
}
