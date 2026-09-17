import { IconPalette, IconTitle, IconShield, Target, Trophy, Sword, IconStar, IconDragon, Flame, Sparkles, IconSkull, IconCrown, IconAxe, IconStaff, IconScythe } from "./icons";

const RARITIES = {
  common:    { label: "Common",    color: "#8A8578", glow: "#8A857822" },
  uncommon:  { label: "Uncommon",  color: "#4C9A6A", glow: "#4C9A6A22" },
  rare:      { label: "Rare",      color: "#4FA3C9", glow: "#4FA3C922" },
  epic:      { label: "Epic",      color: "#8A5FBF", glow: "#8A5FBF22" },
  legendary: { label: "Legendary", color: "#C9A227", glow: "#C9A22722" },
};

const W = (c, def) => c || def;
const ITEM_CATALOGUE = [
  // ===== COSMETICS =====
  // ---- THEMES (9) ----
  { id: "theme_ember",     slot: "theme", category: "cosmetic", label: "Ember",         value: "#C9A227", rarity: "common",    icon: (c) => <IconPalette size={20} color={W(c,"#C9A227")} />, desc: "The default warm gold.",           bonuses: {} },
  { id: "theme_verdant",   slot: "theme", category: "cosmetic", label: "Verdant",        value: "#4C9A6A", rarity: "common",    icon: (c) => <IconPalette size={20} color={W(c,"#4C9A6A")} />, desc: "A calm forest green.",              bonuses: {} },
  { id: "theme_slate",     slot: "theme", category: "cosmetic", label: "Slate",          value: "#5C7A8A", rarity: "uncommon",    icon: (c) => <IconPalette size={20} color={W(c,"#5C7A8A")} />, desc: "Cool grey-blue tones.",             bonuses: {} },
  { id: "theme_frost",     slot: "theme", category: "cosmetic", label: "Frost",          value: "#4FA3C9", rarity: "rare",      icon: (c) => <IconPalette size={20} color={W(c,"#4FA3C9")} />, desc: "Cool arctic blue.",                 bonuses: { xpPct: 0.05 } },
  { id: "theme_arcane",    slot: "theme", category: "cosmetic", label: "Arcane",         value: "#8A5FBF", rarity: "rare",      icon: (c) => <IconPalette size={20} color={W(c,"#8A5FBF")} />, desc: "Mysterious arcane purple.",         bonuses: { xpPct: 0.05 } },
  { id: "theme_crimson",   slot: "theme", category: "cosmetic", label: "Crimson Dawn",   value: "#C1652B", rarity: "rare",      icon: (c) => <IconPalette size={20} color={W(c,"#C1652B")} />, desc: "Dawn breaks in crimson.",           bonuses: { goldFlat: 1 } },
  { id: "theme_blood",     slot: "theme", category: "cosmetic", label: "Blood Moon",     value: "#B33A3A", rarity: "epic",      icon: (c) => <IconPalette size={20} color={W(c,"#B33A3A")} />, desc: "The crimson of battle.",            bonuses: { xpPct: 0.10, goldFlat: 1 } },
  { id: "theme_void",      slot: "theme", category: "cosmetic", label: "Void",           value: "#2A1F3D", rarity: "epic",      icon: (c) => <IconPalette size={20} color={W(c,"#5A4F7A")} />, desc: "Darkness between stars.",           bonuses: { xpPct: 0.10 } },
  { id: "theme_abyss",     slot: "theme", category: "cosmetic", label: "Abyss",          value: "#0D1117", rarity: "epic",      icon: (c) => <IconPalette size={20} color={W(c,"#3A3A5A")} />, desc: "Total darkness.",                   bonuses: { xpPct: 0.10, goldFlat: 1 } },
  { id: "theme_storm",     slot: "theme", category: "cosmetic", label: "Stormbreak",     value: "#7A9ABF", rarity: "epic",      icon: (c) => <IconPalette size={20} color={W(c,"#7A9ABF")} />, desc: "Electric storm sky.",               bonuses: { xpPct: 0.08, goldFlat: 1 } },
  { id: "theme_solaris",   slot: "theme", category: "cosmetic", label: "Solaris",        value: "#E8A020", rarity: "legendary", icon: (c) => <IconPalette size={20} color={W(c,"#E8A020")} />, desc: "Pure radiant gold.",                bonuses: { xpPct: 0.15, goldFlat: 2 } },
  { id: "theme_nebula",    slot: "theme", category: "cosmetic", label: "Nebula",         value: "#7A4FA8", rarity: "legendary", icon: (c) => <IconPalette size={20} color={W(c,"#7A4FA8")} />, desc: "Born from stardust.",               bonuses: { xpPct: 0.15, goldFlat: 2 } },
  // ---- TITLES (16) ----
  { id: "title_rookie",    slot: "title", category: "cosmetic", label: "The Steadfast",  value: "The Steadfast",  rarity: "common",    icon: (c) => <IconTitle size={20} color={W(c,"#8A8578")} />, desc: "Reliable and consistent.",     bonuses: {} },
  { id: "title_keeper",    slot: "title", category: "cosmetic", label: "Dawn Keeper",    value: "Dawn Keeper",    rarity: "common",    icon: (c) => <IconTitle size={20} color={W(c,"#8A8578")} />, desc: "First to rise, first to act.", bonuses: {} },
  { id: "title_seeker",    slot: "title", category: "cosmetic", label: "Seeker",         value: "Seeker",         rarity: "common",    icon: (c) => <IconTitle size={20} color={W(c,"#8A8578")} />, desc: "Always searching.",            bonuses: {} },
  { id: "title_wanderer",  slot: "title", category: "cosmetic", label: "Wanderer",       value: "Wanderer",       rarity: "uncommon",    icon: (c) => <IconTitle size={20} color={W(c,"#8A8578")} />, desc: "No quest is too far.",         bonuses: {} },
  { id: "title_initiate",  slot: "title", category: "cosmetic", label: "The Initiate",   value: "The Initiate",   rarity: "common",    icon: (c) => <IconTitle size={20} color={W(c,"#8A8578")} />, desc: "Just getting started.",        bonuses: {} },
  { id: "title_hunter",    slot: "title", category: "cosmetic", label: "Quest Hunter",   value: "Quest Hunter",   rarity: "uncommon",      icon: (c) => <IconTitle size={20} color={W(c,"#4FA3C9")} />, desc: "Always on the chase.",         bonuses: { xpPct: 0.05 } },
  { id: "title_shadow",    slot: "title", category: "cosmetic", label: "Shadow Reaper",  value: "Shadow Reaper",  rarity: "rare",      icon: (c) => <IconTitle size={20} color={W(c,"#4FA3C9")} />, desc: "Works best in the dark.",      bonuses: { xpPct: 0.05 }, futureStats: { critChance: 0.03 } },
  { id: "title_storm",     slot: "title", category: "cosmetic", label: "Stormcaller",    value: "Stormcaller",    rarity: "rare",      icon: (c) => <IconTitle size={20} color={W(c,"#4FA3C9")} />, desc: "Brings the thunder.",          bonuses: { goldFlat: 1 } },
  { id: "title_focused",   slot: "title", category: "cosmetic", label: "The Focused",    value: "The Focused",    rarity: "rare",      icon: (c) => <IconTitle size={20} color={W(c,"#4FA3C9")} />, desc: "Laser precision.",             bonuses: { xpPct: 0.05 } },
  { id: "title_voidwalk",  slot: "title", category: "cosmetic", label: "Void Walker",    value: "Void Walker",    rarity: "rare",      icon: (c) => <IconTitle size={20} color={W(c,"#4FA3C9")} />, desc: "Moves through shadows.",       bonuses: { goldFlat: 1 } },
  { id: "title_iron",      slot: "title", category: "cosmetic", label: "Iron Will",      value: "Iron Will",      rarity: "epic",      icon: (c) => <IconTitle size={20} color={W(c,"#8A5FBF")} />, desc: "Unbreakable under pressure.",  bonuses: { xpPct: 0.10, goldFlat: 1 } },
  { id: "title_eternal",   slot: "title", category: "cosmetic", label: "Eternal Flame",  value: "Eternal Flame",  rarity: "epic",      icon: (c) => <IconTitle size={20} color={W(c,"#8A5FBF")} />, desc: "The streak never dies.",       bonuses: { xpPct: 0.10 } },
  { id: "title_archmage",  slot: "title", category: "cosmetic", label: "Archmage",       value: "Archmage",       rarity: "epic",      icon: (c) => <IconTitle size={20} color={W(c,"#8A5FBF")} />, desc: "Master of arcane knowledge.",  bonuses: { xpPct: 0.12, goldFlat: 1 } },
  { id: "title_bloodknight",slot:"title", category: "cosmetic", label: "Blood Knight",   value: "Blood Knight",   rarity: "epic",      icon: (c) => <IconTitle size={20} color={W(c,"#8A5FBF")} />, desc: "Sworn to the crimson oath.",   bonuses: { xpPct: 0.10, goldFlat: 2 } },
  { id: "title_starforged",slot: "title", category: "cosmetic", label: "Star Forged",    value: "Star Forged",    rarity: "epic",      icon: (c) => <IconTitle size={20} color={W(c,"#8A5FBF")} />, desc: "Tempered in celestial fire.",  bonuses: { xpPct: 0.12, goldFlat: 1 } },
  { id: "title_legend",    slot: "title", category: "cosmetic", label: "The Legendary",  value: "The Legendary",  rarity: "legendary", icon: (c) => <IconTitle size={20} color={W(c,"#C9A227")} />, desc: "There are no others like you.",bonuses: { xpPct: 0.20, goldFlat: 3 }, futureStats: { critChance: 0.05 } },
  { id: "title_eternal2",  slot: "title", category: "cosmetic", label: "Undying",        value: "Undying",        rarity: "legendary", icon: (c) => <IconTitle size={20} color={W(c,"#C9A227")} />, desc: "Death could not stop you.",    bonuses: { xpPct: 0.18, goldFlat: 3 } },
  // ---- BADGES (12) ----
  { id: "badge_shield",    slot: "badge", category: "cosmetic", label: "Iron Shield",    value: "shield",  rarity: "common",    icon: (c) => <IconShield size={20} color={W(c,"#8A8578")} />, desc: "Standard-issue badge.",         bonuses: {}, futureStats: { defense: 2 } },
  { id: "badge_target",    slot: "badge", category: "cosmetic", label: "Bullseye",       value: "target",  rarity: "common",    icon: (c) => <Target size={20} color={W(c,"#8A8578")} />,    desc: "Aim true.",                     bonuses: {} },
  { id: "badge_trophy",    slot: "badge", category: "cosmetic", label: "Bronze Trophy",  value: "trophy",  rarity: "common",    icon: (c) => <Trophy size={20} color={W(c,"#8A8578")} />,    desc: "A first taste of glory.",       bonuses: {} },
  { id: "badge_sword",     slot: "badge", category: "cosmetic", label: "Crossed Swords", value: "swords",  rarity: "common",    icon: (c) => <Sword size={20} color={W(c,"#8A8578")} />,     desc: "Ready for battle.",             bonuses: {} },
  { id: "badge_star",      slot: "badge", category: "cosmetic", label: "Gold Star",      value: "star",    rarity: "rare",      icon: (c) => <IconStar size={20} color={W(c,"#4FA3C9")} />,  desc: "Awarded to the dedicated.",     bonuses: { goldFlat: 1 } },
  { id: "badge_dragon",    slot: "badge", category: "cosmetic", label: "Dragon Mark",    value: "dragon",  rarity: "rare",      icon: (c) => <IconDragon size={20} color={W(c,"#4FA3C9")} />,desc: "For those who face big quests.",bonuses: { xpPct: 0.05 } },
  { id: "badge_flame",     slot: "badge", category: "cosmetic", label: "Flame Mark",     value: "flame",   rarity: "rare",      icon: (c) => <Flame size={20} color={W(c,"#C1652B")} />,     desc: "Burns brighter each day.",      bonuses: { xpPct: 0.05 } },
  { id: "badge_lightning",  slot: "badge", category: "cosmetic", label: "Lightning Bolt", value: "bolt",    rarity: "rare",      icon: (c) => <Sparkles size={20} color={W(c,"#4FA3C9")} />, desc: "Speed and power combined.",     bonuses: { xpPct: 0.05 } },
  { id: "badge_anchor",    slot: "badge", category: "cosmetic", label: "Anchor",         value: "anchor",  rarity: "rare",      icon: (c) => <IconShield size={20} color={W(c,"#4FA3C9")} />,desc: "Holds firm against the tide.",  bonuses: { goldFlat: 1 } },
  { id: "badge_skull",     slot: "badge", category: "cosmetic", label: "Death Mark",     value: "skull",   rarity: "epic",      icon: (c) => <IconSkull size={20} color={W(c,"#8A5FBF")} />, desc: "You have defeated much.",       bonuses: { xpPct: 0.10, goldFlat: 1 }, futureStats: { critChance: 0.05 } },
  { id: "badge_voideye",   slot: "badge", category: "cosmetic", label: "Void Eye",       value: "voidye",  rarity: "epic",      icon: (c) => <Target size={20} color={W(c,"#8A5FBF")} />,   desc: "Sees all, misses nothing.",     bonuses: { xpPct: 0.10 } , futureStats: { critChance: 0.06 } },

  { id: "badge_phoenix",   slot: "badge", category: "cosmetic", label: "Phoenix",        value: "phoenix", rarity: "epic",      icon: (c) => <Flame size={20} color={W(c,"#C9A227")} fill={W(c,"#C9A22744")} />, desc: "Rise from any failure.", bonuses: { xpPct: 0.12, goldFlat: 1 } },
  { id: "badge_crown",     slot: "badge", category: "cosmetic", label: "Crown",          value: "crown",   rarity: "legendary", icon: (c) => <IconCrown size={20} color={W(c,"#C9A227")} />, desc: "Worn only by the best.",        bonuses: { xpPct: 0.15, goldFlat: 2 } , futureStats: { critChance: 0.05 } },

  { id: "badge_celestial", slot: "badge", category: "cosmetic", label: "Celestial Eye",  value: "ceye",    rarity: "legendary", icon: (c) => <Sparkles size={20} color={W(c,"#C9A227")} />,  desc: "Watches from beyond the stars.",bonuses: { xpPct: 0.15, goldFlat: 2 } },
  // ---- AURA (10) ----
  { id: "aura_none",       slot: "aura",  category: "cosmetic", label: "No Aura",        value: null,       rarity: "common",    icon: (c) => <Sparkles size={20} color={W(c,"#8A8578")} />, desc: "Plain and simple.",             bonuses: {} , auraColor: null, combatEffect: null },
  { id: "aura_silver",     slot: "aura",  category: "cosmetic", label: "Silver",         value: "Silver",   rarity: "common",    icon: (c) => <Sparkles size={20} color={W(c,"#B8C4CE")} />, desc: "A faint silver shimmer.",       bonuses: {} , auraColor: "#B8C4CE", combatEffect: null },
  { id: "aura_ember2",     slot: "aura",  category: "cosmetic", label: "Blazing",        value: "Blazing",  rarity: "rare",      icon: (c) => <Sparkles size={20} color={W(c,"#C1652B")} />, desc: "Your XP burns hotter.",         bonuses: { xpPct: 0.05 } , auraColor: "#C1652B", combatEffect: {"type":"burn","chance":0.12,"value":4,"label":"🔥 Burn"} },
  { id: "aura_frost2",     slot: "aura",  category: "cosmetic", label: "Frozen",         value: "Frozen",   rarity: "rare",      icon: (c) => <Sparkles size={20} color={W(c,"#4FA3C9")} />, desc: "Cool precision.",               bonuses: { goldFlat: 1 } , auraColor: "#4FA3C9", combatEffect: {"type":"chill","chance":0.12,"value":-3,"label":"❄ Chill"} },
  { id: "aura_verdant",    slot: "aura",  category: "cosmetic", label: "Verdant",        value: "Verdant",  rarity: "rare",      icon: (c) => <Sparkles size={20} color={W(c,"#4C9A6A")} />, desc: "Life pulses around you.",       bonuses: { goldFlat: 1 } , auraColor: "#4C9A6A", combatEffect: {"type":"regen","chance":0.15,"value":8,"label":"🌿 Regen"} },
  { id: "aura_storm2",     slot: "aura",  category: "cosmetic", label: "Storm",          value: "Storm",    rarity: "rare",      icon: (c) => <Sparkles size={20} color={W(c,"#7A9ABF")} />, desc: "Crackling with energy.",        bonuses: { xpPct: 0.05 } , auraColor: "#7A9ABF", combatEffect: {"type":"shock","chance":0.12,"value":5,"label":"⚡ Shock"} },
  { id: "aura_arcane2",    slot: "aura",  category: "cosmetic", label: "Arcane",         value: "Arcane",   rarity: "epic",      icon: (c) => <Sparkles size={20} color={W(c,"#8A5FBF")} />, desc: "Arcane energy radiates from you.",bonuses: { xpPct: 0.10 } , auraColor: "#8A5FBF", combatEffect: {"type":"arcane","chance":0.15,"value":7,"label":"🔮 Arcane"} },
  { id: "aura_void2",      slot: "aura",  category: "cosmetic", label: "Void",           value: "Void",     rarity: "epic",      icon: (c) => <Sparkles size={20} color={W(c,"#2A1F3D")} />, desc: "The void swirls around you.",   bonuses: { xpPct: 0.10, goldFlat: 1 } , auraColor: "#5A4F7A", combatEffect: {"type":"drain","chance":0.15,"value":6,"label":"🌑 Drain"} },
  { id: "aura_blood",      slot: "aura",  category: "cosmetic", label: "Blood",          value: "Blood",    rarity: "epic",      icon: (c) => <Sparkles size={20} color={W(c,"#B33A3A")} />, desc: "Crimson mist trails you.",      bonuses: { xpPct: 0.08, goldFlat: 1 } , auraColor: "#B33A3A", combatEffect: {"type":"bleed","chance":0.18,"value":5,"label":"🩸 Bleed"} },
  { id: "aura_divine",     slot: "aura",  category: "cosmetic", label: "Divine",         value: "Divine",   rarity: "legendary", icon: (c) => <Sparkles size={20} color={W(c,"#C9A227")} />, desc: "Blessed by the gods.",          bonuses: { xpPct: 0.15, goldFlat: 2 } , auraColor: "#C9A227", combatEffect: {"type":"smite","chance":0.20,"value":10,"label":"✨ Smite"} },
  { id: "aura_celestial2", slot: "aura",  category: "cosmetic", label: "Nebula Aura",      value: "Celestial",rarity: "legendary", icon: (c) => <Sparkles size={20} color={W(c,"#E8D4A0")} />, desc: "Forged from starlight itself.", bonuses: { xpPct: 0.15, goldFlat: 2 } , auraColor: "#E8D4A0", combatEffect: {"type":"nova","chance":0.20,"value":12,"label":"💫 Nova"} },

  // ===== GEAR =====
  // ---- WEAPONS (14) ----
  { id: "wpn_sword",       slot: "weapon", category: "gear", label: "Iron Sword",      value: "sword",    rarity: "common",    icon: (c) => <Sword size={20} color={W(c,"#8A8578")} />,      desc: "The classic blade.",              bonuses: {} },
  { id: "wpn_dagger",      slot: "weapon", category: "gear", label: "Shadow Dagger",   value: "dagger",   rarity: "uncommon",    icon: (c) => <Sword size={20} color={W(c,"#8A8578")} />,      desc: "Swift and silent.",               bonuses: { goldFlat: 1 } , futureStats: { critChance: 0.08 } },

  { id: "wpn_club",        slot: "weapon", category: "gear", label: "Iron Club",       value: "club",     rarity: "common",    icon: (c) => <IconAxe size={20} color={W(c,"#8A8578")} />,    desc: "Blunt but effective.",            bonuses: {} },
  { id: "wpn_spear",       slot: "weapon", category: "gear", label: "Hunting Spear",   value: "spear",    rarity: "common",    icon: (c) => <Sword size={20} color={W(c,"#8A8578")} />,      desc: "Reach and precision.",            bonuses: {} },
  { id: "wpn_axe",         slot: "weapon", category: "gear", label: "Battle Axe",      value: "axe",      rarity: "uncommon",      icon: (c) => <IconAxe size={20} color={W(c,"#4FA3C9")} />,    desc: "Heavy and decisive.",             bonuses: { xpPct: 0.05 } },
  { id: "wpn_maul",        slot: "weapon", category: "gear", label: "Iron Maul",       value: "maul",     rarity: "rare",      icon: (c) => <IconAxe size={20} color={W(c,"#4FA3C9")} />,    desc: "Slow but devastating.",           bonuses: { xpPct: 0.07 } },
  { id: "wpn_crossbow",    slot: "weapon", category: "gear", label: "Crossbow",        value: "cross",    rarity: "uncommon",      icon: (c) => <Sword size={20} color={W(c,"#4FA3C9")} />,      desc: "Strike from a distance.",         bonuses: { goldFlat: 1 } },
  { id: "wpn_frostblade",  slot: "weapon", category: "gear", label: "Frost Blade",     value: "frost",    rarity: "epic",      icon: (c) => <Sword size={20} color={W(c,"#4FA3C9")} />,      desc: "Cold and precise.",               bonuses: { xpPct: 0.10, goldFlat: 1 } , futureStats: { critChance: 0.05 } },

  { id: "wpn_voidblade",   slot: "weapon", category: "gear", label: "Void Blade",      value: "void",     rarity: "epic",      icon: (c) => <Sword size={20} color={W(c,"#5A4F7A")} />,      desc: "Darkness infused.",               bonuses: { xpPct: 0.10 } , futureStats: { critChance: 0.06 } },

  { id: "wpn_staff",       slot: "weapon", category: "gear", label: "Arcane Staff",    value: "staff",    rarity: "epic",      icon: (c) => <IconStaff size={20} color={W(c,"#8A5FBF")} />,  desc: "Channels pure focus energy.",     bonuses: { xpPct: 0.12, goldFlat: 1 } , futureStats: { critChance: 0.03 } },

  { id: "wpn_lance",       slot: "weapon", category: "gear", label: "Dawn Lance",      value: "lance",    rarity: "epic",      icon: (c) => <Sword size={20} color={W(c,"#C9A227")} />,      desc: "Pierces through hesitation.",     bonuses: { xpPct: 0.10, goldFlat: 2 } , futureStats: { critChance: 0.04 } },

  { id: "wpn_stormhammer", slot: "weapon", category: "gear", label: "Storm Hammer",    value: "storm",    rarity: "epic",      icon: (c) => <IconAxe size={20} color={W(c,"#7A9ABF")} />,    desc: "Thunder in every swing.",         bonuses: { xpPct: 0.12, goldFlat: 1 } },
  { id: "wpn_scythe",      slot: "weapon", category: "gear", label: "Reaper Scythe",   value: "scythe",   rarity: "legendary", icon: (c) => <IconScythe size={20} color={W(c,"#C9A227")} />,  desc: "The weapon of legends.",          bonuses: { xpPct: 0.20, goldFlat: 3 } , futureStats: { critChance: 0.07 } },

  { id: "wpn_celestialswd",slot: "weapon", category: "gear", label: "Celestial Sword", value: "celswrd",  rarity: "legendary", icon: (c) => <Sword size={20} color={W(c,"#E8A020")} />,      desc: "Forged from a falling star.",     bonuses: { xpPct: 0.20, goldFlat: 3 } , futureStats: { critChance: 0.08 } },

  // ---- ARMOUR (10) ----
  { id: "arm_rags",        slot: "armour", category: "gear", label: "Worn Rags",       value: "rags",     rarity: "common",    icon: (c) => <IconShield size={20} color={W(c,"#8A8578")} />, desc: "Better than nothing.",            bonuses: {}, futureStats: { defense: 1, maxHealth: 8 } },
  { id: "arm_leather",     slot: "armour", category: "gear", label: "Leather Vest",    value: "leather",  rarity: "common",    icon: (c) => <IconShield size={20} color={W(c,"#8A6540")} />, desc: "Light and flexible.",             bonuses: {}, futureStats: { defense: 2, maxHealth: 12, critChance: 0.03 } },
  { id: "arm_studded",     slot: "armour", category: "gear", label: "Studded Leather", value: "studded",  rarity: "uncommon",    icon: (c) => <IconShield size={20} color={W(c,"#7A6050")} />, desc: "Reinforced at the joints.",       bonuses: {}, futureStats: { defense: 3, maxHealth: 15 } },
  { id: "arm_chain",       slot: "armour", category: "gear", label: "Chainmail",       value: "chain",    rarity: "uncommon",      icon: (c) => <IconShield size={20} color={W(c,"#4FA3C9")} />, desc: "Proven in many battles.",         bonuses: { goldFlat: 1 }, futureStats: { defense: 5, maxHealth: 20 } },
  { id: "arm_scale",       slot: "armour", category: "gear", label: "Scale Armour",    value: "scale",    rarity: "uncommon",      icon: (c) => <IconShield size={20} color={W(c,"#5A8A7A")} />, desc: "Dragon-scale inspired.",          bonuses: { xpPct: 0.05 }, futureStats: { defense: 6, maxHealth: 25 } },
  { id: "arm_brigandine",  slot: "armour", category: "gear", label: "Brigandine",      value: "brig",     rarity: "uncommon",      icon: (c) => <IconShield size={20} color={W(c,"#7A9ABF")} />, desc: "Versatile and sturdy.",           bonuses: { goldFlat: 1 }, futureStats: { defense: 5, maxHealth: 22 } },
  { id: "arm_plate",       slot: "armour", category: "gear", label: "Plate Armour",    value: "plate",    rarity: "epic",      icon: (c) => <IconShield size={20} color={W(c,"#8A5FBF")} />, desc: "Near impenetrable.",              bonuses: { xpPct: 0.08 }, futureStats: { defense: 9, maxHealth: 35 } },
  { id: "arm_runic",       slot: "armour", category: "gear", label: "Runic Plate",     value: "runic",    rarity: "epic",      icon: (c) => <IconShield size={20} color={W(c,"#4FA3C9")} />, desc: "Etched with ancient runes.",      bonuses: { xpPct: 0.10, goldFlat: 1 }, futureStats: { defense: 10, maxHealth: 38 } },
  { id: "arm_shadow",      slot: "armour", category: "gear", label: "Shadow Shroud",   value: "shadow",   rarity: "epic",      icon: (c) => <IconShield size={20} color={W(c,"#2A1F3D")} />, desc: "Woven from darkness itself.",     bonuses: { xpPct: 0.10, goldFlat: 1 }, futureStats: { defense: 8, maxHealth: 28, critChance: 0.05 } },
  { id: "arm_voidweave",   slot: "armour", category: "gear", label: "Voidweave",       value: "voidwv",   rarity: "legendary", icon: (c) => <IconShield size={20} color={W(c,"#5A4F7A")} />, desc: "Threads pulled from the void.",   bonuses: { xpPct: 0.15, goldFlat: 2 }, futureStats: { defense: 12, maxHealth: 45, critChance: 0.06 } },
  { id: "arm_celestial",   slot: "armour", category: "gear", label: "Celestial Mail",  value: "celmail",  rarity: "legendary", icon: (c) => <IconShield size={20} color={W(c,"#C9A227")} />, desc: "Forged in starlight.",            bonuses: { xpPct: 0.15, goldFlat: 2 }, futureStats: { defense: 14, maxHealth: 55 } },
  // ---- SHIELDS (10) ----
  { id: "shd_plank",       slot: "shield", category: "gear", label: "Wooden Plank",    value: "plank",    rarity: "common",    icon: (c) => <IconShield size={20} color={W(c,"#8A6540")} />, desc: "Surprisingly effective.",         bonuses: {}, futureStats: { defense: 1, blockChance: 0.04 } },
  { id: "shd_buckler",     slot: "shield", category: "gear", label: "Buckler",         value: "buckler",  rarity: "uncommon",    icon: (c) => <IconShield size={20} color={W(c,"#8A8578")} />, desc: "Small but dependable.",           bonuses: {}, futureStats: { defense: 1, blockChance: 0.06 } },
  { id: "shd_heater",      slot: "shield", category: "gear", label: "Heater Shield",   value: "heater",   rarity: "uncommon",    icon: (c) => <IconShield size={20} color={W(c,"#7A6050")} />, desc: "Traditional knight's shield.",    bonuses: {}, futureStats: { defense: 2, blockChance: 0.07 } },
  { id: "shd_kite",        slot: "shield", category: "gear", label: "Kite Shield",     value: "kite",     rarity: "uncommon",      icon: (c) => <IconShield size={20} color={W(c,"#4FA3C9")} />, desc: "Covers more ground.",             bonuses: { goldFlat: 1 }, futureStats: { defense: 3, blockChance: 0.11 } },
  { id: "shd_rune",        slot: "shield", category: "gear", label: "Rune Shield",     value: "rune",     rarity: "rare",      icon: (c) => <IconShield size={20} color={W(c,"#4FA3C9")} />, desc: "Ancient runes hum with power.",   bonuses: { xpPct: 0.05 }, futureStats: { defense: 3, blockChance: 0.13 } },
  { id: "shd_dragon",      slot: "shield", category: "gear", label: "Dragon Scale",    value: "dragon",   rarity: "uncommon",      icon: (c) => <IconShield size={20} color={W(c,"#5A8A7A")} />, desc: "A scale from an ancient dragon.", bonuses: { goldFlat: 1 }, futureStats: { defense: 4, blockChance: 0.12 } },
  { id: "shd_tower",       slot: "shield", category: "gear", label: "Tower Shield",    value: "tower",    rarity: "epic",      icon: (c) => <IconShield size={20} color={W(c,"#8A5FBF")} />, desc: "A wall of iron will.",            bonuses: { xpPct: 0.08 }, futureStats: { defense: 6, blockChance: 0.18 } },
  { id: "shd_stormwall",   slot: "shield", category: "gear", label: "Storm Wall",      value: "storm",    rarity: "epic",      icon: (c) => <IconShield size={20} color={W(c,"#7A9ABF")} />, desc: "Deflects even lightning.",        bonuses: { xpPct: 0.08, goldFlat: 1 }, futureStats: { defense: 6, blockChance: 0.20 } },
  { id: "shd_voidwall",    slot: "shield", category: "gear", label: "Void Wall",       value: "voidwl",   rarity: "epic",      icon: (c) => <IconShield size={20} color={W(c,"#5A4F7A")} />, desc: "Absorbs darkness.",               bonuses: { xpPct: 0.10, goldFlat: 1 }, futureStats: { defense: 5, blockChance: 0.20, critChance: 0.03 } },
  { id: "shd_aegis",       slot: "shield", category: "gear", label: "Aegis",           value: "aegis",    rarity: "legendary", icon: (c) => <IconShield size={20} color={W(c,"#C9A227")} />, desc: "The shield of legends.",          bonuses: { xpPct: 0.12, goldFlat: 2 }, futureStats: { defense: 8, blockChance: 0.28, critChance: 0.04 } },
  { id: "shd_celestial",   slot: "shield", category: "gear", label: "Celestial Barrier",value:"celbar",   rarity: "legendary", icon: (c) => <IconShield size={20} color={W(c,"#E8A020")} />, desc: "Blessed by the stars.",           bonuses: { xpPct: 0.12, goldFlat: 2 }, futureStats: { defense: 8, blockChance: 0.26 } },

  // ===== NEW EXPANSION ITEMS =====
  // ---- WEAPONS (8 new) ----
  { id: "wpn_katana",     slot: "weapon", category: "gear", label: "Katana",          value: "katana",   rarity: "uncommon",      icon: (c) => <Sword size={20} color={W(c,"#4FA3C9")} />,      desc: "Swift eastern blade.",            bonuses: { xpPct: 0.06 },              futureStats: { critChance: 0.09 } },
  { id: "wpn_trident",    slot: "weapon", category: "gear", label: "Trident",         value: "trident",  rarity: "uncommon",      icon: (c) => <Sword size={20} color={W(c,"#4FA3C9")} />,      desc: "Three points of pain.",           bonuses: { goldFlat: 1 },              futureStats: { critChance: 0.04 } },
  { id: "wpn_warbow",     slot: "weapon", category: "gear", label: "War Bow",         value: "warbow",   rarity: "uncommon",      icon: (c) => <Sword size={20} color={W(c,"#4FA3C9")} />,      desc: "Lethal at any range.",            bonuses: { xpPct: 0.05, goldFlat: 1 }, futureStats: { critChance: 0.06 } },
  { id: "wpn_flameblade", slot: "weapon", category: "gear", label: "Flame Blade",     value: "flame",    rarity: "epic",      icon: (c) => <Sword size={20} color={W(c,"#C1652B")} />,      desc: "Burns with every strike.",        bonuses: { xpPct: 0.11, goldFlat: 1 }, futureStats: { critChance: 0.05 } },
  { id: "wpn_runeaxe",    slot: "weapon", category: "gear", label: "Rune Axe",        value: "runeaxe",  rarity: "epic",      icon: (c) => <IconAxe size={20} color={W(c,"#8A5FBF")} />,    desc: "Ancient runes amplify its fury.", bonuses: { xpPct: 0.12 },              futureStats: { critChance: 0.06 } },
  { id: "wpn_ghostblade", slot: "weapon", category: "gear", label: "Ghost Blade",     value: "ghost",    rarity: "epic",      icon: (c) => <Sword size={20} color={W(c,"#B8C4CE")} />,      desc: "Phases through armour.",          bonuses: { xpPct: 0.13, goldFlat: 1 }, futureStats: { critChance: 0.07 } },
  { id: "wpn_solarblade", slot: "weapon", category: "gear", label: "Solar Blade",     value: "solar",    rarity: "legendary", icon: (c) => <Sword size={20} color={W(c,"#E8A020")} />,      desc: "Forged at the heart of a sun.",   bonuses: { xpPct: 0.18, goldFlat: 3 }, futureStats: { critChance: 0.07 } },
  { id: "wpn_doomhammer", slot: "weapon", category: "gear", label: "Doom Hammer",     value: "doom",     rarity: "legendary", icon: (c) => <IconAxe size={20} color={W(c,"#B33A3A")} />,    desc: "The end of all things.",          bonuses: { xpPct: 0.19, goldFlat: 2 }, futureStats: { critChance: 0.06 } },
  // ---- ARMOUR (7 new) ----
  { id: "arm_padded",     slot: "armour", category: "gear", label: "Padded Armour",   value: "padded",   rarity: "common",    icon: (c) => <IconShield size={20} color={W(c,"#8A8578")} />, desc: "Basic padding for beginners.",    bonuses: {},                            futureStats: { defense: 2, maxHealth: 8 } },
  { id: "arm_bronze",     slot: "armour", category: "gear", label: "Bronze Plate",    value: "bronze",   rarity: "uncommon",      icon: (c) => <IconShield size={20} color={W(c,"#C1652B")} />, desc: "Sturdy bronze construction.",     bonuses: { goldFlat: 1 },               futureStats: { defense: 7, maxHealth: 18 } },
  { id: "arm_ironhide",   slot: "armour", category: "gear", label: "Iron Hide",       value: "ironhide", rarity: "uncommon",      icon: (c) => <IconShield size={20} color={W(c,"#7A8A9A")} />, desc: "Thick as iron, tough as nails.",  bonuses: { xpPct: 0.04 },              futureStats: { defense: 9, maxHealth: 24 } },
  { id: "arm_flameguard", slot: "armour", category: "gear", label: "Flame Guard",     value: "flamegrd", rarity: "epic",      icon: (c) => <IconShield size={20} color={W(c,"#C1652B")} />, desc: "Fire cannot touch you.",          bonuses: { xpPct: 0.09, goldFlat: 1 }, futureStats: { defense: 16, maxHealth: 32 } },
  { id: "arm_stormplate", slot: "armour", category: "gear", label: "Storm Plate",     value: "stormpl",  rarity: "epic",      icon: (c) => <IconShield size={20} color={W(c,"#7A9ABF")} />, desc: "Crackles with storm energy.",     bonuses: { xpPct: 0.10, goldFlat: 1 }, futureStats: { defense: 17, maxHealth: 33 } },
  { id: "arm_dragonscale",slot: "armour", category: "gear", label: "Dragon Scale",    value: "drgnscl",  rarity: "legendary", icon: (c) => <IconShield size={20} color={W(c,"#C9A227")} />, desc: "Scales of an ancient wyrm.",      bonuses: { xpPct: 0.14, goldFlat: 2 }, futureStats: { defense: 22, maxHealth: 42 } },
  { id: "arm_soulweave",  slot: "armour", category: "gear", label: "Soul Weave",      value: "soulwv",   rarity: "legendary", icon: (c) => <IconShield size={20} color={W(c,"#8A5FBF")} />, desc: "Woven from captured souls.",      bonuses: { xpPct: 0.14, goldFlat: 2 }, futureStats: { defense: 21, maxHealth: 44, critChance: 0.04 } },
  // ---- SHIELDS (7 new) ----
  { id: "shd_woodround",  slot: "shield", category: "gear", label: "Wooden Round",    value: "woodrnd",  rarity: "common",    icon: (c) => <IconShield size={20} color={W(c,"#8A6540")} />, desc: "A simple round shield.",          bonuses: {},                            futureStats: { defense: 1, blockChance: 0.04 } },
  { id: "shd_ironround",  slot: "shield", category: "gear", label: "Iron Round",      value: "ironrnd",  rarity: "uncommon",    icon: (c) => <IconShield size={20} color={W(c,"#7A8A9A")} />, desc: "Reliable iron construction.",     bonuses: {},                            futureStats: { defense: 2, blockChance: 0.05 } },
  { id: "shd_flameguard", slot: "shield", category: "gear", label: "Flame Guard",     value: "flmgrd",   rarity: "rare",      icon: (c) => <IconShield size={20} color={W(c,"#C1652B")} />, desc: "Burns those who strike it.",      bonuses: { goldFlat: 1 },               futureStats: { defense: 5, blockChance: 0.09 } },
  { id: "shd_ghostwall",  slot: "shield", category: "gear", label: "Ghost Wall",      value: "ghstwall", rarity: "rare",      icon: (c) => <IconShield size={20} color={W(c,"#B8C4CE")} />, desc: "Passes through magic attacks.",   bonuses: { xpPct: 0.05 },              futureStats: { defense: 5, blockChance: 0.10 } },
  { id: "shd_solarwall",  slot: "shield", category: "gear", label: "Solar Wall",      value: "solrwall", rarity: "epic",      icon: (c) => <IconShield size={20} color={W(c,"#E8A020")} />, desc: "Blinding solar radiance.",        bonuses: { xpPct: 0.09, goldFlat: 1 }, futureStats: { defense: 13, blockChance: 0.19 } },
  { id: "shd_doomshield", slot: "shield", category: "gear", label: "Doom Shield",     value: "doomshld", rarity: "epic",      icon: (c) => <IconShield size={20} color={W(c,"#B33A3A")} />, desc: "Forged from despair.",            bonuses: { xpPct: 0.09, goldFlat: 1 }, futureStats: { defense: 14, blockChance: 0.17 } },
  { id: "shd_eternal",    slot: "shield", category: "gear", label: "Eternal Shield",  value: "eternal",  rarity: "legendary", icon: (c) => <IconShield size={20} color={W(c,"#C9A227")} />, desc: "Has never broken. Never will.",   bonuses: { xpPct: 0.13, goldFlat: 2 }, futureStats: { defense: 24, blockChance: 0.29 } },
  // ---- BADGES (10 new) ----
  { id: "badge_moon",     slot: "badge", category: "cosmetic", label: "Moon Crest",   value: "moon",     rarity: "common",    icon: (c) => <Sparkles size={20} color={W(c,"#B8C4CE")} />, desc: "Glows under moonlight.",          bonuses: {} },
  { id: "badge_sun",      slot: "badge", category: "cosmetic", label: "Sun Crest",    value: "sun",      rarity: "uncommon",    icon: (c) => <Sparkles size={20} color={W(c,"#C9A227")} />, desc: "Burns with solar pride.",         bonuses: {} },
  { id: "badge_wolf",     slot: "badge", category: "cosmetic", label: "Wolf Mark",    value: "wolf",     rarity: "uncommon",      icon: (c) => <Target size={20} color={W(c,"#4FA3C9")} />,   desc: "Runs with the pack.",             bonuses: { xpPct: 0.05 } },
  { id: "badge_serpent",  slot: "badge", category: "cosmetic", label: "Serpent Mark", value: "serpent",  rarity: "uncommon",      icon: (c) => <Target size={20} color={W(c,"#4C9A6A")} />,   desc: "Patient and precise.",            bonuses: { goldFlat: 1 } },
  { id: "badge_rune",     slot: "badge", category: "cosmetic", label: "Rune Mark",    value: "rune",     rarity: "rare",      icon: (c) => <Sparkles size={20} color={W(c,"#7A9ABF")} />, desc: "Ancient power inscribed.",        bonuses: { xpPct: 0.05 }, futureStats: { critChance: 0.03 } },
  { id: "badge_inferno",  slot: "badge", category: "cosmetic", label: "Inferno",      value: "inferno",  rarity: "epic",      icon: (c) => <Flame size={20} color={W(c,"#B33A3A")} fill={W(c,"#B33A4422")} />, desc: "Unquenchable fire.",  bonuses: { xpPct: 0.10, goldFlat: 1 } },
  { id: "badge_storm",    slot: "badge", category: "cosmetic", label: "Storm Eye",    value: "stormeye", rarity: "epic",      icon: (c) => <Target size={20} color={W(c,"#7A9ABF")} />,   desc: "Calm at the centre of chaos.",    bonuses: { xpPct: 0.10 }, futureStats: { critChance: 0.05 } },
  { id: "badge_solar",    slot: "badge", category: "cosmetic", label: "Solar Mark",   value: "solar",    rarity: "epic",      icon: (c) => <Sparkles size={20} color={W(c,"#E8A020")} />, desc: "Branded by starfire.",            bonuses: { xpPct: 0.11, goldFlat: 1 } },
  { id: "badge_doom",     slot: "badge", category: "cosmetic", label: "Doom Mark",    value: "doom",     rarity: "legendary", icon: (c) => <IconSkull size={20} color={W(c,"#B33A3A")} />, desc: "The end is near.",               bonuses: { xpPct: 0.15, goldFlat: 2 }, futureStats: { critChance: 0.06 } },
  { id: "badge_eternal",  slot: "badge", category: "cosmetic", label: "Eternal Mark", value: "eternal",  rarity: "legendary", icon: (c) => <Sparkles size={20} color={W(c,"#C9A227")} />, desc: "Time has no meaning here.",      bonuses: { xpPct: 0.14, goldFlat: 2 } },
  // ---- TITLES (10 new) ----
  { id: "title_chosen",   slot: "title", category: "cosmetic", label: "The Chosen",     value: "The Chosen",     rarity: "common",    icon: (c) => <IconTitle size={20} color={W(c,"#8A8578")} />, desc: "Destiny awaits.",              bonuses: {} },
  { id: "title_blade",    slot: "title", category: "cosmetic", label: "Blade Dancer",   value: "Blade Dancer",   rarity: "uncommon",    icon: (c) => <IconTitle size={20} color={W(c,"#8A8578")} />, desc: "Grace and violence combined.", bonuses: {} },
  { id: "title_cursed",   slot: "title", category: "cosmetic", label: "The Cursed",     value: "The Cursed",     rarity: "uncommon",      icon: (c) => <IconTitle size={20} color={W(c,"#4FA3C9")} />, desc: "Suffering breeds power.",      bonuses: { xpPct: 0.06 } },
  { id: "title_warden",   slot: "title", category: "cosmetic", label: "Dungeon Warden", value: "Dungeon Warden", rarity: "rare",      icon: (c) => <IconTitle size={20} color={W(c,"#4FA3C9")} />, desc: "None may pass.",               bonuses: { goldFlat: 1 } },
  { id: "title_ember",    slot: "title", category: "cosmetic", label: "Ember Knight",   value: "Ember Knight",   rarity: "rare",      icon: (c) => <IconTitle size={20} color={W(c,"#C1652B")} />, desc: "Sworn to the flame.",          bonuses: { xpPct: 0.05, goldFlat: 1 } },
  { id: "title_doomknight",slot:"title", category: "cosmetic", label: "Doom Knight",    value: "Doom Knight",    rarity: "epic",      icon: (c) => <IconTitle size={20} color={W(c,"#8A5FBF")} />, desc: "Herald of the apocalypse.",    bonuses: { xpPct: 0.11, goldFlat: 1 } },
  { id: "title_solar",    slot: "title", category: "cosmetic", label: "Solar Guard",    value: "Solar Guard",    rarity: "epic",      icon: (c) => <IconTitle size={20} color={W(c,"#E8A020")} />, desc: "Defender of the light.",       bonuses: { xpPct: 0.11, goldFlat: 1 } },
  { id: "title_ghostking", slot:"title", category: "cosmetic", label: "Ghost King",     value: "Ghost King",     rarity: "epic",      icon: (c) => <IconTitle size={20} color={W(c,"#B8C4CE")} />, desc: "Rules the afterlife.",          bonuses: { xpPct: 0.12 } },
  { id: "title_dawnbringer",slot:"title",category: "cosmetic", label: "Dawnbringer",    value: "Dawnbringer",    rarity: "legendary", icon: (c) => <IconTitle size={20} color={W(c,"#C9A227")} />, desc: "Breaks the eternal night.",    bonuses: { xpPct: 0.18, goldFlat: 3 } },
  { id: "title_worldender",slot: "title",category: "cosmetic", label: "World Ender",    value: "World Ender",    rarity: "legendary", icon: (c) => <IconTitle size={20} color={W(c,"#B33A3A")} />, desc: "The last name ever spoken.",   bonuses: { xpPct: 0.19, goldFlat: 3 } },
  // ---- THEMES (8 new) ----
  { id: "theme_rose",     slot: "theme", category: "cosmetic", label: "Rose Gold",      value: "#C47C8A", rarity: "common",    icon: (c) => <IconPalette size={20} color={W(c,"#C47C8A")} />, desc: "Soft rose-tinted gold.",       bonuses: {} },
  { id: "theme_jade",     slot: "theme", category: "cosmetic", label: "Jade",           value: "#2A7A5A", rarity: "common",    icon: (c) => <IconPalette size={20} color={W(c,"#2A7A5A")} />, desc: "Ancient eastern jade.",        bonuses: {} },
  { id: "theme_copper",   slot: "theme", category: "cosmetic", label: "Copper",         value: "#B87333", rarity: "uncommon",      icon: (c) => <IconPalette size={20} color={W(c,"#B87333")} />, desc: "Warm copper tones.",           bonuses: { xpPct: 0.04 } },
  { id: "theme_sapphire", slot: "theme", category: "cosmetic", label: "Sapphire",       value: "#1A5FAB", rarity: "uncommon",      icon: (c) => <IconPalette size={20} color={W(c,"#1A5FAB")} />, desc: "Deep sapphire blue.",          bonuses: { xpPct: 0.05 } },
  { id: "theme_inferno",  slot: "theme", category: "cosmetic", label: "Inferno",        value: "#CC3300", rarity: "epic",      icon: (c) => <IconPalette size={20} color={W(c,"#CC3300")} />, desc: "Everything burns.",            bonuses: { xpPct: 0.09, goldFlat: 1 } },
  { id: "theme_ghost",    slot: "theme", category: "cosmetic", label: "Ghost",          value: "#D0D8E0", rarity: "epic",      icon: (c) => <IconPalette size={20} color={W(c,"#D0D8E0")} />, desc: "Pale as a phantom.",           bonuses: { xpPct: 0.09 } },
  { id: "theme_doom",     slot: "theme", category: "cosmetic", label: "Doom",           value: "#6B0000", rarity: "legendary", icon: (c) => <IconPalette size={20} color={W(c,"#6B0000")} />, desc: "The colour of the end.",       bonuses: { xpPct: 0.14, goldFlat: 2 } },
  { id: "theme_prismatic",slot: "theme", category: "cosmetic", label: "Prismatic",      value: "#9B59B6", rarity: "legendary", icon: (c) => <IconPalette size={20} color={W(c,"#9B59B6")} />, desc: "Every colour at once.",        bonuses: { xpPct: 0.14, goldFlat: 2 } },
  // ---- AURAS (7 new) ----
  { id: "aura_rose",      slot: "aura", category: "cosmetic", label: "Rose",            value: "Rose",     rarity: "common",    icon: (c) => <Sparkles size={20} color={W(c,"#C47C8A")} />, desc: "Gentle rose petals drift.",     bonuses: {}, auraColor: "#C47C8A", combatEffect: null },
  { id: "aura_jade",      slot: "aura", category: "cosmetic", label: "Jade",            value: "Jade",     rarity: "uncommon",      icon: (c) => <Sparkles size={20} color={W(c,"#2A7A5A")} />, desc: "Ancient jade energy.",          bonuses: { goldFlat: 1 }, auraColor: "#2A7A5A", combatEffect: {"type":"regen","chance":0.10,"value":6,"label":"🌿 Jade"} },
  { id: "aura_inferno",   slot: "aura", category: "cosmetic", label: "Inferno",         value: "Inferno",  rarity: "epic",      icon: (c) => <Sparkles size={20} color={W(c,"#CC3300")} />, desc: "Everything is on fire.",        bonuses: { xpPct: 0.08, goldFlat: 1 }, auraColor: "#CC3300", combatEffect: {"type":"burn","chance":0.18,"value":6,"label":"🔥 Inferno"} },
  { id: "aura_ghost",     slot: "aura", category: "cosmetic", label: "Ghost",           value: "Ghost",    rarity: "epic",      icon: (c) => <Sparkles size={20} color={W(c,"#D0D8E0")} />, desc: "Pale spectral wisps.",          bonuses: { xpPct: 0.09 }, auraColor: "#D0D8E0", combatEffect: {"type":"drain","chance":0.16,"value":7,"label":"👻 Ghost"} },
  { id: "aura_solar",     slot: "aura", category: "cosmetic", label: "Solar",           value: "Solar",    rarity: "legendary", icon: (c) => <Sparkles size={20} color={W(c,"#FFD700")} />, desc: "Radiant solar energy.",         bonuses: { xpPct: 0.14, goldFlat: 2 }, auraColor: "#FFD700", combatEffect: {"type":"smite","chance":0.18,"value":11,"label":"☀ Solar"} },
  { id: "aura_doom",      slot: "aura", category: "cosmetic", label: "Doom",            value: "Doom",     rarity: "legendary", icon: (c) => <Sparkles size={20} color={W(c,"#6B0000")} />, desc: "Dread radiates from you.",      bonuses: { xpPct: 0.13, goldFlat: 2 }, auraColor: "#6B0000", combatEffect: {"type":"bleed","chance":0.20,"value":8,"label":"💀 Doom"} },
  { id: "aura_prismatic", slot: "aura", category: "cosmetic", label: "Prismatic",       value: "Prismatic",rarity: "legendary", icon: (c) => <Sparkles size={20} color={W(c,"#9B59B6")} />, desc: "Every colour of destruction.",  bonuses: { xpPct: 0.15, goldFlat: 2 }, auraColor: "#9B59B6", combatEffect: {"type":"nova","chance":0.22,"value":14,"label":"🌈 Prism"} },
];

