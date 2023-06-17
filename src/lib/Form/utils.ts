import { Player } from "@minecraft/server";
import { MessageForm } from "./Models/MessageForm";

/**
 * Sends a confirmation message to a player to confirm a action
 * @param action action message to confirm
 * @param onConfirm callback to run when a player confirms the action
 * @param onCancel callback to run when a player cancels the action, this can be null
 * @example ```
 * confirmAction("Ban Smell of curry", () => {
 * new Ban("Smell of curry")
 * })
 * ```
 */
export function confirmAction(
    player: Player,
    action: string,
    onConfirm: () => void,
    onCancel: () => void = () => {}
  ) {
    new MessageForm("Confirm To Continue", action)
      .setButton1("Confirm", onConfirm)
      .setButton2("Never Mind", onCancel)
      .show(player, onCancel);
  }
  