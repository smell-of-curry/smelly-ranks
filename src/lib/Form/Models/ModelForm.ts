import { Player, RawMessage } from "@minecraft/server";
import { FormCancelationReason, ModalFormData } from "@minecraft/server-ui";
import { TIMEOUT_THRESHOLD } from "../../../config/form";
import type {
  AppendFormField,
  IModalFormDropDownArg,
  IModalFormSliderArg,
  IModalFormTextFieldArg,
  IModalFormToggleArg,
  Range,
} from "../types";
import { FormCallback } from "./FormCallback";

export class ModalForm<
  Callback extends Function = (ctx: FormCallback) => void
> {
  /**
   *  the title that this form should have
   */
  title?: string | RawMessage;

  /**
   * The default minecraft form this form is based on
   */
  private form: ModalFormData;

  /**
   * The arguments this form has
   */
  public args: (
    | IModalFormDropDownArg
    | IModalFormSliderArg
    | IModalFormTextFieldArg
    | IModalFormToggleArg
  )[];

  /**
   * The amount of times it takes to show this form in ms
   * if this value goes above 200 it will time out
   */
  private triedToShow: number;

  /**
   * Creates a new form to be shown to a player
   * @param title the title that this form should have
   */
  constructor(title?: string | RawMessage) {
    this.title = title;
    this.form = new ModalFormData();

    if (title) this.form.title(title);

    this.args = [];
  }

  /**
   * Clears this form
   */
  clearForm() {
    this.form = new ModalFormData();
    this.args = [];
  }

  /**
   * Adds a dropdown to this form
   * @param label label to show on dropdown
   * @param options the available options for this dropdown
   * @param defaultValueIndex the default value index
   * @returns this
   */
  addDropdown<T extends ReadonlyArray<string>>(
    label: string,
    options: T,
    defaultValueIndex?: number
  ): ModalForm<AppendFormField<Callback, T[number]>> {
    // @ts-ignore
    this.args.push({ type: "dropdown", options: options });
    // @ts-ignore
    this.form.dropdown(label, options, defaultValueIndex);
    // @ts-ignore
    return this;
  }

  /**
   * Adds a slider to this form
   * @param label label to be shown on this slider
   * @param minimumValue the smallest value this can be
   * @param maximumValue the maximum value this can be
   * @param valueStep how this slider increments
   * @param defaultValue the default value in slider
   * @returns this
   */
  addSlider<T extends number, U extends number>(
    label: string,
    minimumValue: T,
    maximumValue: U,
    valueStep: number,
    defaultValue?: number
  ): ModalForm<AppendFormField<Callback, Range<T, U>>> {
    this.args.push({
      type: "slider",
      label: label,
      minimumValue: minimumValue,
      maximumValue: maximumValue,
      valueStep: valueStep,
    });
    this.form.slider(
      label,
      minimumValue,
      maximumValue,
      valueStep,
      defaultValue
    );
    // @ts-ignore
    return this;
  }

  /**
   * Adds a toggle to this form
   * @param label the name of this toggle
   * @param defaultValue the default toggle value could be true or false
   * @returns
   */
  addToggle(
    label: string,
    defaultValue?: boolean
  ): ModalForm<AppendFormField<Callback, boolean>> {
    this.args.push({ type: "toggle", label: label });
    this.form.toggle(label, defaultValue);
    // @ts-ignore
    return this;
  }

  /**
   * Adds a text field to this form
   * @param label label for this textField
   * @param placeholderText the text that shows on this field
   * @param defaultValue the default value that this field has
   */
  addTextField(
    label: string,
    placeholderText: string,
    defaultValue?: string
  ): ModalForm<AppendFormField<Callback, string>> {
    this.args.push({
      type: "textField",
      label: label,
      placeholderText: placeholderText,
    });
    this.form.textField(label, placeholderText, defaultValue);
    // @ts-ignore
    return this;
  }

  /**
   * Shows this form to a player
   * @param player player to show to
   * @param callback sends a callback when this form is submitted
   */
  show(player: Player, callback: Callback, onUserClosed?: () => void) {
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
          this.show(player, callback, onUserClosed);
        }
        if (response.cancelationReason == FormCancelationReason.UserClosed)
          onUserClosed?.();
        return;
      }
      if (!response.formValues) return;
      callback(
        new FormCallback(this, player, callback, response.formValues),
        ...response.formValues.map((v, i) =>
          this.args[i].type == "dropdown"
            ? (this.args[i] as IModalFormDropDownArg).options?.[v as number]
            : v
        )
      );
    });
  }

  /**
   * Shows this form to the player, but wont stop
   * @param player player to show to
   * @param onUserClosed callback to run if the player closes the form and doesn't select something
   */
  forceShow(
    player: Player,
    callback: Callback,
    onUserClosed?: () => void
  ): void {
    this.form.show(player).then((response) => {
      if (response.canceled) {
        if (response.cancelationReason == FormCancelationReason.UserBusy) {
          this.forceShow(player, callback, onUserClosed);
        }
        if (response.cancelationReason == FormCancelationReason.UserClosed)
          onUserClosed?.();
        return;
      }
      if (!response.formValues) return;
      callback(
        new FormCallback(this, player, callback, response.formValues),
        ...response.formValues.map((v, i) =>
          this.args[i].type == "dropdown"
            ? (this.args[i] as IModalFormDropDownArg).options?.[v as number]
            : v
        )
      );
    });
  }
}
