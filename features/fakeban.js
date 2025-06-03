function fakeban(time, reason, banid) {
    Client.getMinecraft().func_147114_u().func_147253_a(new net.minecraft.network.play.server.S40PacketDisconnect(new TextComponent(`§cYou are temporarily banned for §f${time} §cfrom this server!\n\n§7Reason: §f${reason}\n§7Find out more: §b§nh§b§nt§b§nt§b§np§b§ns§b§n:§b§n/§b§n/§b§nw§b§nw§b§nw§b§n.§b§nh§b§ny§b§np§b§ni§b§nx§b§ne§b§nl§b§n.§b§nn§b§ne§b§nt§b§n/§b§na§b§np§b§np§b§ne§b§na§b§nl§b§n§r\n\n§7Ban ID: §f#${banid}\n§7Sharing your Ban ID may affect the processing of your appeal!`).chatComponentText));
}
register("command", (...args) => {
    let time = undefined;
    let reason = undefined;
    let banid = undefined;
    if (args[0] == "cheating") {
        time = "29d 23h 59m 59s"
        reason = "Cheating through the use of unfair game advantages."
        banid = "URAID10T"
    }
    else if (args[0] == "boosting") {
        time = "89d 23h 59m 57s"
        reason = "Boosting detected on one or multiple SkyBlock profiles."
        banid = "URAID10T"
    }
    else {
        customArg = args.join(" ").split(",")
        time = customArg[0]
        reason = customArg[1]
        banid = customArg[2]
    }
    fakeban(time, reason, banid)
}).setName("fakeban")