import { Player } from "@minecraft/server";
import { MessageForm } from "./MessageForm";
import { ModalForm } from "./ModelForm";

export class FormCallback {
  /**
   * form that was used in this call
   */
  private form: ModalForm<any>;
  /**
   * player that this form used
   */
  private player: Player;

  /**
   * the function that was called
   */
  private callback: () => void;

  /**
   * An ordered set of values based on the order of controls specified by ModalFormData.
   */
  private formValues: any[];

  /**
   * Creates a new form callback instance that can be used by
   * buttons, and args to run various functions
   * @param form form that is used in this call
   */
  constructor(
    form: ModalForm<any>,
    player: Player,
    callback: any,
    formValues: any[]
  ) {
    this.form = form;
    this.player = player;
    this.callback = callback;
    this.formValues = formValues;
  }

  /**
   * Reshow the form and shows the user a error message
   * @param message error message to show
   */
  error(message: string) {
    new MessageForm("Error", message)
      .setButton1("Return to form", () => {
        const args = this.form.args;
        this.form.clearForm();
        for (const [i, arg] of args.entries()) {
          switch (arg.type) {
            case "dropdown":
              this.form.addDropdown(arg.label, arg.options, this.formValues[i]);
              break;
            case "slider":
              this.form.addSlider(
                arg.label,
                arg.minimumValue,
                arg.maximumValue,
                arg.valueStep,
                this.formValues[i] 
              );
              break;
            case "textField":
              this.form.addTextField(
                arg.label,
                arg.placeholderText,
                this.formValues[i]
              );
              break;
            case "toggle":
              this.form.addToggle(arg.label, this.formValues[i]);
            default:
              break;
          }
        }
        this.form.show(this.player, this.callback);
      })
      .setButton2("Cancel")
      .show(this.player);
  }
}
