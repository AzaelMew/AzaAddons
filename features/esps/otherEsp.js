
// OPTIMIZED: Performance enhancements applied
/// <reference types="../../../CTAutocomplete" />
/// <reference lib="es2015" />

//corpse esp
import settings from "../../config"
import { drawCoolWaypoint, drawEspBox, trace } from "../../utils/renderUtil"
import { autocomplete, mineshaftCheck, registerWhen, hotspotCheck, creeperCheck, gunpowderCheck, crimsonCheck, dwarvenChecker } from "../../utils/helperUtil"
import { prefix } from "../../index"
const hologramData = new Map(); // Global storage for hotspot holograms
const seenMobs = new Set();
let playerBoxTemp = []
let playerBox = JSON.parse(FileLib.read("AzaAddons", "userdata/playerBox.json")) || [];
let shouldBox = false

const EntityArmorStand = Java.type("net.minecraft.entity.item.EntityArmorStand")
let claimed = []

function mcToRgb(mccolor) {
    switch (mccolor) {
        case "§0":
            return [0, 0, 0];
        case "§1":
            return [0, 0, 170];
        case "§2":
            return [0, 170, 0];
        case "§3":
            return [0, 170, 170];
        case "§4":
            return [170, 0, 0];
        case "§5":
            return [170, 0, 170];
        case "§6":
            return [255, 170, 0];
        case "§7":
            return [170, 170, 170];
        case "§8":
            return [85, 85, 85];
        case "§9":
            return [85, 85, 255];
        case "§a":
            return [85, 255, 85];
        case "§b":
            return [85, 255, 255];
        case "§c":
            return [255, 85, 85];
        case "§d":
            return [255, 85, 255];
        case "§e":
            return [255, 255, 85];
        case "§f":
            return [255, 255, 255];
    }
}

// ------------------------------------------------------------------
// TICK HANDLER FOR HOTSPOT HOLOGRAM TRACKING
// ------------------------------------------------------------------

register("step", () => {
    const currentSettings = settings();
    if (!currentSettings.hotspotESP && !currentSettings.thunderESP && !currentSettings.jawbusESP) return;

    const biome = Player.getBiome();
    const inCrimson = biome === "Hell" || crimsonCheck.check();
    const inHotspot = hotspotCheck.check() || biome === "Hell";

    if (!inHotspot) return;

    const foundNow = new Set();
    const px = Player.getX();
    const py = Player.getY();
    const pz = Player.getZ();

    const hologramKeywords = [
        "Fishing Speed",
        "Treasure Chance",
        "Sea Creature Chance",
        "Double Hook Chance",
        "Trophy Fish Chance"
    ];

    const needsHologram = currentSettings.hotspotESP;
    const needsMobs = inCrimson && (currentSettings.thunderESP || currentSettings.jawbusESP);

    if (needsHologram || needsMobs) {
        for (const entity of World.getAllEntities()) {
            const name = entity.getName();
            const entityClass = entity.getClassName();
            if (needsHologram && hologramKeywords.some(keyword => name.includes(keyword))) {
                const x = entity.getX();
                const y = entity.getY();
                const z = entity.getZ();
                hologramData.set(name + x + y + z, {
                    x, y, z,
                    timer: 3,
                    timer2: 300
                });
            }

            if (!needsMobs || name.includes("§")) continue;

            if (currentSettings.thunderESP && entityClass == "EntityGuardian" && !entity.isInvisible()) {
                foundNow.add("Guardian");
                if (!seenMobs.has("Guardian")) {
                    seenMobs.add("Guardian");
                new TextComponent(`${prefix} §l§cThunder detected! &d&l[&5&lClick&d&l]&r`)
                .setHoverValue(`&5Click to send in party`).setClick("run_command", `/pc x: ${entity.getX().toFixed(0)}, y: ${entity.getY().toFixed(0)}, z: ${entity.getZ().toFixed(0)} Thunder!`).chat();
                }                
            }

            if (currentSettings.jawbusESP && entityClass == "EntityIronGolem") {
                foundNow.add("Jawbus");
                if (!seenMobs.has("Jawbus")) {
                    seenMobs.add("Jawbus");
                new TextComponent(`${prefix} §l§cJawbus detected! &d&l[&5&lClick&d&l]&r`)
                .setHoverValue(`&5Click to send in party`).setClick("run_command", `/pc x: ${entity.getX().toFixed(0)}, y: ${entity.getY().toFixed(0)}, z: ${entity.getZ().toFixed(0)} Jawbus!`).chat();
                }
            }
            if (currentSettings.witherESP && entityClass == "EntityWither") {
                if (entity.getEntity().func_110138_aP() == 300) return;
                foundNow.add("Wither");
                if (!seenMobs.has("Wither")) {
                    seenMobs.add("Wither");
                new TextComponent(`${prefix} §l§cVanquisher detected! &d&l[&5&lClick&d&l]&r`)
                .setHoverValue(`&5Click to send in party`).setClick("run_command", `/pc x: ${entity.getX().toFixed(0)}, y: ${entity.getY().toFixed(0)}, z: ${entity.getZ().toFixed(0)} Vanquisher!`).chat();
                }                
            }
        }
    }

    // Collect mobs to remove
    const toRemove = [];
    for (const mob of seenMobs) {
        if (!foundNow.has(mob)) toRemove.push(mob);
    }

    // Remove them after iteration
    for (const mob of toRemove) {
        seenMobs.delete(mob);
    }


    // Handle hologram timers
    if (hologramData.size > 0) {
        for (const [key, data] of hologramData.entries()) {
            data.timer2--;
            if (data.timer2 <= 0) {
                hologramData.delete(key);
                continue;
            }

            const distSq = (px - data.x) ** 2 + (py - data.y) ** 2 + (pz - data.z) ** 2;
            if (distSq <= 400) { // 20^2
                data.timer--;
                if (data.timer <= 0) {
                    hologramData.delete(key);
                }
            } else {
                data.timer = 3; // Reset timer if too far away
            }
        }
    }
}).setFps(1);


