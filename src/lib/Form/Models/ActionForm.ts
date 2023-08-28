import { Player, RawMessage } from "@minecraft/server";
import { ActionFormData, FormCancelationReason } from "@minecraft/server-ui";
import { TIMEOUT_THRESHOLD } from "../../../config/form";
import type { ButtonCallback, IActionFormButton } from "../types";

export class ActionForm {
  /**
   *  the title that this form should have
   */
  title?: string | RawMessage;
  /**
   * extra text that should be displayed in the form
   */
  body?: string | RawMessage;
  /**
   * The buttons this form has
   */
  private buttons: IActionFormButton[];

  /**
   * The default minecraft form this form is based on
   */
  private form: ActionFormData;

  /**
   * The amount of times it takes to show this form in ms
   * if this value goes above 200 it will time out
   */
  private triedToShow: number;

  /**
   * Creates a new form to be shown to a player
   * @param title the title that this form should have
   * @param body extra text that should be displayed in the form
   */
  constructor(title?: string | RawMessage, body?: string | RawMessage) {
    this.title = title;
    this.body = body;
    this.form = new ActionFormData();

    if (title) this.form.title(title);
    if (body) this.form.body(body);

    this.buttons = [];

    this.triedToShow = 0;
  }

  /**
   * Adds a button to this form
   * @param text text to show on this button
   * @param iconPath the path this button shows
   * @param callback what happens when this button is clicked
   * @param locked if this button is locked and cannot be pushed.
   * @example ```
   * addButton("settings", "textures/items/sum")
   * ```
   */
  addButton(
    text: string,
    iconPath?: string,
    callback?: ButtonCallback,
    locked?: boolean
  ): ActionForm {
    this.buttons.push({
      text: text,
      iconPath: iconPath,
      callback: callback,
    });
    /**
     * Adds the ability for button locking using ` `
     * Grab from {@link https://www.editpad.org/tool/invisible-character}
     */
    this.form.button((locked ? " " : "") + text, iconPath);
    return this;
  }

  /**
   * Shows this form to the player
   * @param player player to show to
   * @param onUserClosed callback to run if the player closes the form and doesn't select something
   */
  show(player: Player, onUserClosed?: () => void): void {
    this.triedToShow = 0;
    this.form.show(player).then((response) => {
      if (response.canceled) {
        if (response.cancelationReason == FormCancelationReason.UserBusy) {
          // check time and reshow form
          if (this.triedToShow > TIMEOUT_THRESHOLD)
            return player.sendMessage({
              translate: "forms.actionForm.show.timeout",
            });
          this.triedToShow++;
          this.show(player, onUserClosed);
        }
        if (response.cancelationReason == FormCancelationReason.UserClosed)
          onUserClosed?.();
        return;
      }
      if (response.selection != null)
        this.buttons[response.selection].callback?.();
    });
  }

  /**
   * Shows this form to the player, but wont stop
   * @param player player to show to
   * @param onUserClosed callback to run if the player closes the form and doesn't select something
   */
  forceShow(player: Player, onUserClosed?: () => void): void {
    this.form.show(player).then((response) => {
      if (response.canceled) {
        if (response.cancelationReason == FormCancelationReason.UserBusy) {
          this.forceShow(player, onUserClosed);
        }
        if (response.cancelationReason == FormCancelationReason.UserClosed)
          onUserClosed?.();
        return;
      }
      if (response.selection != null)
        this.buttons[response.selection].callback?.();
    });
  }
}
