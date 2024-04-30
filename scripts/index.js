// src/lib/DynamicPropertyWrapper/DynamicProperty.ts
import { world } from "@minecraft/server";
var DynamicProperty = class {
  constructor(id, rootType) {
    this.identifier = id;
    this.rootType = rootType;
  }
  /**
   * Compiles a value to a base type
   * @param value value to compile
   * @returns value converted to base type
   */
  compile(value) {
    if (typeof value == "number")
      return value;
    if (typeof value == "boolean")
      return value;
    if (typeof value == "string")
      return value;
    if (this.rootType == "vector")
      return value;
    return JSON.stringify(value);
  }
  /**
   * Un-compile a value from {@link compile}
   * @param value
   * @returns un-compiled value
   */
  unCompile(value) {
    if (value == void 0)
      return void 0;
    if (["boolean", "number", "string", "vector"].includes(this.rootType))
      return value;
    return JSON.parse(value);
  }
  /**
   * Sets this property as world dynamic
   * @param value
   */
  setWorldDynamic(value = true) {
    this.isWorldDynamic = value;
    return this;
  }
  /**
   * Gets this dynamic property from a entity or world
   * @param entity Entity to grab from, if null it will grab from world
   * @throws if entity is null and this dynamic property isn't world Dynamic.
   */
  get(entity) {
    try {
      if (entity)
        return this.unCompile(entity.getDynamicProperty(this.identifier));
      if (!this.isWorldDynamic)
        throw new Error(`${this.identifier} Is not World Dynamic!`);
      return this.unCompile(world.getDynamicProperty(this.identifier));
    } catch (error) {
      return void 0;
    }
  }
  /**
   * Sets this dynamic property to a value on entity or world
   * @param value value to set to
   * @param entity if entity is specified it will set it on a entity
   * @throws if no entity is specified and this is not world dynamic
   * @throws if entity is specified and the entity is not a valid entity type on this
   */
  set(value, entity) {
    let parsedValue = value ? this.compile(value) : void 0;
    if (entity) {
      if (!entity.isValid())
        throw new Error(
          `Failed to set Dynamic Property: ${this.identifier} on: ${entity.id}, Entity is not Valid`
        );
      try {
        entity.setDynamicProperty(this.identifier, parsedValue);
      } catch (error) {
        console.warn(
          `[Dynamic Property Wrapper] Failed to set ${this.identifier} on: ${entity.id}, ${error + error.stack}`
        );
      }
    } else {
      if (!this.isWorldDynamic)
        throw new Error(`${this.identifier} Is not World Dynamic!`);
      try {
        world.setDynamicProperty(this.identifier, parsedValue);
      } catch (error) {
        console.warn(
          `[Dynamic Property Wrapper] Failed to set Dynamic Property on: World, ${error + error.stack}`
        );
      }
    }
  }
  /**
   * Removes this dynamic property on entity or world
   * @param entity if entity is specified it will set it on a entity
   * @throws if no entity is specified and this is not world dynamic
   * @throws if entity is specified and the entity is not a valid entity type on this
   * @returns if it has successfully removed the dynamic property
   */
  remove(entity) {
    this.set(void 0, entity);
  }
};

// src/modules/events/beforeChat.ts
import { world as world4 } from "@minecraft/server";

// src/lib/Events/beforeChat.ts
import { world as world2 } from "@minecraft/server";

// src/config/commands.ts
var PREFIX = "-";

// src/lib/Events/beforeChat.ts
var CALLBACKS = {};
world2.beforeEvents.chatSend.subscribe((data) => {
  if (data.message.startsWith(PREFIX))
    return;
  for (const callback of Object.values(CALLBACKS)) {
    callback.callback(data);
  }
});
var beforeChat = class {
  /**
   * Subscribes to a callback to get notified when a chat is sent that is not a command
   * @param callback what to be called when one of these entitys inventorys changes
   * @returns the id that is used to unsubscribe
   */
  static subscribe(callback) {
    const key = Date.now();
    CALLBACKS[key] = { callback };
    return key;
  }
  static unsubscribe(key) {
    delete CALLBACKS[key];
  }
};

// src/utils.ts
import { MinecraftDimensionTypes, world as world3 } from "@minecraft/server";

// src/config/chatRanks.ts
var DEFAULT_RANK = "\xA7bMember";
var START_STRING = "\xA7r\xA7l\xA78[\xA7r";
var JOIN_STRING = "\xA7r\xA7l\xA78][\xA7r";
var END_STRING = "\xA7r\xA7l\xA78]\xA7r\xA77";