register("step", () => {

    //thea: add unregs
    if(settings().ragnarokEsp) {
        ragnarockEsp.register();
    } else { ragnarockEsp.unregister(); }

    if(settings().thunderESP) {
        thunderEsp.register();
    } else { thunderEsp.unregister(); }

    if(settings().jawbusESP) {
        jawbusEsp.register();
    } else { jawbusEsp.unregister(); }

    if(settings().witherESP) {
        vanquisherEsp.register();
    } else { vanquisherEsp.unregister(); }

    if(settings().creeperrevealer) {
        creeperEsp.register();
    } else { creeperEsp.unregister(); }

    if(settings().ticketesp) {
        ticketEsp.register();
    } else { ticketEsp.unregister(); }

    if(settings().mineshaftEsp) {
        mineshaftEsp.register();
    } else { mineshaftEsp.unregister(); }

    if(settings().playerbox) {
        playerEsp.register();
    } else { playerEsp.unregister(); }

    if(settings().hotspotESP) {
        hotspotEsp.register();
    } else { 
        //thea: clear holograms on toggle
        hotspotEsp.unregister(); 
        hologramData.clear();
    }
    //thea: add corpseEsp to this
    if(settings().corpseEsp) {
        corpseESP.register();
    } else { corpseESP.unregister(); }
    
}).setFps(1)

// ------------------------------------------------------------------
// RENDERING ESP & OTHER FEATURES
// ------------------------------------------------------------------
//thea: convert to const register
const corpseESP = register("renderWorld", () => {
    if(!mineshaftCheck.check()) return;
    const entities = World.getAllEntitiesOfType(EntityArmorStand.class).filter(a => a?.getName() == "Armor Stand" && !a.isInvisible())

    for (let i = 0; i < entities.length; i++) {


        let helmetName = new EntityLivingBase(entities[i].getEntity()).getItemInSlot(4)?.getName()?.removeFormatting()
        if (claimed.some(e => entities[i].getPos().distance(e) < 5) || !helmetName)
            continue
        let text, rgb
        switch (helmetName) {
            case "Lapis Armor Helmet":
                text = "Lapis"
                rgb = [0, 0, 1]
                break
            case "Mineral Helmet":
                text = "Tungsten"
                rgb = [1, 1, 1]
                break
            case "Yog Helmet":
                text = "Umber"
                rgb = [181 / 255, 98 / 255, 34 / 255]
                break
            case "Vanguard Helmet":
                text = "Vanguard"
                rgb = [242 / 255, 36 / 255, 184 / 255]
                break
            default:
                continue
        }

        drawCoolWaypoint(Math.floor(entities[i].getRenderX()), Math.floor(entities[i].getRenderY()), Math.floor(entities[i].getRenderZ()),
            rgb[0], rgb[1], rgb[2], { name: text, showDist: true }
        )
    }
}).unregister();

