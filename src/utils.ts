import { MinecraftDimensionTypes, world } from "@minecraft/server";
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
