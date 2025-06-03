
// OPTIMIZED: Performance enhancements applied
//party commands
import settings from "../config"
import party from "../utils/partyUtil";
import { autocomplete, registerWhen } from "../utils/helperUtil";
import { onChatPacket } from "../../BloomCore/utils/Events";
import { prefix, prefixNoFormat } from "../index"

let lastPingAt = -1
let requestedPing = false
let requestedTPS = false
let prevTime = null
let downtimeUser = ""
let downtimeReason = ""
let bossKilled = false
const S37PacketStatistics = Java.type('net.minecraft.network.play.server.S37PacketStatistics')
const C16PacketClientStatus = Java.type('net.minecraft.network.play.client.C16PacketClientStatus')
const S03_PACKET_TIME_UPDATE = Java.type('net.minecraft.network.play.server.S03PacketTimeUpdate')
const System = Java.type('java.lang.System')
const blacklistValeus = ["0", "1"]
const line = "&m-".repeat(ChatLib.getChatWidth() / 6);
let blacklist = JSON.parse(FileLib.read("AzaAddons", "userdata/blacklist.json")) || [];

function reinstance() {
    msg = new Message(new TextComponent(`&r&9${line}\n${prefix} &aClick here to re-instance\n&r&9${line}`).setClick("run_command", `/instancerequeue`).setHover("show_text", `&aClick here to Requeue!`))
    msg.chat()
}

function addToBlacklist(username, level) {
    if (level < 0 || level > 1 || level == undefined) {
        ChatLib.chat(`${prefix} &cInvalid blacklist level. \n&cMust be 0 (full) or 1 (partial).`);
        return
    }
    ChatLib.chat(`${prefix} &aAdded &5&l${username}&a to blacklist`);
    blacklist = blacklist.filter((a) => { return a.username !== username.toLowerCase() })
    blacklist.push({
        username: username.toLowerCase(),
        level: level,
    })
    FileLib.write("AzaAddons", "userdata/blacklist.json", JSON.stringify(blacklist));
}
function removeFromBlacklist(username) {
    ChatLib.chat(`${prefix} &cRemoved &5&l${username}&c from blacklist`);
    blacklist = blacklist.filter((a) => { return a.username !== username.toLowerCase() })
    FileLib.write("AzaAddons", "userdata/blacklist.json", JSON.stringify(blacklist));
}
function checkBlacklist(username) {
    let a = "2"
    blacklist.forEach(user => {
        if (user.username === username) {
            a = user.level;
        }
    })
    return a
}
const numbersToText = new Map([
    ['0', 'entrance'],
    ['1', 'floor_one'],
    ['2', 'floor_two'],
    ['3', 'floor_three'],
    ['4', 'floor_four'],
    ['5', 'floor_five'],
    ['6', 'floor_six'],
    ['7', 'floor_seven'],
])
const kuudraToText = new Map([
    ['1', 'normal'],
    ['2', 'hot'],
    ['3', 'burning'],
    ['4', 'fiery'],
    ['5', 'infernal'],
])

// Generic function to handle party commands
function handlePartyCommand(player, cmd, enabled, blacklistSetting, mfaSetting, blacklistLevel) {
    if (blacklistLevel === blacklistValeus[blacklistSetting] || blacklistLevel === "2") {
        if (!enabled) return;
        if (!party.getLeader()) return;

        if (mfaSetting && player !== Player.getName()) {
            new TextComponent(`${prefix} &5&l${player}&d has requested ${cmd}. &d&l[&5&lClick&d&l]&r`)
                .setHoverValue(`&5Click to run &d'/p ${cmd}'`).setClick("run_command", `/p ${cmd}`).chat();
        } else {
            setTimeout(() => {
                if (player !== Player.getName()) ChatLib.chat(`${prefix} &5&l${player}&d triggered ${cmd}.`);
                ChatLib.command(`p ${cmd}`);
            }, 250);
        }
    }
}

// Function to handle player invitations
function handleInvite(player, arg, blacklistLevel) {
    if (!arg) return;
    if (blacklistLevel === blacklistValeus[settings().partyInvBlacklist] || blacklistLevel === "2") {
        if (!settings().partyInv) return;

        if (settings().partyInvMFA && player !== Player.getName()) {
            new TextComponent(`${prefix} &5&l${player}&d has requested to invite ${arg}. &d&l[&5&lClick&d&l]&r`)
                .setHoverValue(`&5Click to run &d'/p ${arg}'`).setClick("run_command", `/p ${arg}`).chat();
        } else {
            setTimeout(() => {
                if (player !== Player.getName()) ChatLib.chat(`${prefix} &5&l${player}&d has invited ${arg} to party.`);
                ChatLib.command(`p ${arg}`);
            }, 250);
        }
    }
}