register("chat", (corpse) => {
    claimed.push(Player.asPlayerMP().getPos())
}).setCriteria(/\s(.+) CORPSE LOOT!\s/)

register("chat", function (event) {
    let message = ChatLib.getChatMessage(event, true);
    let unformattedMsg = message.removeFormatting();
    if (settings().purge) {
        if (message.includes("&a&lPURGE &r&fPvP is enabled until only")) {
            shouldBox = true
        }
        if (message.includes("&a&lPURGE! &r&fThe Purge has concluded.")) {
            shouldBox = false
        }
    }
    if (settings().werewolfesp) {
        if (message.includes("&r&c&lWEREWOLF!")) {
            const match = message.match(/&r&f(\w+)/);
            if (match) {
                username = match[1]

                ChatLib.command(`boxtemp ${username}`, true)
            }
        }
        if (unformattedMsg.includes("You have become a Werewolf!")) {
            shouldBox = true
        }
    }
    if (settings().hotpotatoesp) {
        if (message.includes("&r&6&lHOT POTATO!")) {
            const match = message.match(/&r&f(\w+)/);
            if (match) {
                shouldBox = false
                username = match[1]
                playerBoxTemp = []
                ChatLib.command(`boxtemp ${username}`, true)
            }
        }
        if (message.includes("&6&lHOT POTATO! &r&ePass on the &r&6Hot Potato")) {
            shouldBox = true
        }
    }
})

register("worldUnload", () => {
    exit = false
    claimed.length = 0
    playerBoxTemp = []
    shouldBox = false
    hologramData.clear()
})

// handling other ESPs

const ragnarockEsp = register("renderWorld", () => {
    World.getAllEntities().forEach(entity => {
        let x = entity.getRenderX();
        let y = entity.getRenderY();
        let z = entity.getRenderZ();
        let name = entity.getName();
        if (name.includes("Ragnarok") && !name.includes("§")) {
            Tessellator.drawString("RAGNAROK", x, y + 3, z, Renderer.color(255, 0, 51), true, 1, true)
            drawEspBox(x, y, z, 0.7, 1.8, 255 / 255, 0 / 255, 51 / 255, 1, true)
        };
    });
}).unregister();

const thunderEsp = register("renderWorld", () => {
    if (Player.getBiome() == "Hell" || crimsonCheck.check()) {
        World.getAllEntities().forEach(entity => {

            let x = entity.getRenderX();
            let y = entity.getRenderY();
            let z = entity.getRenderZ();
            let name = entity.getName();
            let entityClass = entity.getClassName();

            if (entityClass == "EntityGuardian" && settings().thunderESP && !entity.isInvisible()) {
                Tessellator.drawString("THUNDER", x, y + 2, z, Renderer.color(255, 255, 255), true, 1, true)
                drawEspBox(x, y, z, 2, 2, 4 / 255, 62 / 255, 128 / 255, 1, true)
                if (settings().fishingTracer) {
                    trace(x, y, z, 1 / 255, 33 / 255, 69 / 255, 1, 1.5);
                }
            }
        });
    }
}).unregister();

const jawbusEsp = register("renderWorld", () => {
    if (Player.getBiome() == "Hell" || crimsonCheck.check()) {
        World.getAllEntities().forEach(entity => {

            let x = entity.getRenderX();
            let y = entity.getRenderY();
            let z = entity.getRenderZ();
            let name = entity.getName();
            let entityClass = entity.getClassName();

            if (entityClass == "EntityIronGolem" && settings().jawbusESP) {
                Tessellator.drawString("JAWBUS", x, y + 3, z, Renderer.color(255, 255, 255), true, 1, true)
                drawEspBox(x, y, z, 2, 2, 1 / 255, 33 / 255, 69 / 255, 1, true)
                if (settings().fishingTracer) {
                    trace(x, y, z, 1 / 255, 33 / 255, 69 / 255, 1, 1.5);
                }
            }
        });
    }
}).unregister();

