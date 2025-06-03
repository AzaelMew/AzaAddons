
// OPTIMIZED: Performance enhancements applied
const File = Java.type("java.io.File")

/**
 * Adds commas to the number.
 * @param {Number} num
 * @returns
 */
export function addCommas(num) {
    try {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    } catch (error) {
        return 0
    }
}


/**
 * Adds notation based on type to the value.
 * @param {String} type oneLetters, shortScale, commas
 * @param {Number} value
 * @returns The notated value.
 */
export function addNotation(type, value) {
    let returnVal = value
    let notList = []
    if (type === "shortScale") {
        notList = [
            " Thousand",
            " Million",
            " Billion",
            " Trillion",
            " Quadrillion",
            " Quintillion"
        ]
    }

    if (type === "oneLetters") {
        notList = [" K", " M", " B", " T"]
    }

    let checkNum = 1000
    if (type !== "none" && type !== "commas") {
        let notValue = notList[notList.length - 1]
        for (let u = notList.length; u >= 1; u--) {
            notValue = notList.shift()
            for (let o = 3; o >= 1; o--) {
                if (value >= checkNum) {
                    returnVal = value / (checkNum / 100)
                    returnVal = Math.floor(returnVal)
                    returnVal = (returnVal / Math.pow(10, o)) * 10
                    returnVal = +returnVal.toFixed(o - 1) + notValue
                }
                checkNum *= 10
            }
        }
    } else {
        returnVal = addCommas(value.toFixed(0))
    }

    return returnVal
}

/**
 * Renders a waypoint.
 * @param {Number[][]} waypoints
 * @param {Boolean} yellow If the waypoints should be yellow, default false.
 * @param {Boolean} numbered If the waypoints should be numbered, default false.
 * @returns
 */
export function waypointRender(waypoints, yellow=false, numbered=false)
{
    let string = ""
    if(waypoints.length < 1) return
    waypoints.forEach((waypoint, index) => {
        string = Math.floor((Math.abs(parseInt(Player.getX()) - waypoint[0]) + Math.abs(parseInt(Player.getY()) - waypoint[1]) + Math.abs(parseInt(Player.getZ()) - waypoint[2]))/3) + "m"
        if (numbered)
            string = index + 1

        if (yellow)
            Tessellator.drawString(string, waypoint[0], waypoint[1], waypoint[2], 0xFAFD01)
        else
            Tessellator.drawString(string, waypoint[0], waypoint[1], waypoint[2])
    })
}

/**
 * Gets a value from an object with a dynamic path to the value.
 * @param {Object} obj
 * @param {String[]} path
 * @returns
 */
export function getObjectValue(obj, path)
{
	let current = obj
    if(path == undefined) return undefined
    for (let i = 0; i < path.length; i++)
        current = current[path[i]]

	return current
}


export function parseNotatedInput(input)
{
    for(let index = 0; index < input.length; index++)
    {

        switch(input[index])
        {
            case "k":
                return 1000 * parseFloat(input.slice(0, index))
            case "m":
                return 1000000 * parseFloat(input.slice(0, index))
        }
    }
    if(parseFloat(input) == input)
        return parseFloat(input)
    else
        return undefined
}


/**
 * Gets the selected profile.
 * @param {Object} res The response from requesting https://api.hypixel.net/skyblock/profiles
 * @returns Selected profile
 */
export function getSelectedProfile(res)
{
    for(let i=0; i < res.profiles.length; i+=1)
    {
        if(res.profiles[i].selected == true)
            return res.profiles[i]
    }
}

/**
 * Capitalizes the first letter of every word in a sentence.
 * @param {String} sentence
 * @returns String
 */
export function capitalizeFirst(sentence)
{
    if(sentence == undefined) return sentence
    let words = sentence.split(" "),
     capitalized = words.map(word => {
        return word[0].toUpperCase() + word.slice(1)
    })

    return capitalized.join(" ")
}

/**
 * This contains a value "drawState", this dictates whether or not this draw or not. Default to 0. Check for 1 in a "renderOverlay" to draw. (must set to draw.)
 * @returns
 */
