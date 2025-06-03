import settings from "../config"
import { prefixNoFormat, prefix } from "../index";
import { registerWhen } from "../utils/helperUtil";

let lastTriggered = 0;
let lastItemId = "";

registerWhen(
    register("actionBar", () => {
        const now = new Date().getTime();

        // Ignore if triggering too soon (e.g., within 500ms)
        if (now - lastTriggered < 500) return;

        const held = Player.getHeldItem();
        if (!held) return;

        const nbt = held.getNBT().getCompoundTag("tag").getCompoundTag("ExtraAttributes");
        const itemId = nbt.getString("id");

        if (itemId !== "RAGNAROCK_AXE") return;

        // Only proceed if not already triggered for this item within cooldown
        if (lastItemId === itemId && now - lastTriggered < 3000) return;

        lastItemId = itemId;
        lastTriggered = now;

        let strength = held.getLore().find((line) => line.startsWith("§5§o§7Strength:"))?.split(" ")?.[1]?.substring(3) ?? 0;
        strength = strength * 1.5;
        Client.showTitle(`${settings().ragAxeTitle}`, "", 0, 15, 15);
        if (settings().ragAxeSayMsg && !settings().ragAxeSayParty) {
            ChatLib.chat(`${prefix} ${settings().ragAxeText.replace("${strength}", strength)}`)
        }
        if (settings().ragAxeSayParty) {
            ChatLib.command(`pc ${prefixNoFormat} ${settings().ragAxeText.replace("${strength}", strength)}`);
        }
    }).setCriteria("${before}CASTING"),
    () => settings().ragAxe
);
