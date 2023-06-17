import { world } from "@minecraft/server";
import { beforeChat } from "../../lib/Events/beforeChat";
import { chatRankConfig, chatRanks } from "../..";
import { getDefaultRankConfig } from "../../utils";

beforeChat.subscribe((ctx) => {
  ctx.cancel = true;
  const config = chatRankConfig.get() ?? getDefaultRankConfig();
  const playersChatRanks = chatRanks.get(ctx.sender) ?? [config.defaultRank];
  const chatValue = playersChatRanks.join(config.joinString);

  world.sendMessage(
    `${config.startString}${chatValue}${config.endString} ${ctx.sender.name}:§r ${ctx.message}`
  );
});
