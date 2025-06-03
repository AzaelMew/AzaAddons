
// OPTIMIZED: Performance enhancements applied
/// <reference types="../../../CTAutocomplete" />
/// <reference lib="es2015" />
import { renderBoxOutline, renderFilledBox } from "../../../BloomCore/RenderUtils"
import { EntityArmorStand, getEntitySkullTexture, getEntityXYZ } from "../../../BloomCore/utils/Utils"
import PogObject from "../../../PogData"
import settings from "../../config"

let eggs = []

let data = {
    inFactory: false,
    fullyLoaded: false, // Flips to true when every item in the gui has been loaded
    windowId: null,
    chocolate: 0,
    chocolateSlot: null,
    allTimeChocolate: 0,
    cps: 0,
    baseCps: 0,
    cpsMultiplier: 0,
    factoryTier: 1,
    canPrestige: false,
    factoryItemSlot: null,
    productionMultipliers: {}, // {"Hoppity's Collection": 0.693, ...}
    cpsSources: {}, // {"Rabbit Employees": 2630, ...}
    bestUpgrade: null, // {slot: 10, cost: 100000000, costPerCps: 420}
    employees: {},
    jackrabbit: {
        level: 0,
        cost: null,
        slot: null,
    },
    timeTower: {
        level: 0,
        cost: null,
        slot: null,
    },
    rabbitShrine: {
        level: 0,
        cost: null,
        slot: null,
    },
}
const pogObj = new PogObject("AzaAddons", {
    lastEggAnnounced: null,
    debug: false,
    eggs: {
        breakfast: {
            isAvailable: null,
            lastSpawn: null,
        },
        lunch : {
            isAvailable: null,
            lastSpawn: null,
        },
        dinner : {
            isAvailable: null,
            lastSpawn: null,
        },
        x: Renderer.screen.getWidth()/2,
        y: Renderer.screen.getHeight()/2
    },
    rabbits: {
        common: {
            unique: 0,
            duplicates: 0,
            total: 0,
        },
        uncommon: {
            unique: 0,
            duplicates: 0,
            total: 0,
        },
        rare: {
            unique: 0,
            duplicates: 0,
            total: 0,
        },
        epic: {
            unique: 0,
            duplicates: 0,
            total: 0,
        },
        legendary: {
            unique: 0,
            duplicates: 0,
            total: 0,
        },
        mythic: {
            unique: 0,
            duplicates: 0,
            total: 0,
        },
        divine: {
            unique: 0,
            duplicates: 0,
            total: 0,
        },
        total: 0,
        totalDuplicates: 0,
        totalUniques: 0,
        lastUnique: 0,
        x: Renderer.screen.getWidth()/2,
        y: Renderer.screen.getHeight()/2
    }
}, "userdata/eggs.json")
pogObj.autosave()

const skullTextures = {
    "§6Chocolate Breakfast Egg": "ewogICJ0aW1lc3RhbXAiIDogMTcxMTQ2MjY3MzE0OSwKICAicHJvZmlsZUlkIiA6ICJiN2I4ZTlhZjEwZGE0NjFmOTY2YTQxM2RmOWJiM2U4OCIsCiAgInByb2ZpbGVOYW1lIiA6ICJBbmFiYW5hbmFZZzciLAogICJzaWduYXR1cmVSZXF1aXJlZCIgOiB0cnVlLAogICJ0ZXh0dXJlcyIgOiB7CiAgICAiU0tJTiIgOiB7CiAgICAgICJ1cmwiIDogImh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYTQ5MzMzZDg1YjhhMzE1ZDAzMzZlYjJkZjM3ZDhhNzE0Y2EyNGM1MWI4YzYwNzRmMWI1YjkyN2RlYjUxNmMyNCIKICAgIH0KICB9Cn0",
    "§9Chocolate Lunch Egg": "ewogICJ0aW1lc3RhbXAiIDogMTcxMTQ2MjU2ODExMiwKICAicHJvZmlsZUlkIiA6ICI3NzUwYzFhNTM5M2Q0ZWQ0Yjc2NmQ4ZGUwOWY4MjU0NiIsCiAgInByb2ZpbGVOYW1lIiA6ICJSZWVkcmVsIiwKICAic2lnbmF0dXJlUmVxdWlyZWQiIDogdHJ1ZSwKICAidGV4dHVyZXMiIDogewogICAgIlNLSU4iIDogewogICAgICAidXJsIiA6ICJodHRwOi8vdGV4dHVyZXMubWluZWNyYWZ0Lm5ldC90ZXh0dXJlLzdhZTZkMmQzMWQ4MTY3YmNhZjk1MjkzYjY4YTRhY2Q4NzJkNjZlNzUxZGI1YTM0ZjJjYmM2NzY2YTAzNTZkMGEiCiAgICB9CiAgfQp9",
    "§aChocolate Dinner Egg": "ewogICJ0aW1lc3RhbXAiIDogMTcxMTQ2MjY0OTcwMSwKICAicHJvZmlsZUlkIiA6ICI3NGEwMzQxNWY1OTI0ZTA4YjMyMGM2MmU1NGE3ZjJhYiIsCiAgInByb2ZpbGVOYW1lIiA6ICJNZXp6aXIiLAogICJzaWduYXR1cmVSZXF1aXJlZCIgOiB0cnVlLAogICJ0ZXh0dXJlcyIgOiB7CiAgICAiU0tJTiIgOiB7CiAgICAgICJ1cmwiIDogImh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTVlMzYxNjU4MTlmZDI4NTBmOTg1NTJlZGNkNzYzZmY5ODYzMTMxMTkyODNjMTI2YWNlMGM0Y2M0OTVlNzZhOCIKICAgIH0KICB9Cn0",
}

let inHoppity = false

register("chat", (egg) => {
    mostRecentEgg = egg
}).setCriteria(/^HOPPITY'S HUNT A (.+) has appeared!$/)

register("worldUnload", () => {
    mostRecentEgg = null
})

register("step", () => {
    inHoppity = Scoreboard?.getLines()?.findIndex(line => line?.getName()?.removeFormatting()?.replace(/[^\u0000-\u007F]/g, "")?.includes(' Spring ')) != -1

    if (!inHoppity || !settings().eggEsp) {
        eggEsp.unregister()
        return
    } else {
        eggEsp.register()
    }

    const stands = World.getAllEntitiesOfType(EntityArmorStand)
    eggs = []
    stands.forEach(entity => {
        const skullTexture = getEntitySkullTexture(entity)

        if (!skullTexture) return

        Object.entries(skullTextures).forEach(([eggName, eggTexture]) => {
            if (skullTexture !== eggTexture) return
            let [r, g, b] = [1, 1, 0]
            if (settings().jenify) {
                [r, g, b] = [82/255, 32/255, 129/255]
            }


            let eggType = eggName.split(' ')[1].toLowerCase()
            
            if (eggType in pogObj.eggs && pogObj.eggs[eggType].isAvailable) r = 0

            eggs.push({
                entity: entity,
                color: [r, g, b],
                name: eggName
            })
        })
    })
}).setFps(1)

const eggEsp = register("renderWorld", () => {
    eggs.forEach(e => {
        const { entity, color, name } = e
        const [x, y, z] = getEntityXYZ(entity)
        const [r, g, b] = color
        renderFilledBox(x, y+1.4, z, 0.8, 0.8, r, g, b, 0.2, true)
        renderBoxOutline(x, y+1.4, z, 0.8, 0.8, r, g, b, 1, 2, true)
        Tessellator.drawString(name, x, y+3, z)
    })
}).unregister()