export class Title
{
    /**
     *
     * @param {{text: string, scale: number, time: number, sound: string, yOffset: number, xOffset: number}} param0
     */
    constructor({text, scale = 5, time = 3000, sound = "random.orb", yOffset = 0, xOffset = 0})
    {
        this.text = text
        this.scale = scale
        this.time = time
        this.sound = sound
        this.yOffset = yOffset
        this.xOffset = xOffset
        this.drawState = 0
        this.drawing = false

        register("renderOverlay", () => {
            this.drawing = false
            if(this.drawState == 1)
            {
                this.drawing = true

                const title = new Text(this.text,
                    Renderer.screen.getWidth()/2 + this.xOffset,
                    Renderer.screen.getHeight()/2 - Renderer.screen.getHeight()/14 + this.yOffset
                )
                if(this.drawTimestamp == undefined)
                {
                    World.playSound(this.sound, 1, 1)
                    this.drawTimestamp = Date.now()
                    this.drawState = 1
                }
                else if (Date.now() - this.drawTimestamp > this.time)
                {
                    this.drawTimestamp = undefined
                    this.drawState = 2
                }
                else
                {
                    title.setAlign("CENTER")
                    .setShadow(true)
                    .setScale(this.scale)
                    .draw()
                    this.drawState = 1
                }
            }
        })
    }

    draw()
    {
        this.drawState = 1
    }

    isDrawing()
    {
        return this.drawing
    }
}

// could move below to it's own file or do something else
class LocationChecker
{
    /**
     *
     * @param {String[]} locations
     */
    constructor(locations)
    {
        this.locations = locations
        this.checkTime = Date.now()
        this.state = false
        this.scoreboard = 0
    }

    getState()
    {
        return this.check()
    }

    check()
    {
        if(Date.now() - this.checkTime > 1000) // 1 sec
        {
            this.checkTime = Date.now()
            this.scoreboard = Scoreboard.getLines()

            for(let lineIndex = 0; lineIndex < this.scoreboard.length; lineIndex++)
            {
                for(let locationsIndex = 0; locationsIndex < this.locations.length; locationsIndex++)
                {
                    if(this.scoreboard[lineIndex].toString().includes(this.locations[locationsIndex]))
                    {
                        this.state = true
                        return this.state
                    }
                }
            }
            this.state = false
            return this.state
        }
        else
            return this.state
    }
}

export const hollowsChecker = new LocationChecker(["Goblin", "Jungle", "Mithril", "Precursor", "Magma", "Crystal", "Khazad", "Divan", "City"])
export const dwarvenChecker = new LocationChecker(["Dwarven", "Royal", "Palace", "Library", "Mist", "Cliffside", "Quarry", "Gateway", "Wall", "Forge", "Far", "Burrows", "Springs", "Upper", "Glacite"])
export const foragingChecker = new LocationChecker(["§aDark Thic", "§aBirch Par", "§aSpruce Wo", "§aSavanna W", "§aJungle Is", "§bForest"])
export const endChecker = new LocationChecker(["End", "Dragon's"])
export const mirroverseCheck = new LocationChecker(["§fMirrorver"])
export const mineshaftCheck = new LocationChecker(["shaft"])
export const hotspotCheck = new LocationChecker(["Backwater", "Fishing", "Wildernes", "Spider's", "Mountain", "Wizard To", "Fisherman", "Colosseum", "Village", "Unincorpo"])
export const gardenCheck = new LocationChecker(["Garde"])
export const islandCheck = new LocationChecker(["§aYour I"])
export const hubCheck = new LocationChecker(["§bVillage"])
export const creeperCheck = new LocationChecker(["Gunpowder", "The Mist"])
export const gunpowderCheck = new LocationChecker(["Gunpowder"])
export const crimsonCheck = new LocationChecker(["Crimson I"])


/**
 * Converts seconds to a standard message.
 * @param {Number} seconds
 * @returns String
 */
export function secondsToMessage(seconds)
{
    let hour = Math.floor(seconds/60/60)
    if(hour < 1)
        return `${Math.floor(seconds/60)}m ${Math.floor(seconds%60)}s`
    else
        return `${hour}h ${Math.floor(seconds/60) - hour*60}m`
}

/**
 * Calculates distance between waypoints.
 * @param {{x: Number, y: Number, z: Number}} waypoint1
 * @param {{x: Number, y: Number, z: Number}} waypoint2
 * @returns
 */
