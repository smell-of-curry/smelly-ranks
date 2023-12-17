import { Player, system, world } from "@minecraft/server";
import { PREFIX } from "../../config/commands";
import type { Command } from "./Command";
import {
  commandNotFound,
  commandSyntaxFail,
  getChatAugments,
  noPerm,
  sendCallback,
} from "./utils";
import { PlayerLog } from "../../database/PlayerLog";

/**
 * An array of all active commands
 */
export const COMMANDS: Command<any>[] = [];

/**
 * Players Command Cooldowns
 */
export const commandCooldowns = new PlayerLog<{ [key: string]: number }>();

export interface ChatEventDetails {
  message: string;
  sendToTargets: boolean;
  sender: Player;
  targets: Player[];
}

world.beforeEvents.chatSend.subscribe((data) => {
  if (!data.message.startsWith(PREFIX)) return; // This is not a command
  data.cancel = true;
  const args = getChatAugments(data.message, PREFIX);
  const command = COMMANDS.find(
    (c) =>
      c.depth == 0 &&
      (c.data.name == args[0] || c.data?.aliases?.includes(args[0]))
  );
  const event: ChatEventDetails = {
    message: data.message,
    sendToTargets: data.sendToTargets,
    sender: data.sender,
    targets: data.getTargets(),
  };
  if (!command) return commandNotFound(data.sender, args[0]);
  if (!command.data?.requires?.(data.sender))
    return noPerm(event.sender, command);
  if (command.data?.cooldown) {
    const cooldownData = commandCooldowns.get(data.sender) ?? {};
    if (Object.keys(cooldownData).length == 0) {
      cooldownData[command.data.name] = Date.now();
      commandCooldowns.set(data.sender, cooldownData);
    } else {
      if (
        Date.now() - cooldownData[command.data.name] <
        command.data.cooldown
      ) {
        const seconds = Math.abs(
          Math.ceil(
            (Date.now() -
              (cooldownData[command.data.name] + command.data.cooldown)) /
              1000
          )
        );
        return data.sender.sendMessage({
          translate: "commands.default.cooldown",
          with: [command.data.name, seconds.toString()],
        });
      }
    }
  }
  args.shift(); // Remove first command so we can look at args
  // Check Args/SubCommands for errors
  const verifiedCommands: Command[] = [];
  const getArg = (start: Command<any>, i: number): string | undefined => {
    if (start.children.length > 0) {
      const arg = start.children.find((v) => v.type?.matches(args[i]).success);
      if (!arg && !args[i] && start.callback) return undefined;
      if (!arg)
        return commandSyntaxFail(event.sender, command, start, args, i), "fail";
      if (!arg.data?.requires?.(event.sender))
        return noPerm(event.sender, arg), "fail";
      verifiedCommands.push(arg);
      return getArg(arg, i + 1);
    }
  };
  let v = getArg(command, 0);
  if (v == "fail") return;
  system.run(() => {
    sendCallback(args, verifiedCommands, event, command);
  });
});
