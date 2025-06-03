
// OPTIMIZED: Performance enhancements applied
/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import settings from "../config"
import { displayTitle } from "../utils/helperUtil";

const colors = ["§0", "§1", "§2", "§3", "§4", "§5", "§6", "§7", "§8", "§9", "§a", "§b", "§c", "§d", "§e", "§f"];
let lastWorldSwap = new Date().getTime()

register("chat", function (event) {
    let message = ChatLib.getChatMessage(event, true);
    let unformattedMsg = message.removeFormatting();
    if (settings().pluscolorToggle) {
        const match = message.match(/(\[(?:VIP|MVP)&(?:r?&)?([0-9a-f]+)\+?\+?&?(?:r?&)?(?:[0-9a-f]?)\])\s+([a-zA-Z0-9_]{1,16})/g)
        if (match) {
            try {
                let a = match.toString().match(/(\[(?:VIP|MVP)&(?:r?&)?([0-9a-f]+)\+?\+?&?(?:r?&)?(?:[0-9a-f]?)\])\s+([a-zA-Z0-9_]{1,16})/)
                if (a[3] == Player.getName()) {
                    let ranka = a[1]
                    let rankb = a[1].replace("&" + a[2], colors[settings().pluscolorColor])
                    let messageParts = new Message(EventLib.getMessage(event)).getMessageParts()

                    let hover = messageParts[messageParts.length - 1].hoverValue;
                    let link = messageParts[messageParts.length - 1].clickValue;
                    cancel(event)
                    if (settings().jenify) {
                        if (message.includes("&bCo-op")) message = message.replace("&bCo-op", "&5Co-op")
                    }
                    if (message.includes("<ItemSharing:")) return
                    if (link == null) {
                        ChatLib.chat(message.replace(ranka, rankb))
                    } else {
                        new TextComponent(message.replace(ranka, rankb)).setHoverValue(hover).setClick("run_command", link).chat()
                    }
                }
            } catch (error) {

            }
        }
    }
})
const pickaxeMessages = ["Mining Speed Boost is now available!", "Pickobulus is now available!"];

register("command", () => {
    ChatLib.command("warp garden")
}).setName("dr")

// handling chat messages
register("chat", function (event) {
    let message = ChatLib.getChatMessage(event, true);
    let unformattedMsg = message.removeFormatting();
    if (settings().locket) {
        if(message.includes("&r    &r&6Shattered Locket&r")){
            cancel(event)
            ChatLib.chat("§r    §r§6locket :3§r")
        }
    }
    if (settings().repellant) {
        if(unformattedMsg.includes("Pest Repellent MAX has expired!")){
            if (settings().jenify) {
                displayTitle(50, 5, "§5Pest Repel Running Out", 80)
            } else {
                displayTitle(50, 5, "§aPest Repel Running Out", 80)
            }
            World.playSound("mob.cat.meow", 1, 1)
        }
    }
    if (unformattedMsg.startsWith("Co-op > [MVP+] Azael_Nyas: ")) {
        if (settings().jenify) {
            unformattedMsg = unformattedMsg.replace("Co-op > [MVP+] Azael_Nyas: ", "§5Co-op > §d")
        } else {
            unformattedMsg = unformattedMsg.replace("Co-op > [MVP+] Azael_Nyas: ", "§bCo-op > §b")
        }
        cancel(event)
        ChatLib.chat(unformattedMsg.replace(":", "§f:"))
        if (settings().coopPing) {
            World.playSound("random.orb", 1, 1)
        }
    }
    else if (settings().jenify) {
        if (message.startsWith("&r&bCo-op >")) {
            if (unformattedMsg.includes(`${Player.getName()}:`) && settings().pluscolorToggle && (unformattedMsg.includes("MVP+") || unformattedMsg.includes("VIP+"))) return
            cancel(event)
            ChatLib.chat(message.replace("&bCo-op >", "&5Co-op >"))
            if (settings().coopPing) {
                if (unformattedMsg.startsWith("Co-op >")) {
                    let name = Player.getName();
                    let sender = unformattedMsg.replaceAll("Co-op > ", "").split(":")[0]
                    if (sender.includes(' ')) sender = sender.split(' ')[1];
                    if (sender != name) {
                        World.playSound("random.orb", 1, 1)
                    }
                }
            }
        }
    }
    if (settings().coopPing) {
        if (unformattedMsg.startsWith("Co-op >")) {
            let name = Player.getName();
            let sender = unformattedMsg.replaceAll("Co-op > ", "").split(":")[0]
            if (sender.includes(' ')) sender = sender.split(' ')[1];
            if (sender != name) {
                World.playSound("random.orb", 1, 1)
            }
        }
    }
    if (settings().commissionMsg) {
        let checktime = new Date().getTime() - lastWorldSwap
        if (checktime > 3000) {
            if (unformattedMsg.includes("Commission Complete! Visit the King to claim your rewards!")) {
                if (settings().jenify) {
                    displayTitle(50, 5, "§5COMMISSION DONE", 80)
                } else {
                    displayTitle(50, 5, "§aCOMMISSION DONE", 80)
                }
            }
        }
    }

    if (settings().cdMsg) {
        let checktime = new Date().getTime() - lastWorldSwap
        if (checktime > 3000) {
            for (let i = 0; i < pickaxeMessages.length; i++) {
                if (unformattedMsg == pickaxeMessages[i]) {
                    if (settings().jenify) {
                        displayTitle(30, 5, "§5Cooldown Over!", 80)
                    } else {
                        displayTitle(30, 5, "§aCooldown Over!", 80)
                    }
                }
            }
        }
    }
    if (settings().coldMsg) {
        if (unformattedMsg.startsWith("BRRR! It's getting really cold in here!")) {
            displayTitle(50, 5, "§9You're Cold (-25 cold)", 80)
        }
        if (unformattedMsg.startsWith("BRRR! It's so cold that you can barely feel your fingers.")) {
            displayTitle(50, 5, "§9You're Cold (-50 cold)", 80)
        }
        if (unformattedMsg.startsWith("BRRR! Your movement slows to a crawl as the cold threatens to take over")) {
            displayTitle(50, 5, "§9You're Cold (-75 cold)", 80)
        }
        if (unformattedMsg.startsWith("BRRR! You're freezing!")) {
            displayTitle(50, 5, "§9You're Cold (-90 cold)", 80)
        }
    }
    if (settings().joinMsg) {
        if (message.includes("the lobby!&r")) cancel(event)
    }
    if (settings().meow) {
        if (message.removeFormatting().toLowerCase().split(":").splice(1).join(":").includes("meow")) World.playSound("mob.cat.meow", 1, 1);
    }
    if (settings().autorequeue) {
        if (/Winners \(\d{1,2}\):&r/.test(message) && message.startsWith("&r&f")) {
            ChatLib.say("/ac gg");
            playerBoxTemp = []
            setTimeout(() => {
                ChatLib.say("/play prototype_disasters")
            }, 750);
        }
        if (message.startsWith("&r&f") && message.includes("Nobody survived!")) {
            ChatLib.say("/ac gg")
            setTimeout(() => {
                ChatLib.say("/play prototype_disasters")
            }, 750);
        }
        if (message.startsWith("&r&f") && message.endsWith("Winner:")) {
            ChatLib.say("/ac gg")
            setTimeout(() => {
                ChatLib.say("/play prototype_disasters")
            }, 750);
        }
    }
})
register("worldLoad", () => {
    lastWorldSwap = new Date().getTime()
})