import { chatRankConfig, chatRanks } from "../..";
import { PREFIX } from "../../config/commands";
import { ArgumentTypes, Command } from "../../lib/Command/Command";
import { ModalForm } from "../../lib/Form/Models/ModelForm";
import { confirmAction } from "../../lib/Form/utils";
import { getDefaultRankConfig } from "../../utils";

const root = new Command({
  name: "chatRank",
  description: "Manages the Smelly Chat plugin.",
  requires: (player) => player.isOp(),
});

root
  .literal({
    name: "create",
    description: "Creates a custom Chat Rank.",
  })
  .executes((ctx) => {
    new ModalForm(`Create Smelly Chat Rank.`)
      .addTextField("Rank", "§cAdmin")
      .show(ctx.sender, (_, rank) => {
        const config = chatRankConfig.get() ?? getDefaultRankConfig();
        config.ranks.push(rank);
        chatRankConfig.set(config);
        ctx.sender.sendMessage(`§aCreated Rank: ${rank}§r§a Successfully!`);
      });
    ctx.sender.sendMessage(
      `§aForm Requested, Close chat to create a Smelly Rank!`
    );
  });

root
  .literal({
    name: "delete",
    description: "Deletes a custom Chat Rank.",
  })
  .executes((ctx) => {
    const config = chatRankConfig.get() ?? getDefaultRankConfig();
    if (config.ranks.length < 1)
      return ctx.sender.sendMessage(
        `§cThere are no registered chat ranks to delete!`
      );
    new ModalForm(`Delete Smelly Chat Rank.`)
      .addDropdown("Rank", config.ranks)
      .show(ctx.sender, (_, rank) => {
        const index = config.ranks.findIndex((v) => v == rank);
        config.ranks.splice(index, 1);
        chatRankConfig.set(config);
        ctx.sender.sendMessage(`§aDeleted Rank: ${rank}§r§a Successfully!`);
      });
    ctx.sender.sendMessage(
      `§aForm Requested, Close chat to delete a Smelly Rank!`
    );
  });

root
  .literal({
    name: "add",
    description: "Adds a Chat Rank to a player.",
  })
  .argument(new ArgumentTypes.player())
  .executes((ctx, player) => {
    const config = chatRankConfig.get() ?? getDefaultRankConfig();
    if (config.ranks.length < 1)
      return ctx.sender.sendMessage(
        `§cThere are no registered chat ranks! use "${PREFIX}chatRank create"`
      );
    new ModalForm(`Add Rank to ${player.name}.`)
      .addDropdown("Rank", config.ranks)
      .show(ctx.sender, (_, rank) => {
        const playersRanks = chatRanks.get(player) ?? [];
        playersRanks.push(rank);
        chatRanks.set(playersRanks, player);
        ctx.sender.sendMessage(
          `§aAdded "${rank}"§r§a to ${player.name}'s Ranks Successfully!`
        );
      });
    ctx.sender.sendMessage(
      `§aForm Requested, Close chat to add a Smelly Rank to ${player.name}!`
    );
  });

root
  .literal({
    name: "remove",
    description: "Removes a Chat Rank from a player.",
  })
  .argument(new ArgumentTypes.player())
  .executes((ctx, player) => {
    const playersRanks = chatRanks.get(player) ?? [];
    if (playersRanks.length < 1)
      return ctx.sender.sendMessage(
        `§c${player.name} does not have any ranks!`
      );
    new ModalForm(`Remove a Rank from ${player.name}.`)
      .addDropdown("Rank", playersRanks)
      .show(ctx.sender, (_, rank) => {
        const index = playersRanks.findIndex((v) => v == rank);
        playersRanks.splice(index, 1);
        chatRanks.set(playersRanks, player);
        ctx.sender.sendMessage(
          `§aDeleted "${rank}"§r§a from ${player.name} Successfully!`
        );
      });
    ctx.sender.sendMessage(
      `§aForm Requested, Close chat to remove a Smelly Rank from ${player.name}!`
    );
  });

root
  .literal({
    name: "reset",
    description: "Resets a players rank data.",
  })
  .argument(new ArgumentTypes.player())
  .executes((ctx, player) => {
    confirmAction(
      ctx.sender,
      `Are you sure you want to reset: ${player.name}'s rank data!`,
      () => {
        chatRanks.remove(player);
        ctx.sender.sendMessage(`§aReset ${player.name}'s rank data!`);
      }
    );
    ctx.sender.sendMessage(
      `§aForm Requested, Close chat to reset ${player.name}'s rank data!`
    );
  });

root
  .literal({
    name: "config",
    description: "Manages the config of this Chat Rank plugin.",
  })
  .executes((ctx) => {
    const config = chatRankConfig.get() ?? getDefaultRankConfig();
    new ModalForm(`Manage Chat Rank Config.`)
      .addTextField("Default Rank", "§bMember", config.defaultRank)
      .addTextField("Start String", "§r§l§8[§r", config.startString)
      .addTextField("Join String", "§r§l§8][§r", config.joinString)
      .addTextField("End String", "§r§l§8]§r§7", config.endString)
      .show(
        ctx.sender,
        (_, defaultRank, startString, joinString, endString) => {
          chatRankConfig.set({
            ranks: config.ranks,
            defaultRank,
            startString,
            joinString,
            endString,
          });
          ctx.sender.sendMessage(`§aUpdated Smelly Chat config!`);
        }
      );
    ctx.sender.sendMessage(
      `§aForm Requested, Close chat to manage Smelly Chat config!`
    );
  });
