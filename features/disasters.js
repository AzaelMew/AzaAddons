
// OPTIMIZED: Performance enhancements applied
import settings from "../config"

import { drawCoolWaypoint, drawEspBox } from "../utils/renderUtil"

function parsePotion(input) {
    return input.map(item => {
        const match = item.toString().match(/potion\.(\w+)(?: x (\d+))?, Duration: (\d+)/);
        if (match) {
            const effect = match[1];
            const quantity = match[2] || 1; // Default to 1 if no multiplier is specified
            const duration = (parseInt(match[3], 10) / 20).toFixed(2); // Divide duration by 20
            return {
                type: `${effect.charAt(0).toUpperCase() + effect.slice(1)} ${quantity}`,
                duration: duration
            };
        }
        return { error: "Invalid input" }; // Return an error object for invalid inputs
    });
}
register('step', () => {
    // potion solver
    if (settings().potionsolver) {
        let ctItem = Player.getHeldItem()
        let potionCheck
        if (Player.getHeldItem() != null) {
            potionCheck = ctItem.getID()
        }
        try {
            if (Scoreboard.getTitle()?.includes("DISASTERS")) {
                if (Player.getHeldItem() == null) return
                if (potionCheck == "373" && !ctItem.getName().includes("&b&l")) {
                    let potionItem = ctItem
                    let potionEffects = potionItem.getItemStack().func_77973_b().func_77832_l(potionItem.getItemStack()) //getItem().getEffects()
                    let stuff = parsePotion(potionEffects)
                    potionItem.setName(`&b&l${stuff[0].type}&r &7- &c${stuff[0].duration}s`)
                }
            }
        } catch (error) {
            //do nothing, this is error handoling trust
        }
    }
})

register("renderWorld", () => {
    if (settings().goldesp || settings().vendingesp || settings().zombieESP || settings().dragonESP || settings().itemESP) { // Added settings().itemESP here
        if (Scoreboard.getTitle().removeFormatting()?.includes("DISASTERS") || Scoreboard.getTitle().removeFormatting()?.includes("ZOMBIES")) {
            World.getAllEntities().forEach(entity => {
                // zombie esp
                if (settings().zombieESP) {
                    if (entity.getName().includes("Zombie")) {
                        let x = entity.getX()
                        let y = entity.getY()
                        let z = entity.getZ()
                        drawEspBox(x, y, z, 0.75, 2, 58 / 255, 114 / 255, 29 / 255, 1, true)
                    }
                }
                //ender dragon esp
                if (settings().dragonESP) {
                    if (entity.getName().includes("Ender Dragon")) {
                        let x = entity.getX()
                        let y = entity.getY()
                        let z = entity.getZ()
                        drawEspBox(x, y, z, 15, 4, 107 / 255, 3 / 255, 201 / 255, 1, true)
                    }
                }
                // gold esp toggle & render stuff
                if (settings().goldesp) {
                    if (entity.getName().includes("item.item.ingotGold")) {
                        drawEspBox(entity.getX(), entity.getY(), entity.getZ(), 0.5, 0.5, 255 / 255, 255 / 255, 0 / 255, 1, true)
                    }
                }
                // vending machine esp toggle & render stuff
                if (settings().vendingesp) {
                    if (entity.getName().includes("VENDING MACHINE")) {
                        Tessellator.drawString("Vending Machine", entity.getX(), entity.getY(), entity.getZ(), Renderer.color(227, 178, 60), true, 1, true)
                        drawEspBox(entity.getX(), entity.getY() - 3, entity.getZ(), 4, 4, 227 / 255, 178 / 255, 60 / 255, 1, true)
                    }
                }
                // Item ESP - NEW FEATURE
                if (settings().itemESP) {
                    const itemsToFind = [
                        " helmet",
                        " chestplate",
                        " leggings",
                        " boots",
                        " sword",
                        "boat",
                        "snowball",
                        " pearl",
                        " bucket",
                        "hard hat",
                        " potion"
                    ];

                    itemsToFind.forEach(item => {
                        if (entity.getName().toLowerCase().includes(item) && entity.getName().includes("§l")) {
                            let x = entity.getX();
                            let y = entity.getY();
                            let z = entity.getZ();
                            drawEspBox(x, y-0.5, z, 0.75, 0.75, 0 / 255, 255 / 255, 0 / 255, 1, true); // Green color for item ESP
                            Tessellator.drawString(entity.getName(), x, y + 1, z, Renderer.color(0, 255, 0), true, 1, true)
                        }
                    });
                }
            })
        }
    }
})