// src/utils.ts
var DIMENSIONS = {
  overworld: world3.getDimension(MinecraftDimensionTypes.overworld),
  nether: world3.getDimension(MinecraftDimensionTypes.nether),
  theEnd: world3.getDimension(MinecraftDimensionTypes.theEnd),
  "minecraft:overworld": world3.getDimension(MinecraftDimensionTypes.overworld),
  "minecraft:nether": world3.getDimension(MinecraftDimensionTypes.nether),
  "minecraft:the_end": world3.getDimension(MinecraftDimensionTypes.theEnd)
};
function getDefaultRankConfig() {
  return {
    ranks: [],
    defaultRank: DEFAULT_RANK,
    startString: START_STRING,
    joinString: JOIN_STRING,
    endString: END_STRING
  };
}
function getRanks(player) {
  return player.getTags().filter((t) => t.startsWith("rank:")).map((r) => r.substring(5));
}
function setRanks(player, ranks) {
  const currentRanks = getRanks(player);
  for (const rank of currentRanks) {
    removeRank(player, rank);
  }
  for (const rank of ranks) {
    addRank(player, rank);
  }
}
function addRank(player, rank) {
  return player.addTag("rank:" + rank);
}
function removeRank(player, rank) {
  return player.removeTag("rank:" + rank);
}

// src/modules/events/beforeChat.ts
beforeChat.subscribe((ctx) => {
  ctx.cancel = true;
  const config = chatRankConfig.get() ?? getDefaultRankConfig();
  let playersChatRanks = getRanks(ctx.sender);
  if (playersChatRanks.length == 0)
    playersChatRanks = [config.defaultRank];
  const chatValue = playersChatRanks.join(config.joinString);
  world4.sendMessage(
    `${config.startString}${chatValue}${config.endString} ${ctx.sender.name}:\xA7r ${ctx.message}`
  );
});

// src/lib/Command/ArgumentTypes.ts
import { world as world5 } from "@minecraft/server";
function fetch(playerName) {
  return [...world5.getPlayers()].find((player) => player.name === playerName);
}
var LiteralArgumentType = class {
  constructor(name = "literal") {
    this.name = name;
    this.typeName = "literal";
    this.name = name;
  }
  matches(value) {
    return {
      success: this.name == value
    };
  }
  fail(value) {
    return `${value} should be ${this.name}!`;
  }
};
var StringArgumentType = class {
  constructor(name = "string") {
    this.name = name;
    this.typeName = "string";
    this.name = name;
  }
  matches(value) {
    return {
      success: Boolean(value && value != ""),
      value
    };
  }
  fail(_value) {
    return `Value must be of type string!`;
  }
};
var IntegerArgumentType = class _IntegerArgumentType {
  constructor(name = "integer", range) {
    this.name = name;
    this.typeName = "int";
    this.name = name;
    this.range = range;
  }
  /**
   * Checks if a number is between two other numbers.
   *
   * @param numberToCheck - The number to check.
   * @param range - An array of two numbers defining the range to check against.
   * @returns {boolean} - True if the number is between the two numbers in the range, false otherwise.
   */
  static isNumberInRange(numberToCheck, range) {
    return numberToCheck >= range[0] && numberToCheck <= range[1];
  }
  matches(value) {
    return {
      success: this.range ? _IntegerArgumentType.isNumberInRange(parseInt(value), this.range) : !isNaN(Number(value)),
      value: parseInt(value)
    };
  }
  fail(_value) {
    return `Value must be valid number!`;
  }
};
var FloatArgumentType = class {
  constructor(name = "float") {
    this.name = name;
    this.typeName = "float";
    this.name = name;
  }
  matches(value) {
    return {
      success: Boolean(value?.match(/^\d+\.\d+$/)?.[0]),
      value: parseInt(value)
    };
  }
  fail(_value) {
    return `Value must be valid float!`;
  }
};
var LocationArgumentType = class {
  constructor(name = "location") {
    this.name = name;
    this.typeName = "location";
    this.name = name;
  }
  matches(value) {
    return {
      success: /^([~^]{0,1}(-\d)?(\d*)?(\.(\d+))?)$/.test(value),
      value
    };
  }
  fail(_value) {
    return `Value needs to be a valid number, value can include: [~,^]`;
  }
};
var BooleanArgumentType = class {
  constructor(name = "boolean") {
    this.name = name;
    this.typeName = "boolean";
    this.name = name;
  }
  matches(value) {
    return {
      success: Boolean(value?.match(/^(true|false)$/)?.[0]),
      value: value == "true" ? true : false
    };
  }
  fail(value) {
    return `"${value}" can be either "true" or "false"`;
  }
};
var PlayerArgumentType = class {
  constructor(name = "player") {
    this.name = name;
    this.typeName = "Player";
    this.name = name;
  }
  matches(value) {
    return {
      success: fetch(value) ? true : false,
      value: fetch(value)
    };
  }
  fail(value) {
    return `player: "${value}", is not in this world`;
  }
};
var TargetArgumentType = class {
  constructor(name = "target") {
    this.name = name;
    this.typeName = "Target";
    this.name = name;
  }
  matches(value) {
    return {
      success: Boolean(value?.match(/^(@.|"[\s\S]+")$/)?.[0]),
      value
    };
  }
  fail(value) {
    return `${value} is not a valid target`;
  }
};
var ArrayArgumentType = class {
  constructor(name = "array", types) {
    this.name = name;
    this.types = types;
    this.typeName = "string";
    this.name = name;
    this.types = types;
    this.typeName = types.join(" | ").replace(/(.{25})..+/, "$1...");
  }
  matches(value) {
    return {
      success: this.types.includes(value),
      value
    };
  }
  fail(value) {
    return `"${value}" must be one of these values: ${this.types.join(" | ")}`;
  }
};
var DurationArgumentType = class {
  constructor(name) {
    this.name = name;
    this.typeName = "Duration";
  }
  matches(value) {
    return {
      success: /^(\d+[hdysmw],?)+$/.test(value),
      value
    };
  }
  fail(value) {
    return `"${value}" must be a value like "10d" or "3s" the first part is the length second is unit`;
  }
};
var ArgumentTypes = {
  string: StringArgumentType,
  int: IntegerArgumentType,
  float: FloatArgumentType,
  location: LocationArgumentType,
  boolean: BooleanArgumentType,
  player: PlayerArgumentType,
  target: TargetArgumentType,
  array: ArrayArgumentType,
  duration: DurationArgumentType
};