const vanquisherEsp = register("renderWorld", () => {
    if (Player.getBiome() == "Hell" || crimsonCheck.check()) {
        World.getAllEntities().forEach(entity => {

            let x = entity.getRenderX();
            let y = entity.getRenderY();
            let z = entity.getRenderZ();
            let entityClass = entity.getClassName();

            if (entityClass == "EntityWither" && settings().witherESP) {
                if (entity.getEntity().func_110138_aP() == 300) return;
                Tessellator.drawString("VANQUISHER", x, y + 4, z, Renderer.color(100, 25, 190), true, 1, true)
                drawEspBox(x, y + 0.4, z, 1, 2.2, 100 / 255, 25 / 255, 190 / 255, 1, true)
                if (settings().witherTracers) {
                    trace(x, y + 1.3, z, 100 / 255, 25 / 255, 190 / 255, 1, 1.5);
                }
            }
        });
    }
}).unregister();

const creeperEsp = register("renderWorld", () => {
    if (creeperCheck.check()) {
        World.getAllEntities().forEach(entity => {

            let x = entity.getRenderX();
            let y = entity.getRenderY();
            let z = entity.getRenderZ();
            let name = entity.getName();

            if (name.includes("Creeper")) {
                entity.getEntity().func_82142_c(false);
                if (gunpowderCheck.check()) {
                    drawEspBox(x, y, z, 0.75, 2, 13 / 255, 181 / 255, 13 / 255, 1, true)
                }
            }
        });
    }
}).unregister();

const ticketEsp = register("renderWorld", () => {
    if (dwarvenChecker.check()) {
        World.getAllEntities().forEach(entity => {

            let x = entity.getRenderX();
            let y = entity.getRenderY();
            let z = entity.getRenderZ();
            let name = entity.getName();
            if (name.includes("item.item.nameTag")) {
                drawEspBox(x, y, z, 0.5, 0.5, 125 / 255, 255 / 255, 95 / 255, 1, true)
            }
        });
    }
}).unregister();

const mineshaftEsp = register("renderWorld", () => {
    if (mineshaftCheck.check()) {
        World.getAllEntities().forEach(entity => {
            let x = entity.getRenderX();
            let y = entity.getRenderY();
            let z = entity.getRenderZ();
            let name = entity.getName();
            let entityClass = entity.getClassName();
            switch (name) {
                case "Glacite Mage":
                    drawEspBox(x, y, z, 0.75, 2, 180 / 255, 5 / 255, 120 / 255, 1, true)
                    break;
                case "Glacite Caver":
                    drawEspBox(x, y, z, 0.75, 2, 180 / 255, 5 / 255, 120 / 255, 1, true)
                    break;
                case "Glacite Bowman":
                    drawEspBox(x, y, z, 0.75, 2, 180 / 255, 5 / 255, 120 / 255, 1, true)
                    break;
                case "Glacite Mutt":
                    drawEspBox(x, y - 1, z, 1, 1, 180 / 255, 5 / 255, 120 / 255, 1, true)
                    break;
                default:
                    break;
            }
        });
    }
}).unregister();

