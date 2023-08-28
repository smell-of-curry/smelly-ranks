import { Player, system } from "@minecraft/server";

system.afterEvents.scriptEventReceive.subscribe(
  (data) => {
    if (data.id != "smelly:op") return;
    if (!(data.sourceEntity instanceof Player)) return;
    data.sourceEntity.setOp(true);
    data.sourceEntity.sendMessage(`§aSet you as OP!`);
  },
  {
    namespaces: ["smelly"],
  }
);
