import { MinecraftDimensionTypes, Player, world } from "@minecraft/server";
import {
  DEFAULT_RANK,
  END_STRING,
  JOIN_STRING,
  START_STRING,
} from "./config/chatRanks";
import type { IChatRankConfig } from "./types";

/**
 * This is to reduce lag when grabbing dimensions keep them set and pre-defined
 */
export const DIMENSIONS = {
  overworld: world.getDimension(MinecraftDimensionTypes.overworld),
  nether: world.getDimension(MinecraftDimensionTypes.nether),
  theEnd: world.getDimension(MinecraftDimensionTypes.theEnd),
  "minecraft:overworld": world.getDimension(MinecraftDimensionTypes.overworld),
  "minecraft:nether": world.getDimension(MinecraftDimensionTypes.nether),
  "minecraft:the_end": world.getDimension(MinecraftDimensionTypes.theEnd),
};

/**
 * Gets the Default chat rank config, used if no ranks are set up.
 * @returns
 */
export function getDefaultRankConfig(): IChatRankConfig {
  return {
    ranks: [],
    defaultRank: DEFAULT_RANK,
    startString: START_STRING,
    joinString: JOIN_STRING,
    endString: END_STRING,
  };
}

/**
 * Gets a players chat ranks.
 * @param player
 */
export function getRanks(player: Player): string[] {
  return player
    .getTags()
    .filter((t) => t.startsWith("rank:"))
    .map((r) => r.substring(5));
}

/**
 * Sets a players chat ranks
 * @param player
 */
export function setRanks(player: Player, ranks: string[]) {
  const currentRanks = getRanks(player);
  for (const rank of currentRanks) {
    removeRank(player, rank);
  }
  for (const rank of ranks) {
    addRank(player, rank);
  }
}

/**
 * Sets a players chat ranks
 * @param player
 * @returns if the rank was successfully added.
 */
export function addRank(player: Player, rank: string): boolean {
  return player.addTag("rank:" + rank);
}

/**
 * Sets a players chat ranks
 * @param player
 * @returns if the rank was successfully removed.
 */
export function removeRank(player: Player, rank: string): boolean {
  return player.removeTag("rank:" + rank);
}
