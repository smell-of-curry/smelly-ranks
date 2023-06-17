import { Player, world } from "@minecraft/server";

export class PlayerLog<T extends any = any> {
  data: Map<string, T>;
  events: Object;

  constructor() {
    this.data = new Map();
    world.afterEvents.playerLeave.subscribe((data) => {
      console.warn(`player leave! ${data.playerId} ${data.playerName}`);
      this.data.delete(data.playerId);
    });
  }

  /**
   * Logs a player to a value
   */
  set(player: Player, value: T): void {
    this.data.set(player.id, value);
  }

  /**
   * Gets a players value
   */
  get(player: Player): T | undefined {
    return this.data.get(player.id);
  }

  /**
   * Tests if a player is on this log
   * @param player
   * @returns
   */
  has(player: Player): boolean {
    return this.data.has(player.id);
  }

  /**
   * Deletes a player from log
   */
  delete(player: Player) {
    this.data.delete(player.id);
  }

  /**
   * Clears this Player log
   */
  clear() {
    this.data.clear();
  }

  /**
   * Gets all the players in the log
   */
  playerIds(): Array<string> {
    return [...this.data.keys()];
  }

  /**
   * Checks to see if a player is in this list
   * @param player player to check
   * @returns
   */
  includes(player: Player): boolean {
    return this.playerIds().includes(player.id);
  }
}
