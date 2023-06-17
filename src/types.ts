/**
 * The config types for the chat rank config.
 */
export interface IChatRankConfig {
  /**
   * Ranks that are created
   */
  ranks: string[];
  /**
   * The Default Rank configured.
   * @example "§bMember"
   */
  defaultRank: string;
  /**
   * The string that starts off the ranks
   * @example "§r§l§8[§r"
   */
  startString: string;
  /**
   * The string that joins the ranks together
   * @example "§r§l§8][§r"
   */
  joinString: string;
  /**
   * The ranks ending value.
   * @example "§r§l§8]§r§7"
   */
  endString: string;
}
