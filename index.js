
// OPTIMIZED: Performance enhancements applied
/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />
export const prefix = "§5[§dAzaAddons§5]§r"
export const prefixNoFormat = "[AzaAddons]"
//imports
import settings from "./config"
import "./features/party"
import "./features/esps/otherEsp"
import "./features/esps/gemEsp"
import "./features/esps/eggEsp"
import "./features/chatmodify"
import "./features/fakeban"
import "./features/yellingthing"
import "./features/muteBypass"
import "./features/disasters"
import "./features/melody"
import "./features/ragAxe"

import { hubCheck, updateRegisters } from "./utils/helperUtil";

register("worldLoad", () => {
    Client.scheduleTask(20, updateRegisters);
    Client.scheduleTask(60, updateRegisters);
    setTimeout(() => {
        if(hubCheck.check() && settings().afkMode){
            ChatLib.command("is")
        }
    }, 5500);
})

updateRegisters()
register("guiClosed", () => {
    updateRegisters();
});
register("guiOpened", () => {
    updateRegisters();
});