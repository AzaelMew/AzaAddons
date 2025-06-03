
// OPTIMIZED: Performance enhancements applied
import settings from "../config";
const AxisAlignedBB = Java.type("net.minecraft.util.AxisAlignedBB");
const EntityOtherPlayerMP = Java.type("net.minecraft.client.entity.EntityOtherPlayerMP");
let yellArray = []
let shouldListen = false
//functions
function syncUsernames(arr1, arr2) {
    arr1.forEach(username => {
        if (!arr2.includes(username)) {
            arr2.push(username);
        }
    });
    for (let i = arr2.length - 1; i >= 0; i--) {
        if (!arr1.includes(arr2[i])) {
            arr2.splice(i, 1);
        }
    }
    return arr2;
}
function getPlayerUsernames(players) {
    return players.map(entity => {
        const match = entity.toString().match(/EntityOtherPlayerMP\['(.+?)'/);
        return match ? match[1] : null;
    }).filter(username => username !== null);
}
register("chat", function (event) {
    let message = ChatLib.getChatMessage(event, true);
    if (settings().shouldYell) {
        if (message.includes("&4[BOSS] Maxor&r&c: &r&cWELL! WELL! WELL! LOOK WHO'S HERE!")) {
            shouldListen = true
        }
        if (message.includes("&4[BOSS] Storm&r&c: &r&cThe power of lightning is quite phenomenal. A single strike can vaporize a person whole.")) {
            shouldListen = false
        }
    }
})
register("step", () => {
    // Yelling thing
    if (settings().shouldYell) {
        if (shouldListen) {
            let x = Player.getX()
            let y = Player.getY()
            let z = Player.getZ()
            let AABB = new AxisAlignedBB(x + 7, y + 7, z + 7, x - 7, y - 7, z - 7);
            let usernames = getPlayerUsernames(World.getWorld().func_72872_a(EntityOtherPlayerMP, AABB))

            if (x > 1 && x < 108 && y > 115 && y < 159 && z > 32 && z < 137) {
                usernames.forEach(user => {
                    if (!yellArray.includes(user)) {
                        ChatLib.say("/pc hi " + user + "!")
                    }
                });
                yellArray = syncUsernames(usernames, yellArray)
            }
        }
    }
})