// ---- SET BONUSES (18) — every item in exactly one set ----
// Each set leans into one of five archetypes so equipping toward a set is a real
// choice (economy, growth, tankiness, survivability, or burst) rather than every
// set granting the same XP%+gold combo at a different number.
const SETS = [
  // ---- Merchant (gold) ----
  {
    id: "dawn_set", label: "Dawn Set", color: "#C9A227",
    items: ["wpn_sword","wpn_dagger","arm_leather","shd_buckler","title_keeper","title_rookie","badge_shield","theme_ember"],
    requiredCount: 4, bonus: { goldFlat: 3 }, desc: "+3g/quest",
  },
  {
    id: "void_set", label: "Void Set", color: "#2A1F3D",
    items: ["wpn_club","arm_rags","shd_aegis","title_initiate","title_hunter","badge_voideye","theme_abyss","aura_none"],
    requiredCount: 3, bonus: { goldFlat: 5 }, desc: "+5g/quest",
  },
  {
    id: "celestial_set", label: "Celestial Set", color: "#E8A020",
    items: ["wpn_celestialswd","shd_celestial","badge_crown","theme_solaris","aura_divine","title_eternal2"],
    requiredCount: 4, bonus: { goldFlat: 10 }, desc: "+10g/quest",
  },
  // ---- Scholar (XP) ----
  {
    id: "arcane_set", label: "Arcane Set", color: "#8A5FBF",
    items: ["wpn_staff","arm_chain","arm_scale","shd_kite","title_archmage","badge_dragon","theme_arcane","aura_arcane2"],
    requiredCount: 4, bonus: { xpPct: 0.24 }, desc: "+24% XP",
  },
  {
    id: "nebula_set", label: "Nebula Set", color: "#7A4FA8",
    items: ["arm_celestial","title_starforged","badge_celestial","badge_target","theme_nebula","theme_crimson","aura_celestial2","badge_star"],
    requiredCount: 4, bonus: { xpPct: 0.27 }, desc: "+27% XP",
  },
  {
    id: "solar_set", label: "Solar Set", color: "#FFD700",
    items: ["wpn_solarblade","arm_dragonscale","shd_solarwall","badge_solar","title_solar","theme_sapphire","aura_solar","title_dawnbringer"],
    requiredCount: 4, bonus: { xpPct: 0.29 }, desc: "+29% XP",
  },
  // ---- Guardian (defense) ----
  {
    id: "storm_set", label: "Storm Set", color: "#7A9ABF",
    items: ["wpn_stormhammer","arm_plate","shd_stormwall","shd_tower","title_storm","badge_lightning","theme_storm","aura_storm2"],
    requiredCount: 4, bonus: { defense: 11 }, desc: "+11 Defense",
  },
  {
    id: "runic_set", label: "Runic Set", color: "#B8C4CE",
    items: ["wpn_axe","wpn_maul","arm_runic","shd_rune","title_iron","title_wanderer","badge_trophy","theme_slate"],
    requiredCount: 4, bonus: { defense: 9 }, desc: "+9 Defense",
  },
  {
    id: "doom_set", label: "Doom Set", color: "#6B0000",
    items: ["wpn_doomhammer","arm_soulweave","shd_doomshield","badge_doom","title_worldender","theme_doom","aura_doom","badge_storm"],
    requiredCount: 4, bonus: { defense: 13 }, desc: "+13 Defense",
  },
  // ---- Vitality (max HP) ----
  {
    id: "bloom_set", label: "Bloom Set", color: "#4C9A6A",
    items: ["wpn_spear","arm_studded","shd_heater","title_eternal","title_seeker","badge_flame","theme_verdant","aura_verdant"],
    requiredCount: 3, bonus: { maxHealth: 17 }, desc: "+17 Max HP",
  },
  {
    id: "reaper_set", label: "Reaper Set", color: "#B33A3A",
    items: ["wpn_scythe","wpn_lance","arm_voidweave","shd_plank","title_legend","badge_sword","theme_blood","aura_blood"],
    requiredCount: 4, bonus: { maxHealth: 26 }, desc: "+26 Max HP",
  },
  {
    id: "eternal_set", label: "Eternal Set", color: "#C9A227",
    items: ["shd_eternal","badge_eternal","title_warden","theme_rose","aura_rose","wpn_trident","arm_padded","badge_sun"],
    requiredCount: 4, bonus: { maxHealth: 19 }, desc: "+19 Max HP",
  },
  {
    id: "undying_set", label: "Undying Set", color: "#C9A227",
    items: ["badge_phoenix","aura_ember2","aura_silver","badge_moon","title_blade","title_chosen"],
    requiredCount: 4, bonus: { maxHealth: 16 }, desc: "+16 Max HP",
  },
  // ---- Assassin (crit chance) ----
  {
    id: "frost_set", label: "Frost Set", color: "#4FA3C9",
    items: ["wpn_frostblade","wpn_crossbow","arm_brigandine","shd_dragon","title_focused","badge_anchor","theme_frost","aura_frost2"],
    requiredCount: 4, bonus: { critChance: 0.1 }, desc: "+10% Crit",
  },
  {
    id: "blade_set", label: "Blade Set", color: "#4FA3C9",
    items: ["wpn_katana","wpn_warbow","wpn_runeaxe","arm_bronze","arm_stormplate","shd_ironround","shd_woodround","badge_serpent","badge_rune","title_bloodknight","theme_jade","theme_copper","theme_prismatic","aura_jade","aura_prismatic"],
    requiredCount: 5, bonus: { critChance: 0.09 }, desc: "+9% Crit",
  },
  {
    id: "ghost_set", label: "Ghost Set", color: "#D0D8E0",
    items: ["wpn_ghostblade","arm_ironhide","shd_ghostwall","badge_wolf","title_ghostking","theme_ghost","aura_ghost","title_cursed"],
    requiredCount: 4, bonus: { critChance: 0.1 }, desc: "+10% Crit",
  },
  {
    id: "inferno_set", label: "Inferno Set", color: "#CC3300",
    items: ["wpn_flameblade","arm_flameguard","shd_flameguard","badge_inferno","title_ember","theme_inferno","aura_inferno","title_doomknight"],
    requiredCount: 4, bonus: { critChance: 0.12 }, desc: "+12% Crit",
  },
  {
    id: "shadow_set", label: "Shadow Set", color: "#5A4F7A",
    items: ["wpn_voidblade","arm_shadow","shd_voidwall","title_shadow","title_voidwalk","badge_skull","theme_void","aura_void2"],
    requiredCount: 4, bonus: { critChance: 0.12 }, desc: "+12% Crit",
  },
];

