
// OPTIMIZED: Performance enhancements applied
import Settings from "../Amaterasu/core/Settings"
import DefaultConfig from "../Amaterasu/core/DefaultConfig"
const defaultConf = new DefaultConfig("AzaAddons", "userdata/settings.json")
    // GENERAL STUFF
    // 
    .addSwitch({
        category: "General",
        subcategory: "ESPs",
        configName: "playerbox",
        title: "Player Box",
        description: "Highlight players of your liking! /box",
    })
    .addSwitch({
        category: "General",
        subcategory: "ESPs",
        configName: "creeperrevealer",
        title: "Creeper Revealer",
        description: "Reveals hidden creepers in Deep Caverns & The Mist",
    })
    .addSwitch({
        category: "General",
        subcategory: "ESPs",
        configName: "eggEsp",
        title: "ESPs eggs",
        description: "Hoppity Egg ESP",
    })
    .addSwitch({
        category: "General",
        subcategory: "Other",
        configName: "jenify",
        title: "Jen'ify stuff",
        description: "purpul <3 ❤"
    })
    .addSwitch({
        category: "General",
        subcategory: "Other",
        configName: "meow",
        title: "Meows at you",
        description: "Does a Meow when Meow is said",
    })
    .addSwitch({
        category: "General",
        subcategory: "Other",
        configName: "coopPing",
        title: "Coop chat Ping",
        description: "Makes a ping noise when a message is said in coop chat",
    })
    .addSwitch({
        category: "General",
        subcategory: "Other",
        configName: "muteBypass",
        title: "Mute Bypass",
        description: "Bypasses hypixel mute in guild chat",
    })
    .addSwitch({
        category: "General",
        subcategory: "Other",
        configName: "joinMsg",
        title: "Hide Join message",
        description: "Hides the Joined Lobby message",
    })
    // MELODY
    .addSwitch({
        category: "Melody",
        configName: "melody",
        title: "Toggle melody macro",
        description: "Toggles melody macro",
    })
    .addSlider({
        category: "Melody",
        configName: "melodyDelay",
        title: "Melody Delay",
        description: "Sets the delay before click, higher ping = lower delay.",
        options: [0, 15],
        value: 5
    })
    .addSwitch({
        category: "Melody",
        configName: "melodyToggle",
        title: "Toggle other melody macro",
        description: "Toggles melody macro",
    })
    .addSlider({
        category: "Melody",
        configName: "melodyDelay2",
        title: "Melody Delay",
        description: "Sets the delay for note clicks",
        options: [0, 10],
        value: 5
    })
    // COMBAT
    .addSwitch({
        category: "Combat",
        subcategory: "Ragnarock Axe",
        configName: "ragAxe",
        title: "Ragnarock axe display",
        description: "Displays text if you hit a successfully cast",
    })
    .addTextInput({
        configName: "ragAxeTitle",
        title: "Ragnarock Axe Title",
        description: "Text that is shown on screen when successfully casting",
        category: "Combat",
        subcategory: "Ragnarock Axe",
        value: "§4§lWoah!",
        placeHolder: "",
        shouldShow(data) {
            return data.ragAxe
        }
    })
    .addSwitch({
        category: "Combat",
        subcategory: "Ragnarock Axe",
        configName: "ragAxeSayMsg",
        title: "Ragnarock Axe Chat Message",
        description: "Toggles if a message is said after cast",
    })
    .addSwitch({
        category: "Combat",
        subcategory: "Ragnarock Axe",
        configName: "ragAxeSayParty",
        title: "Say message on successful cast in party chat",
        description: "Toggles if message is sent in party chat after cast",
        shouldShow(data) {
            return data.ragAxeSayMsg
        }
    })
    .addTextInput({
        configName: "ragAxeText",
        title: "Ragnarock Axe Text",
        description: "Text that is said when successfully casting",
        category: "Combat",
        subcategory: "Ragnarock Axe",
        value: "Casted Ragnarock for ${strenght} strenght.",
        placeHolder: "",
        shouldShow(data) {
            return data.ragAxeSayMsg
        }
    })
    .addSwitch({
        category: "Combat",
        subcategory: "Crimson Isle",
        configName: "witherESP",
        title: "Vanquisher ESP",
        description: "ESP for Vanquishers",
    })
    .addSwitch({
        category: "Combat",
        subcategory: "Crimson Isle",
        configName: "witherTracers",
        title: "Vanquisher Tracers",
        description: "Adds tracers to Vanquishers",
        shouldShow(data) {
            return data.witherESP
        }
    })
    // DUNGEON
    .addSwitch({
        category: "Dungeon",
        subcategory: "Auto Requeue",
        configName: "autoReinstance",
        title: "Auto Requeue",
        description: "Automatically requeues at end of run",
    })
    .addSlider({
        category: "Dungeon",
        subcategory: "Auto Requeue",
        configName: "autoReinstanceTimer",
        title: "Requeue Time",
        description: "In how many seconds it requeues (0 is instant)",
        options: [0, 8],
        value: 0
    })
    // DUNGEON F7/M7
    .addSwitch({
        category: "Dungeon",
        subcategory: "F7/M7",
        configName: "shouldYell",
        title: "Yell at F7/M7",
        description: "Yells at people at f7/m7",
    })
    // FISHING
    .addSwitch({
        category: "Fishing",
        configName: "fishingTracer",
        title: "Crimson mob tracers",
        description: "Adds tracers to crimson mobs",
    })
    .addSwitch({
        category: "Fishing",
        configName: "hotspotESP",
        title: "Fishing Hotspot ESP",
        description: "ESP for fishing hotspots",
    })
    .addSwitch({
        category: "Fishing",
        configName: "thunderESP",
        title: "Thunder ESP",
        description: "ESP for Thunders",
    })
    .addSwitch({
        category: "Fishing",
        configName: "jawbusESP",
        title: "Jawbus ESP",
        description: "ESP for Jawbuses",
    })
    .addSwitch({
        category: "Fishing",
        configName: "ragnarokEsp",
        title: "Ragnarock ESP",
        description: "ESP for Ragnaroks",
    })
    // MINING
    .addSwitch({
        category: "Mining",
        subcategory: "Notifiers",
        configName: "commissionMsg",
        title: "Comission notifer",
        description: "Shows title when commission done",
    })
    .addSwitch({
        category: "Mining",
        subcategory: "Notifiers",
        configName: "coldMsg",
        title: "Cold notifier",
        description: "Shows title when Brrr! message comes",
    })
    .addSwitch({
        category: "Mining",
        subcategory: "Notifiers",
        configName: "cdMsg",
        title: "Cooldown notifier",
        description: "Notifies with a title when your pickaxe ability is ready to be used",
    })
    .addSwitch({
        category: "Mining",
        subcategory: "Notifiers",
        configName: "shaftTypeNotifier",
        title: "Shaft Notifier",
        description: "Shouts what shaft you in",
    })
    // MINING ESPS
    .addSwitch({
        category: "Mining",
        subcategory: "ESPs",
        configName: "ticketesp",
        title: "Raffle Ticket ESP",
        description: "Highlight Raffle Tickets",
    })
    .addSwitch({
        category: "Mining",
        subcategory: "ESPs",
        configName: "corpseEsp",
        title: "Corpse ESP",
        description: "Highlight corpses",
    })
    .addSwitch({
        category: "Mining",
        subcategory: "ESPs",
        configName: "mineshaftEsp",
        title: "Esp for mineshaft mobs",
        description: "Highlight mobs",
    })
    // Disasters
    .addSwitch({
        category: "Disasters",
        subcategory: "ESPs",
        configName: "goldesp",
        title: "Gold ESP",
        description: "Highlight Gold",
    })
    .addSwitch({
        category: "Disasters",
        configName: "itemESP",
        subcategory: "ESPs",
        title: "Item ESP",
        description: "Highlights powerups",
    })
    .addSwitch({
        category: "Disasters",
        configName: "purge",
        subcategory: "ESPs",
        title: "Purge ESP",
        description: "Highlights players while Purge",
    })
    .addSwitch({
        category: "Disasters",
        configName: "zombieESP",
        subcategory: "ESPs",
        title: "Zombie ESP",
        description: "Highlights zombies",
    })
    .addSwitch({
        category: "Disasters",
        configName: "dragonESP",
        subcategory: "ESPs",
        title: "Dragon ESP",
        description: "Highlights ender dragons",
    })
    .addSwitch({
        category: "Disasters",
        configName: "vendingesp",
        subcategory: "ESPs",
        title: "Vending Machine ESP",
        description: "Highlights Vending Machines",
    })
    .addSwitch({
        category: "Disasters",
        configName: "werewolfesp",
        subcategory: "ESPs",
        title: "Werewolf ESP",
        description: "Highlights the Werewolf",
    })
    .addSwitch({
        category: "Disasters",
        subcategory: "ESPs",
        configName: "hotpotatoesp",
        title: "Hot Potato ESP",
        description: "Highlights the Potato Holder",
    })
    .addSwitch({
        category: "Disasters",
        subcategory: "ESPs",
        configName: "potionsolver",
        title: "Potion Solver",
        description: "Reveals the potion when held",
    })
    .addSwitch({
        category: "Disasters",
        subcategory: "Disasters Requeue",
        configName: "autorequeue",
        title: "Auto Requeue",
        description: "Automatically requeue back into another game",
    })
    // CHAT WITH + COLOR
    .addSwitch({
        category: "Chat",
        configName: "pluscolorToggle",
        title: "Color changer for + in ranks",
        description: "Toggles [MVP+] color changer",
    })
    .addSelection({
        category: "Chat",
        configName: "pluscolorColor",
        title: "Change + color",
        description: "Swaps [MVP+] + color",
        options: ["§0Black", "§1Dark Blue", "§2Dark Green", "§3Dark Aqua", "§4Dark Red", "§5Dark Purple", "§6Gold", "§7Gray", "§8Dark Gray", "§9Blue", "§aGreen", "§bAqua", "§cRed", "§dPink", "§eYellow", "§fWhite"],
        shouldShow(data) {
            return data.pluscolorToggle
        }
    })
    // REPELLENT  
    .addSwitch({
        category: "Chat",
        configName: "repellant",
        title: "Repellant Notifier",
        description: "Yells at you when pest repel runs out",
    })
    // PARTY COMMANDS
    .addSwitch({
        category: "Chat",
        subcategory: "Chat Commands",
        configName: "partyCommands",
        title: "Party Chat commands",
        description: "Toggles party chat commands",
    })
    .addSwitch({
        category: "Chat",
        subcategory: "Chat Commands",
        configName: "allInv",
        title: "All Inv",
        description: "Toggles !allinv command",
        shouldShow(data) {
            return data.partyCommands
        }
    })
    .addSwitch({
        category: "Chat",
        subcategory: "Chat Commands",
        configName: "partyWarp",
        title: "Warp Party",
        description: "Toggles !warp command",
        shouldShow(data) {
            return data.partyCommands
        }
    })
    .addSwitch({
        category: "Chat",
        subcategory: "Chat Commands",
        configName: "partyKickoffline",
        title: "Kick offline",
        description: "Toggles !kickoffline command",
        shouldShow(data) {
            return data.partyCommands
        }
    })
    .addSwitch({
        category: "Chat",
        subcategory: "Chat Commands",
        configName: "partyInv",
        title: "Invite",
        description: "Toggles !inv command",
        shouldShow(data) {
            return data.partyCommands
        }
    })
    .addSwitch({
        category: "Chat",
        subcategory: "Chat Commands",
        configName: "msgInv",
        title: "/msg invite",
        description: "Toggles /msg invites",
        shouldShow(data) {
            return data.partyCommands
        }
    })
    .addSwitch({
        category: "Chat",
        subcategory: "Chat Commands",
        configName: "partyTransfer",
        title: "Party Transfer",
        description: "Toggles !ptme command",
        shouldShow(data) {
            return data.partyCommands
        }
    })
    .addSwitch({
        category: "Chat",
        subcategory: "Chat Commands",
        configName: "partyPing",
        title: "Ping Command",
        description: "Toggles !ping command",
        shouldShow(data) {
            return data.partyCommands
        }
    })
    .addSwitch({
        category: "Chat",
        subcategory: "Chat Commands",
        configName: "partyTPS",
        title: "TPS Command",
        description: "Toggles !tps command",
        shouldShow(data) {
            return data.partyCommands
        }
    })
    .addSwitch({
        category: "Chat",
        subcategory: "Chat Commands",
        configName: "partyDungeon",
        title: "Join Dungeon command",
        description: "Toggles !m1 command",
        shouldShow(data) {
            return data.partyCommands
        }
    })
    .addSwitch({
        category: "Chat",
        subcategory: "Chat Commands",
        configName: "dtCommand",
        title: "Downtime Command",
        description: "Toggles !dt command",
        shouldShow(data) {
            return data.partyCommands
        }
    })
    //2FA
    .addSwitch({
        category: "Chat",
        subcategory: "Command 2FA",
        configName: "allInvMFA",
        title: "MFA for all inv command",
        description: "Toggles 2FA for !allinv command",
    })
    .addSwitch({
        category: "Chat",
        subcategory: "Command 2FA",
        configName: "partyWarpMFA",
        title: "MFA for warp command",
        description: "Toggles 2FA for !warp command",
    })
    .addSwitch({
        category: "Chat",
        subcategory: "Command 2FA",
        configName: "partyKickofflineMFA",
        title: "MFA for kickoffline command",
        description: "Toggles 2FA for !kickoffline command",
    })
    .addSwitch({
        category: "Chat",
        subcategory: "Command 2FA",
        configName: "partyInvMFA",
        title: "MFA for invite command",
        description: "Toggles 2FA for !inv command",
    })
    .addSwitch({
        category: "Chat",
        subcategory: "Command 2FA",
        configName: "msgInvMFA",
        title: "MFA for msg invite command",
        description: "Toggles 2FA for msg !inv command",
    })
    .addSwitch({
        category: "Chat",
        subcategory: "Command 2FA",
        configName: "partyTransferMFA",
        title: "MFA for transfer command",
        description: "Toggles 2FA for !ptme command",
    })
    .addSwitch({
        category: "Chat",
        subcategory: "Command 2FA",
        configName: "partyDungeonMFA",
        title: "MFA for dungeon joining command",
        description: "Toggles 2FA for !f1 (etc) command",
    })

    //Blacklist
    .addSelection({
        category: "Chat",
        subcategory: "Blacklist",
        configName: "allInvBlacklist",
        title: "Blacklist for all invite",
        description: "How should blacklist affect All Invite",
        options: ["Full blacklist", "Partial blacklist"],
    })
    .addSelection({
        category: "Chat",
        subcategory: "Blacklist",
        configName: "partyInvBlacklist",
        title: "Blacklist for party invite",
        description: "Which blacklist should party invite be affected by",
        options: ["Full blacklist", "Partial blacklist"],
    })
    .addSelection({
        category: "Chat",
        subcategory: "Blacklist",
        configName: "partyWarpBlacklist",
        title: "Which blacklist should party warp be affected by",
        description: "\nBlacklist for party warp",
        options: ["Full blacklist", "Partial blacklist"],
    })
    .addSelection({
        category: "Chat",
        subcategory: "Blacklist",
        configName: "partyKickofflineBlacklist",
        title: "Which blacklist should party kickoffline be affected by",
        description: "\nBlacklist for kickoffline warp",
        options: ["Full blacklist", "Partial blacklist"],
    })
    .addSelection({
        category: "Chat",
        subcategory: "Blacklist",
        configName: "partyTransferBlacklist",
        title: "Which blacklist should party transfer be affected by",
        description: "\nBlacklist for party transfer",
        options: ["Full blacklist", "Partial blacklist"],
    })
    .addSelection({
        category: "Chat",
        subcategory: "Blacklist",
        configName: "partyPingBlacklist",
        title: "Which blacklist should !ping be affected by",
        description: "\nBlacklist for !ping",
        options: ["Full blacklist", "Partial blacklist"],
    })
    .addSelection({
        category: "Chat",
        subcategory: "Blacklist",
        configName: "partyDungeonBlacklist",
        title: "Which blacklist should join dungeon be affected by",
        description: "Blacklist for join dungeon",
        options: ["Full blacklist", "Partial blacklist"],
    })
    .addSwitch({
        category: "Gemstone",
        configName: "gemToggle",
        title: "Toggle Gemstone Finder",
        description: "Toggles the ESP",
    })
    .addSlider({
        category: "Gemstone",
        configName: "gemScannerRange",
        title: "Range",
        description: "Sets the scanner's RADIUS.\nIf you are using Vein mode I recommend using max 20 range.\nWARNING: 10 Range is 8,000 blocks, but 30 range is 216,000 blocks.",
        options: [5, 50],
        value: 10
    })
    .addSlider({
        category: "Gemstone",
        configName: "gemAlpha",
        title: "Render Alpha",
        description: "Sets the alpha value for the boxes.",
        options: [11, 100],
        value: 20
    })
    .addSlider({
        category: "Gemstone",
        configName: "gemScannerInterval",
        title: "Scanner Interval",
        description: "Sets the scanner's delay in seconds. 3 is recommended.",
        options: [3, 20],
        value: 5
    })
    .addSlider({
        category: "Gemstone",
        configName: "gemEspBoxSize",
        title: "ESP Box size",
        description: "Sets the esp boxs size",
        options: [1, 10],
        value: 10
    })
    .addSelection({
        category: "Gemstone",
        configName: "gemRenderMode",
        title: "Render Type",
        description: "Normal: Draws regular ESP boxes.\nVein: Doesn't draw side if theres another gemstone next to it.\nDot: Draws dots at gemstones. Looks horrible but good for potato PCs.", options: ["Full blacklist", "Partial blacklist"],
        options: ["Normal", "Vein", "Dot"],
    })
    .addSelection({
        category: "Gemstone",
        configName: "gemNeighbourAlgo",
        title: "Vein Neighbour Finding Algorithm",
        description: "If you don't know what this means, don't touch it. Filter seems to be better for FPS. Theres no difference in visuals.",
        options: ['Filter', 'Loop'],
    })

    .addSwitch({
        category: "Gemstone",
        configName: "gemOnlyMineshaft",
        title: "Shaft Check",
        description: "Toggles the esp only in mineshafts",
    })

    .addSwitch({
        category: "Gemstone",
        subcategory: "Gem Type",
        configName: "gemToggleAmber",
        title: "Toggle Amber",
        description: "Toggles the Amber ESP",
    })
    .addSwitch({
        category: "Gemstone",
        subcategory: "Gem Type",
        configName: "gemToggleJasper",
        title: "Toggle Jasper",
        description: "Toggles the Jasper ESP",
    })
    .addSwitch({
        category: "Gemstone",
        subcategory: "Gem Type",
        configName: "gemToggleSapphire",
        title: "Toggle Sapphire",
        description: "Toggles the Sapphire ESP",
    })
    .addSwitch({
        category: "Gemstone",
        subcategory: "Gem Type",
        configName: "gemToggleTopaz",
        title: "Toggle Topaz",
        description: "Toggles the Topaz ESP",
    })
    .addSwitch({
        category: "Gemstone",
        subcategory: "Gem Type",
        configName: "gemToggleJade",
        title: "Toggle Jade",
        description: "Toggles the Jade ESP",
    })
    .addSwitch({
        category: "Gemstone",
        subcategory: "Gem Type",
        configName: "gemToggleAmethys",
        title: "Toggle Amethys",
        description: "Toggles the Amethys ESP",
    })
    .addSwitch({
        category: "Gemstone",
        subcategory: "Gem Type",
        configName: "gemToggleAquamarine",
        title: "Toggle Aquamarine",
        description: "Toggles the Aquamarine ESP",
    })
    .addSwitch({
        category: "Gemstone",
        subcategory: "Gem Type",
        configName: "gemToggleCitrine",
        title: "Toggle Citrine",
        description: "Toggles the Citrine ESP",
    })
    .addSwitch({
        category: "Gemstone",
        subcategory: "Gem Type",
        configName: "gemTogglePeridot",
        title: "Toggle Peridot",
        description: "Toggles the Peridot ESP",
    })
    .addSwitch({
        category: "Gemstone",
        subcategory: "Gem Type",
        configName: "gemToggleRuby",
        title: "Toggle Ruby",
        description: "Toggles the Ruby ESP",
    })
    .addSwitch({
        category: "Gemstone",
        subcategory: "Gem Type",
        configName: "gemToggleOnyx",
        title: "Toggle Onyx",
        description: "Toggles the Onyx ESP",
    })

    .addSwitch({
        category: "Secret",
        configName: "locket",
        title: "locket :3",
        description: ":3",
    })
    .addSwitch({
        category: "Secret",
        configName: "afkMode",
        title: "AFK Mayhem",
        description: ":3",
    })
/*
if (Player.getName() == "JustJenniferuwu" || Player.getName() == "snowyJennifer") {

}
*/
const config = new Settings("AzaAddons", defaultConf, "data/theme.json")
    .setCommand("aa")
const currentScheme = "data/theme.json"
config
    .setPos(config.settings.x, config.settings.y)
    .setSize(config.settings.width, config.settings.height)
    .setScheme(currentScheme)
    .apply()
export default () => config.settings