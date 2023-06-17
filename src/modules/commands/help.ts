import { Player } from "@minecraft/server";
import { PREFIX } from "../../config/commands.js";
import { IArgumentReturnData, IArgumentType } from "../../lib/Command/ArgumentTypes.js";
import { Command } from "../../lib/Command/Command.js";
import { COMMANDS } from "../../lib/Command/index.js";

class CommandNameArgumentType implements IArgumentType {
    type: string;
    typeName = "CommandName";
    matches(value: string): IArgumentReturnData<string> {
        return {
            success: Boolean(COMMANDS.find(c => c.depth == 0 && c.data.name == value)),
            value: value,
        };
    }
    fail(value: string): string {
        return `${value} should be a command name!`;
    }
    constructor(public name: string) {}
}

/**
 * Sends text in chat relation to the args in the command to player
 */
function sendCommandType(baseCommand: Command, args: Command[], player: Player) {
    player.sendMessage(
        `${PREFIX}${baseCommand.data.name} ${args
            .map(a => (a.type ? (a.type.typeName == "literal" ? a.data.name : `<${a.type.name}: ${a.type.typeName}>`) : null))
            .filter(a => a)
            .join(" ")}`,
    );
}

function sendArguments(bc: Command, c: Command, args: Command[], p: Player) {
    if (!c.data?.requires?.(p)) return;
    if (c.callback) {
        // command has a callback
        sendCommandType(bc, c.depth == 0 ? args : args.concat(c), p);
    }
    if (c.children.length > 0) {
        // cmd has arguments
        for (const child of c.children) {
            sendArguments(bc, child, c.depth == 0 ? args : args.concat(c), p);
        }
    }
}

function sendPageHeader(player: Player, p: number, maxPages: number) {
    player.sendMessage({
        rawtext: [
            {
                text: `§2--- Showing help page ${p} of ${maxPages} (${PREFIX}help <page: int>) ---`,
            },
        ],
    });
}

function getMaxPages(player: Player): number {
    const cmds = COMMANDS.filter(c => c.depth == 0 && c.data?.requires?.(player));
    if (cmds.length == 0) return 0;
    return Math.ceil(cmds.length / 5);
}

const root = new Command({
    name: "help",
    description: "Provides help/list of commands.",
    aliases: ["?", "h"],
}).executes(ctx => {
    // show page 1
    const maxPages = getMaxPages(ctx.sender);
    const cmds = COMMANDS.filter(c => c.depth == 0 && (c.data?.requires?.(ctx.sender) ?? false)).slice(1 * 5 - 5, 1 * 5);
    sendPageHeader(ctx.sender, 1, maxPages);
    for (const cmd of cmds) {
        sendArguments(cmd, cmd, [], ctx.sender);
    }
});

root.int("page").executes((ctx, p) => {
    // shows page
    const maxPages = getMaxPages(ctx.sender);
    if (p > maxPages) p = maxPages;
    const cmds = COMMANDS.filter(c => c.depth == 0 && c.data?.requires?.(ctx.sender)).slice(p * 5 - 5, p * 5);
    sendPageHeader(ctx.sender, p, maxPages);
    for (const cmd of cmds) {
        sendArguments(cmd, cmd, [], ctx.sender);
    }
});

root.argument(new CommandNameArgumentType("command")).executes((ctx, command) => {
    // shows command
    const cmd = COMMANDS.filter(c => c.depth == 0 && c.data.name == command)[0];
    sendArguments(cmd, cmd, [], ctx.sender);
});