function computeActiveStats(equipped) {
  let xpPct = 0, goldFlat = 0, defense = 0, maxHealth = 100, blockChance = 0, critChance = 0;
  Object.values(equipped).forEach((itemId) => {
    if (!itemId) return;
    const item = ITEM_CATALOGUE.find((i) => i.id === itemId);
    if (!item) return;
    xpPct += item.bonuses?.xpPct || 0;
    goldFlat += item.bonuses?.goldFlat || 0;
    defense += item.futureStats?.defense || 0;
    maxHealth += item.futureStats?.maxHealth || 0;
    blockChance += item.futureStats?.blockChance || 0;
    critChance += item.futureStats?.critChance || 0;
  });
  const activeSets = [];
  SETS.forEach((set) => {
    const equippedIds = Object.values(equipped).filter(Boolean);
    const matches = set.items.filter((id) => equippedIds.includes(id)).length;
    if (matches >= set.requiredCount) {
      activeSets.push(set);
      xpPct += set.bonus.xpPct || 0;
      goldFlat += set.bonus.goldFlat || 0;
      defense += set.bonus.defense || 0;
      maxHealth += set.bonus.maxHealth || 0;
      critChance += set.bonus.critChance || 0;
    }
  });
  return { xpPct, goldFlat, defense, maxHealth, blockChance, critChance, activeSets };
}

