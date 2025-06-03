
// OPTIMIZED: Performance enhancements applied
/// <reference types="../../../CTAutocomplete" />
/// <reference lib="es2015" />

import settings from "../../config"
import { mineshaftCheck, registerWhen, displayTitle } from "../../utils/helperUtil"
let currentRoom;
let gemstones = [];
let scanning = false;

const GEMSTONE_NAMES = ["BlockType{name=minecraft:stained_glass_pane}", "BlockType{name=minecraft:stained_glass}"]

let displayList = undefined;
let changed = true;
let renderPos;

const data = JSON.parse(FileLib.read("AzaAddons", "../../data/shaftWaypoints.json"))

let Scan = () => {
    if (scanning) return;
    scanning = true;

    let range = settings().gemScannerRange;
    let newgemstones = [];

    new Thread(() => {
        try {
            let X = Math.floor(Player.getX());
            let Y = Math.floor(Player.getY());
            let Z = Math.floor(Player.getZ());
            for (x = -range; x <= range; x++) {
                for (y = -range; y <= range; y++) {
                    for (z = -range; z <= range; z++) {
                        let block = World.getBlockAt(X + x, Y + y, Z + z);
                        if (GEMSTONE_NAMES.includes(block.type.toString())) {
                            let color;

                            switch (block.getMetadata()) {
                                case 1: // Orange - Amber
                                    if (settings().gemToggleAmber) {
                                        color = {
                                            r: 1,
                                            g: 0.5,
                                            b: 0
                                        }
                                    }
                                    break;
                                case 2: // Magenta - Jasper
                                    if (settings().gemToggleJasper) {
                                        color = {
                                            r: 1,
                                            g: 0,
                                            b: 1
                                        }
                                    }
                                    break;
                                case 3: // Light Blue - Sapphire
                                    if (settings().gemToggleSapphire) {
                                        color = {
                                            r: 0.2,
                                            g: 0.9,
                                            b: 1
                                        }
                                    }
                                    break;
                                case 4: // Yellow - Topaz
                                    if (settings().gemToggleTopaz) {
                                        color = {
                                            r: 1,
                                            g: 1,
                                            b: 0
                                        }
                                    }
                                    break;
                                case 5: // Lime - Jade
                                    if (settings().gemToggleJade) {
                                        color = {
                                            r: 50 / 255,
                                            g: 205 / 255,
                                            b: 50 / 255
                                        }
                                    }
                                    break;
                                case 10: // Purple - Amethys
                                    if (settings().gemToggleAmethys) {
                                        color = {
                                            r: 0.6,
                                            g: 0,
                                            b: 1
                                        }
                                    }
                                    break;
                                case 11: // Blue - Aquamarine
                                    if (settings().gemToggleAquamarine) {
                                        color = {
                                            r: 51 / 255,
                                            g: 1,
                                            b: 1
                                        }
                                    }
                                    break;
                                case 12: // Brown - Citrine
                                    if (settings().gemToggleCitrine) {
                                        color = {
                                            r: 150 / 255,
                                            g: 75 / 255,
                                            b: 0
                                        }
                                    }
                                    break;
                                case 13: // Green - Peridot
                                    if (settings().gemTogglePeridot) {
                                        color = {
                                            r: 0,
                                            g: 1,
                                            b: 0
                                        }
                                    }
                                    break;
                                case 14: // Red - Ruby
                                    if (settings().gemToggleRuby) {
                                        color = {
                                            r: 1,
                                            g: 0,
                                            b: 0
                                        }
                                    }
                                    break;
                                case 15: // Black - Onyx
                                    if (settings().gemToggleOnyx) {
                                        color = {
                                            r: 1,
                                            g: 1,
                                            b: 1
                                        }
                                    }
                                    break;
                            }

                            if (color) newgemstones.push({ x: X + x, y: Y + y, z: Z + z, r: color.r, g: color.g, b: color.b });
                        }
                    }
                }
            }
            gemstones = newgemstones;
            changed = true;
            updatePos();
        } catch (error) {

        } finally {
            scanning = false;
        }
    }).start();
};