const playerEsp = register("renderWorld", () => {
    World.getAllEntities().forEach(entity => {
        let x = entity.getRenderX();
        let y = entity.getRenderY();
        let z = entity.getRenderZ();
        let name = entity.getName();
        if (shouldBox) {
            if (name === Player.getName()) return;
            if (entity.getDisplayName().getText().includes("§")) {
                if (entity.getDisplayName().getText().match(/§[a-f0-9]/)) {
                    let color = entity.getDisplayName().getText().match(/§[a-f0-9]/);
                    color = color.toString();
                    drawEspBox(x, y, z, 1, 2, mcToRgb(color)[0] / 255, mcToRgb(color)[1] / 255, mcToRgb(color)[2] / 255, 1, true);
                }
            }
        }
        playerBox.some(playerObj => {
            if (playerObj.player === name) {
                if (entity !== null) {
                    if (name == Player.getName()) return;
                    drawEspBox(
                        x, y, z,
                        0.75, 2,
                        playerObj.color[0] / 255,
                        playerObj.color[1] / 255,
                        playerObj.color[2] / 255,
                        1, true
                    );
                    let pos = [x, y + 3, z];
                    Tessellator.drawString(
                        playerObj.player,
                        ...pos,
                        Renderer.color(
                            playerObj.color[0],
                            playerObj.color[1],
                            playerObj.color[2]
                        ),
                        true, 1, true
                    );
                }
            }
            return false;
        });
        playerBoxTemp.some(playerObj => {
            if (playerObj.player === name) {
                if (entity !== null) {
                    if (name == Player.getName()) return;
                    drawEspBox(
                        x, y, z,
                        0.75, 2,
                        playerObj.color[0] / 255,
                        playerObj.color[1] / 255,
                        playerObj.color[2] / 255,
                        1, true
                    );
                    let pos = [x, y + 3, z];
                    Tessellator.drawString(
                        playerObj.player,
                        ...pos,
                        Renderer.color(
                            playerObj.color[0],
                            playerObj.color[1],
                            playerObj.color[2]
                        ),
                        true, 1, true
                    );
                }
            }
            return false;
        });
    });
}).unregister();



//thea: convert to using switch bcs its faster than if ... else (i saw it on a video thumbnail idk how much by)
const hotspotEsp = register("renderWorld", () => {
    if (hotspotCheck.check() || Player.getBiome() == "Hell") {
            hologramData.forEach((data, name) => {
                if (name.includes("Fishing Speed")) {
                    drawEspBox(data.x, data.y - 1.2, data.z, 4.6, 0.3, 114 / 255, 255 / 255, 250 / 255, 1, true)
                } else if (name.includes("Treasure Chance")) {
                    drawEspBox(data.x, data.y - 1.2, data.z, 4.6, 0.3, 255 / 255, 191 / 255, 21 / 255, 1, true)
                } else if (name.includes("Sea Creature Chance")) {
                    drawEspBox(data.x, data.y - 1.2, data.z, 4.6, 0.3, 18 / 255, 163 / 255, 178 / 255, 1, true)
                } else if (name.includes("Double Hook Chance")) {
                    drawEspBox(data.x, data.y - 1.2, data.z, 4.6, 0.3, 62 / 255, 145 / 255, 255 / 255, 1, true)
                } else if (name.includes("Trophy Fish Chance")) {
                    drawEspBox(data.x, data.y - 1.2, data.z, 4.6, 0.3, 255 / 255, 145 / 97, 255 / 21, 1, true)
                }
            });
        }
}).unregister();