const CRATE_TIERS = [
  { id: "wooden",   label: "Wooden Crate",   icon: () => <span style={{ fontSize: 22 }}>📦</span>,          cost: 15,  color: "#8A6540", weights: { common: 40, uncommon: 35, rare: 20, epic: 5,  legendary: 0 } },
  { id: "iron",     label: "Iron Crate",     icon: () => <IconShield size={22} color="#7A8A9A" />,           cost: 40,  color: "#7A8A9A", weights: { common: 10, uncommon: 25, rare: 45, epic: 18, legendary: 2 } },
  { id: "golden",   label: "Golden Crate",   icon: () => <Trophy size={22} color="#C9A227" />,               cost: 100, color: "#C9A227", weights: { common: 0,  uncommon: 5,  rare: 35, epic: 48, legendary: 12 } },
  { id: "void",     label: "Void Crate",     icon: () => <Sparkles size={22} color="#8A5FBF" />,             cost: 250, color: "#8A5FBF", weights: { common: 0,  uncommon: 0,  rare: 20, epic: 55, legendary: 25 } },
  { id: "celestial",label: "Celestial Crate",icon: () => <IconStar size={22} color="#E8A020" />,             cost: 500, color: "#E8A020", weights: { common: 0,  uncommon: 0,  rare: 0,  epic: 38, legendary: 62 } },
];