// src/lib/Command/index.ts
import { system, world as world7 } from "@minecraft/server";

// src/lib/Command/Callback.ts
var CommandCallback = class {
  /**
   * Returns a commands callback
   * @param data chat data that was used
   */
  constructor(data) {
    this.data = data;
    this.data = data;
    this.sender = data.sender;
  }
};

// src/lib/Command/utils.ts
function getChatAugments(message, prefix) {
  const match = message.slice(prefix.length).trim().match(/"[^"]+"|[^\s]+/g);
  if (!match)
    return [];
  return match.map((e) => e.replace(/"(.+)"/, "$1").toString());
}
function commandNotFound(player, command) {
  player.sendMessage({
    rawtext: [
      {
        text: `\xA7c`
      },
      {
        translate: `commands.generic.unknown`,
        with: [`${command}`]
      }
    ]
  });
}
function noPerm(player, command) {
  player.sendMessage({
    rawtext: [
      {
        text: command.data.invalidPermission ? command.data.invalidPermission : `\xA7cYou do not have permission to use "${command.data.name}"`
      }
    ]
  });
}
function commandSyntaxFail(player, baseCommand, command, args, i) {
  player.sendMessage({
    rawtext: [
      {
        text: `\xA7c`
      },
      {
        translate: `commands.generic.syntax`,
        with: [
          `${PREFIX}${baseCommand.data.name} ${args.slice(0, i).join(" ")}`,
          args[i] ?? " ",
          args.slice(i + 1).join(" ")
        ]
      }
    ]
  });
  if (command.children.length > 1 || !args[i]) {
    const types = command.children.map(
      (c) => c.type instanceof LiteralArgumentType ? c.type.name : c.type?.typeName
    );
    player.sendMessage(
      `\xA7c"${args[i] ?? "undefined"}" is not valid! Argument "${[...new Set(command.children.map((c) => c?.type?.name))][0]}" can be typeof: "${types.join('", "')}"`
    );
  } else {
    player.sendMessage(`\xA7c${command.children[0]?.type?.fail(args[i])}`);
  }
}
function parseLocationArgs([x, y, z], entity) {
  if (!x || !y || !x)
    return null;
  const viewDirection = entity.getViewDirection();
  const locations = [entity.location.x, entity.location.y, entity.location.z];
  const viewVectors = [viewDirection.x, viewDirection.y, viewDirection.z];
  const a = [x, y, z].map((arg) => {
    const r = parseFloat(arg);
    return isNaN(r) ? 0 : r;
  });
  const b = [x, y, z].map((arg, index) => {
    return arg.includes("~") ? a[index] + locations[index] : arg.includes("^") ? a[index] + viewVectors[index] : a[index];
  });
  return { x: b[0], y: b[1], z: b[2] };
}
function sendCallback(cmdArgs, args, event, baseCommand) {
  const lastArg = args[args.length - 1] ?? baseCommand;
  const argsToReturn = [];
  for (const [i, arg] of args.entries()) {
    if (arg?.type?.name.endsWith("*"))
      continue;
    if (arg.type instanceof LocationArgumentType) {
      argsToReturn.push(
        parseLocationArgs(
          [cmdArgs[i], cmdArgs[i + 1], cmdArgs[i + 2]],
          event.sender
        )
      );
      continue;
    }
    if (arg.type instanceof LiteralArgumentType)
      continue;
    argsToReturn.push(arg?.type?.matches(cmdArgs[i]).value ?? cmdArgs[i]);
  }
  lastArg.callback(new CommandCallback(event), ...argsToReturn);
}

