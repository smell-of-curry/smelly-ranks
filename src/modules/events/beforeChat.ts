import { world } from "@minecraft/server";
import { beforeChat } from "../../lib/Events/beforeChat";
import { chatRankConfig } from "../..";
import { getDefaultRankConfig, getRanks } from "../../utils";

beforeChat.subscribe((ctx) => {
  ctx.cancel = true;
  const config = chatRankConfig.get() ?? getDefaultRankConfig();
  let playersChatRanks = getRanks(ctx.sender);
  if (playersChatRanks.length == 0) playersChatRanks = [config.defaultRank];
  const chatValue = playersChatRanks.join(config.joinString);

  world.sendMessage(
    `${config.startString}${chatValue}${config.endString} ${ctx.sender.name}:§r ${ctx.message}`
  );
});
