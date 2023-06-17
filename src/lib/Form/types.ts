import { RawMessage } from "@minecraft/server";

export type ButtonCallback = () => void;

export interface IActionFormButton {
  /**
   * Text that gets displayed on the button
   */
  text: string | RawMessage;
  /**
   * The icon that is showed with this button
   */
  iconPath?: string;
  /**
   * What gets called when this gets clicked
   */
  callback?: ButtonCallback;
}

export interface IMessageFormButton {
  /**
   * Text that gets displayed on the button
   */
  text: string;
  /**
   * What gets called when this gets clicked
   */
  callback?: ButtonCallback;
}

export interface IModalFormArg {
  /**
   * What this form arg is
   */
  type: "dropdown" | "slider" | "textField" | "toggle";
  /**
   * Label for this arg
   */
  label: string,
}

export interface IModalFormDropDownArg extends IModalFormArg {
  /**
   * What this form arg is
   */
  type: "dropdown";
  /**
   * if this option is a dropdown this is
   * the Values that this dropdown can have
   */
  options: string[];
}
export interface IModalFormSliderArg extends IModalFormArg {
  /**
   * What this form arg is
   */
  type: "slider";
  /**
   *  the smallest value this can be
   */
  minimumValue: number;
  /**
   * the maximum value this can be
   */
  maximumValue: number;
  /**
   * how this slider increments
   */
  valueStep: number;
}

export interface IModalFormTextFieldArg extends IModalFormArg {
  /**
   * What this form arg is
   */
  type: "textField";
  /**
   * if this option is a dropdown this is
   * the Values that this dropdown can have
   */
  placeholderText: string,
}

export interface IModalFormToggleArg extends IModalFormArg {
  /**
   * What this form arg is
   */
  type: "toggle";
}

export type AppendFormField<Base, Next> = Base extends (
  ...args: infer E
) => infer R
  ? (...args: [...E, Next]) => R
  : never;

type Enumerate<
  N extends number,
  Acc extends number[] = []
> = Acc["length"] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc["length"]]>;

export type Range<F extends number, T extends number> =
  | Exclude<Enumerate<T>, Enumerate<F>>
  | T;
