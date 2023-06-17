import { Player } from "@minecraft/server";
import { ChatEventDetails } from ".";

export class CommandCallback {
  sender: Player;

  /**
   * Returns a commands callback
   * @param data chat data that was used
   */
  constructor(public data: ChatEventDetails) {
    this.data = data;
    this.sender = data.sender;
  }
}