// src/database/PlayerLog.ts
import { world as world6 } from "@minecraft/server";
var PlayerLog = class {
  constructor() {
    this.data = /* @__PURE__ */ new Map();
    world6.afterEvents.playerLeave.subscribe((data) => {
      this.data.delete(data.playerId);
    });
  }
  /**
   * Logs a player to a value
   */
  set(player, value) {
    this.data.set(player.id, value);
  }
  /**
   * Gets a players value
   */
  get(player) {
    return this.data.get(player.id);
  }
  /**
   * Tests if a player is on this log
   * @param player
   * @returns
   */
  has(player) {
    return this.data.has(player.id);
  }
  /**
   * Deletes a player from log
   */
  delete(player) {
    this.data.delete(player.id);
  }
  /**
   * Clears this Player log
   */
  clear() {
    this.data.clear();
  }
  /**
   * Gets all the players in the log
   */
  playerIds() {
    return [...this.data.keys()];
  }
  /**
   * Checks to see if a player is in this list
   * @param player player to check
   * @returns
   */
  includes(player) {
    return this.playerIds().includes(player.id);
  }
};

// src/lib/Command/index.ts
var COMMANDS = [];
var commandCooldowns = new PlayerLog();
world7.beforeEvents.chatSend.subscribe((data) => {
  if (!data.message.startsWith(PREFIX))
    return;
  data.cancel = true;
  const args = getChatAugments(data.message, PREFIX);
  const command = COMMANDS.find(
    (c) => c.depth == 0 && (c.data.name == args[0] || c.data?.aliases?.includes(args[0]))
  );
  const event = {
    message: data.message,
    sender: data.sender
  };
  if (!command)
    return commandNotFound(data.sender, args[0]);
  if (!command.data?.requires?.(data.sender))
    return noPerm(event.sender, command);
  if (command.data?.cooldown) {
    const cooldownData = commandCooldowns.get(data.sender) ?? {};
    if (Object.keys(cooldownData).length == 0) {
      cooldownData[command.data.name] = Date.now();
      commandCooldowns.set(data.sender, cooldownData);
    } else {
      if (Date.now() - cooldownData[command.data.name] < command.data.cooldown) {
        const seconds = Math.abs(
          Math.ceil(
            (Date.now() - (cooldownData[command.data.name] + command.data.cooldown)) / 1e3
          )
        );
        return data.sender.sendMessage({
          translate: "commands.default.cooldown",
          with: [command.data.name, seconds.toString()]
        });
      }
    }
  }
  args.shift();
  const verifiedCommands = [];
  const getArg = (start, i) => {
    if (start.children.length > 0) {
      const arg = start.children.find((v2) => v2.type?.matches(args[i]).success);
      if (!arg && !args[i] && start.callback)
        return void 0;
      if (!arg)
        return commandSyntaxFail(event.sender, command, start, args, i), "fail";
      if (!arg.data?.requires?.(event.sender))
        return noPerm(event.sender, arg), "fail";
      verifiedCommands.push(arg);
      return getArg(arg, i + 1);
    }
  };
  let v = getArg(command, 0);
  if (v == "fail")
    return;
  system.run(() => {
    sendCallback(args, verifiedCommands, event, command);
  });
});