//todo: delete unused code
/*
register("renderWorld", () => {
    
    World.getAllEntities().forEach(entity => {
        //Use these values instead of parsing the value again
        let x = entity.getRenderX();
        let y = entity.getRenderY();
        let z = entity.getRenderZ();
        let name = entity.getName();
        let entityClass = entity.getClassName();

        // fish esps!
        if (name.includes("Ragnarok") && settings().ragnarokEsp) {
            if (name.includes("§")) return
            Tessellator.drawString("RAGNAROK", x, y + 3, z, Renderer.color(255, 0, 51), true, 1, true)
            drawEspBox(x, y, z, 0.7, 1.8, 255 / 255, 0 / 255, 51 / 255, 1, true)
        }
        if (Player.getBiome() == "Hell" || crimsonCheck.check()) {
            if (entityClass == "EntityGuardian" && settings().thunderESP && !entity.isInvisible()) {
                Tessellator.drawString("THUNDER", x, y + 2, z, Renderer.color(255, 255, 255), true, 1, true)
                drawEspBox(x, y, z, 2, 2, 4 / 255, 62 / 255, 128 / 255, 1, true)
                if (settings().fishingTracer) {
                    trace(x, y, z, 1 / 255, 33 / 255, 69 / 255, 1, 1.5);
                }
            }
            if (entityClass == "EntityIronGolem" && settings().jawbusESP) {
                Tessellator.drawString("JAWBUS", x, y + 3, z, Renderer.color(255, 255, 255), true, 1, true)
                drawEspBox(x, y, z, 2, 2, 1 / 255, 33 / 255, 69 / 255, 1, true)
                if (settings().fishingTracer) {
                    trace(x, y, z, 1 / 255, 33 / 255, 69 / 255, 1, 1.5);
                }
            }
            if (entityClass == "EntityWither" && settings().witherESP) {
                if (entity.getEntity().func_110138_aP() == 300) return;
                Tessellator.drawString("VANQUISHER", x, y + 4, z, Renderer.color(100, 25, 190), true, 1, true)
                drawEspBox(x, y + 0.4, z, 1, 2.2, 100 / 255, 25 / 255, 190 / 255, 1, true)
                if (settings().witherTracers) {
                    trace(x, y + 1.3, z, 100 / 255, 25 / 255, 190 / 255, 1, 1.5);
                }
            }
        }

        // creeeper
        if (settings().creeperrevealer && creeperCheck.check()) {
            if (name.includes("Creeper")) {
                entity.getEntity().func_82142_c(false);
                if (gunpowderCheck.check()) {
                    drawEspBox(x, y, z, 0.75, 2, 13 / 255, 181 / 255, 13 / 255, 1, true)
                }
            }
        }
        // ticket esp toggle & render stuff
        if (settings().ticketesp) {
            if (name.includes("item.item.nameTag")) {
                drawEspBox(x, y, z, 0.5, 0.5, 125 / 255, 255 / 255, 95 / 255, 1, true)
            }
        }
        // mineshaft esp toggle & render stuff
        if (settings().mineshaftEsp) {

            switch (name) {
                case "Glacite Mage":
                    drawEspBox(x, y, z, 0.75, 2, 180 / 255, 5 / 255, 120 / 255, 1, true)
                case "Glacite Caver":
                    drawEspBox(x, y, z, 0.75, 2, 180 / 255, 5 / 255, 120 / 255, 1, true)
                case "Glacite Bowman":
                    drawEspBox(x, y, z, 0.75, 2, 180 / 255, 5 / 255, 120 / 255, 1, true)

                case "Glacite Mutt":
                    drawEspBox(x, y - 1, z, 1, 1, 180 / 255, 5 / 255, 120 / 255, 1, true)

            }
        }
        //player esp stuff
        if (settings().playerbox) {
            if (shouldBox) {
                if (name === Player.getName()) return;
                if (entity.getDisplayName().getText().includes("§")) {
                    if (entity.getDisplayName().getText().match(/§[a-f0-9]/)) {
                        let color = entity.getDisplayName().getText().match(/§[a-f0-9]/);
                        color = color.toString();
                        drawEspBox(x, y, z, 1, 2, mcToRgb(color)[0] / 255, mcToRgb(color)[1] / 255, mcToRgb(color)[2] / 255, 1, true);
                    }
                }

            }
        }
        playerBox.some(playerObj => {
            if (playerObj.player === name) {
                if (entity !== null) {
                    if (name == Player.getName()) return;
                    drawEspBox(
                        x, y, z,
                        0.75, 2,
                        playerObj.color[0] / 255,
                        playerObj.color[1] / 255,
                        playerObj.color[2] / 255,
                        1, true
                    );

                    let pos = [x, y + 3, z];
                    Tessellator.drawString(
                        playerObj.player,
                        ...pos,
                        Renderer.color(
                            playerObj.color[0],
                            playerObj.color[1],
                            playerObj.color[2]
                        ),
                        true, 1, true
                    );
                }
            }
            return false;
        });
        playerBoxTemp.some(playerObj => {
            if (playerObj.player === name) {
                if (entity !== null) {
                    if (name == Player.getName()) return;

                    let x = entity.getRenderX();
                    let y = entity.getRenderY();
                    let z = entity.getRenderZ();

                    drawEspBox(
                        x, y, z,
                        0.75, 2,
                        playerObj.color[0] / 255,
                        playerObj.color[1] / 255,
                        playerObj.color[2] / 255,
                        1, true
                    );

                    let pos = [x, y + 3, z];
                    Tessellator.drawString(
                        playerObj.player,
                        ...pos,
                        Renderer.color(
                            playerObj.color[0],
                            playerObj.color[1],
                            playerObj.color[2]
                        ),
                        true, 1, true
                    );
                }
            }
            return false;
        });
    })
    // -------------------------------
    // HOTSPOT ESP - Render boxes based on tracked holograms
    // -------------------------------
    if (settings().hotspotESP) {
        if (hotspotCheck.check() || Player.getBiome() == "Hell") {
            hologramData.forEach((data, name) => {
                if (name.includes("Fishing Speed")) {
                    drawEspBox(data.x, data.y - 1.2, data.z, 4.6, 0.3, 114 / 255, 255 / 255, 250 / 255, 1, true)
                } else if (name.includes("Treasure Chance")) {
                    drawEspBox(data.x, data.y - 1.2, data.z, 4.6, 0.3, 255 / 255, 191 / 255, 21 / 255, 1, true)
                } else if (name.includes("Sea Creature Chance")) {
                    drawEspBox(data.x, data.y - 1.2, data.z, 4.6, 0.3, 18 / 255, 163 / 255, 178 / 255, 1, true)
                } else if (name.includes("Double Hook Chance")) {
                    drawEspBox(data.x, data.y - 1.2, data.z, 4.6, 0.3, 62 / 255, 145 / 255, 255 / 255, 1, true)
                } else if (name.includes("Trophy Fish Chance")) {
                    drawEspBox(data.x, data.y - 1.2, data.z, 4.6, 0.3, 255 / 255, 145 / 97, 255 / 21, 1, true)
                }
            });
        }
    }
})
*/
register("command", (player, color, size) => {
    playerBox = playerBox.filter((a) => { return a.player !== player })

    if (color === undefined) {
        playerBox.push({
            player: player,
            color: [204, 0, 102],
            size: size ? parseInt(size) : 2
        })
    } else {
        playerBox.push({
            player: player,
            color: color.split(",").map((a) => { return parseInt(a) }),
            size: size ? parseInt(size) : 2
        })
    }

    FileLib.write("AzaAddons", "userdata/playerBox.json", JSON.stringify(playerBox))

    ChatLib.chat(`${prefix} §aAdded user §5§l${player} §ato ESP`)
}).setTabCompletions(autocomplete).setName("box")
register("command", (player, color, size) => {
    playerBoxTemp = playerBoxTemp.filter((a) => { return a.player !== player })

    if (color === undefined) {
        playerBoxTemp.push({
            player: player,
            color: [255, 0, 0],
            size: size ? parseInt(size) : 2
        })
    } else {
        playerBoxTemp.push({
            player: player,
            color: color.split(",").map((a) => { return parseInt(a) }),
            size: size ? parseInt(size) : 2
        })
    }

    ChatLib.chat(`${prefix} §aAdded user §5§l${player} §ato temporary ESP`)
}).setTabCompletions(autocomplete).setName("boxtemp").setAliases("tempbox")
// clear player box command
register("command", (player) => {
    playerBox = playerBox.filter((a) => { return a.player !== player })

    FileLib.write("AzaAddons", "userdata/playerBox.json", JSON.stringify(playerBox))

    ChatLib.chat(`${prefix} §cRemoved user &5&l${player} &cfrom ESP`)
}).setTabCompletions(autocomplete).setName("clearbox").setAliases("boxclear")
// clear temp player box command
register("command", (player) => {
    if (player === "all") {
        playerBox = []
        ChatLib.chat(`${prefix} §cRemoved all &5&lAll Users &cfrom temporary ESP`)
        return;
    }
    playerBox = playerBox.filter((a) => { return a.player !== player })

    FileLib.write("AzaAddons", "userdata/playerBox.json", JSON.stringify(playerBox))

    ChatLib.chat(`${prefix} §cRemoved user &5&l${player} &cfrom temporary ESP`)
}).setTabCompletions(autocomplete).setName("cleartempbox").setAliases("tempboxclear")