// Function to handle ping requests
function handlePing(player, blacklistLevel) {
    if (blacklistLevel === blacklistValeus[settings().partyPingBlacklist] || blacklistLevel === "2") {
        if (!settings().partyPing) return;

        setTimeout(() => {
            Client.sendPacket(new C16PacketClientStatus(C16PacketClientStatus.EnumState.REQUEST_STATS));
            lastPingAt = System.nanoTime();
            requestedPing = true;
            lastTimeUsed = Date.now();
            if (player !== Player.getName()) ChatLib.chat(`${prefix} &5&l${player}&d triggered ping.`);
        }, 250);
    }
}

// Function to handle TPS requests
function handleTPS(player, blacklistLevel) {
    if (blacklistLevel === blacklistValeus[settings().partyPingBlacklist] || blacklistLevel === "2") {
        if (!settings().partyTPS) return;

        setTimeout(() => {
            requestedTPS = true;
            lastTimeUsed = Date.now();
            if (player !== Player.getName()) ChatLib.chat(`${prefix} &5&l${player}&d triggered TPS.`);
        }, 250);
    }
}

// Function to handle dungeon joins
function handleDungeonJoin(player, dungeon, blacklistLevel) {
    console.log(dungeon)
    if (blacklistLevel === blacklistValeus[settings().partyDungeonBlacklist] || blacklistLevel === "2") {
        if (!settings().partyDungeon) return;
        if (!party.getLeader()) return;

        if (settings().partyDungeonMFA && player !== Player.getName()) {
            new TextComponent(`${prefix} &5&l${player}&d has requested to join ${dungeon}. &d&l[&5&lClick&d&l]&r`)
                .setHoverValue(`&5Click to run &d'/joindungeon ${dungeon}'`).setClick("run_command", `/joindungeon ${dungeon}`).chat();
        } else {
            setTimeout(() => {
                if (player !== Player.getName()) ChatLib.chat(`${prefix} &5&l${player}&d triggered join ${dungeon}.`);
                ChatLib.command(`joindungeon ${dungeon}`);
            }, 250);
        }
    }
}

// Function to handle party invitations via chat message
function handlePartyRequest(name, blacklistLevel) {
    console.log(blacklistLevel === blacklistValeus[settings().allInvBlacklist] || blacklistLevel === "2")
    if (blacklistLevel === blacklistValeus[settings().allInvBlacklist] || blacklistLevel === "2") {
        if (settings().allInvMFA) {
            new TextComponent(`${prefix} &5&l${name}&d has requested to join the party. &d&l[&5&lClick&d&l]&r`)
                .setHoverValue(`&5Click to run &d'/p ${name}'`)
                .setClick("run_command", `p ${name}`)
                .chat();
        } else {
            setTimeout(() => {
                ChatLib.command(`p ${name}`);
            }, 250);
        }
    }
}

// blacklist command
register("command", (player, level) => {
    let a = undefined
    blacklist.forEach(user => {
        if (user.username === player.toLowerCase()) {
            a = player.toLowerCase()
        }
    })
    if (a == undefined) {
        addToBlacklist(player, level)
    } else {
        removeFromBlacklist(player)
    }
}).setTabCompletions(autocomplete).setName("blacklist")

register("chat", function (event) {
    let message = ChatLib.getChatMessage(event, true);
    let unformattedMsg = message.removeFormatting();

    if (!settings() || !settings().partyCommands) return;

    let regex = /^Party > (?:\[[^\]]*\] )?(\w{1,16})(?: [ቾ⚒])?: !(\w+)(?: (.+))?$/;
    const match = unformattedMsg.match(regex);

    if (!match) return;

    let player = match[1];
    let command = match[2].toLowerCase();
    let arg = match[3] || undefined;

    const blacklistLevel = checkBlacklist(player);
    if (blacklistLevel === "0") return;

    const commandAliases = {
        "allinv": ["allinv", "allinvite"],
        "warp": ["warp"],
        "kickoffline": ["kickoffline", "kicko", "offline"],
        "inv": ["inv", "invite"],
        "ptme": ["ptme", "transfer", "pt"],
        "ping": ["ping"],
        "tps": ["tps"],
        "dt": ["dt", "downtime"]
    };

    const commands = {
        "allinv": () => handlePartyCommand(player, "setting allinvite", settings().allInv, settings().allInvBlacklist, settings().allInvMFA, blacklistLevel),
        "warp": () => handlePartyCommand(player, "warp", settings().partyWarp, settings().partyWarpBlacklist, settings().partyWarpMFA, blacklistLevel),
        "kickoffline": () => handlePartyCommand(player, "kickoffline", settings().partyKickoffline, settings().partyKickofflineBlacklist, settings().partyKickofflineMFA, blacklistLevel),
        "inv": () => handleInvite(player, arg, blacklistLevel),
        "ptme": () => handlePartyCommand(player, `transfer ${player}`, settings().partyTransfer, settings().partyTransferBlacklist, settings().partyTransferMFA, blacklistLevel),
        "ping": () => handlePing(player, blacklistLevel),
        "tps": () => handleTPS(player, blacklistLevel),
        "dt": () => handleDowntime(player, arg)
    };

    for (let i = 1; i <= 5; i++) {
        let kuudraName = kuudraToText.get(i.toString());
        if (kuudraName) {
            commands[`t${i}`] = () => handleDungeonJoin(player, `kuudra_${kuudraName}`, blacklistLevel);
        }
    }
    for (let i = 0; i <= 7; i++) {
        let floorName = numbersToText.get(i.toString());
        if (floorName) {
            commands[`f${i}`] = () => handleDungeonJoin(player, `catacombs_${floorName}`, blacklistLevel);
            if (i >= 1) {
                commands[`m${i}`] = () => handleDungeonJoin(player, `master_catacombs_${floorName}`, blacklistLevel);
            }
        }
    }

    const aliasMap = {};
    Object.entries(commandAliases).forEach(([main, aliases]) => {
        aliases.forEach(alias => aliasMap[alias] = main);
    });

    commands["help"] = () => {
        setTimeout(() => {
            let commandList = Object.keys(commands)
                .filter(cmd => !/^t[2-5]$/.test(cmd) && !/^f[2-7]$/.test(cmd) && !/^m[2-7]$/.test(cmd)) // Show only t1, f1, m1
                .map(cmd => `!${cmd}`)
                .join(", ");
            
            ChatLib.command(`pc ${prefixNoFormat} ${commandList}`);
        }, 250);
    };

    if (aliasMap[command]) {
        command = aliasMap[command];
    }

    if (commands[command]) {
        commands[command]();
    }
});