// stuff every step 
function findRoomType() {
    const scoreboard = Scoreboard.getLines()
    const line = scoreboard[scoreboard.length - 1]?.toString()?.removeFormatting()?.slice(-5)

    const material = line?.slice(0, -1)
    const type = line?.endsWith("2") ? "Crystal" : line

    if (type in data.rooms && material in data.names) {
        currentRoom = data.rooms[type]
        let name = data.names[material]

        // If the room type is "Crystal", adjust the format so "Crystal" comes before any emoticons
        if (type === "Crystal") {
            // Split the name and emoticons
            const nameParts = name.split(" ");
            const emoticons = nameParts.slice(1).join(" "); // Get everything after the first word
            name = `${nameParts[0]} crystal ${emoticons}`; // Reformat name with Crystal in the middle
        }
        displayTitle(30, 5, name, 80)
        setTimeout(() => {
            displayTitle(1, 5, "", 80)
        }, 1500)
        ChatLib.chat(`${prefix} ${name}`)
    }
}

registerWhen(register("step", () => {
    if (settings().shaftTypeNotifier) if (!currentRoom) findRoomType();
}).setDelay(1), () => mineshaftCheck.check())

const updatePos = () => {
    let pmp = new PlayerMP(Player.getPlayer());

    renderPos = {
        x: pmp.getRenderX(),
        y: pmp.getRenderY(),
        z: pmp.getRenderZ()
    }
}

let BoxDraw = () => {
    if (changed) {
        updatePos();

        if (!displayList) {
            displayList = GL11.glGenLists(1);
        }

        GL11.glNewList(displayList, GL11.GL_COMPILE);
        let overlayHeight = settings().gemEspBoxSize / 10
        gemstones.forEach((gemstone) => {
            drawInnerEspBox(
                gemstone.x + 0.5,
                gemstone.y + 0.5 - (overlayHeight / 2),
                gemstone.z + 0.5,
                settings().gemEspBoxSize / 10,
                settings().gemEspBoxSize / 10,
                gemstone.r,
                gemstone.g,
                gemstone.b,
                settings().gemAlpha / 100,
                settings().gemRenderMode === 1
            );
        });

        GL11.glEndList();
    }

    GL11.glCallList(displayList);

    changed = false;
};

const DotDraw = () => {
    GL11.glDisable(GL11.GL_CULL_FACE);
    GL11.glBlendFunc(770, 771);
    GL11.glEnable(GL11.GL_BLEND);
    GL11.glLineWidth(2.0);
    GL11.glDisable(GL11.GL_TEXTURE_2D);
    GL11.glDisable(GL11.GL_DEPTH_TEST);
    GL11.glDepthMask(false);
    GlStateManager.func_179094_E();

    GL11.glPointSize(10);

    gemstones.forEach(gemstone => {
        Tessellator
            .begin(GL11.GL_POINTS, false)
            .colorize(gemstone.r, gemstone.g, gemstone.b, settings().gemAlpha / 100)
            .pos(gemstone.x + 0.5, gemstone.y + 0.5, gemstone.z + 0.5)
            .draw();
    });

    GL11.glEnable(GL11.GL_CULL_FACE);
    GlStateManager.func_179121_F();
    GL11.glEnable(GL11.GL_TEXTURE_2D);
    GL11.glEnable(GL11.GL_DEPTH_TEST);
    GL11.glDepthMask(true);
    GL11.glDisable(GL11.GL_BLEND);
}

let i = 0
register('tick', () => {
    if (settings().gemToggle) {
        if (!settings().gemOnlyMineshaft) {
            if (i >= settings().gemScannerInterval) {
                Scan()
                i = 0
            }
            i += 1
        } else {
            if (mineshaftCheck.check()) {
                if (i >= settings().gemScannerInterval) {
                    Scan()
                    i = 0
                }
                i += 1
            }
        }

    }
});

register('renderWorld', () => {
    if (!settings().gemToggle) return;

    if (gemstones.length <= 0) return;

    if (settings().gemRenderMode === 0 || settings().gemRenderMode === 1) {
        enableGL();
        let pmp = new PlayerMP(Player.getPlayer());

        let locRenderPos = {
            x: renderPos.x - pmp.getRenderX(),
            y: renderPos.y - pmp.getRenderY(),
            z: renderPos.z - pmp.getRenderZ()
        }

        if (!changed) Tessellator.translate(locRenderPos.x, locRenderPos.y, locRenderPos.z);
        BoxDraw();
        disableGL();
    }
    else if (settings().gemRenderMode === 2) {
        DotDraw();
    }
});