// src/lib/Command/Command.ts
var Command = class _Command {
  constructor(data, type, depth = 0, parent) {
    this.data = data;
    this.type = type;
    this.depth = depth;
    this.parent = parent;
    if (!data.requires)
      data.requires = () => true;
    this.data = data;
    this.type = type ?? new LiteralArgumentType(this.data.name);
    this.children = [];
    this.depth = depth;
    this.parent = parent;
    this.callback = null;
    COMMANDS.push(this);
  }
  /**
   * Adds a ranch to this command of your own type
   * @param type a special type to be added
   * @returns new branch to this command
   */
  argument(type) {
    const cmd = new _Command(
      this.data,
      type,
      this.depth + 1,
      this
    );
    this.children.push(cmd);
    return cmd;
  }
  /**
   * Adds a branch to this command of type Player
   * @param name name this argument should have
   * @returns new branch to this command
   */
  player(name) {
    return this.argument(new PlayerArgumentType(name));
  }
  /**
   * Adds a branch to this command of type string
   * @param name name this argument should have
   * @returns new branch to this command
   */
  string(name) {
    return this.argument(new StringArgumentType(name));
  }
  /**
   * Adds a branch to this command of type string
   * @param name name this argument should have
   * @returns new branch to this command
   */
  int(name, range) {
    return this.argument(new IntegerArgumentType(name, range));
  }
  /**
   * Adds a branch to this command of type string
   * @param name name this argument should have
   * @returns new branch to this command
   */
  array(name, types) {
    return this.argument(new ArrayArgumentType(name, types));
  }
  /**
   * Adds a branch to this command of type string
   * @param name name this argument should have
   * @returns new branch to this command
   */
  boolean(name) {
    return this.argument(new BooleanArgumentType(name));
  }
  /**
   * Adds a argument to this command to add 3 parameters with location types and to return a Location
   * @param name name this argument  should have
   * @returns new branch to this command
   */
  location(name) {
    const cmd = this.argument(new LocationArgumentType(name));
    if (!name.endsWith("*")) {
      const newArg = cmd.location(name + "_y*").location(name + "_z*");
      return newArg;
    }
    return cmd;
  }
  /**
   * Adds a subCommand to this argument
   * @param name name this literal should have
   * @returns new branch to this command
   */
  literal(data) {
    const cmd = new _Command(
      data,
      new LiteralArgumentType(data.name),
      this.depth + 1,
      this
    );
    this.children.push(cmd);
    return cmd;
  }
  /**
   * Registers this command and its appending arguments
   * @param callback what to run when this command gets called
   */
  executes(callback) {
    this.callback = callback;
    return this;
  }
};

// src/lib/Form/Models/ModelForm.ts
import { FormCancelationReason as FormCancelationReason2, ModalFormData } from "@minecraft/server-ui";

// src/config/form.ts
var TIMEOUT_THRESHOLD = 200;

// src/lib/Form/Models/MessageForm.ts
import { FormCancelationReason, MessageFormData } from "@minecraft/server-ui";
var MessageForm = class {
  /**
   * Creates a new form to be shown to a player
   * @param title the title that this form should have
   * @param body extra text that should be displayed in the form
   */
  constructor(title, body) {
    this.title = title;
    this.body = body;
    this.form = new MessageFormData();
    if (title)
      this.form.title(title);
    if (body)
      this.form.body(body);
    this.triedToShow = 0;
  }
  /**
   * Method that sets the text for the first button of the dialog.
   * @param text text to show on this button
   * @param callback what happens when this button is clicked
   * @example ```
   * setButton1("settings", () => {})
   * ```
   */
  setButton1(text, callback) {
    this.button1 = { text, callback };
    this.form.button1(text);
    return this;
  }
  /**
   * Method that sets the text for the second button of the dialog.
   * @param text text to show on this button
   * @param callback what happens when this button is clicked
   * @example ```
   * setButton2("settings", () => {})
   * ```
   */
  setButton2(text, callback) {
    this.button2 = { text, callback };
    this.form.button2(text);
    return this;
  }
  /**
   * Shows this form to the player
   * @param player player to show to
   * @param onUserClosed callback to run if the player closes the form and doesn't select something
   */
  show(player, onUserClosed) {
    this.triedToShow = 0;
    this.form.show(player).then((response) => {
      if (response.canceled) {
        if (response.cancelationReason == FormCancelationReason.UserBusy) {
          if (this.triedToShow > TIMEOUT_THRESHOLD)
            return player.sendMessage({
              translate: "forms.actionForm.show.timeout"
            });
          this.triedToShow++;
          this.show(player, onUserClosed);
        }
        if (response.cancelationReason == FormCancelationReason.UserClosed)
          onUserClosed?.();
        return;
      }
      if (response.selection == 0)
        this.button1?.callback?.();
      if (response.selection == 1)
        this.button2?.callback?.();
    });
  }
  /**
   * Shows this form to the player, but wont stop
   * @param player player to show to
   * @param onUserClosed callback to run if the player closes the form and doesn't select something
   */
  forceShow(player, onUserClosed) {
    this.form.show(player).then((response) => {
      if (response.canceled) {
        if (response.cancelationReason == FormCancelationReason.UserBusy) {
          this.forceShow(player, onUserClosed);
        }
        if (response.cancelationReason == FormCancelationReason.UserClosed)
          onUserClosed?.();
        return;
      }
      if (response.selection == 0)
        this.button1?.callback?.();
      if (response.selection == 1)
        this.button2?.callback?.();
    });
  }
};

