
// OPTIMIZED: Performance enhancements applied
import settings from "../config"

const S2FPacketSetSlot = Java.type("net.minecraft.network.play.server.S2FPacketSetSlot")
const C0EPacketClickWindow = Java.type("net.minecraft.network.play.client.C0EPacketClickWindow")

const sendWindowClick = (windowId, slot, clickType, actionNumber=0) => Client.sendPacket(new C0EPacketClickWindow(windowId ?? Player.getContainer().getWindowId(), slot, clickType ?? 0, 0, null, actionNumber))
const slots = [37, 38, 39, 40, 41, 42, 43]
let canClick = false

const funkyStuff = () => {
    canClick = false
    let inv = Player.getContainer()
    if (!inv || !inv.getName().startsWith("Harp - ") || inv.getSize() < 54) return
    for (let s of slots) {
        let item = inv.getStackInSlot(s-9)
        if (!item) continue
        let name = item.getName()
        let split = name.split(" ")
        if (split.length < 2) continue
        let color = split[1][1]
        if (color == "7") continue
        sendWindowClick(null, s, 0)
        canClick = false
    }
}

register("packetReceived", () => {
    if (!settings().melody) return;
    if (canClick) return
    canClick = true
    Client.scheduleTask(settings().melodyDelay, funkyStuff)
}).setPacketClass(S2FPacketSetSlot)

class Note {
    constructor(slot) {
        this.slot = slot
        this.clicked = false
        this.delay = settings().melodyDelay2
    }
}
const notes = [new Note(37), new Note(38), new Note(39), new Note(40), new Note(41), new Note(42), new Note(43)]

register('tick', () => {
    if (!settings().melodyToggle) return
    let inv = Player.getOpenedInventory()
    if (inv === undefined) return
    if (inv.getName().indexOf('Harp') !== 0) return

    notes.forEach(note => {
        if (note.delay > 0)
            note.delay--

            
        const item = inv.getStackInSlot(note.slot)
        if (item?.getID() === 159) {
            note.clicked = false
            note.delay = 0
        }
        if (item?.getID() === 155) {
            if (note.clicked || note.delay !== 0) return
            if (inv.getStackInSlot(note.slot - 9)?.getID() === 35) note.delay = 0
            else note.clicked = true
            inv.click(note.slot,false,"MIDDLE")
        }
    })
})