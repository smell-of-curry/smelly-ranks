import { DynamicProperty } from "./lib/DynamicPropertyWrapper/DynamicProperty";
import type { IChatRankConfig } from "./types";
import "./modules/events/import";
import "./modules/commands/import";
import "./lib/DynamicPropertyWrapper/worldInitializeEvent";

/**
 * The config for the chat rank plugin
 */
export const chatRankConfig = new DynamicProperty<IChatRankConfig>(
  "smelly:chatRankConfig",
  "object"
).setWorldDynamic();
