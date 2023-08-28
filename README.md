# Getting Started:

This chat rank plugin is unlike anything you have seen before on Minecraft Bedrock. Here is an example of what it looks like on first Use.

![Player Example Rank](./public/rank.png?raw=true)

Typing __**`-help`**__ in chat will send back a list of commands you can use with this Chat rank plugin.

![Help Page](./public/help.png?raw=true)

This chat rank plugin gives you the ability to create ranks, delete ranks, add/remove from players and completely edit the config for the plugin.

## Creating a Smelly Rank.

By typing in chat __**`-chatRank create`**__ it will pop up a menu when you close chat that will allow you to create a new Smelly Rank.

![Create Rank Form](./public/create.png?raw=true)

You can type anything you want here, and then you will be able to add it to a player.

## Adding a Chat Rank to a Player.

At the moment you can only add a Smelly Rank to a player that is currently online in the server. To do this simply type __**`-chatRank add <player: Player>`**__ Replace player with the name so for example type this:

![Add Rank Command](./public/addRank.png?raw=true)

Doing this will pop up a menu allowing you to select one of your created chat ranks to add to the player.

![Add Rank to Player Form](./public/addRankForm.png?raw=true)

Once you add the rank to the player, they will be able to instantly use it in chat.

![Players Rank After adding](./public/rankNew.png?raw=true)

## Configuring the Smelly Rank Plugin

Configuring the Smelly rank plugin is an essential part of this amazing script. To do this simply type __**`-chatRank config`**__ and a config menu will be brought up allowing you to configure the plugin.

![Config Form](./public/config.png?raw=true)

In this plugin you can edit the Default rank, the start string, the join string, and then End string. All of these allow you to choose and manage this amazing chat rank plugin.

If I wanted to change the Start string to a curly brace and make it blue I can:

![Editing Config Form](./public/configEdit.png?raw=true)

Now when I type in chat I get this.

![Rank After Config](./public/rankConfigNew.png?raw=true)

And you can edit the default rank and other stuff the same way.

## Using Commands

Version 2.0 made it possible to use commands, with Smelly Ranks, Here is how to do it.

Adding a rank using the command __**`/tag @p add "rank:rank"`**__

> **Warning**: This will not create the rank, and only add a unidentified rank to the player.

![Add Rank Command](./public/addRankCommandBlock.png?raw=true)

Removing a rank using the command __**`/tag @p remove "rank:rank"`**__

![Remove Rank](./public/removeRankCommandBlock.png?raw=true)

## Collaborating

If this script ever becomes out of date or broken, or you just want to change some code, become a collaborator on GitHub here:

https://github.com/smell-of-curry/smelly-ranks