export function distanceCalc(waypoint1, waypoint2, includeVertical = true)
{
    if(includeVertical)
        return Math.hypot(waypoint1.x - waypoint2.x, waypoint1.y - waypoint2.y, waypoint1.z - waypoint2.z)
    else
        return Math.hypot(waypoint1.x - waypoint2.x, waypoint1.z - waypoint2.z)
}

/**
 * Returns whether the playing is holding a drill, gemstone gauntlet, picko or not
 * @returns {boolean}
 */
export function isPlayerHoldingDrill()
{
    let itemId = Player.getHeldItem()?.getItemNBT()?.getTag("tag")?.getTag("ExtraAttributes")?.getTag("id")?.toString()?.toLowerCase()

    return itemId != undefined && (itemId.includes("drill") || itemId.includes("gemstone_gauntlet") || itemId.includes("pickonimbus"))
}


let registers = [];
/**
 * Adds a trigger to the registers array to be reset on updateRegisters() 
 * Credit: BloomCore
 * @param {Trigger} trigger 
 * @param {CallableFunction} dependency 
 */
export function registerWhen(trigger, dependency) {
    registers.push([trigger.unregister(), dependency, false]);
}

/**
 * Registers and unregisters triggers.
 */
export function updateRegisters() {
    registers.forEach(trigger => {
        if (trigger[1]() && !trigger[2])
        {
            trigger[0].register();
            trigger[2] = true;
        }
        else if (!trigger[1]() && trigger[2])
        {
            trigger[0].unregister();
            trigger[2] = false;
        }
    });
}

let timer = new Text('').setScale(5).setShadow(true).setAlign('CENTER')
let titleHeight = 80
let stringInput = ""
let ticks = 0
let a = 0
let b = 0

/**
 * Displays a secondary title
 * 
 * @param {Number} ticks - How many seconds (20ticks = 1second)
 * @param {Number} scale
 * @param {String} text
 */
export function displayTitle(tks, scale, text, height=80) {
    titleHeight = height
    timer.setScale(scale)
    ticks = tks
    stringInput = text
    tickCounter.register()
    stringOverlay.register()
}

/**
 * Displays a timer
 * 
 * @param {Number} ticks - How many seconds (20ticks = 1second)
 * @param {Number} scale
 */
export function displayTimerTitle(tks, scale, height=80) {
    titleHeight = height
    timer.setScale(scale)
    ticks = tks
    tickCounter.register()
    timerOverlay.register()
}

const tickCounter = register('packetReceived', (packet) => {
    ticks--
    if (ticks <= 0) tickCounter.unregister()
}).setFilteredClass(Java.type("net.minecraft.network.play.server.S32PacketConfirmTransaction")).unregister()

function unreg() {
    timer.setScale(3)
    ticks = 0
    a = 0
    stringInput = ""
}

const stringOverlay = register('renderOverlay', () => {
    a = (ticks / 20).toFixed(3);
    timer.setString(`${stringInput}`);
    timer.draw(Renderer.screen.getWidth() / 2, Renderer.screen.getHeight() / 2 - titleHeight);
    if (a <= 0) {unreg(); stringOverlay.unregister()}
}).unregister()

const timerOverlay = register('renderOverlay', () => {
    b = (ticks / 20).toFixed(3)
    let formattedTime = b >= (((60 * 50) / 100) / 20) ? `&a${b}` : (b >= (((60 * 25) / 100) / 20) ? `&e${b}` : `&c${b}`)
    timer.setString(formattedTime)
    timer.draw(Renderer.screen.getWidth() / 2, Renderer.screen.getHeight() / 2 - titleHeight)
    if (b <= 0) {unreg(); timerOverlay.unregister()}
}).unregister()


register(`worldUnload`, () => {
    if (a != 0) stringOverlay.unregister()
    if (b != 0) timerOverlay.unregister()
})

export function autocomplete(args) {
    const list = [];
    Player.getPlayer().field_71174_a.func_175106_d().forEach(v => {
        const t = v.func_178850_i();
        if (!t || !t.func_96661_b().startsWith('a')) return;
        list.push(v.func_178845_a().getName());
    });
    const a = args[0].toLowerCase();
    if (a) return list.filter(v => v.toLowerCase().startsWith(a));
    return list;
}