const RARITY_ORDER = ["common","uncommon","rare","epic","legendary"];

const GEAR_SLOTS     = ["weapon", "armour", "shield"];
const COSMETIC_SLOTS = ["badge", "title", "theme", "aura"];
const SLOTS          = [...GEAR_SLOTS, ...COSMETIC_SLOTS];
const SLOT_LABELS    = { weapon: "Weapon", armour: "Armour", shield: "Shield", badge: "Badge", title: "Title", theme: "Theme", aura: "Aura" };
const DEFAULT_GEAR   = { theme: "theme_ember", title: null, badge: null, weapon: "wpn_sword", armour: null, shield: null, aura: "aura_none" };

function rollCrate(tier, inventory) {
  const weights = { ...tier.weights };
  const roll = Math.random() * 100;
  let rarity;
  if (roll < weights.legendary) rarity = "legendary";
  else if (roll < weights.legendary + weights.epic) rarity = "epic";
  else if (roll < weights.legendary + weights.epic + weights.rare) rarity = "rare";
  else if (roll < weights.legendary + weights.epic + weights.rare + (weights.uncommon||0)) rarity = "uncommon";
  else rarity = "common";
  const pool = ITEM_CATALOGUE.filter((i) => i.rarity === rarity);
  const unowned = pool.filter((i) => !inventory.includes(i.id));
  const finalPool = unowned.length > 0 ? unowned : pool;
  return finalPool[Math.floor(Math.random() * finalPool.length)];
}

export { RARITIES, ITEM_CATALOGUE, SETS, computeActiveStats, CRATE_TIERS, RARITY_ORDER, GEAR_SLOTS, COSMETIC_SLOTS, SLOTS, SLOT_LABELS, DEFAULT_GEAR, rollCrate };