function handleDowntime(player, reason) {
    if (!settings().dtCommand) return;

    setTimeout(() => {
        if (downtimeUser === "") {
            downtimeUser = player;
            downtimeReason = reason || "Unspecified";
            ChatLib.command(`pc ${prefixNoFormat} ${player} needs downtime`);
        } else {
            ChatLib.command(`pc ${prefixNoFormat} ${downtimeUser} needs downtime`);
        }
    }, 500);
}

register("chat", function () {
    setTimeout(() => {
        if (bossKilled) {
            if (downtimeUser !== "") {
                if (downtimeReason === "") downtimeReason = "Unspecified";
                
                if (settings().jenify) {
                    Client.showTitle("&5Downtime Needed!", `${downtimeUser}: ${downtimeReason}`, 0, 75, 0);
                } else {
                    Client.showTitle("&cDowntime Needed!", `${downtimeUser}: ${downtimeReason}`, 0, 75, 0);
                }

                ChatLib.command(`pc ${prefixNoFormat} ${downtimeUser} needs downtime`);
                ChatLib.chat(`&r&9${line}\n${prefix} &f${downtimeUser} needs downtime: ${downtimeReason}\n&r&9${line}`);
            };
            if (!party.getLeader()) return;
            if (downtimeUser !== "") {
                reinstance();
            } else if (settings().autoReinstance) {
                if (settings().autoReinstanceTimer !== 0) {
                    ChatLib.chat(`${prefix} Requeueing in ${settings().autoReinstanceTimer} seconds`)
                }
                setTimeout(() => {
                    ChatLib.command(`instancerequeue`);
                }, settings().autoReinstanceTimer * 1000);
            }
        }
    }, 100);
}).setCriteria(/^\s*> EXTRA STATS <$/ || "                               KUUDRA DOWN!");

register("chat", function (event) {
    let message = ChatLib.getChatMessage(event, true);
    let unformattedMsg = message.removeFormatting();

    if (!settings().msgInv) return;

    let regex = /From (?:\[.+\])? ?(.+) ?[ቾ⚒]?: !(party|p|inv|invite)/;
    const match = unformattedMsg.match(regex);

    if (!match) return;

    let name = match[1];
    const blacklistLevel = checkBlacklist(name);
    console.log(name, blacklistLevel)
    handlePartyRequest(name, blacklistLevel);
});

registerWhen(onChatPacket((boss, time, pb) => {
    bossKilled = true
}).setCriteria(/^\s*☠ Defeated (.+) in 0?([\dhms ]+?)\s*(\(NEW RECORD!\))?$/), () => settings().dtCommand)


// ping & tps stuff
register('packetReceived', (packet) => {
    if (lastPingAt > 0 && requestedPing) {
        if (packet instanceof S37PacketStatistics) {
            let diff = Math.abs((System.nanoTime() - lastPingAt) / 1_000_000)
            ChatLib.command(`pc ${prefixNoFormat} ${parseInt(diff)}ms`)
            lastPingAt *= -1
            requestedPing = false
        }
    }

    if (packet instanceof S03_PACKET_TIME_UPDATE && requestedTPS) {
        if (prevTime !== null) {
            let time = Date.now() - prevTime
            let instantTps = MathLib.clampFloat(20000 / time, 0, 20)
            ChatLib.command(`pc ${prefixNoFormat} TPS: ${parseFloat(instantTps).toFixed(1)}`)
            requestedTPS = false
        }
        prevTime = Date.now()
    }
})


register(`worldUnload`, () => {
    bossKilled = false
    downtimeUser = ""
    downtimeReason = ""
})