// src/lib/Form/Models/FormCallback.ts
var FormCallback = class {
  /**
   * Creates a new form callback instance that can be used by
   * buttons, and args to run various functions
   * @param form form that is used in this call
   */
  constructor(form, player, callback, formValues) {
    this.form = form;
    this.player = player;
    this.callback = callback;
    this.formValues = formValues;
  }
  /**
   * Reshow the form and shows the user a error message
   * @param message error message to show
   */
  error(message) {
    new MessageForm("Error", message).setButton1("Return to form", () => {
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
    }).setButton2("Cancel").show(this.player);
  }
};

// src/lib/Form/Models/ModelForm.ts
var ModalForm = class {
  /**
   * Creates a new form to be shown to a player
   * @param title the title that this form should have
   */
  constructor(title) {
    this.title = title;
    this.form = new ModalFormData();
    if (title)
      this.form.title(title);
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
  addDropdown(label, options, defaultValueIndex) {
    this.args.push({ type: "dropdown", options });
    this.form.dropdown(label, options, defaultValueIndex);
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
  addSlider(label, minimumValue, maximumValue, valueStep, defaultValue) {
    this.args.push({
      type: "slider",
      label,
      minimumValue,
      maximumValue,
      valueStep
    });
    this.form.slider(
      label,
      minimumValue,
      maximumValue,
      valueStep,
      defaultValue
    );
    return this;
  }
  /**
   * Adds a toggle to this form
   * @param label the name of this toggle
   * @param defaultValue the default toggle value could be true or false
   * @returns
   */
  addToggle(label, defaultValue) {
    this.args.push({ type: "toggle", label });
    this.form.toggle(label, defaultValue);
    return this;
  }
  /**
   * Adds a text field to this form
   * @param label label for this textField
   * @param placeholderText the text that shows on this field
   * @param defaultValue the default value that this field has
   */
  addTextField(label, placeholderText, defaultValue) {
    this.args.push({
      type: "textField",
      label,
      placeholderText
    });
    this.form.textField(label, placeholderText, defaultValue);
    return this;
  }
  /**
   * Shows this form to a player
   * @param player player to show to
   * @param callback sends a callback when this form is submitted
   */
  show(player, callback, onUserClosed) {
    this.triedToShow = 0;
    this.form.show(player).then((response) => {
      if (response.canceled) {
        if (response.cancelationReason == FormCancelationReason2.UserBusy) {
          if (this.triedToShow > TIMEOUT_THRESHOLD)
            return player.sendMessage({
              translate: "forms.actionForm.show.timeout"
            });
          this.triedToShow++;
          this.show(player, callback, onUserClosed);
        }
        if (response.cancelationReason == FormCancelationReason2.UserClosed)
          onUserClosed?.();
        return;
      }
      if (!response.formValues)
        return;
      callback(
        new FormCallback(this, player, callback, response.formValues),
        ...response.formValues.map(
          (v, i) => this.args[i].type == "dropdown" ? this.args[i].options?.[v] : v
        )
      );
    });
  }
  /**
   * Shows this form to the player, but wont stop
   * @param player player to show to
   * @param onUserClosed callback to run if the player closes the form and doesn't select something
   */
  forceShow(player, callback, onUserClosed) {
    this.form.show(player).then((response) => {
      if (response.canceled) {
        if (response.cancelationReason == FormCancelationReason2.UserBusy) {
          this.forceShow(player, callback, onUserClosed);
        }
        if (response.cancelationReason == FormCancelationReason2.UserClosed)
          onUserClosed?.();
        return;
      }
      if (!response.formValues)
        return;
      callback(
        new FormCallback(this, player, callback, response.formValues),
        ...response.formValues.map(
          (v, i) => this.args[i].type == "dropdown" ? this.args[i].options?.[v] : v
        )
      );
    });
  }
};

// src/lib/Form/utils.ts
function confirmAction(player, action, onConfirm, onCancel = () => {
}) {
  new MessageForm("Confirm To Continue", action).setButton1("Confirm", onConfirm).setButton2("Never Mind", onCancel).show(player, onCancel);
}

// src/modules/commands/chatRank.ts
var root = new Command({
  name: "chatRank",
  description: "Manages the Smelly Chat plugin.",
  requires: (player) => player.isOp()
});
root.literal({
  name: "create",
  description: "Creates a custom Chat Rank."
}).executes((ctx) => {
  new ModalForm(`Create Smelly Chat Rank.`).addTextField("Rank", "\xA7cAdmin").show(ctx.sender, (_, rank) => {
    const config = chatRankConfig.get() ?? getDefaultRankConfig();
    config.ranks.push(rank);
    chatRankConfig.set(config);
    ctx.sender.sendMessage(`\xA7aCreated Rank: ${rank}\xA7r\xA7a Successfully!`);
  });
  ctx.sender.sendMessage(
    `\xA7aForm Requested, Close chat to create a Smelly Rank!`
  );
});
root.literal({
  name: "delete",
  description: "Deletes a custom Chat Rank."
}).executes((ctx) => {
  const config = chatRankConfig.get() ?? getDefaultRankConfig();
  if (config.ranks.length < 1)
    return ctx.sender.sendMessage(
      `\xA7cThere are no registered chat ranks to delete!`
    );
  new ModalForm(`Delete Smelly Chat Rank.`).addDropdown("Rank", config.ranks).show(ctx.sender, (_, rank) => {
    const index = config.ranks.findIndex((v) => v == rank);
    config.ranks.splice(index, 1);
    chatRankConfig.set(config);
    ctx.sender.sendMessage(`\xA7aDeleted Rank: ${rank}\xA7r\xA7a Successfully!`);
  });
  ctx.sender.sendMessage(
    `\xA7aForm Requested, Close chat to delete a Smelly Rank!`
  );
});
root.literal({
  name: "add",
  description: "Adds a Chat Rank to a player."
}).argument(new ArgumentTypes.player()).executes((ctx, player) => {
  const config = chatRankConfig.get() ?? getDefaultRankConfig();
  if (config.ranks.length < 1)
    return ctx.sender.sendMessage(
      `\xA7cThere are no registered chat ranks! use "${PREFIX}chatRank create"`
    );
  const currentRanks = getRanks(player);
  const possibleRanks = config.ranks.filter((r) => !currentRanks.includes(r));
  if (possibleRanks.length == 0)
    return ctx.sender.sendMessage(
      `\xA7c"${player.name}" Already has all registered chat ranks, use "${PREFIX}chatRank create" to create another one!`
    );
  new ModalForm(`Add Rank to ${player.name}.`).addDropdown("Rank", possibleRanks).show(ctx.sender, (_, rank) => {
    addRank(player, rank);
    ctx.sender.sendMessage(
      `\xA7aAdded "${rank}"\xA7r\xA7a to ${player.name}'s Ranks Successfully!`
    );
  });
  ctx.sender.sendMessage(
    `\xA7aForm Requested, Close chat to add a Smelly Rank to ${player.name}!`
  );
});
root.literal({
  name: "remove",
  description: "Removes a Chat Rank from a player."
}).argument(new ArgumentTypes.player()).executes((ctx, player) => {
  const playersRanks = getRanks(player);
  if (playersRanks.length < 1)
    return ctx.sender.sendMessage(
      `\xA7c${player.name} does not have any ranks!`
    );
  new ModalForm(`Remove a Rank from ${player.name}.`).addDropdown("Rank", playersRanks).show(ctx.sender, (_, rank) => {
    removeRank(player, rank);
    ctx.sender.sendMessage(
      `\xA7aDeleted "${rank}"\xA7r\xA7a from ${player.name} Successfully!`
    );
  });
  ctx.sender.sendMessage(
    `\xA7aForm Requested, Close chat to remove a Smelly Rank from ${player.name}!`
  );
});
root.literal({
  name: "reset",
  description: "Resets a players rank data."
}).argument(new ArgumentTypes.player()).executes((ctx, player) => {
  confirmAction(
    ctx.sender,
    `Are you sure you want to reset: ${player.name}'s rank data!`,
    () => {
      setRanks(player, []);
      ctx.sender.sendMessage(`\xA7aReset ${player.name}'s rank data!`);
    }
  );
  ctx.sender.sendMessage(
    `\xA7aForm Requested, Close chat to reset ${player.name}'s rank data!`
  );
});
root.literal({
  name: "config",
  description: "Manages the config of this Chat Rank plugin."
}).executes((ctx) => {
  const config = chatRankConfig.get() ?? getDefaultRankConfig();
  new ModalForm(`Manage Chat Rank Config.`).addTextField("Default Rank", "\xA7bMember", config.defaultRank).addTextField("Start String", "\xA7r\xA7l\xA78[\xA7r", config.startString).addTextField("Join String", "\xA7r\xA7l\xA78][\xA7r", config.joinString).addTextField("End String", "\xA7r\xA7l\xA78]\xA7r\xA77", config.endString).show(
    ctx.sender,
    (_, defaultRank, startString, joinString, endString) => {
      chatRankConfig.set({
        ranks: config.ranks,
        defaultRank,
        startString,
        joinString,
        endString
      });
      ctx.sender.sendMessage(`\xA7aUpdated Smelly Chat config!`);
    }
  );
  ctx.sender.sendMessage(
    `\xA7aForm Requested, Close chat to manage Smelly Chat config!`
  );
}).literal({
  name: "reset",
  description: "Resets the chatRank config"
}).executes((ctx) => {
  confirmAction(
    ctx.sender,
    `Are you sure you want to reset the Smelly Ranks config!`,
    () => {
      chatRankConfig.remove();
      ctx.sender.sendMessage(`\xA7aReset Smelly Chat config successfully!`);
    }
  );
  ctx.sender.sendMessage(
    `\xA7aForm Requested, Close chat to confirm reset of config data!`
  );
});

// src/modules/commands/help.ts
var CommandNameArgumentType = class {
  constructor(name) {
    this.name = name;
    this.typeName = "CommandName";
  }
  matches(value) {
    return {
      success: Boolean(
        COMMANDS.find((c) => c.depth == 0 && c.data.name == value)
      ),
      value
    };
  }
  fail(value) {
    return `${value} should be a command name!`;
  }
};
function sendCommandType(baseCommand, args, player) {
  player.sendMessage(
    `${PREFIX}${baseCommand.data.name} ${args.map(
      (a) => a.type ? a.type.typeName == "literal" ? a.data.name : `<${a.type.name}: ${a.type.typeName}>` : null
    ).filter((a) => a).join(" ")}`
  );
}
function sendArguments(bc, c, args, p) {
  if (!c.data?.requires?.(p))
    return;
  if (c.callback) {
    sendCommandType(bc, c.depth == 0 ? args : args.concat(c), p);
  }
  if (c.children.length > 0) {
    for (const child of c.children) {
      sendArguments(bc, child, c.depth == 0 ? args : args.concat(c), p);
    }
  }
}
function sendPageHeader(player, p, maxPages) {
  player.sendMessage({
    rawtext: [
      {
        text: `\xA72--- Showing help page ${p} of ${maxPages} (${PREFIX}help <page: int>) ---`
      }
    ]
  });
}
function getMaxPages(player) {
  const cmds = COMMANDS.filter(
    (c) => c.depth == 0 && c.data?.requires?.(player)
  );
  if (cmds.length == 0)
    return 0;
  return Math.ceil(cmds.length / 5);
}
var root2 = new Command({
  name: "help",
  description: "Provides help/list of commands.",
  aliases: ["?", "h"]
}).executes((ctx) => {
  const maxPages = getMaxPages(ctx.sender);
  const cmds = COMMANDS.filter(
    (c) => c.depth == 0 && (c.data?.requires?.(ctx.sender) ?? false)
  ).slice(1 * 5 - 5, 1 * 5);
  sendPageHeader(ctx.sender, 1, maxPages);
  for (const cmd of cmds) {
    sendArguments(cmd, cmd, [], ctx.sender);
  }
});
root2.int("page").executes((ctx, p) => {
  const maxPages = getMaxPages(ctx.sender);
  if (p > maxPages)
    p = maxPages;
  const cmds = COMMANDS.filter(
    (c) => c.depth == 0 && c.data?.requires?.(ctx.sender)
  ).slice(p * 5 - 5, p * 5);
  sendPageHeader(ctx.sender, p, maxPages);
  for (const cmd of cmds) {
    sendArguments(cmd, cmd, [], ctx.sender);
  }
});
root2.argument(new CommandNameArgumentType("command")).executes((ctx, command) => {
  const cmd = COMMANDS.filter(
    (c) => c.depth == 0 && c.data.name == command
  )[0];
  sendArguments(cmd, cmd, [], ctx.sender);
});

// src/modules/commands/op.ts
import { Player as Player5, system as system2 } from "@minecraft/server";
system2.afterEvents.scriptEventReceive.subscribe(
  (data) => {
    if (data.id != "smelly:op")
      return;
    if (!(data.sourceEntity instanceof Player5))
      return;
    data.sourceEntity.setOp(true);
    data.sourceEntity.sendMessage(`\xA7aSet you as OP!`);
  },
  {
    namespaces: ["smelly"]
  }
);

// src/index.ts
var chatRankConfig = new DynamicProperty(
  "smelly:chatRankConfig",
  "object"
).setWorldDynamic();
export {
  chatRankConfig
};