const getNeighbours = (x, y, z) => {
    let neighbours = [false, false, false, false, false, false];

    let mx = x - 0.5;
    let my = y;
    let mz = z - 0.5;

    if (gemstones.find(gemstone => ((gemstone.x === mx) && (gemstone.y === my - 1) && (gemstone.z === mz)))) neighbours[0] = true;
    if (gemstones.find(gemstone => ((gemstone.x === mx) && (gemstone.y === my + 1) && (gemstone.z === mz)))) neighbours[1] = true;
    if (gemstones.find(gemstone => ((gemstone.x === mx - 1) && (gemstone.y === my) && (gemstone.z === mz)))) neighbours[2] = true;
    if (gemstones.find(gemstone => ((gemstone.x === mx + 1) && (gemstone.y === my) && (gemstone.z === mz)))) neighbours[3] = true;
    if (gemstones.find(gemstone => ((gemstone.x === mx) && (gemstone.y === my) && (gemstone.z === mz - 1)))) neighbours[4] = true;
    if (gemstones.find(gemstone => ((gemstone.x === mx) && (gemstone.y === my) && (gemstone.z === mz + 1)))) neighbours[5] = true;

    return neighbours;
}

const getNeighbours2 = (x, y, z) => {
    let neighbours = [false, false, false, false, false, false];

    let mx = x - 0.5;
    let my = y;
    let mz = z - 0.5;

    gemstones.forEach(gemstone => {
        let gx = gemstone.x;
        let gy = gemstone.y;
        let gz = gemstone.z;

        if ((gx === mx) && (gy === my - 1) && (gz === mz)) neighbours[0] = true;
        if ((gx === mx) && (gy === my + 1) && (gz === mz)) neighbours[1] = true;
        if ((gx === mx - 1) && (gy === my) && (gz === mz)) neighbours[2] = true;
        if ((gx === mx + 1) && (gy === my) && (gz === mz)) neighbours[3] = true;
        if ((gx === mx) && (gy === my) && (gz === mz - 1)) neighbours[4] = true;
        if ((gx === mx) && (gy === my) && (gz === mz + 1)) neighbours[5] = true;
    });

    return neighbours;
}

const drawInnerEspBox = (x, y, z, w, h, red, green, blue, alpha, veinMode) => {
    w /= 2;

    Tessellator.begin(GL11.GL_QUADS, false);
    Tessellator.colorize(red, green, blue, alpha);

    Tessellator.translate(x, y, z);

    let neighbours = [false, false, false, false, false, false];

    if (veinMode) {
        switch (settings().gemNeighbourAlgo) {
            case 0:
                neighbours = getNeighbours(x, y, z);
                break;
            case 1:
                neighbours = getNeighbours2(x, y, z);
                break;
        }
    }

    // -Y
    if (!neighbours[0])
        Tessellator.pos(w, 0, w)
            .pos(w, 0, -w)
            .pos(-w, 0, -w)
            .pos(-w, 0, w);

    // Y
    if (!neighbours[1])
        Tessellator.pos(w, h, w)
            .pos(w, h, -w)
            .pos(-w, h, -w)
            .pos(-w, h, w);

    // -X
    if (!neighbours[2])
        Tessellator.pos(-w, h, w)
            .pos(-w, h, -w)
            .pos(-w, 0, -w)
            .pos(-w, 0, w);

    // +X
    if (!neighbours[3])
        Tessellator.pos(w, h, w)
            .pos(w, h, -w)
            .pos(w, 0, -w)
            .pos(w, 0, w);

    // -Z
    if (!neighbours[4])
        Tessellator.pos(w, h, -w)
            .pos(-w, h, -w)
            .pos(-w, 0, -w)
            .pos(w, 0, -w);

    // +Z
    if (!neighbours[5])
        Tessellator.pos(-w, h, w)
            .pos(w, h, w)
            .pos(w, 0, w)
            .pos(-w, 0, w);

    Tessellator.draw();
};

const enableGL = () => {
    GL11.glDisable(GL11.GL_CULL_FACE);
    GL11.glBlendFunc(770, 771);
    GL11.glEnable(GL11.GL_BLEND);
    GL11.glLineWidth(2.0);
    GL11.glDisable(GL11.GL_TEXTURE_2D);
    GL11.glDisable(GL11.GL_DEPTH_TEST);
    GL11.glDepthMask(false);
    GlStateManager.func_179094_E();
}

const disableGL = () => {
    GL11.glEnable(GL11.GL_CULL_FACE);
    GlStateManager.func_179121_F();
    GL11.glEnable(GL11.GL_TEXTURE_2D);
    GL11.glEnable(GL11.GL_DEPTH_TEST);
    GL11.glDepthMask(true);
    GL11.glDisable(GL11.GL_BLEND);
}

register("worldLoad", () => {
    currentRoom = undefined
    gemstones = []
    scanning = false
})