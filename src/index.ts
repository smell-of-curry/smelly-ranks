import { MinecraftEntityTypes } from "@minecraft/server";
import { DynamicProperty } from "./lib/DynamicPropertyWrapper/DynamicProperty";
import type { IChatRankConfig } from "./types";
import "./modules/events/import";
import "./modules/commands/import";
import "./lib/DynamicPropertyWrapper/worldInitializeEvent";

/**
 * An array of ranks this player has.
 */
export const chatRanks = new DynamicProperty<string[]>(
  "smelly:chatRanks",
  "object"
).registerEntityTypes([MinecraftEntityTypes.player]);

/**
 * The config for the chat rank plugin
 */
export const chatRankConfig = new DynamicProperty<IChatRankConfig>(
  "smelly:chatRankConfig",
  "object"
).setWorldDynamic();
