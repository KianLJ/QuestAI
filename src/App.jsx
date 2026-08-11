import { useState, useEffect, useRef } from "react";

// ---- Icons ----
function Sym({ ch, size = 16, color, style, className }) {
  return <span className={className} style={{ fontSize: size, lineHeight: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", width: size, height: size, color: color || "currentColor", ...style }}>{ch}</span>;
}
const Plus = (p) => <Sym ch="+" {...p} />;
const Check = (p) => <Sym ch="✓" {...p} />;
const X = (p) => <Sym ch="✕" {...p} />;
const Play = (p) => <Sym ch="▶" {...p} />;
const Pause = (p) => <Sym ch="⏸" {...p} />;
const RotateCcw = (p) => <Sym ch="↺" {...p} />;
const ChevronLeft = (p) => <Sym ch="‹" {...p} />;
const ChevronRight = (p) => <Sym ch="›" {...p} />;
const ArrowRightLeft = (p) => <Sym ch="⇄" {...p} />;
const Columns3 = (p) => <Sym ch="⊞" {...p} />;
const Rows3 = (p) => <Sym ch="☰" {...p} />;
function Sparkles({ size = 16, color = "currentColor", style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" style={style}><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" /><path d="M19 14l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2z" /></svg>;
}
function Wand2({ size = 16, color = "currentColor", style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={style}><path d="M6 18L18 6" /><path d="M15 3l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" /><path d="M4 13l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" /></svg>;
}
function Repeat({ size = 16, color = "currentColor", style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}><path d="M17 2l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><path d="M7 22l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>;
}
function Crown({ size = 16, color = "currentColor", style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}><path d="M3 8l4 4 5-7 5 7 4-4-2 10H5L3 8z" /></svg>;
}
function Coins({ size = 16, color = "currentColor", style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" style={style}><circle cx="9" cy="10" r="6" /><circle cx="15" cy="14" r="6" opacity="0.6" /></svg>;
}
function BarChart2({ size = 16, color = "currentColor", style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" style={style}><line x1="6" y1="20" x2="6" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="18" y1="20" x2="18" y2="14" /></svg>;
}
function FileText({ size = 16, color = "currentColor", style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={style}><path d="M6 2h9l5 5v15H6V2z" /><path d="M15 2v5h5" /><line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="15" y2="17" /></svg>;
}
function Lock({ size = 16, color = "currentColor", style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}><rect x="4" y="11" width="16" height="9" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
}
function Scissors({ size = 16, color = "currentColor", style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={style}><circle cx="6" cy="6" r="2.5" /><circle cx="6" cy="18" r="2.5" /><line x1="8.5" y1="7.5" x2="20" y2="19" /><line x1="8.5" y1="16.5" x2="20" y2="5" /></svg>;
}
function Target({ size = 16, color = "currentColor", style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" style={style}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1.2" fill={color} stroke="none" /></svg>;
}
function Gear({ size = 16, color = "currentColor", style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={style}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></svg>;
}
function Flame({ size = 16, color = "currentColor", fill = "none", style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={fill === "none" ? "none" : fill} stroke={color} strokeWidth="1.8" style={style}><path d="M12 2c1.2 4.2-4 5.4-4 9.4a4 4 0 0 0 8 0c0-1.6-1-2.6-1-2.6s2 1.2 2 4.6a6 6 0 0 1-12 0C5 8.4 9.2 7 12 2z" /></svg>;
}
function Trophy({ size = 16, color = "currentColor", style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" style={style}><path d="M7 4h10v4a5 5 0 0 1-10 0V4z" /><path d="M7 5H4a3 3 0 0 0 3 5" /><path d="M17 5h3a3 3 0 0 1-3 5" /><path d="M12 13v3" /><path d="M9 20h6" /><path d="M10 17h4l.5 3h-5z" /></svg>;
}
function Sword({ size = 16, color = "currentColor", style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
      {/* Blade — diagonal from top-right to middle */}
      <line x1="20" y1="4" x2="9" y2="15" />
      {/* Tip sharpening lines */}
      <polyline points="20,4 16,4 20,8" />
      {/* Guard / crosspiece */}
      <line x1="7" y1="13" x2="11" y2="17" />
      {/* Handle */}
      <line x1="5" y1="17" x2="4" y2="20" />
      <line x1="7" y1="19" x2="4" y2="20" />
    </svg>
  );
}
function Trash2({ size = 16, color = "currentColor", style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="M6 7l1 13h10l1-13" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>;
}
function Timer({ size = 16, color = "currentColor", className, style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" className={className} style={style}><circle cx="12" cy="13" r="8" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="9" y1="3" x2="15" y2="3" /></svg>;
}
function Loader2({ size = 16, color = "currentColor", className, style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" className={className} style={style}><path d="M12 2a10 10 0 1 0 10 10" /></svg>;
}
function Edit2({ size = 16, color = "currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
}
// ---- Gear slot icons ----
function IconAxe({ size = 22, color = "currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="18" x2="18" y2="6" /><path d="M11 5l3-3 3 3-3 3z" /><path d="M5 13l-2 4 4-2z" /></svg>;
}
function IconStaff({ size = 22, color = "currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><line x1="12" y1="20" x2="12" y2="5" /><path d="M9 8a3 3 0 0 1 6 0" /><circle cx="12" cy="3" r="1.5" /><line x1="9" y1="12" x2="15" y2="12" /></svg>;
}
function IconScythe({ size = 22, color = "currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="20" x2="18" y2="7" /><path d="M18 7c0-3-2-5-4-5-3 0-6 3-6 7" /><line x1="5" y1="18" x2="7" y2="20" /></svg>;
}
function IconShield({ size = 16, color = "currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L4 6v6c0 5 4 9 8 10 4-1 8-5 8-10V6z" /></svg>;
}
function IconStar({ size = 16, color = "currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12,2 15,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 9,9" /></svg>;
}
function IconDragon({ size = 16, color = "currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12c0-5 3-8 7-8 2 0 4 1 5 3l3-2-2 4 2 2-3 1c0 3-2 5-5 5-4 0-7-2-7-5z" /><circle cx="9" cy="11" r="1" fill={color} stroke="none" /></svg>;
}
function IconSkull({ size = 16, color = "currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round"><path d="M8 21h8M9 21v-3M15 21v-3" /><path d="M12 2C7 2 4 5.5 4 9c0 2.5 1 4.5 3 6v3h10v-3c2-1.5 3-3.5 3-6 0-3.5-3-7-8-7z" /><circle cx="9" cy="10" r="1.2" fill={color} stroke="none" /><circle cx="15" cy="10" r="1.2" fill={color} stroke="none" /></svg>;
}
function IconCrown({ size = 16, color = "currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l4 4 5-7 5 7 4-4-2 10H5L3 8z" /></svg>;
}
function IconTitle({ size = 16, color = "currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><line x1="4" y1="7" x2="20" y2="7" /><line x1="10" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></svg>;
}
function IconPalette({ size = 16, color = "currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10a2 2 0 0 0 2-2 2 2 0 0 0-.5-1.3c-.4-.5-.4-1.2 0-1.7A2 2 0 0 1 15 16h2a5 5 0 0 0 5-5c0-4.4-4-8-10-8z" /><circle cx="8.5" cy="9.5" r="1.2" fill={color} stroke="none" /><circle cx="15.5" cy="9.5" r="1.2" fill={color} stroke="none" /><circle cx="8.5" cy="14.5" r="1.2" fill={color} stroke="none" /></svg>;
}
// ---- End Icons ----

const DIFFICULTIES = [
  { key: "trivial", label: "Trivial", xp: 5, color: "#8A8578" },
  { key: "easy", label: "Easy", xp: 10, color: "#4C9A6A" },
  { key: "medium", label: "Medium", xp: 20, color: "#C9A227" },
  { key: "hard", label: "Hard", xp: 35, color: "#C1652B" },
  { key: "epic", label: "Epic", xp: 60, color: "#8A2E44" },
];
const DAYS = [
  { key: "mon", label: "Mon" }, { key: "tue", label: "Tue" }, { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" }, { key: "fri", label: "Fri" }, { key: "sat", label: "Sat" }, { key: "sun", label: "Sun" },
];
const RANKS = [
  { minLevel: 1, title: "Rookie Adventurer" }, { minLevel: 3, title: "Apprentice" },
  { minLevel: 6, title: "Journeyman" }, { minLevel: 10, title: "Expert" },
  { minLevel: 15, title: "Veteran" }, { minLevel: 20, title: "Master" }, { minLevel: 30, title: "Legend" },
];
const MILESTONE_LEVELS = [5, 10, 15, 20, 25, 30, 40, 50];
const STREAK_MILESTONES = { 3: 15, 7: 30, 14: 60, 30: 150 };
const HABIT_XP = 3;
const HABIT_STREAK_MILESTONES = { 3: 5, 7: 10, 21: 25, 66: 50 };
const PERFECT_DAY_XP = 10;
// ---- Enemy SVG silhouettes ----
// ---- Aura particle component ----
function AuraParticles({ color, type }) {
  if (!color) return null;

  // Different particle shapes/behaviours per aura type
  const configs = {
    burn:    { chars: ["🔥","✦","·"], count: 8, spread: 120 },
    chill:   { chars: ["❄","·","✦"], count: 7, spread: 110 },
    regen:   { chars: ["✦","·","○"], count: 7, spread: 130 },
    shock:   { chars: ["·","✦","⚡"], count: 9, spread: 115 },
    arcane:  { chars: ["✦","·","◆"], count: 8, spread: 125 },
    drain:   { chars: ["·","◆","✦"], count: 7, spread: 110 },
    bleed:   { chars: ["·","✦","○"], count: 8, spread: 120 },
    smite:   { chars: ["✦","◆","·"], count: 9, spread: 130 },
    nova:    { chars: ["✦","◆","·"], count: 10, spread: 140 },
    default: { chars: ["·","✦"],     count: 6, spread: 100 },
  };
  const cfg = configs[type] || configs.default;

  return (
    <>
      {Array.from({ length: cfg.count }, (_, i) => {
        const left = 5 + Math.floor((i / cfg.count) * 90);
        const delay = (i * 0.4).toFixed(1);
        const dur = (1.6 + (i % 3) * 0.5).toFixed(1);
        const char = cfg.chars[i % cfg.chars.length];
        const size = 7 + (i % 3) * 3;
        return (
          <span key={i} style={{
            position: "absolute",
            left: `${left}%`,
            bottom: 0,
            fontSize: size,
            color,
            opacity: 0,
            pointerEvents: "none",
            animation: `auraFloat ${dur}s ease-in ${delay}s infinite`,
            zIndex: 2,
            lineHeight: 1,
          }}>{char}</span>
        );
      })}
    </>
  );
}

function getEnemyVisual(enemy, size = 72) {
  const dead = enemy.hp <= 0;
  const emoji = enemy.isBoss ? "👹"
    : enemy.difficulty === "trivial" ? "🟢"
    : enemy.difficulty === "easy"    ? "💀"
    : enemy.difficulty === "medium"  ? "⚔️"
    : enemy.difficulty === "hard"    ? "🗡️"
    : "🐉";
  return (
    <div style={{ fontSize: size * 0.7, lineHeight: 1, opacity: dead ? 0.3 : 1, filter: dead ? "grayscale(1)" : "none", display: "flex", alignItems: "center", justifyContent: "center", width: size, height: size }}>
      {emoji}
    </div>
  );
}

// ---- Gear & Crate System ----

// ---- Gear & Crate System ----
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
const SETS = [
  {
    id: "dawn_set", label: "Dawn Set", color: "#C9A227",
    items: ["wpn_sword","wpn_dagger","arm_leather","shd_buckler","title_keeper","title_rookie","badge_shield","theme_ember"],
    requiredCount: 4, bonus: { xpPct: 0.1, goldFlat: 2 }, desc: "+10% XP, +2g/quest",
  },
  {
    id: "bloom_set", label: "Bloom Set", color: "#4C9A6A",
    items: ["wpn_spear","arm_studded","shd_heater","title_eternal","title_seeker","badge_flame","theme_verdant","aura_verdant"],
    requiredCount: 3, bonus: { xpPct: 0.12, goldFlat: 1 }, desc: "+12% XP, +1g",
  },
  {
    id: "storm_set", label: "Storm Set", color: "#7A9ABF",
    items: ["wpn_stormhammer","arm_plate","shd_stormwall","shd_tower","title_storm","badge_lightning","theme_storm","aura_storm2"],
    requiredCount: 4, bonus: { xpPct: 0.18, goldFlat: 2 }, desc: "+18% XP, +2g",
  },
  {
    id: "frost_set", label: "Frost Set", color: "#4FA3C9",
    items: ["wpn_frostblade","wpn_crossbow","arm_brigandine","shd_dragon","title_focused","badge_anchor","theme_frost","aura_frost2"],
    requiredCount: 4, bonus: { xpPct: 0.15, goldFlat: 1 }, desc: "+15% XP, +1g",
  },
  {
    id: "arcane_set", label: "Arcane Set", color: "#8A5FBF",
    items: ["wpn_staff","arm_chain","arm_scale","shd_kite","title_archmage","badge_dragon","theme_arcane","aura_arcane2"],
    requiredCount: 4, bonus: { xpPct: 0.2, goldFlat: 1 }, desc: "+20% XP, +1g",
  },
  {
    id: "runic_set", label: "Runic Set", color: "#B8C4CE",
    items: ["wpn_axe","wpn_maul","arm_runic","shd_rune","title_iron","title_wanderer","badge_trophy","theme_slate"],
    requiredCount: 4, bonus: { xpPct: 0.22, goldFlat: 1 }, desc: "+22% XP, +1g",
  },
  {
    id: "shadow_set", label: "Shadow Set", color: "#5A4F7A",
    items: ["wpn_voidblade","arm_shadow","shd_voidwall","title_shadow","title_voidwalk","badge_skull","theme_void","aura_void2"],
    requiredCount: 4, bonus: { xpPct: 0.25, goldFlat: 1 }, desc: "+25% XP, +1g",
  },
  {
    id: "reaper_set", label: "Reaper Set", color: "#B33A3A",
    items: ["wpn_scythe","wpn_lance","arm_voidweave","shd_plank","title_legend","badge_sword","theme_blood","aura_blood"],
    requiredCount: 4, bonus: { xpPct: 0.2, goldFlat: 2 }, desc: "+20% XP, +2g",
  },
  {
    id: "void_set", label: "Void Set", color: "#2A1F3D",
    items: ["wpn_club","arm_rags","shd_aegis","title_initiate","title_hunter","badge_voideye","theme_abyss","aura_none"],
    requiredCount: 3, bonus: { xpPct: 0.15, goldFlat: 1 }, desc: "+15% XP, +1g",
  },
  {
    id: "nebula_set", label: "Nebula Set", color: "#7A4FA8",
    items: ["arm_celestial","title_starforged","badge_celestial","badge_target","theme_nebula","theme_crimson","aura_celestial2","badge_star"],
    requiredCount: 4, bonus: { xpPct: 0.28, goldFlat: 2 }, desc: "+28% XP, +2g",
  },
  {
    id: "celestial_set", label: "Celestial Set", color: "#E8A020",
    items: ["wpn_celestialswd","shd_celestial","badge_crown","theme_solaris","aura_divine","title_eternal2"],
    requiredCount: 4, bonus: { xpPct: 0.3, goldFlat: 3 }, desc: "+30% XP, +3g",
  },
  {
    id: "undying_set", label: "Undying Set", color: "#C9A227",
    items: ["badge_phoenix","aura_ember2","aura_silver","badge_moon","title_blade","title_chosen"],
    requiredCount: 4, bonus: { xpPct: 0.35, goldFlat: 4 }, desc: "+35% XP, +4g",
  },
  {
    id: "inferno_set", label: "Inferno Set", color: "#CC3300",
    items: ["wpn_flameblade","arm_flameguard","shd_flameguard","badge_inferno","title_ember","theme_inferno","aura_inferno","title_doomknight"],
    requiredCount: 4, bonus: { xpPct: 0.22, goldFlat: 2 }, desc: "+22% XP, +2g",
  },
  {
    id: "solar_set", label: "Solar Set", color: "#FFD700",
    items: ["wpn_solarblade","arm_dragonscale","shd_solarwall","badge_solar","title_solar","theme_sapphire","aura_solar","title_dawnbringer"],
    requiredCount: 4, bonus: { xpPct: 0.28, goldFlat: 3 }, desc: "+28% XP, +3g",
  },
  {
    id: "doom_set", label: "Doom Set", color: "#6B0000",
    items: ["wpn_doomhammer","arm_soulweave","shd_doomshield","badge_doom","title_worldender","theme_doom","aura_doom","badge_storm"],
    requiredCount: 4, bonus: { xpPct: 0.3, goldFlat: 3 }, desc: "+30% XP, +3g",
  },
  {
    id: "ghost_set", label: "Ghost Set", color: "#D0D8E0",
    items: ["wpn_ghostblade","arm_ironhide","shd_ghostwall","badge_wolf","title_ghostking","theme_ghost","aura_ghost","title_cursed"],
    requiredCount: 4, bonus: { xpPct: 0.22, goldFlat: 2 }, desc: "+22% XP, +2g",
  },
  {
    id: "eternal_set", label: "Eternal Set", color: "#C9A227",
    items: ["shd_eternal","badge_eternal","title_warden","theme_rose","aura_rose","wpn_trident","arm_padded","badge_sun"],
    requiredCount: 4, bonus: { xpPct: 0.28, goldFlat: 2 }, desc: "+28% XP, +2g",
  },
  {
    id: "blade_set", label: "Blade Set", color: "#4FA3C9",
    items: ["wpn_katana","wpn_warbow","wpn_runeaxe","arm_bronze","arm_stormplate","shd_ironround","shd_woodround","badge_serpent","badge_rune","title_bloodknight","theme_jade","theme_copper","theme_prismatic","aura_jade","aura_prismatic"],
    requiredCount: 5, bonus: { xpPct: 0.2, goldFlat: 2 }, desc: "+20% XP, +2g",
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
      xpPct += set.bonus.xpPct;
      goldFlat += set.bonus.goldFlat;
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

// ---- Combat System ----
const WEAPON_ATK = {
  wpn_sword: 8, wpn_dagger: 10, wpn_club: 7, wpn_spear: 9,
  wpn_axe: 12, wpn_maul: 15, wpn_crossbow: 11,
  wpn_frostblade: 13, wpn_voidblade: 14, wpn_staff: 11,
  wpn_lance: 13, wpn_stormhammer: 16, wpn_scythe: 18, wpn_celestialswd: 20,
};
// Miss chance per weapon (lower = more accurate)
const WEAPON_MISS = {
  wpn_sword: 0.12, wpn_dagger: 0.08, wpn_club: 0.14, wpn_spear: 0.12,
  wpn_axe: 0.14,   wpn_maul: 0.15,   wpn_crossbow: 0.11,
  wpn_frostblade: 0.07, wpn_voidblade: 0.07, wpn_staff: 0.08,
  wpn_lance: 0.07,  wpn_stormhammer: 0.10,  wpn_scythe: 0.09, wpn_celestialswd: 0.05,
};
// Miss chance per enemy difficulty
const ENEMY_MISS = { trivial: 0.22, easy: 0.18, medium: 0.13, hard: 0.09, epic: 0.06 };
const ENEMY_STATS = {
  trivial: { hp: 20,  atk: 3,  reward: 1,  xp: 2  },
  easy:    { hp: 40,  atk: 6,  reward: 2,  xp: 5  },
  medium:  { hp: 80,  atk: 10, reward: 4,  xp: 10 },
  hard:    { hp: 150, atk: 15, reward: 8,  xp: 20 },
  epic:    { hp: 220, atk: 19, reward: 15, xp: 35 },
};
function buildEnemies(completedQuests, bossId) {
  const normals = completedQuests
    .filter((q) => q.id !== bossId)
    .map((q) => {
      const stats = ENEMY_STATS[q.difficulty] || ENEMY_STATS.medium;
      // ±20% HP variance for variety
      const variance = 0.8 + Math.random() * 0.4;
      const hp = Math.round(stats.hp * variance);
      return { id: q.id, name: q.title, difficulty: q.difficulty, maxHp: hp, hp, atk: stats.atk, reward: stats.reward, xpReward: stats.xp, isBoss: false, dropChance: 0.05 };
    });
  const boss = completedQuests.find((q) => q.id === bossId);
  if (boss) {
    const stats = ENEMY_STATS[boss.difficulty] || ENEMY_STATS.epic;
    const bossHp = Math.round(stats.hp * 2 * (0.9 + Math.random() * 0.2));
    normals.push({ id: boss.id, name: boss.title, difficulty: boss.difficulty, maxHp: bossHp, hp: bossHp, atk: Math.round(stats.atk * 1.15), reward: stats.reward * 3, xpReward: stats.xp * 2, isBoss: true, dropChance: boss.difficulty === "epic" ? 1.0 : 0.6 });
  }
  return normals;
}

const VAPID_PUBLIC_KEY = "BN9N-JZIyMl9HuJ5nNwZ1GfwjL8U0283hXl4uRHhgAdpv1h6nDF3IygrZx820qMtedo-WqApDIbiPe1A5fXHaI4";

const STORAGE_KEY = "quest-log-data";
const XP_BASE = 100;
const XP_INCREMENT = 15;

function habitTier(streakDays) {
  if (streakDays >= 66) return { label: "Diamond", color: "#4FA3C9" };
  if (streakDays >= 21) return { label: "Gold", color: "#C9A227" };
  if (streakDays >= 7) return { label: "Silver", color: "#B8C4CE" };
  if (streakDays >= 3) return { label: "Bronze", color: "#C1652B" };
  return { label: null, color: "#5C6773" };
}
function pad2(n) { return String(n).padStart(2, "0"); }
function localDateStr(d = new Date()) { return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; }
function parseLocalDate(s) { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); }
function addDaysLocal(s, delta) { const d = parseLocalDate(s); d.setDate(d.getDate() + delta); return localDateStr(d); }
function todayStr() { return localDateStr(); }
function yesterdayStr() { return addDaysLocal(todayStr(), -1); }
function getMondayISO(d = new Date()) {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = date.getDay();
  date.setDate(date.getDate() - day + (day === 0 ? -6 : 1));
  return localDateStr(date);
}
function dayDateLabel(mondayISO, offset) {
  const d = parseLocalDate(mondayISO);
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
function currentDayKey() { return DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1].key; }
function costForLevel(level) { return XP_BASE + XP_INCREMENT * (level - 1); }
function levelFromXP(totalXP) {
  let level = 1, remaining = totalXP;
  while (remaining >= costForLevel(level)) { remaining -= costForLevel(level); level++; }
  return { level, into: remaining, need: costForLevel(level) };
}
function comboBonusPct(ordinal) { return ordinal >= 5 ? 0.3 : ordinal >= 3 ? 0.15 : 0; }
function streakBonusPct(days) { return days >= 30 ? 0.5 : days >= 14 ? 0.35 : days >= 7 ? 0.2 : days >= 3 ? 0.1 : 0; }
function rankForLevel(level) { let t = RANKS[0].title; for (const r of RANKS) if (level >= r.minLevel) t = r.title; return t; }
function fmtTime(sec) { return `${Math.floor(sec / 60).toString().padStart(2, "0")}:${Math.floor(sec % 60).toString().padStart(2, "0")}`; }
function xpFor(diffKey) { return DIFFICULTIES.find((d) => d.key === diffKey)?.xp || 10; }
function emptyDayCounts() { return Object.fromEntries(DAYS.map((d) => [d.key, 0])); }
function emptyDiffCounts() { return Object.fromEntries(DIFFICULTIES.map((d) => [d.key, 0])); }
function extractJson(text) {
  const cleaned = text.replace(/```json|```/g, "").trim();
  // Try clean array first
  const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    try { JSON.parse(arrayMatch[0]); return arrayMatch[0]; } catch (_) {}
  }
  // Try clean object
  const objMatch = cleaned.match(/\{[\s\S]*\}/);
  if (objMatch) {
    try { JSON.parse(objMatch[0]); return objMatch[0]; } catch (_) {}
  }
  // Truncated array — extract complete items only
  if (cleaned.includes("[")) {
    const start = cleaned.indexOf("[");
    const partial = cleaned.slice(start);
    const items = [];
    let depth = 0, inStr = false, itemStart = -1;
    for (let i = 0; i < partial.length; i++) {
      const c = partial[i];
      if (c === '"' && partial[i-1] !== "\\") inStr = !inStr;
      if (inStr) continue;
      if (c === "{") { if (depth === 0) itemStart = i; depth++; }
      if (c === "}") { depth--; if (depth === 0 && itemStart !== -1) { try { const obj = JSON.parse(partial.slice(itemStart, i+1)); items.push(obj); } catch(_) {} itemStart = -1; } }
    }
    if (items.length > 0) return JSON.stringify(items);
  }
  return cleaned;
}

// ---- Gemini AI (via Vercel serverless proxy — no key in browser) ----
async function callQuestAI(prompt, timeoutMs = 60000, maxTokens = 4096) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let response;
  try {
    response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: maxTokens },
      }),
      signal: controller.signal,
    });
  } catch (e) {
    if (e.name === "AbortError") throw new Error("Request timed out");
    throw new Error("Network error — check your connection");
  } finally {
    clearTimeout(timer);
  }
  if (response.status === 500) throw new Error("Gemini API key not configured on server — check Vercel environment variables.");
  if (response.status === 429) { const err = new Error("AI quota reached for today"); err.isQuota = true; throw err; }
  if (!response.ok) throw new Error(`AI error ${response.status}`);
  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  if (!text) throw new Error("Empty response from Gemini");
  return extractJson(text.replace(/```json|```/g, "").trim());
}

async function assessTask(taskTitle) {
  const clean = await callQuestAI(
    `Classify this task for someone with ADHD. Output ONLY a JSON object, nothing else.
Task: "${taskTitle}"
Tiers: trivial=under 2min, easy=quick low focus, medium=20-45min, hard=multi-step, epic=large/taxing
{"difficulty":"easy","estMinutes":10,"reason":"6 words max"}`,
    20000, 80
  );
  const parsed = JSON.parse(clean);
  if (!DIFFICULTIES.some((d) => d.key === parsed.difficulty)) throw new Error("bad difficulty");
  return { difficulty: parsed.difficulty, estMinutes: Math.min(240, Math.max(1, Math.round(Number(parsed.estMinutes) || 15))), reason: parsed.reason };
}

async function parseBrainDump(text, todayISO, upcomingShifts) {
  const futureDates = Array.from({ length: 14 }, (_, i) => addDaysLocal(todayISO, i));
  const dateList = futureDates.join(", ");
  const shiftContext = upcomingShifts
    ? `\nWork shifts (avoid scheduling tasks during these hours on these dates): ${upcomingShifts}`
    : "";

  const clean = await callQuestAI(`INSTRUCTIONS: Output ONLY a JSON array. No prose, no explanation, no markdown, no backticks, no commentary before or after. Just the raw JSON array starting with [ and ending with ]. Any text outside the array will break the parser.

Today is ${todayISO} (YYYY-MM-DD format). You are scheduling tasks onto a real calendar.

Valid dates to assign tasks to: ${dateList}
CRITICAL: Only assign dates from the list above. Use real dates like "${todayISO}", not day names like "mon".${shiftContext}

Raw notes to convert into tasks:
"""${text}"""

Rules:
- Split into max 12 distinct actionable tasks (including any smart splits)
- Skip vague filler
- Classify each: trivial/easy/medium/hard/epic
- Estimate minutes per session: 1-240
- Add a short reason (max 6 words) explaining the difficulty
- Spread tasks across different dates — don't pile everything on one day
- Use deadline clues in the text ("by Friday", "next week", "tomorrow") to pick the right date
- Avoid scheduling tasks on dates where the user has a work shift if possible, or schedule them before/after the shift
- SMART SPLITTING: If a task benefits from multiple shorter sessions (e.g. "finish reading book", "study for exam"), split into 2-3 entries like "Read book — session 1" on different dates. Only split when it genuinely makes sense.

OUTPUT FORMAT (a JSON array, nothing else):
[{"title":"task name","difficulty":"easy","estMinutes":15,"date":"${todayISO}","reason":"why this difficulty"}]`, 45000);

  const parsed = JSON.parse(clean);
  if (!Array.isArray(parsed)) throw new Error("bad response");
  const validDateSet = new Set(futureDates);
  return parsed
    .filter((it) => it && it.title && DIFFICULTIES.some((d) => d.key === it.difficulty))
    .slice(0, 12)
    .map((it) => {
      let date = it.date && typeof it.date === "string" && it.date.length === 10 ? it.date : todayISO;
      if (!validDateSet.has(date)) date = todayISO;
      return {
        title: String(it.title).slice(0, 120),
        difficulty: it.difficulty,
        estMinutes: Math.min(240, Math.max(1, Math.round(Number(it.estMinutes) || 15))),
        date,
        reason: it.reason ? String(it.reason).slice(0, 60) : null,
      };
    });
}


async function splitEpicTask(taskTitle) {
  const clean = await callQuestAI(`INSTRUCTIONS: Output ONLY a JSON array. No prose, no explanation, no markdown, no backticks. Just the raw JSON array starting with [ and ending with ]. Any text outside the array will break the parser.

Break this task into 2-4 smaller sub-tasks for someone with ADHD:
"${taskTitle}"

Rules:
- Each sub-task must be concrete and startable
- Effort tier: trivial/easy/medium/hard (never epic)
- Estimated minutes: 1-120
- No explanations outside the JSON

OUTPUT FORMAT (a JSON array, nothing else):
[{"title":"sub-task name","difficulty":"easy","estMinutes":15}]`, 30000, 300);
  const parsed = JSON.parse(clean);
  if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("bad response");
  return parsed
    .filter((it) => it && it.title && DIFFICULTIES.some((d) => d.key === it.difficulty))
    .slice(0, 4)
    .map((it) => ({ title: String(it.title).slice(0, 120), difficulty: it.difficulty, estMinutes: Math.min(120, Math.max(1, Math.round(Number(it.estMinutes) || 15))) }));
}

// ---- WeekShiftModal — standalone component to avoid nested component crash ----
function WeekShiftModal({ weekDates, shifts, accent, themePersonality, onSave, onClose, formatShiftTime, parseLocalDate }) {
  const [rows, setRows] = useState(() =>
    weekDates.map((date) => {
      const existing = shifts.find((s) => s.date === date);
      return { date, enabled: !!existing, startTime: existing?.startTime || "09:00", endTime: existing?.endTime || "17:00" };
    })
  );

  function save() {
    onSave(rows.filter((r) => r.enabled).map(({ date, startTime, endTime }) => ({ date, startTime, endTime })));
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,14,20,0.80)", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={onClose}>
      <div style={{ background: themePersonality.cardBase, border: `1px solid ${accent}55`, borderRadius: 16, padding: 20, width: "100%", maxWidth: 380, maxHeight: "90vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}>
        <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, fontFamily: "Georgia, serif", color: accent }}>Set Week Shifts</h3>
        <p style={{ fontSize: 12, color: "#8A8578", margin: "0 0 16px" }}>Toggle days you're working and set times.</p>
        {rows.map((row, i) => (
          <div key={row.date} style={{ marginBottom: 10, background: row.enabled ? accent + "10" : "#141C27", border: `1px solid ${row.enabled ? accent + "44" : "#2C3947"}`, borderRadius: 10, padding: "10px 12px", transition: "all 0.15s" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: row.enabled ? 10 : 0 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: row.enabled ? accent : "#8A8578" }}>
                {parseLocalDate(row.date).toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "short" })}
              </span>
              <div onClick={() => setRows((r) => r.map((x, j) => j === i ? { ...x, enabled: !x.enabled } : x))}
                style={{ width: 36, height: 20, borderRadius: 10, background: row.enabled ? accent : "#2C3947", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
                <div style={{ position: "absolute", top: 3, left: row.enabled ? 18 : 3, width: 14, height: 14, borderRadius: "50%", background: "#EDE4D3", transition: "left 0.2s" }} />
              </div>
            </div>
            {row.enabled && (
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 10, color: "#5C6773", margin: "0 0 3px" }}>Start</p>
                  <input type="time" value={row.startTime}
                    onChange={(e) => setRows((r) => r.map((x, j) => j === i ? { ...x, startTime: e.target.value } : x))}
                    style={{ width: "100%", boxSizing: "border-box", background: "#141C27", border: "1px solid #33414F", borderRadius: 6, padding: "6px 4px", color: "#EDE4D3", fontSize: 12 }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 10, color: "#5C6773", margin: "0 0 3px" }}>End</p>
                  <input type="time" value={row.endTime}
                    onChange={(e) => setRows((r) => r.map((x, j) => j === i ? { ...x, endTime: e.target.value } : x))}
                    style={{ width: "100%", boxSizing: "border-box", background: "#141C27", border: "1px solid #33414F", borderRadius: 6, padding: "6px 4px", color: "#EDE4D3", fontSize: 12 }} />
                </div>
              </div>
            )}
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <button onClick={save} className="qlog-btn"
            style={{ flex: 1, background: accent, border: "none", borderRadius: 8, padding: "11px 0", fontWeight: 700, fontSize: 13, color: "#1B2430", cursor: "pointer" }}>
            Save Shifts
          </button>
          <button onClick={onClose} className="qlog-btn"
            style={{ background: "#141C27", border: "1px solid #33414F", borderRadius: 8, padding: "11px 14px", fontSize: 13, color: "#8A8578", cursor: "pointer" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  // ---- State ----
  const [quests, setQuests] = useState([]);
  const [totalXP, setTotalXP] = useState(0);
  const [gold, setGold] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastActiveDate, setLastActiveDate] = useState(null);
  const [weeklyBossId, setWeeklyBossId] = useState(null);
  const [weekStart, setWeekStart] = useState(getMondayISO());
  const [pendingBattle, setPendingBattle] = useState(null); // enemies array waiting to be fought
  const [battleState, setBattleState] = useState(null); // active battle
  const [isBlocking, setIsBlocking] = useState(false);
  const [battleAnimating, setBattleAnimating] = useState(false);
  const [blockCooldown, setBlockCooldown] = useState(0); // turns until block available again
  const [inventory, setInventory] = useState(["theme_ember", "wpn_sword"]);
  const [equipped, setEquipped] = useState({ ...DEFAULT_GEAR });
  const [crateModalOpen, setCrateModalOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [pickingSlot, setPickingSlot] = useState(null); // which slot is being picked
  const collectionScrollRef = useRef(null);
  const [lastDrop, setLastDrop] = useState(null);
  const [devMode, setDevMode] = useState(false);
  const [devGold, setDevGold] = useState("100");
  const [devXP, setDevXP] = useState("200");
  const devTapCount = useRef(0);
  const devTapTimer = useRef(null); // { item, isNew }
  const [historyDay, setHistoryDay] = useState(emptyDayCounts);
  const [historyDiff, setHistoryDiff] = useState(emptyDiffCounts);
  const [habits, setHabits] = useState([]);
  const [habitPerfectDayDate, setHabitPerfectDayDate] = useState(null);
  const [newHabitName, setNewHabitName] = useState("");
  const [habitBanner, setHabitBanner] = useState(null);
  const [perfectDayBanner, setPerfectDayBanner] = useState(false);
  const [habitXpPop, setHabitXpPop] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // Calendar state
  const [calView, setCalView] = useState("week"); // "day" | "week" | "month"
  const [calAnchor, setCalAnchor] = useState(todayStr()); // focused date
  const [selectedDate, setSelectedDate] = useState(todayStr());

  // UI state
  const [showCompleted, setShowCompleted] = useState(true);
  const [levelUp, setLevelUp] = useState(null);
  const [playerStats, setPlayerStats] = useState({ bonusHp: 0, bonusDef: 0, bonusAtk: 0, bonusCrit: 0 });
  const [statHistory, setStatHistory] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [weekShiftModalOpen, setWeekShiftModalOpen] = useState(false); // [{ level, key, value }]
  const [statChoiceQueue, setStatChoiceQueue] = useState([]);
  const [notifPermission, setNotifPermission] = useState("default");
  const [swReg, setSwReg] = useState(null); // pending level-up choices
  const [streakBanner, setStreakBanner] = useState(null);
  const [bossBanner, setBossBanner] = useState(null);
  const [xpPop, setXpPop] = useState(null);
  const [assessing, setAssessing] = useState(false);
  const [assessError, setAssessError] = useState(false);
  const [aiQuotaExhausted, setAiQuotaExhausted] = useState(false);
  const [focus, setFocus] = useState(null);
  const [focusOpen, setFocusOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addDate, setAddDate] = useState(todayStr());
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [recurringChoice, setRecurringChoice] = useState(null);
  const [repeatWeeks, setRepeatWeeks] = useState(2);
  const [manualMinutes, setManualMinutes] = useState("");
  const [dumpModalOpen, setDumpModalOpen] = useState(false);
  const [dumpText, setDumpText] = useState("");
  const [dumpParsing, setDumpParsing] = useState(false);
  const [dumpError, setDumpError] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);

  const [splittingId, setSplittingId] = useState(null);
  const [splitError, setSplitError] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [moveMenuFor, setMoveMenuFor] = useState(null);
  const [questDetailFor, setQuestDetailFor] = useState(null);
  const [deleteSeriesPromptFor, setDeleteSeriesPromptFor] = useState(null); // { id, seriesId, title }
  const [dragOverDate, setDragOverDate] = useState(null);
  const [dragOverTrash, setDragOverTrash] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragIdRef = useRef(null);
  const [confettiPieces, setConfettiPieces] = useState([]);
  const longPressTimer = useRef(null);
  const saveTimer = useRef(null);

  // ---- Load ----
  useEffect(() => {
    (async () => {
      let data = null;
      try {
        const res = await window.storage.get(STORAGE_KEY);
        if (res && res.value) data = JSON.parse(res.value);
      } catch (e) {}

      if (data) {
        const today = todayStr();
        const nowMonday = getMondayISO();

        // Migrate old day-key quests (mon/tue/etc) to actual ISO dates
        const dayKeyMap = { mon: 0, tue: 1, wed: 2, thu: 3, fri: 4, sat: 5, sun: 6 };
        let workingQuests = (data.quests || []).map((q) => {
          if (q.date) return q; // already migrated
          if (q.day && dayKeyMap[q.day] !== undefined) {
            const monday = parseLocalDate(nowMonday);
            monday.setDate(monday.getDate() + dayKeyMap[q.day]);
            return { ...q, date: localDateStr(monday), day: undefined };
          }
          return { ...q, date: today, day: undefined };
        });

        // Reset recurring quests — kept for backwards compat with any old-style recurring quests
        workingQuests = workingQuests.filter((q) => {
          // Remove any old-style recurring quests that were generated by the previous system
          // (they'll be re-added as proper dated instances if the user sets repeat again)
          return true; // keep all quests, just don't do magic resets anymore
        });

        setQuests(workingQuests);
        setHistoryDay({ ...emptyDayCounts(), ...(data.historyDay || {}) });
        setHistoryDiff({ ...emptyDiffCounts(), ...(data.historyDiff || {}) });
        setTotalXP(data.totalXP || 0);
        setGold(data.gold || 0);
        setStreak(data.streak || 0);
        setLastActiveDate(data.lastActiveDate || null);
        setWeekStart(data.weekStart === nowMonday ? data.weekStart : nowMonday);
        setWeeklyBossId(data.weekStart === nowMonday ? (data.weeklyBossId || null) : null);
        // On new week: generate battle from last week's completed quests
        if (data.weekStart && data.weekStart !== nowMonday) {
          const completed = (data.quests || []).filter((q) => q.completed && !q.recurring);
          if (completed.length > 0) {
            const enemies = buildEnemies(completed, data.weeklyBossId);
            setPendingBattle(enemies);
          }
        } else {
          setPendingBattle(data.pendingBattle || null);
          setBattleState(data.battleState || null);
        }
        setInventory(data.inventory?.length ? data.inventory : ["theme_ember", "wpn_sword"]);
        setEquipped(data.equipped ? { ...DEFAULT_GEAR, ...data.equipped } : { ...DEFAULT_GEAR });
        setPlayerStats(data.playerStats || { bonusHp: 0, bonusDef: 0, bonusAtk: 0, bonusCrit: 0 });
        setStatHistory(data.statHistory || []);
        setShifts(data.shifts || []);
        setHabits(data.habits || []);
        setHabitPerfectDayDate(data.habitPerfectDayDate || null);
        if (data.calView) setCalView(data.calView);
        if (data.focus) {
          const f = data.focus;
          if (f.running && f.endsAt) {
            const remaining = Math.floor((f.endsAt - Date.now()) / 1000);
            setFocus(remaining > 0 ? { ...f, secondsLeft: remaining } : { ...f, secondsLeft: 0, running: false });
          } else {
            setFocus(f);
          }
        }
      } else {
        setHabits([
          { id: Date.now() + 0.1, name: "Make the bed", streak: 0, lastCompletedDate: null, totalCompletions: 0, undo: null },
          { id: Date.now() + 0.2, name: "Brush teeth", streak: 0, lastCompletedDate: null, totalCompletions: 0, undo: null },
          { id: Date.now() + 0.3, name: "Wash face", streak: 0, lastCompletedDate: null, totalCompletions: 0, undo: null },
        ]);
      }
      setLoaded(true);
    })();
  }, []);

  // ---- Save ----
  useEffect(() => {
    if (!loaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await window.storage.set(STORAGE_KEY, JSON.stringify({
          quests, totalXP, gold, streak, lastActiveDate, weekStart, weeklyBossId, inventory, equipped, playerStats, statHistory, shifts, historyDay, historyDiff,
          habits, habitPerfectDayDate, calView, pendingBattle, battleState, focus,
        }));
      } catch (e) { console.error("save failed", e); }
    }, 150);
  }, [quests, totalXP, gold, streak, lastActiveDate, weekStart, weeklyBossId, inventory, equipped, playerStats, statHistory, shifts, historyDay, historyDiff, habits, habitPerfectDayDate, calView, pendingBattle, battleState, focus, loaded]);

  // ---- Real-time sync from other devices ----
  useEffect(() => {
    if (!loaded) return;
    const unsub = window.storage.subscribe?.((key, value) => {
      if (key !== STORAGE_KEY) return;
      try {
        const data = JSON.parse(value);
        // Apply remote state — same migration logic as the initial load
        const nowMonday = getMondayISO();
        const dayKeyMap = { mon: 0, tue: 1, wed: 2, thu: 3, fri: 4, sat: 5, sun: 6 };
        const migratedQuests = (data.quests || []).map((q) => {
          if (q.date) return q;
          if (q.day && dayKeyMap[q.day] !== undefined) {
            const monday = parseLocalDate(nowMonday);
            monday.setDate(monday.getDate() + dayKeyMap[q.day]);
            return { ...q, date: localDateStr(monday), day: undefined };
          }
          return { ...q, date: todayStr(), day: undefined };
        });
        setQuests(migratedQuests);
        setTotalXP(data.totalXP || 0);
        setGold(data.gold || 0);
        setStreak(data.streak || 0);
        setLastActiveDate(data.lastActiveDate || null);
        setWeeklyBossId(data.weeklyBossId || null);
        setWeekStart(data.weekStart || nowMonday);
        setInventory(data.inventory?.length ? data.inventory : ["theme_ember", "wpn_sword"]);
        setEquipped(data.equipped ? { ...DEFAULT_GEAR, ...data.equipped } : { ...DEFAULT_GEAR });
        setPlayerStats(data.playerStats || { bonusHp: 0, bonusDef: 0, bonusAtk: 0, bonusCrit: 0 });
        setStatHistory(data.statHistory || []);
        setShifts(data.shifts || []);
        setPendingBattle(data.pendingBattle || null);
        setHabits(data.habits || []);
        setHabitPerfectDayDate(data.habitPerfectDayDate || null);
        setHistoryDay({ ...emptyDayCounts(), ...(data.historyDay || {}) });
        setHistoryDiff({ ...emptyDiffCounts(), ...(data.historyDiff || {}) });
      } catch (e) {
        console.error("real-time sync parse error", e);
      }
    });
    return () => unsub?.();
  }, [loaded]);
  useEffect(() => {
    if (!focus || !focus.running) return;
    const id = setInterval(() => {
      setFocus((f) => { if (!f) return f; if (f.secondsLeft <= 1) return { ...f, secondsLeft: 0, running: false }; return { ...f, secondsLeft: f.secondsLeft - 1 }; });
    }, 1000);
    return () => clearInterval(id);
  }, [focus?.running, focus?.questId]);
  // ---- Sync notification permission state on load ----
  useEffect(() => {
    if ("Notification" in window) setNotifPermission(Notification.permission);
  }, []);

  // ---- Recompute playerStats when level changes (handles de-levelling) ----
  useEffect(() => {
    if (!loaded || statHistory.length === 0) return;
    const currentLevel = levelFromXP(totalXP).level;
    const validHistory = statHistory.filter((e) => e.level <= currentLevel);
    if (validHistory.length === statHistory.length) return; // nothing to strip
    const newStats = validHistory.reduce((acc, e) => ({
      ...acc,
      [e.key]: (acc[e.key] || 0) + e.value,
    }), { bonusHp: 0, bonusDef: 0, bonusAtk: 0, bonusCrit: 0 });
    setStatHistory(validHistory);
    setPlayerStats(newStats);
  }, [totalXP, loaded]);

  // ---- Service Worker registration ----
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").then((reg) => {
      setSwReg(reg);
    }).catch((e) => console.warn("SW registration failed:", e));
  }, [loaded]);

  // ---- Schedule focus timer push when focus starts ----
  useEffect(() => {
    if (!swReg?.active || !focus?.running || !focus?.endsAt) return;
    const q = quests.find((x) => x.id === focus.questId);
    const questLabel = q ? `"${q.title}"` : "Focus session";
    swReg.active.postMessage({
      type: "SCHEDULE_NOTIFICATION",
      id: "focus-timer",
      title: "⏱ Focus timer done!",
      body: q ? `"${q.title}" focus session complete.` : "Focus session complete.",
      tag: "focus-timer",
      url: "/",
      fireAt: focus.endsAt,
    });
    const warnAt = focus.endsAt - 5 * 60 * 1000;
    if (warnAt > Date.now()) {
      swReg.active.postMessage({
        type: "SCHEDULE_NOTIFICATION",
        id: "focus-timer-warning",
        title: "⏱ 5 minutes left",
        body: `${questLabel} wraps up in 5 minutes.`,
        tag: "focus-timer-warning",
        url: "/",
        fireAt: warnAt,
      });
    } else {
      swReg.active.postMessage({ type: "CANCEL_NOTIFICATION", id: "focus-timer-warning" });
    }
    return () => {
      swReg.active?.postMessage({ type: "CANCEL_NOTIFICATION", id: "focus-timer" });
      swReg.active?.postMessage({ type: "CANCEL_NOTIFICATION", id: "focus-timer-warning" });
    };
  }, [focus?.running, focus?.endsAt, swReg]);

  // ---- Keep screen awake while the focus timer is enlarged on screen ----
  useEffect(() => {
    if (!focusOpen || !("wakeLock" in navigator)) return;
    let lock = null;
    let cancelled = false;
    const acquire = async () => {
      try {
        lock = await navigator.wakeLock.request("screen");
      } catch (e) {
        console.warn("wake lock failed:", e);
      }
    };
    acquire();
    const onVisibility = () => {
      if (!cancelled && document.visibilityState === "visible" && !lock) acquire();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibility);
      lock?.release().catch(() => {});
    };
  }, [focusOpen]);

  const { level, into, need } = levelFromXP(totalXP);
  const rank = rankForLevel(level);
  const nextMilestone = MILESTONE_LEVELS.find((m) => level < m);
  const accent = (ITEM_CATALOGUE.find((i) => i.id === equipped.theme))?.value || "#C9A227";

  // Blend difficulty colours toward the theme accent (18% keeps them readable)
  const themedDifficulties = DIFFICULTIES.map((d) => {
    const parse = (h) => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
    const toHex = (n) => n.toString(16).padStart(2,'0');
    const [br,bg,bb] = parse(d.color);
    const [tr,tg,tb] = parse(accent);
    const blend = 0.18;
    const r = Math.round(br + (tr-br)*blend);
    const g = Math.round(bg + (tg-bg)*blend);
    const b = Math.round(bb + (tb-bb)*blend);
    return { ...d, color: `#${toHex(r)}${toHex(g)}${toHex(b)}` };
  });
  const today = todayStr();
  const activeStats = computeActiveStats(equipped);
  const activeAura = equipped.aura ? ITEM_CATALOGUE.find((i) => i.id === equipped.aura) : null;
  const auraColor = activeAura?.auraColor || null;

  // Theme personality — subtle tints on bg and cards, accent border on header
  const themePersonality = (() => {
    const tid = equipped.theme || "theme_ember";
    const isVoid  = ["theme_void","theme_abyss","theme_doom"].includes(tid);
    const isFrost = ["theme_frost","theme_sapphire","theme_ghost"].includes(tid);
    const isBlood = ["theme_blood","theme_crimson","theme_inferno"].includes(tid);
    const isSolar = ["theme_solaris","theme_nebula","theme_prismatic"].includes(tid);
    const bgBase   = isVoid ? "#0F0C18" : isFrost ? "#0E1620" : isBlood ? "#130C0C" : isSolar ? "#131108" : "#1B2430";
    const cardBase = isVoid ? "#1A1528" : isFrost ? "#111E2A" : isBlood ? "#1D1212" : isSolar ? "#1B190E" : "#232E3D";
    const deepBase = isVoid ? "#110E1C" : isFrost ? "#0D1520" : isBlood ? "#160D0D" : isSolar ? "#151308" : "#1F2836";
    const xpGlow   = `0 0 10px ${accent}33`;
    const borderCol = `${accent}33`;
    return { bgBase, cardBase, deepBase, xpGlow, borderCol };
  })();

  const todayInView = calView === "day" ? calAnchor === today
    : calView === "week" ? getWeekDates(calAnchor).includes(today)
    : (() => { const d = parseLocalDate(calAnchor); return d.getFullYear() === parseLocalDate(today).getFullYear() && d.getMonth() === parseLocalDate(today).getMonth(); })();
  const timerPct = focus && focus.totalSeconds ? (focus.secondsLeft / focus.totalSeconds) * 100 : 100;
  const timerColor = timerPct > 50 ? "#4C9A6A" : timerPct > 20 ? "#C9A227" : "#8A2E44";
  const bossQuest = weeklyBossId ? quests.find((q) => q.id === weeklyBossId) : null;
  const completedTodayCount = quests.filter((q) => q.completed && q.completedAt === today).length;
  const comboPctActive = comboBonusPct(completedTodayCount + 1);
  const streakPctActive = streakBonusPct(streak);
  const dayStats = DAYS.map((d) => ({ label: d.label, count: (historyDay[d.key] || 0) + quests.filter((q) => q.completed && q.date && DAYS[new Date(q.date + "T00:00:00").getDay() === 0 ? 6 : new Date(q.date + "T00:00:00").getDay() - 1]?.key === d.key).length }));
  const diffStats = themedDifficulties.map((d) => ({ label: d.label, color: d.color, count: (historyDiff[d.key] || 0) + quests.filter((q) => q.completed && q.difficulty === d.key).length }));
  const maxDayCount = Math.max(1, ...dayStats.map((d) => d.count));
  const maxDiffCount = Math.max(1, ...diffStats.map((d) => d.count));

  // ---- Calendar helpers ----
  function getWeekDates(anchorDate) {
    const d = parseLocalDate(anchorDate);
    const day = d.getDay();
    const monday = new Date(d);
    monday.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
    return Array.from({ length: 7 }, (_, i) => {
      const dd = new Date(monday);
      dd.setDate(monday.getDate() + i);
      return localDateStr(dd);
    });
  }

  function getMonthDates(anchorDate) {
    const d = parseLocalDate(anchorDate);
    const year = d.getFullYear();
    const month = d.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    // pad to start on Monday
    let start = new Date(firstDay);
    const startDay = start.getDay();
    start.setDate(start.getDate() - (startDay === 0 ? 6 : startDay - 1));
    let end = new Date(lastDay);
    const endDay = end.getDay();
    if (endDay !== 0) end.setDate(end.getDate() + (7 - endDay));
    const dates = [];
    const cur = new Date(start);
    while (cur <= end) { dates.push(localDateStr(cur)); cur.setDate(cur.getDate() + 1); }
    return dates;
  }

  function monthLabel(anchorDate) {
    const d = parseLocalDate(anchorDate);
    return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  }

  function weekLabel(anchorDate) {
    const dates = getWeekDates(anchorDate);
    const s = parseLocalDate(dates[0]);
    const e = parseLocalDate(dates[6]);
    return `${s.toLocaleDateString(undefined, { day: "numeric", month: "short" })} – ${e.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}`;
  }

  function navCalendar(dir) {
    if (calView === "day") setCalAnchor((a) => addDaysLocal(a, dir));
    else if (calView === "week") setCalAnchor((a) => addDaysLocal(a, dir * 7));
    else setCalAnchor((a) => {
      const d = parseLocalDate(a);
      d.setMonth(d.getMonth() + dir);
      return localDateStr(d);
    });
  }

  function questsForDate(date) {
    return quests.filter((q) => q.date === date && (showCompleted || !q.completed));
  }

  // ---- Quest actions ----
  function buildQuestInstances(trimmed, diffKey, reason, estMinutes) {
    const mins = manualMinutes ? parseInt(manualMinutes, 10) || null : estMinutes || null;
    const seriesId = recurringChoice ? `series-${Date.now()}` : null;
    const base = { title: trimmed, difficulty: diffKey, xp: xpFor(diffKey), reason, estMinutes: mins, completed: false, completedAt: null, seriesId };
    if (!recurringChoice) {
      return [{ ...base, id: Date.now() + Math.random(), date: addDate }];
    }
    const instances = [];
    const weeks = Math.max(1, Math.min(52, repeatWeeks || 2));
    for (let w = 0; w < weeks; w++) {
      const date = recurringChoice === "daily"
        ? addDaysLocal(addDate, w)          // one per day for N days (we treat weeks as "occurrences" for daily)
        : addDaysLocal(addDate, w * 7);     // same weekday each week
      if (recurringChoice === "daily") {
        // For daily, generate one per day for (weeks * 7) days
        for (let d = 0; d < 7; d++) {
          instances.push({ ...base, id: Date.now() + Math.random() + w * 100 + d, date: addDaysLocal(addDate, w * 7 + d) });
        }
        break; // handled inside the loop
      } else {
        instances.push({ ...base, id: Date.now() + Math.random() + w, date });
      }
    }
    // For daily, rebuild properly
    if (recurringChoice === "daily") {
      const totalDays = Math.max(1, Math.min(365, weeks * 7));
      return Array.from({ length: totalDays }, (_, i) => ({
        ...base, id: Date.now() + Math.random() + i, date: addDaysLocal(addDate, i),
      }));
    }
    return instances;
  }

  function addQuest() {
    const trimmed = title.trim();
    if (!trimmed) return;
    setAssessError(false);
    const finish = (diffKey, reason, estMinutes, closeDelay = 0) => {
      const instances = buildQuestInstances(trimmed, diffKey, reason, estMinutes);
      setQuests((q) => [...instances, ...q]);
      setTitle("");
      setRecurringChoice(null);
      setManualMinutes("");
      if (closeDelay > 0) setTimeout(() => setAddModalOpen(false), closeDelay);
      else setAddModalOpen(false);
    };
    setAssessing(true);
    assessTask(trimmed)
      .then((r) => finish(r.difficulty, r.reason, r.estMinutes))
      .catch((e) => {
        if (e.isQuota) {
          setAiQuotaExhausted(true);
          setAssessError(false);
        } else {
          setAssessError(true);
        }
        // Don't silently add — let the user pick difficulty manually
      })
      .finally(() => setAssessing(false));
  }

  function addQuestManual() {
    const trimmed = title.trim();
    if (!trimmed) return;
    const instances = buildQuestInstances(trimmed, difficulty, null, null);
    setQuests((q) => [...instances, ...q]);
    setTitle("");
    setRecurringChoice(null);
    setManualMinutes("");
    setAssessError(false);
    setAddModalOpen(false);
  }

  function submitDump() {
    const trimmed = dumpText.trim();
    if (!trimmed) return;
    setDumpError(false);
    setDumpParsing(true);
    // Build shift context for the next 14 days
    const upcomingShifts = shifts
      .filter((s) => s.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 14)
      .map((s) => `${s.date}: ${s.startTime}–${s.endTime}`)
      .join(", ");
    parseBrainDump(trimmed, today, upcomingShifts)
      .then((items) => {
        setQuests((qs) => [...items.map((it) => ({ id: Date.now() + Math.random(), title: it.title, difficulty: it.difficulty, xp: xpFor(it.difficulty), reason: it.reason || null, estMinutes: it.estMinutes, date: it.date, recurring: null, completed: false, completedAt: null })), ...qs]);
        setDumpText("");
        setDumpModalOpen(false);
      })
      .catch(() => setDumpError(true))
      .finally(() => setDumpParsing(false));
  }

  function splitEpicQuest(quest) {
    setSplittingId(quest.id);
    setSplitError(false);
    splitEpicTask(quest.title)
      .then((subs) => {
        setQuests((qs) => [...subs.map((s) => ({ id: Date.now() + Math.random(), title: s.title, difficulty: s.difficulty, xp: xpFor(s.difficulty), reason: null, estMinutes: s.estMinutes, date: quest.date, recurring: null, completed: false, completedAt: null })), ...qs.filter((q) => q.id !== quest.id)]);
        if (weeklyBossId === quest.id) setWeeklyBossId(null);
      })
      .catch(() => { setSplitError(true); setTimeout(() => setSplitError(false), 3000); })
      .finally(() => setSplittingId(null));
  }

  function completeQuest(id, opts = {}) {
    const { beatClockBonus = 0 } = opts;
    const quest = quests.find((q) => q.id === id);
    if (!quest || quest.completed) return;
    const isBoss = weeklyBossId === id;
    const bossBonus = isBoss ? quest.xp : 0;
    let newStreak = streak, milestoneBonus = 0, streakChanged = false;
    if (lastActiveDate !== today) {
      newStreak = lastActiveDate === yesterdayStr() ? streak + 1 : 1;
      milestoneBonus = STREAK_MILESTONES[newStreak] || 0;
      streakChanged = true;
    }
    const effectiveStreak = streakChanged ? newStreak : streak;
    const comboOrdinal = quests.filter((q) => q.completed && q.completedAt === today).length + 1;
    const boostPct = comboBonusPct(comboOrdinal) + streakBonusPct(effectiveStreak);
    const workXP = quest.xp + beatClockBonus + bossBonus;
    const boostXP = Math.round(workXP * boostPct);
    const gearXP = Math.round((workXP + boostXP) * activeStats.xpPct);
    const xpGain = workXP + boostXP + gearXP + milestoneBonus;
    const goldEarned = Math.max(1, Math.round(xpGain / 10) + activeStats.goldFlat);
    const prevLevel = levelFromXP(totalXP).level;
    const newTotal = totalXP + xpGain;
    const newLevel = levelFromXP(newTotal).level;
    const undo = { xpAwarded: xpGain, goldAwarded: goldEarned, streakIncremented: streakChanged, prevStreak: streak, prevLastActiveDate: lastActiveDate };
    setQuests((qs) => qs.map((q) => q.id === id ? { ...q, completed: true, completedAt: today, undo } : q));
    setTotalXP(newTotal);
    setGold((g) => g + goldEarned);
    if (streakChanged) { setStreak(newStreak); setLastActiveDate(today); }
    setXpPop({ id, xp: workXP + boostXP, gearXP, gearPct: activeStats.xpPct, activeSets: activeStats.activeSets });
    setTimeout(() => setXpPop(null), 900);
    if (isBoss) { setBossBanner(true); setTimeout(() => setBossBanner(false), 2400); }
    if (milestoneBonus > 0) { setStreakBanner({ days: newStreak, bonus: milestoneBonus }); setTimeout(() => setStreakBanner(null), 2400); }
    if (newLevel > prevLevel) { spawnConfetti(); setStatChoiceQueue((q) => [...q, { level: newLevel, rank: rankForLevel(newLevel) }]); }
    setFocus((f) => f && f.questId === id ? null : f);
    setFocusOpen(false);
    setQuestDetailFor(null);
  }

  function uncompleteQuest(id) {
    const quest = quests.find((q) => q.id === id);
    if (!quest || !quest.completed) return;
    const undo = quest.undo || { xpAwarded: quest.xp, goldAwarded: 1, streakIncremented: false, prevStreak: streak, prevLastActiveDate: lastActiveDate };
    setTotalXP((t) => Math.max(0, t - undo.xpAwarded));
    setGold((g) => Math.max(0, g - (undo.goldAwarded || 0)));
    if (undo.streakIncremented) { setStreak(undo.prevStreak); setLastActiveDate(undo.prevLastActiveDate); }
    setQuests((qs) => qs.map((q) => q.id === id ? { ...q, completed: false, completedAt: null, undo: null } : q));
  }

  function deleteQuest(id) {
    const quest = quests.find((q) => q.id === id);
    if (quest?.seriesId) {
      setDeleteSeriesPromptFor({ id, seriesId: quest.seriesId, title: quest.title });
      setQuestDetailFor(null);
      return;
    }
    setQuests((qs) => qs.filter((q) => q.id !== id));
    if (weeklyBossId === id) setWeeklyBossId(null);
    setQuestDetailFor(null);
  }

  function deleteQuestOnly(id) {
    setQuests((qs) => qs.filter((q) => q.id !== id));
    if (weeklyBossId === id) setWeeklyBossId(null);
    setQuestDetailFor(null);
    setDeleteSeriesPromptFor(null);
  }

  function deleteQuestSeries(seriesId) {
    setQuests((qs) => qs.filter((q) => q.seriesId !== seriesId));
    setWeeklyBossId((b) => { const kept = quests.find((q) => q.id === b && q.seriesId !== seriesId); return kept ? b : null; });
    setQuestDetailFor(null);
    setDeleteSeriesPromptFor(null);
  }

  function moveQuestToDate(id, date) {
    setQuests((qs) => qs.map((q) => q.id === id ? { ...q, date } : q));
    setMoveMenuFor(null);
  }

  function openFocus(quest) {
    if (focus && focus.questId === quest.id) { setFocusOpen(true); return; }
    setFocus({ questId: quest.id, title: quest.title, xp: quest.xp, minutesInput: quest.estMinutes || 15, totalSeconds: null, secondsLeft: null, running: false, started: false });
    setFocusOpen(true);
  }
  function startFocus() { setFocus((f) => { if (!f) return f; const total = f.minutesInput * 60; const endsAt = Date.now() + total * 1000; return { ...f, totalSeconds: total, secondsLeft: total, running: true, started: true, endsAt }; }); }
  function toggleRun() { setFocus((f) => f ? { ...f, running: !f.running } : f); }
  function resetFocus() { setFocus((f) => f ? { ...f, secondsLeft: f.totalSeconds, running: false } : f); }
  function completeFromFocus() {
    if (!focus) return;
    const quest = quests.find((q) => q.id === focus.questId);
    if (!quest) return;
    const beatClock = focus.started && focus.secondsLeft > 0 ? Math.max(5, Math.round(quest.xp * 0.25)) : 0;
    completeQuest(focus.questId, { beatClockBonus: beatClock });
  }

  // ---- Habit actions ----
  function completeHabit(id) {
    const habit = habits.find((h) => h.id === id);
    if (!habit || habit.lastCompletedDate === today) return;
    const yesterday = yesterdayStr();
    const newStreak = habit.lastCompletedDate === yesterday ? habit.streak + 1 : 1;
    const milestoneBonus = HABIT_STREAK_MILESTONES[newStreak] || 0;
    const steppedHabits = habits.map((h) => h.id === id ? { ...h, streak: newStreak, lastCompletedDate: today, totalCompletions: h.totalCompletions + 1 } : h);
    const allDoneToday = steppedHabits.length > 0 && steppedHabits.every((h) => h.lastCompletedDate === today);
    const perfectDayEarned = allDoneToday && habitPerfectDayDate !== today;
    let mainStreakChanged = false, newMainStreak = streak;
    if (lastActiveDate !== today) { newMainStreak = lastActiveDate === yesterday ? streak + 1 : 1; mainStreakChanged = true; }
    const xpGain = HABIT_XP + milestoneBonus + (perfectDayEarned ? PERFECT_DAY_XP : 0);
    const goldEarned = Math.max(1, Math.round(xpGain / 10));
    const prevLevel = levelFromXP(totalXP).level;
    const newTotal = totalXP + xpGain;
    const newLevel = levelFromXP(newTotal).level;
    const undo = { prevStreak: habit.streak, prevLastCompletedDate: habit.lastCompletedDate, xpAwarded: xpGain, goldAwarded: goldEarned, mainStreakChanged, prevMainStreak: streak, prevMainLastActiveDate: lastActiveDate, perfectDayEarned };
    setHabits(steppedHabits.map((h) => h.id === id ? { ...h, undo } : h));
    setTotalXP(newTotal);
    setGold((g) => g + goldEarned);
    if (mainStreakChanged) { setStreak(newMainStreak); setLastActiveDate(today); }
    if (perfectDayEarned) setHabitPerfectDayDate(today);
    setHabitXpPop({ id, xp: xpGain });
    setTimeout(() => setHabitXpPop(null), 900);
    if (perfectDayEarned) { setPerfectDayBanner(true); setTimeout(() => setPerfectDayBanner(false), 2400); }
    else if (milestoneBonus > 0) { setHabitBanner({ name: habit.name, days: newStreak, bonus: milestoneBonus }); setTimeout(() => setHabitBanner(null), 2400); }
    if (newLevel > prevLevel) { spawnConfetti(); setStatChoiceQueue((q) => [...q, { level: newLevel, rank: rankForLevel(newLevel) }]); }
  }
  function uncompleteHabit(id) {
    const habit = habits.find((h) => h.id === id);
    if (!habit || habit.lastCompletedDate !== today || !habit.undo) return;
    const u = habit.undo;
    setTotalXP((t) => Math.max(0, t - (u.xpAwarded || 0)));
    setGold((g) => Math.max(0, g - (u.goldAwarded || 0)));
    if (u.mainStreakChanged) { setStreak(u.prevMainStreak); setLastActiveDate(u.prevMainLastActiveDate); }
    if (u.perfectDayEarned) setHabitPerfectDayDate((d) => d === today ? null : d);
    setHabits((hs) => hs.map((h) => h.id === id ? { ...h, streak: u.prevStreak, lastCompletedDate: u.prevLastCompletedDate, totalCompletions: Math.max(0, h.totalCompletions - 1), undo: null } : h));
  }
  function addHabit(name) {
    const trimmed = name.trim();
    if (!trimmed) return;
    setHabits((hs) => [...hs, { id: Date.now() + Math.random(), name: trimmed, streak: 0, lastCompletedDate: null, totalCompletions: 0, undo: null }]);
    setNewHabitName("");
  }
  function deleteHabit(id) { setHabits((hs) => hs.filter((h) => h.id !== id)); }

  async function clearAllData() {
    try { await window.storage.delete(STORAGE_KEY); } catch (e) {}
    setQuests([]);
    setTotalXP(0);
    setGold(0);
    setStreak(0);
    setLastActiveDate(null);
    setWeeklyCompletedCount(0);
    setWeeklyBonusClaimed(false);
    setWeeklyBossId(null);
    setHistoryDay(emptyDayCounts());
    setHistoryDiff(emptyDiffCounts());
    setInventory(["theme_ember", "wpn_sword"]);
    setEquipped({ ...DEFAULT_GEAR });
    setLastDrop(null);
    setPendingBattle(null);
    setBattleState(null);
    setPlayerStats({ bonusHp: 0, bonusDef: 0, bonusAtk: 0, bonusCrit: 0 });
    setStatHistory([]);
    setShifts([]);
    setStatChoiceQueue([]);
    setHabits([
      { id: Date.now() + 0.1, name: "Make the bed", streak: 0, lastCompletedDate: null, totalCompletions: 0, undo: null },
      { id: Date.now() + 0.2, name: "Brush teeth", streak: 0, lastCompletedDate: null, totalCompletions: 0, undo: null },
      { id: Date.now() + 0.3, name: "Wash face", streak: 0, lastCompletedDate: null, totalCompletions: 0, undo: null },
    ]);
    setHabitPerfectDayDate(null);
    setConfirmClear(false);
    setSettingsOpen(false);
  }

    function spawnConfetti() {
    const colors = [accent, "#4C9A6A", "#C1652B", "#8A5FBF", "#4FA3C9", "#C9A227"];
    const pieces = Array.from({ length: 36 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: `${0.9 + Math.random() * 0.8}s`,
      delay: `${Math.random() * 0.4}s`,
      size: `${6 + Math.random() * 6}px`,
    }));
    setConfettiPieces(pieces);
    setTimeout(() => setConfettiPieces([]), 2000);
  }

  function getPlayerCombatStats() {
    const atk = (WEAPON_ATK[equipped.weapon] || 15) + (playerStats.bonusAtk || 0);
    const def = activeStats.defense + (playerStats.bonusDef || 0);
    const hp = activeStats.maxHealth + (playerStats.bonusHp || 0);
    const crit = activeStats.critChance + (playerStats.bonusCrit || 0);
    const miss = WEAPON_MISS[equipped.weapon] ?? 0.12;
    return { atk, def, hp, crit, miss };
  }

  function startBattle() {
    if (!pendingBattle || pendingBattle.length === 0) return;
    const stats = getPlayerCombatStats();
    setBattleState({
      enemies: pendingBattle.map((e) => ({ ...e })),
      currentIndex: 0,
      playerMaxHp: stats.hp,
      playerHp: stats.hp,
      log: [`⚔ Battle begins! ${pendingBattle.length} enemies await.`, `Your weapon: ${ITEM_CATALOGUE.find((i) => i.id === equipped.weapon)?.label || "Iron Sword"} — ${stats.atk} ATK`],
      phase: "fighting", // "fighting" | "victory" | "defeat" | "drop"
      goldEarned: 0,
      xpEarned: 0,
      pendingDrop: null,
    });
  }

  function doPlayerTurn(blocking = false) {
    if (!battleState || battleState.phase !== "fighting" || battleAnimating) return;
    setBattleAnimating(true);
    setIsBlocking(blocking);
    if (blocking) setBlockCooldown(2); // 2-turn cooldown after blocking
    else setBlockCooldown((c) => Math.max(0, c - 1));
    const stats = getPlayerCombatStats();
    const state = battleState;
    const enemies = state.enemies.map((e) => ({ ...e }));
    const enemy = enemies[state.currentIndex];
    if (!enemy || enemy.hp <= 0) { setBattleAnimating(false); return; }
    const log = [...state.log];

    // Step 1: Player attack — miss check first, then crit, then blocking mult
    setTimeout(() => {
      const playerMissed = Math.random() < stats.miss;
      let enemyHp = enemy.hp;
      if (playerMissed) {
        log.push(`💨 You swing at ${enemy.name} and miss!`);
      } else {
        const isCrit = Math.random() < stats.crit;
        const variance = Math.floor(Math.random() * Math.ceil(stats.atk * 0.3));
        const attackMult = blocking ? 0.7 : 1;
        const rawDmg = Math.floor((stats.atk + variance) * attackMult);
        const playerDmg = isCrit ? rawDmg * 2 : rawDmg;
        enemyHp = Math.max(0, enemy.hp - playerDmg);
        enemies[state.currentIndex] = { ...enemy, hp: enemyHp };
        log.push(`${isCrit ? "💥 CRIT! " : "⚔ "}You deal ${playerDmg}${blocking ? " (guarded)" : ""} to ${enemy.name}. (${enemyHp}/${enemy.maxHp} HP)`);
      }

      // Aura combat effect proc
      const auraItem = equipped.aura ? ITEM_CATALOGUE.find((i) => i.id === equipped.aura) : null;
      const effect = auraItem?.combatEffect;
      if (effect && enemyHp > 0 && Math.random() < effect.chance) {
        if (effect.type === "regen") {
          // Regen heals player
          setBattleState((prev) => prev ? { ...prev, playerHp: Math.min(prev.playerMaxHp, prev.playerHp + effect.value) } : prev);
          log.push(`${effect.label} +${effect.value} HP restored!`);
        } else if (effect.type === "chill") {
          // Chill reduces enemy ATK this turn (handled as extra damage reduction in description)
          log.push(`${effect.label} ${enemy.name} slowed — next hit reduced!`);
        } else {
          // All other effects deal bonus damage
          const bonusDmg = effect.value + Math.floor(Math.random() * 3);
          enemyHp = Math.max(0, enemyHp - bonusDmg);
          enemies[state.currentIndex] = { ...enemies[state.currentIndex], hp: enemyHp };
          log.push(`${effect.label} ${bonusDmg} bonus damage!`);
        }
      }

      setBattleState((prev) => prev ? { ...prev, enemies: enemies.map(e => ({...e})), log: [...log] } : prev);

      // Step 2: Enemy death check
      setTimeout(() => {
        if (enemyHp <= 0) {
          log.push(`💀 ${enemy.name} defeated! +${enemy.reward}g +${enemy.xpReward}XP`);
          setGold((g) => g + enemy.reward);
          setTotalXP((x) => x + enemy.xpReward);
          let pendingDrop = null;
          if (Math.random() < enemy.dropChance) {
            const weights = enemy.isBoss && enemy.difficulty === "epic"
              ? { common: 0, rare: 30, epic: 50, legendary: 20 }
              : enemy.isBoss ? { common: 20, rare: 60, epic: 18, legendary: 2 }
              : { common: 100, rare: 0, epic: 0, legendary: 0 };
            const drop = rollCrate({ weights }, inventory);
            const isNew = !inventory.includes(drop.id);
            const dupeRanges = { common: [3,8], uncommon: [5,12], rare: [10,20], epic: [30,55], legendary: [75,125] };
            const [dMin2, dMax2] = dupeRanges[drop.rarity] || [3,8];
            const dropDupeGold = isNew ? 0 : (dMin2 + Math.floor(Math.random() * (dMax2 - dMin2 + 1)));
            if (isNew) setInventory((inv) => [...inv, drop.id]);
            if (!isNew) setGold((g) => g + dropDupeGold);
            pendingDrop = { item: drop, isNew, dupeGold: dropDupeGold };
            log.push(`🎁 ${enemy.isBoss ? "Boss drop!" : "Lucky drop!"} ${drop.label}!`);
          }
          const nextIndex = state.currentIndex + 1;
          const allDone = nextIndex >= enemies.length;
          // Partial heal between fights — 20% of max HP on kill
          const healOnKill = !allDone ? Math.floor(state.playerMaxHp * 0.20) : 0;
          if (healOnKill > 0) log.push(`💊 Recovered ${healOnKill} HP.`);
          setBattleState((prev) => prev ? {
            ...prev, enemies: enemies.map(e=>({...e})), log: [...log],
            currentIndex: nextIndex,
            playerHp: Math.min(prev.playerMaxHp, prev.playerHp + healOnKill),
            goldEarned: prev.goldEarned + enemy.reward,
            xpEarned: prev.xpEarned + enemy.xpReward,
            pendingDrop: pendingDrop || null,
            phase: pendingDrop ? "drop" : allDone ? "victory" : "fighting",
          } : prev);
          if (allDone && !pendingDrop) setPendingBattle(null);
          setBattleAnimating(false);
          return;
        }

        // Step 3: Enemy counter-attack — miss first, then deflect, then player block
        setTimeout(() => {
          const enemyMissChance = enemy.isBoss ? 0.04 : (ENEMY_MISS[enemy.difficulty] ?? 0.12);
          const enemyMissed = Math.random() < enemyMissChance;
          const defPct = Math.min(0.50, activeStats.defense / 100);
          const enemyBlockRoll = Math.random();
          const enemyBlockChance = enemy.isBoss ? 0.12 : enemy.difficulty === "hard" ? 0.10 : enemy.difficulty === "medium" ? 0.06 : 0;
          let newPlayerHp = state.playerHp;
          const counterRoll = Math.random();
          const counterChance = activeStats.blockChance;
          if (enemyMissed) {
            log.push(`💨 ${enemy.name}'s attack misses!`);
          } else {
            const rawEnemyDmg = Math.max(1, Math.round(enemy.atk * (1 - defPct)) + Math.floor(Math.random() * 4) - 1);
            const incomingMult = blocking ? 0.6 : 1;
            if (enemyBlockRoll < enemyBlockChance) {
              const reducedDmg = Math.max(1, Math.round(rawEnemyDmg * 0.75 * incomingMult));
              newPlayerHp = state.playerHp - reducedDmg;
              log.push(`🛡 ${enemy.name} deflects — but still hits for ${reducedDmg}! (You: ${Math.max(0, newPlayerHp)}/${state.playerMaxHp} HP)`);
            } else {
              const finalDmg = Math.max(1, Math.round(rawEnemyDmg * incomingMult));
              newPlayerHp = state.playerHp - finalDmg;
              log.push(`${enemy.name} ${blocking ? "strikes your guard for" : "hits for"} ${finalDmg}! (You: ${Math.max(0, newPlayerHp)}/${state.playerMaxHp} HP)`);
            }
          }
          // Counter-attack on block (even if enemy missed, no counter needed)
          if (blocking && !enemyMissed && counterRoll < counterChance) {
            const counterDmg = Math.max(1, Math.floor(stats.atk * 0.5));
            enemies[state.currentIndex] = { ...enemies[state.currentIndex], hp: Math.max(0, enemies[state.currentIndex].hp - counterDmg) };
            log.push(`⚡ Counter! Your shield strikes back for ${counterDmg}!`);
          }
          if (newPlayerHp <= 0) {
            log.push(`💔 Defeated by ${enemy.name}! Moving to next enemy...`);
            const nextIndex = state.currentIndex + 1;
            const allDone = nextIndex >= enemies.length;
            setBattleState((prev) => {
              if (!prev) return prev;
              const healedHp = Math.min(prev.playerMaxHp, prev.playerMaxHp * 0.3 + (allDone ? 0 : 0));
              const newLog = [...log, allDone ? "⚔ Battle over." : `💊 Recovered ${Math.floor(prev.playerMaxHp * 0.3)} HP before next fight.`];
              return {
                ...prev,
                enemies: enemies.map(e=>({...e})),
                log: newLog,
                currentIndex: nextIndex,
                // On defeat: restore 30% HP (not full) so it's still a consequence
                playerHp: Math.min(prev.playerMaxHp, Math.floor(prev.playerMaxHp * 0.30)),
                // Only victory if we actually won — defeat means phase = defeat if it was the last
                phase: allDone ? "defeat" : "fighting",
              };
            });
            if (allDone) setPendingBattle(null);
          } else {
            setBattleState((prev) => prev ? { ...prev, enemies: enemies.map(e=>({...e})), log: [...log], playerHp: newPlayerHp } : prev);
          }
          setBattleAnimating(false);
          setIsBlocking(false);
        }, 650);
      }, 650);
    }, 150);
  }

  function doBlock() {
    if (!battleState || battleState.phase !== "fighting" || battleAnimating || blockCooldown > 0) return;
    doPlayerTurn(true);
  }

  function claimDrop() {
    if (!battleState?.pendingDrop) return;
    const nextIndex = battleState.currentIndex;
    const allDone = nextIndex >= battleState.enemies.length;
    setBattleState({ ...battleState, pendingDrop: null, phase: allDone ? "victory" : "fighting" });
    if (allDone) setPendingBattle(null);
  }

  function abandonBattle() {
    setPendingBattle(null);
    setBattleState(null);
  }

  function simulateBattle() {
    const fakeQuests = [
      { id: "sim1", title: "Goblin Scout", difficulty: "easy", completed: true },
      { id: "sim2", title: "Skeleton Warrior", difficulty: "medium", completed: true },
      { id: "sim3", title: "Dark Knight", difficulty: "hard", completed: true },
      { id: "sim4", title: "Ancient Dragon", difficulty: "epic", completed: true },
    ];
    const enemies = buildEnemies(fakeQuests, "sim4");
    setPendingBattle(enemies);
    setBattleState(null);
  }

  function equipItem(itemId) {
    const item = ITEM_CATALOGUE.find((i) => i.id === itemId);
    if (!item || !inventory.includes(itemId)) return;
    setEquipped((e) => ({ ...e, [item.slot]: itemId }));
  }

  function getItemSets(itemId) {
    // Returns array of { set, ownedCount } for every set this item belongs to
    return SETS.filter((s) => s.items.includes(itemId)).map((s) => ({
      set: s,
      ownedCount: s.items.filter((id) => inventory.includes(id)).length,
    }));
  }

  function openCrate(tier) {
    if (gold < tier.cost) return;
    const item = rollCrate(tier, inventory);
    const isNew = !inventory.includes(item.id);
    const dupeRanges = { common: [3,8], uncommon: [5,12], rare: [10,20], epic: [30,55], legendary: [75,125] };
    const [dMin, dMax] = dupeRanges[item.rarity] || [3,8];
    const dupeGold = isNew ? 0 : (dMin + Math.floor(Math.random() * (dMax - dMin + 1)));
    setGold((g) => g - tier.cost + dupeGold);
    if (isNew) setInventory((inv) => [...inv, item.id]);
    setLastDrop({ item, isNew, dupeGold });
  }

  // ---- Quest card (compact for calendar cells) ----
  function QuestDot({ q }) {
    const diff = themedDifficulties.find((d) => d.key === q.difficulty);
    const isOverdue = !q.completed && q.date < today;
    const startXRef = useRef(null);
    const [swipeOffset, setSwipeOffset] = useState(0);
    const [swipeAction, setSwipeAction] = useState(null);
    const isDotTouchRef = useRef(false);

    function onTouchStart(e) {
      if (isDotTouchRef.current) return;
      startXRef.current = e.touches[0].clientX;
      setSwipeOffset(0);
      setSwipeAction(null);
      // Long-press: 600ms hold triggers delete
      longPressTimer.current = setTimeout(() => {
        startXRef.current = null; // cancel swipe
        deleteQuest(q.id);
      }, 600);
    }
    function onTouchMove(e) {
      if (isDotTouchRef.current || startXRef.current === null) return;
      const dx = e.touches[0].clientX - startXRef.current;
      if (Math.abs(dx) > 4 && longPressTimer.current) {
        clearTimeout(longPressTimer.current); // moved — not a long press
        longPressTimer.current = null;
      }
      if (Math.abs(dx) < 4) return;
      const clamped = Math.max(-80, Math.min(80, dx));
      setSwipeOffset(clamped);
      setSwipeAction(clamped > 36 ? "complete" : clamped < -36 ? "delete" : null);
    }
    function onTouchEnd() {
      if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; }
      if (isDotTouchRef.current) { isDotTouchRef.current = false; return; }
      if (startXRef.current === null) return; // was a long press, already handled
      if (swipeAction === "complete" && !q.completed) completeQuest(q.id);
      else if (swipeAction === "delete") deleteQuest(q.id);
      setSwipeOffset(0);
      setSwipeAction(null);
      startXRef.current = null;
    }

    return (
      <div style={{ position: "relative", marginBottom: 2, borderRadius: 4, overflow: "hidden", height: 22 }}>
        {/* Revealed background — green on right, red on left */}
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center",
          justifyContent: swipeOffset > 0 ? "flex-start" : "flex-end",
          paddingLeft: swipeOffset > 0 ? 8 : 0, paddingRight: swipeOffset < 0 ? 8 : 0,
          background: swipeAction === "complete" ? "#4C9A6A" : swipeAction === "delete" ? "#8A2E44" : "#1F2836",
          borderRadius: 4, transition: "background 0.1s ease",
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#EDE4D3" }}>
            {swipeAction === "complete" ? "✓" : swipeAction === "delete" ? "✕" : ""}
          </span>
        </div>

        {/* Card slides over the background */}
        <div
          draggable
          onDragStart={(e) => { e.dataTransfer.setData("text/plain", String(q.id)); dragIdRef.current = q.id; setTimeout(() => setIsDragging(true), 0); }}
          onDragEnd={() => { dragIdRef.current = null; setIsDragging(false); setDragOverDate(null); setDragOverTrash(false); }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", gap: 6, padding: "5px 6px", borderRadius: 4,
            background: q.completed ? themePersonality.deepBase : isOverdue ? "rgba(138,46,68,0.15)" : themePersonality.cardBase,
            borderLeft: `2px solid ${isOverdue && !q.completed ? "#8A2E44" : diff.color}`,
            opacity: q.completed ? 0.5 : 1, cursor: "grab", userSelect: "none",
            transform: `translateX(${swipeOffset}px)`,
            transition: swipeOffset === 0 ? "transform 0.2s ease" : "none",
          }}>
          {/* Quick-complete dot */}
          <div
            onTouchStart={(e) => { isDotTouchRef.current = true; e.stopPropagation(); }}
            onTouchEnd={(e) => { e.stopPropagation(); q.completed ? uncompleteQuest(q.id) : completeQuest(q.id); }}
            onClick={(e) => { e.stopPropagation(); q.completed ? uncompleteQuest(q.id) : completeQuest(q.id); }}
            style={{ width: 8, height: 8, borderRadius: "50%", background: q.completed ? "#4C9A6A" : diff.color, flexShrink: 0, cursor: "pointer", padding: 6, margin: "-6px -2px -6px -5px" }}
            title={q.completed ? "Undo" : "Complete"}
          />
          <span
            onClick={() => setQuestDetailFor(q.id)}
            style={{ fontSize: 11, lineHeight: 1.2, color: isOverdue && !q.completed ? "#C1652B" : q.completed ? "#5C6773" : "#EDE4D3", textDecoration: q.completed ? "line-through" : "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, cursor: "pointer" }}>
            {isOverdue && !q.completed ? "⚠ " : ""}{q.title}
          </span>
        </div>
      </div>
    );
  }

  // ---- Day column (used in day + week view) ----
  function DayColumn({ date, narrow = false }) {
    const isToday = date === today;
    const isSelected = date === selectedDate;
    const dayQuests = questsForDate(date);
    const dayShifts = shifts.filter((s) => s.date === date);
    const d = parseLocalDate(date);
    const dayName = d.toLocaleDateString(undefined, { weekday: narrow ? "narrow" : "short" });
    const dayNum = d.getDate();
    const isCurrentMonth = d.getMonth() === parseLocalDate(calAnchor).getMonth();

    return (
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", borderRight: "1px solid #2C3947" }}>
        <div style={{ padding: "6px 4px", textAlign: "center", borderBottom: "1px solid #2C3947", background: isSelected ? accent + "22" : "transparent" }}>
          <div onClick={() => { setSelectedDate(date); if (calView === "month") setCalView("day"); }} style={{ cursor: "pointer" }}>
            <div style={{ fontSize: 10, color: isToday ? accent : "#8A8578", fontWeight: 600, textTransform: "uppercase" }}>{dayName}</div>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: isToday ? accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", margin: "2px auto 0" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: isToday ? "#1B2430" : isCurrentMonth ? "#EDE4D3" : "#4A5563" }}>{dayNum}</span>
            </div>
          </div>

        </div>
        <div style={{ flex: 1, padding: "4px 3px", overflowY: "auto", maxHeight: 300 }}
          onClick={() => { setAddDate(date); setAddModalOpen(true); }}>
          {dayShifts.map((s) => (
            <div key={s.id}
              style={{ background: accent + "22", border: `1px solid ${accent}55`, borderLeft: `3px solid ${accent}`, borderRadius: 4, padding: "4px 5px", marginBottom: 3 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: 0.3 }}>Shift</div>
              <div style={{ fontSize: 9, color: accent + "cc", fontFamily: "ui-monospace, Menlo, monospace" }}>
                {formatShiftTime(s.startTime)}–{formatShiftTime(s.endTime)}
              </div>
            </div>
          ))}
          {dayQuests.map((q) => <QuestDot key={q.id} q={q} />)}
          {dayQuests.length === 0 && dayShifts.length === 0 && <div style={{ height: "100%", minHeight: 40 }} />}
        </div>
      </div>
    );
  }

  // ---- Quest detail modal ----
  function QuestDetailModal({ questId }) {
    const q = quests.find((x) => x.id === questId);
    if (!q) return null;
    const diff = themedDifficulties.find((d) => d.key === q.difficulty);
    const isBossCard = q.id === weeklyBossId;
    const isDesktop = window.innerWidth >= 640;

    const [editing, setEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(q.title);
    const [editDiff, setEditDiff] = useState(q.difficulty);
    const [editMins, setEditMins] = useState(q.estMinutes ? String(q.estMinutes) : "");
    const [editDate, setEditDate] = useState(q.date);

    function saveEdit() {
      const trimmed = editTitle.trim();
      if (!trimmed) return;
      setQuests((qs) => qs.map((x) => x.id === questId ? {
        ...x,
        title: trimmed,
        difficulty: editDiff,
        xp: xpFor(editDiff),
        estMinutes: editMins ? parseInt(editMins, 10) || null : null,
        date: editDate,
      } : x));
      setEditing(false);
    }

    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(10,14,20,0.75)", zIndex: 70, display: "flex", alignItems: isDesktop ? "center" : "flex-end", justifyContent: "center", padding: isDesktop ? 20 : 0 }} onClick={() => { if (!editing) setQuestDetailFor(null); }}>
        <div style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: isDesktop ? 16 : "16px 16px 0 0", padding: 20, width: "100%", maxWidth: isDesktop ? 440 : 500, position: "relative" }} onClick={(e) => e.stopPropagation()}>
          {!isDesktop && <div style={{ width: 36, height: 4, background: "#33414F", borderRadius: 2, margin: "0 auto 16px" }} />}

          {editing ? (
            /* ---- Edit mode ---- */
            <div>
              <p style={{ fontSize: 11, color: "#5C6773", margin: "0 0 5px" }}>Task name:</p>
              <input
                autoFocus
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                style={{ width: "100%", marginBottom: 12, background: "#141C27", border: `1px solid ${accent}`, borderRadius: 8, padding: "9px 11px", color: "#EDE4D3", fontSize: 14 }}
              />
              <p style={{ fontSize: 11, color: "#5C6773", margin: "0 0 6px" }}>Difficulty:</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                {themedDifficulties.map((d) => (
                  <button key={d.key} onClick={() => setEditDiff(d.key)} className="qlog-btn"
                    style={{ fontSize: 11, fontWeight: 700, padding: "5px 10px", borderRadius: 8, border: `1.5px solid ${editDiff === d.key ? d.color : "#33414F"}`, background: editDiff === d.key ? d.color + "22" : "transparent", color: editDiff === d.key ? d.color : "#8A8578", cursor: "pointer" }}>
                    {d.label}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: 11, color: "#5C6773", margin: "0 0 5px" }}>Date:</p>
              <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)}
                style={{ width: "100%", marginBottom: 12, background: "#141C27", border: "1px solid #33414F", borderRadius: 8, padding: "8px 11px", color: "#EDE4D3", fontSize: 13 }} />
              <p style={{ fontSize: 11, color: "#5C6773", margin: "0 0 5px" }}>Focus timer (minutes):</p>
              <input
                type="number" min={1} max={240} value={editMins}
                onChange={(e) => setEditMins(e.target.value)}
                placeholder="Leave blank to keep current"
                style={{ width: "100%", marginBottom: 16, background: "#141C27", border: "1px solid #33414F", borderRadius: 8, padding: "8px 11px", color: "#EDE4D3", fontSize: 13 }}
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={saveEdit} className="qlog-btn"
                  style={{ flex: 1, background: accent, border: "none", borderRadius: 8, padding: "10px 0", fontWeight: 700, fontSize: 13, color: "#1B2430", cursor: "pointer" }}>
                  Save
                </button>
                <button onClick={() => setEditing(false)} className="qlog-btn"
                  style={{ background: "#141C27", border: "1px solid #33414F", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#8A8578", cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* ---- View mode ---- */
            <>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
                {!q.completed ? (
                  <button onClick={() => completeQuest(q.id)} className="qlog-btn" style={{ width: 22, height: 22, minWidth: 22, borderRadius: "50%", border: `2px solid ${diff.color}`, background: "transparent", cursor: "pointer", marginTop: 2 }} />
                ) : (
                  <button onClick={() => { uncompleteQuest(q.id); setQuestDetailFor(null); }} className="qlog-btn" style={{ width: 22, height: 22, minWidth: 22, borderRadius: "50%", background: "#4C9A6A", border: "none", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2, cursor: "pointer" }}>
                    <Check size={13} color="#141C27" />
                  </button>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, textDecoration: q.completed ? "line-through" : "none", marginBottom: 4 }}>{q.title}</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: diff.color, fontWeight: 700, fontFamily: "ui-monospace, Menlo, monospace" }}>{diff.label.toUpperCase()} · {q.xp} XP</span>
                    {q.estMinutes && <span style={{ fontSize: 11, color: "#5C6773", fontFamily: "ui-monospace, Menlo, monospace" }}>~{q.estMinutes}m</span>}
                    {q.recurring && <Repeat size={11} color="#5C6773" />}
                    {isBossCard && <span style={{ fontSize: 11, color: "#8A5FBF", fontWeight: 700 }}>👑 Boss</span>}
                  </div>
                  {q.reason && <div style={{ fontSize: 11, color: "#5C6773", marginTop: 4, fontStyle: "italic" }}>{q.reason}</div>}
                  <div style={{ fontSize: 11, color: "#5C6773", marginTop: 4 }}>
                    {parseLocalDate(q.date).toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}
                  </div>
                </div>
                {isDesktop && <button onClick={() => setQuestDetailFor(null)} style={{ background: "none", border: "none", color: "#8A8578", cursor: "pointer", padding: 0 }}><X size={18} /></button>}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {!q.completed && (
                  <>
                    <button onClick={() => { openFocus(q); setQuestDetailFor(null); }} className="qlog-btn" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, padding: "8px 12px", borderRadius: 8, border: `1px solid ${accent}`, background: "transparent", color: accent, cursor: "pointer" }}><Timer size={13} /> Focus</button>
                    {(q.difficulty === "hard" || q.difficulty === "epic") && !isBossCard && (
                      <button onClick={() => { setWeeklyBossId(q.id); setQuestDetailFor(null); }} className="qlog-btn" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, padding: "8px 12px", borderRadius: 8, border: "1px solid #8A5FBF", background: "transparent", color: "#8A5FBF", cursor: "pointer" }}><Crown size={13} /> Make Boss</button>
                    )}
                    {q.difficulty === "epic" && (
                      splittingId === q.id
                        ? <button disabled style={{ fontSize: 12, padding: "8px 12px", borderRadius: 8, border: "1px solid #33414F", background: "transparent", color: "#5C6773" }}><Loader2 size={13} className="spin" /></button>
                        : <button onClick={() => { splitEpicQuest(q); setQuestDetailFor(null); }} className="qlog-btn" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, padding: "8px 12px", borderRadius: 8, border: "1px solid #33414F", background: "transparent", color: "#8A8578", cursor: "pointer" }}><Scissors size={13} /> Split</button>
                    )}
                    <button onClick={() => setEditing(true)} className="qlog-btn" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, padding: "8px 12px", borderRadius: 8, border: "1px solid #33414F", background: "transparent", color: "#8A8578", cursor: "pointer" }}><Edit2 size={13} /> Edit</button>
                  </>
                )}
                <button onClick={() => deleteQuest(q.id)} className="qlog-btn" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, padding: "8px 12px", borderRadius: 8, border: "1px solid #8A2E44", background: "transparent", color: "#8A2E44", cursor: "pointer" }}><Trash2 size={13} /> Delete</button>
              </div>
              {q.completed && <p style={{ fontSize: 11, color: "#5C6773", margin: "10px 0 0" }}>Tap ✓ to undo this completion.</p>}
            </>
          )}
        </div>
      </div>
    );
  }

  // ---- Notification permission + push subscription ----
  async function requestNotifPermission() {
    if (!("Notification" in window)) return;
    const perm = await Notification.requestPermission();
    setNotifPermission(perm);
    if (perm === "granted" && swReg) {
      try {
        const existing = await swReg.pushManager.getSubscription();
        const sub = existing || await swReg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlB64ToUint8Array(VAPID_PUBLIC_KEY),
        });
        // Save subscription directly to Firestore using the existing client SDK
        const { db } = await import("./firebase.js");
        const { doc, setDoc } = await import("firebase/firestore");
        await setDoc(doc(db, "storage", "main"), { pushSubscription: sub.toJSON() }, { merge: true });
        console.log("Push subscription saved to Firestore");
      } catch (e) {
        console.warn("Push subscription failed:", e);
      }
    }
  }

  function urlB64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
  }


  // ---- Shifts ----
  function addShifts(newShifts) {
    // newShifts = [{ date, startTime, endTime }]
    setShifts((s) => {
      // Remove any existing shifts for these dates, then add new ones
      const dates = new Set(newShifts.map((x) => x.date));
      const kept = s.filter((x) => !dates.has(x.date));
      const added = newShifts.filter((x) => x.startTime && x.endTime).map((x) => ({ id: Date.now() + Math.random(), date: x.date, startTime: x.startTime, endTime: x.endTime }));
      return [...kept, ...added];
    });
    setWeekShiftModalOpen(false);
  }
  function deleteShift(id) {
    setShifts((s) => s.filter((x) => x.id !== id));
  }
  function formatShiftTime(t) {
    // t = "HH:MM", return "9:00am" style
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "pm" : "am";
    const hour = h % 12 || 12;
    return `${hour}${m > 0 ? `:${String(m).padStart(2,"0")}` : ""}${ampm}`;
  }


  // ---- Render ----
  return (
    <div className="safe-top safe-bottom" style={{ minHeight: "100vh", background: themePersonality.bgBase, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: "#EDE4D3", paddingBottom: 60 }}>
      <style>{`
        * { box-sizing: border-box; }
        .qlog-btn { transition: transform 0.12s ease; }
        .qlog-btn:active { transform: scale(0.96); }
        @keyframes floatUp { 0% { opacity:0; transform: translateY(6px) scale(0.9);} 20% { opacity:1; transform: translateY(-4px) scale(1.05);} 100% { opacity:0; transform: translateY(-32px) scale(1);} }
        @keyframes bannerIn { 0% { opacity:0; transform: translate(-50%,-20px) scale(0.9);} 15% { opacity:1; transform: translate(-50%,0) scale(1);} 85% { opacity:1; transform: translate(-50%,0) scale(1);} 100% { opacity:0; transform: translate(-50%,-10px) scale(0.95);} }
        .xp-pop { animation: floatUp 0.9s ease forwards; }
        .level-banner { animation: bannerIn 2.4s ease forwards; }
        @keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        .pulse { animation: pulse 1s ease-in-out infinite; }
        @keyframes todayPulse { 0%,100% { box-shadow: 0 0 0 0 ${accent}44; } 50% { box-shadow: 0 0 0 6px ${accent}00; } }
        .today-glow { animation: todayPulse 2s ease-in-out infinite; }
        @keyframes auraFloat {
          0%   { opacity: 0; transform: translateY(0) scale(0.8); }
          15%  { opacity: 0.9; }
          80%  { opacity: 0.4; }
          100% { opacity: 0; transform: translateY(-28px) scale(1.1); }
        }
        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .confetti-piece { position: fixed; width: 8px; height: 8px; border-radius: 2px; animation: confettiFall linear forwards; pointer-events: none; z-index: 999; }
        input:focus, select:focus, textarea:focus { outline: 2px solid ${accent}; outline-offset: 2px; }
        button:focus-visible { outline: 2px solid ${accent}; outline-offset: 2px; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); }
        .cal-col::-webkit-scrollbar { width: 4px; }
        .cal-col::-webkit-scrollbar-thumb { background: #33414F; border-radius: 2px; }
      `}</style>

      {/* XP pop with gear bonus breakdown */}
      {xpPop && (
        <div className="xp-pop" style={{ position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)", zIndex: 65, background: "#232E3D", border: `1px solid ${accent}`, borderRadius: 10, padding: "8px 16px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.5)", whiteSpace: "nowrap" }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: accent, fontFamily: "ui-monospace, Menlo, monospace" }}>+{xpPop.xp} XP</span>
          {xpPop.gearXP > 0 && (
            <span style={{ fontSize: 11, color: RARITIES.epic.color, fontFamily: "ui-monospace, Menlo, monospace" }}>⚔ +{xpPop.gearXP} ({Math.round(xpPop.gearPct * 100)}%)</span>
          )}
          {xpPop.activeSets?.length > 0 && (
            <span style={{ fontSize: 11, color: RARITIES.legendary.color, fontFamily: "ui-monospace, Menlo, monospace" }}>✦ Set</span>
          )}
        </div>
      )}

      {/* Banners */}
      {/* Level-up stat choice modal */}
      {statChoiceQueue.length > 0 && (() => {
        const pending = statChoiceQueue[0];
        const choices = [
          { key: "bonusHp",   label: "❤ Health",      sub: "+15 max HP",          value: 15,    apply: (s) => ({ ...s, bonusHp: (s.bonusHp||0) + 15 }) },
          { key: "bonusDef",  label: "🛡 Defense",     sub: "+2 DEF",              value: 2,     apply: (s) => ({ ...s, bonusDef: (s.bonusDef||0) + 2 }) },
          { key: "bonusAtk",  label: "⚔ Damage",      sub: "+1 base ATK",         value: 1,     apply: (s) => ({ ...s, bonusAtk: (s.bonusAtk||0) + 1 }) },
          { key: "bonusCrit", label: "💥 Critical",    sub: "+1.5% crit chance",   value: 0.015, apply: (s) => ({ ...s, bonusCrit: (s.bonusCrit||0) + 0.015 }) },
        ];
        function pick(choice) {
          const entry = { level: pending.level, key: choice.key, value: choice.value };
          setStatHistory((h) => {
            const newHistory = [...h, entry];
            // Recompute playerStats from full history
            const newStats = newHistory.reduce((acc, e) => ({
              ...acc,
              [e.key]: (acc[e.key] || 0) + e.value,
            }), { bonusHp: 0, bonusDef: 0, bonusAtk: 0, bonusCrit: 0 });
            setPlayerStats(newStats);
            return newHistory;
          });
          setStatChoiceQueue((q) => q.slice(1));
        }
        return (
          <div style={{ position: "fixed", inset: 0, background: "rgba(10,14,20,0.88)", zIndex: 90, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ background: "#1B2430", border: `1px solid ${accent}`, borderRadius: 18, padding: 24, width: "100%", maxWidth: 360, textAlign: "center" }}>
              <Trophy size={28} color={accent} style={{ marginBottom: 10 }} />
              <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, fontFamily: "Georgia, serif", color: accent }}>Level {pending.level}!</h2>
              <p style={{ fontSize: 13, color: "#8A8578", margin: "0 0 6px" }}>{pending.rank}</p>
              {statChoiceQueue.length > 1 && <p style={{ fontSize: 11, color: "#5C6773", margin: "0 0 14px" }}>{statChoiceQueue.length - 1} more choice{statChoiceQueue.length > 2 ? "s" : ""} pending</p>}
              <p style={{ fontSize: 13, color: "#EDE4D3", margin: "0 0 18px", fontWeight: 600 }}>Choose a permanent stat upgrade:</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {choices.map((c) => (
                  <button key={c.key} onClick={() => pick(c)} className="qlog-btn"
                    style={{ background: "#232E3D", border: `1.5px solid ${accent}33`, borderRadius: 12, padding: "13px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", transition: "border-color 0.15s" }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = accent}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = `${accent}33`}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#EDE4D3" }}>{c.label}</span>
                    <span style={{ fontSize: 12, color: accent, fontFamily: "ui-monospace, Menlo, monospace" }}>{c.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      })()}
      {streakBanner && <div className="level-banner" style={{ position: "fixed", top: (levelUp ? 84 : 24), left: "50%", zIndex: 60, background: "linear-gradient(135deg, #C1652B, #1B2430)", padding: "14px 28px", borderRadius: 10, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 30px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.25)" }}><Flame size={20} color="#EDE4D3" /><span style={{ fontWeight: 700, color: "#EDE4D3", fontSize: 14 }}>{streakBanner.days}-day streak! +{streakBanner.bonus} XP</span></div>}
      {bossBanner && <div className="level-banner" style={{ position: "fixed", top: (levelUp ? 84 : 24) + (streakBanner ? 60 : 0), left: "50%", zIndex: 60, background: "linear-gradient(135deg, #8A5FBF, #1B2430)", padding: "14px 28px", borderRadius: 10, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 30px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.25)" }}><Crown size={20} color="#EDE4D3" /><span style={{ fontWeight: 700, color: "#EDE4D3", fontSize: 14 }}>Boss defeated! Bonus XP earned.</span></div>}
      {perfectDayBanner && <div className="level-banner" style={{ position: "fixed", top: (levelUp ? 84 : 24) + (streakBanner ? 60 : 0) + (bossBanner ? 60 : 0), left: "50%", zIndex: 60, background: "linear-gradient(135deg, #C9A227, #4C9A6A)", padding: "14px 28px", borderRadius: 10, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 30px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.25)" }}><Sparkles size={20} color="#1B2430" /><span style={{ fontWeight: 700, color: "#1B2430", fontSize: 14 }}>Perfect day! All habits done — +{PERFECT_DAY_XP} XP</span></div>}
      {habitBanner && <div className="level-banner" style={{ position: "fixed", top: (levelUp ? 84 : 24) + (streakBanner ? 60 : 0) + (bossBanner ? 60 : 0) + (perfectDayBanner ? 60 : 0), left: "50%", zIndex: 60, background: `linear-gradient(135deg, ${habitTier(habitBanner.days).color}, #1B2430)`, padding: "14px 28px", borderRadius: 10, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 30px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.25)" }}><Flame size={20} color="#EDE4D3" fill="#EDE4D3" /><span style={{ fontWeight: 700, color: "#EDE4D3", fontSize: 14 }}>{habitBanner.name}: {habitBanner.days}-day streak! +{habitBanner.bonus} XP</span></div>}

      {/* Confetti burst on level up */}
      {confettiPieces.map((p) => (
        <div key={p.id} className="confetti-piece" style={{ left: p.left, top: 0, background: p.color, width: p.size, height: p.size, animationDuration: p.duration, animationDelay: p.delay }} />
      ))}

      {/* ---- BATTLE PENDING BANNER ---- */}
      {pendingBattle && !battleState && (
        <div style={{ position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)", zIndex: 65, background: "linear-gradient(135deg, #8A2E44, #232E3D)", border: "1px solid #8A2E44", borderRadius: 12, padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 6px 24px rgba(0,0,0,0.5)", cursor: "pointer", whiteSpace: "nowrap" }} onClick={startBattle}>
          <span style={{ fontSize: 20 }}>⚔</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#EDE4D3" }}>Weekly Battle Ready!</div>
            <div style={{ fontSize: 10, color: "#8A8578" }}>{pendingBattle.length} enemies await — tap to fight</div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); abandonBattle(); }} style={{ background: "none", border: "none", color: "#5C6773", cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>
      )}

      {/* ---- BATTLE MODAL ---- */}
      {battleState && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10,14,20,0.95)", zIndex: 75, display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }}>
          <div style={{ background: "#1B2430", border: "1px solid #33414F", borderRadius: 16, width: "100%", maxWidth: 440, maxHeight: "94vh", display: "flex", flexDirection: "column" }}>

            {/* Header — enemy counter */}
            <div style={{ background: "#141C27", borderRadius: "16px 16px 0 0", padding: "10px 16px", borderBottom: "1px solid #33414F", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#EDE4D3", fontFamily: "Georgia, serif" }}>
                {battleState.phase === "victory" ? "⚔ Victory!" : battleState.phase === "defeat" ? "💔 Defeated" : battleState.phase === "drop" ? "🎁 Item Drop!" : "⚔ Weekly Battle"}
              </span>
              <span style={{ fontSize: 11, color: "#8A8578" }}>{Math.min(battleState.currentIndex, battleState.enemies.length)}/{battleState.enemies.length} defeated</span>
            </div>

            {/* Enemy visual arena */}
            {battleState.phase === "fighting" && (() => {
              const enemy = battleState.enemies[battleState.currentIndex];
              if (!enemy) return null;
              const diff = themedDifficulties.find((d) => d.key === enemy.difficulty);
              const enemyColor = enemy.isBoss ? "#C9A227" : diff?.color || "#8A8578";
              return (
                <div style={{ background: "linear-gradient(180deg, #0D1117 0%, #1B2430 100%)", padding: "16px 16px 10px", flexShrink: 0 }}>
                  {/* Enemy info + visual row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    {/* Enemy SVG */}
                    <div style={{ flexShrink: 0 }}>
                      {getEnemyVisual(enemy, 72)}
                    </div>
                    {/* Enemy stats */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: enemyColor, marginBottom: 2 }}>
                        {enemy.isBoss ? "👑 " : ""}{enemy.name}
                      </div>
                      <div style={{ fontSize: 10, color: "#8A8578", marginBottom: 4 }}>
                        {themedDifficulties.find((d) => d.key === enemy.difficulty)?.label} · ATK {enemy.atk}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#5C6773", marginBottom: 3 }}>
                        <span>HP</span><span>{enemy.hp}/{enemy.maxHp}</span>
                      </div>
                      <div style={{ height: 7, background: "#232E3D", borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${(enemy.hp / enemy.maxHp) * 100}%`, background: enemyColor, borderRadius: 4, transition: "width 0.35s ease" }} />
                      </div>
                    </div>
                  </div>
                  {/* Player HP */}
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#5C6773", marginBottom: 3 }}>
                    <span>Your HP</span>
                    <span>{battleState.playerHp}/{battleState.playerMaxHp} · ATK {getPlayerCombatStats().atk} · DEF {activeStats.defense} · {Math.round(getPlayerCombatStats().miss * 100)}% miss{activeStats.critChance > 0 ? ` · ${Math.round(activeStats.critChance * 100)}% crit` : ""}</span>
                  </div>
                  <div style={{ height: 6, background: "#232E3D", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(battleState.playerHp / battleState.playerMaxHp) * 100}%`, background: battleState.playerHp / battleState.playerMaxHp > 0.5 ? "#4C9A6A" : battleState.playerHp / battleState.playerMaxHp > 0.25 ? "#C9A227" : "#8A2E44", borderRadius: 4, transition: "width 0.35s ease" }} />
                  </div>
                  {/* Enemy queue preview */}
                  {battleState.enemies.length > 1 && (
                    <div style={{ display: "flex", gap: 4, marginTop: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 9, color: "#5C6773", marginRight: 2 }}>Queue:</span>
                      {battleState.enemies.map((e, i) => {
                        const d = themedDifficulties.find((d) => d.key === e.difficulty);
                        return (
                          <div key={e.id} style={{ width: 18, height: 18, borderRadius: "50%", background: i < battleState.currentIndex ? "#2C3947" : i === battleState.currentIndex ? (e.isBoss ? "#C9A227" : d?.color || "#8A8578") : "#232E3D", border: `1.5px solid ${i === battleState.currentIndex ? (e.isBoss ? "#C9A227" : d?.color || "#8A8578") : "#33414F"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {e.isBoss && i >= battleState.currentIndex && <span style={{ fontSize: 8 }}>👑</span>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Battle log — scrollable, each line clearly separated */}
            <div style={{ overflowY: "auto", padding: "10px 16px", flex: 1 }}>
              {battleState.log.slice(-10).map((line, i, arr) => {
                const isLatest = i === arr.length - 1;
                const color = line.includes("CRIT") || line.includes("💥") ? "#C9A227"
                  : line.includes("💀") ? "#4C9A6A"
                  : line.includes("💔") ? "#8A2E44"
                  : line.includes("🎁") ? RARITIES.rare.color
                  : line.includes("🛡") ? "#4FA3C9"
                  : line.includes("⚔") ? accent
                  : "#EDE4D3";
                return (
                  <div key={i} style={{ fontSize: 12, color, padding: "5px 0", borderBottom: i < arr.length - 1 ? "1px solid #1F2836" : "none", opacity: isLatest ? 1 : 0.65 + (i / arr.length) * 0.35 }}>
                    {line}
                  </div>
                );
              })}
              {battleAnimating && <div style={{ fontSize: 11, color: "#5C6773", marginTop: 4 }}>...</div>}

              {/* Drop reveal */}
              {battleState.phase === "drop" && battleState.pendingDrop && (
                <div style={{ background: RARITIES[battleState.pendingDrop.item.rarity].glow, border: `1px solid ${RARITIES[battleState.pendingDrop.item.rarity].color}`, borderRadius: 12, padding: "14px", marginTop: 8, textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 36, marginBottom: 6 }}>{battleState.pendingDrop.item.icon(RARITIES[battleState.pendingDrop.item.rarity].color)}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: RARITIES[battleState.pendingDrop.item.rarity].color }}>{battleState.pendingDrop.item.label}</div>
                  <div style={{ fontSize: 10, color: "#8A8578", margin: "3px 0" }}>{battleState.pendingDrop.item.desc}</div>
                  <div style={{ fontSize: 10, color: RARITIES[battleState.pendingDrop.item.rarity].color, fontWeight: 700 }}>{RARITIES[battleState.pendingDrop.item.rarity].label} · {battleState.pendingDrop.isNew ? "✨ New item!" : "Duplicate"}</div>
                  {!battleState.pendingDrop.isNew && battleState.pendingDrop.dupeGold > 0 && (
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#C9A227", fontFamily: "ui-monospace, Menlo, monospace", margin: "4px 0" }}>+{battleState.pendingDrop.dupeGold}g</div>
                  )}
                  <button onClick={claimDrop} className="qlog-btn" style={{ marginTop: 10, background: accent, border: "none", borderRadius: 8, padding: "7px 20px", fontSize: 12, fontWeight: 700, color: "#1B2430", cursor: "pointer" }}>Claim & Continue</button>
                </div>
              )}

              {/* Victory screen */}
              {battleState.phase === "victory" && (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <Trophy size={40} color={accent} style={{ marginBottom: 10 }} />
                  <div style={{ fontSize: 17, fontWeight: 700, color: accent, fontFamily: "Georgia, serif", marginBottom: 6 }}>All enemies defeated!</div>
                  <div style={{ fontSize: 13, color: "#8A8578", marginBottom: 16 }}>
                    <span style={{ color: "#C9A227", fontWeight: 700 }}>+{battleState.goldEarned}g</span> · <span style={{ color: accent, fontWeight: 700 }}>+{battleState.xpEarned} XP</span>
                  </div>
                  <button onClick={() => { setBattleState(null); setPendingBattle(null); }} className="qlog-btn" style={{ background: accent, border: "none", borderRadius: 10, padding: "12px 36px", fontSize: 14, fontWeight: 700, color: "#1B2430", cursor: "pointer" }}>Claim Rewards</button>
                </div>
              )}

              {/* Defeat screen */}
              {battleState.phase === "defeat" && (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>💔</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "#8A2E44", fontFamily: "Georgia, serif", marginBottom: 6 }}>Defeated!</div>
                  <div style={{ fontSize: 13, color: "#8A8578", marginBottom: 4 }}>You fell before clearing all enemies.</div>
                  {battleState.goldEarned > 0 || battleState.xpEarned > 0 ? (
                    <div style={{ fontSize: 13, color: "#8A8578", marginBottom: 16 }}>
                      Still earned: <span style={{ color: "#C9A227", fontWeight: 700 }}>+{battleState.goldEarned}g</span> · <span style={{ color: accent, fontWeight: 700 }}>+{battleState.xpEarned} XP</span>
                    </div>
                  ) : <div style={{ marginBottom: 16 }} />}
                  <button onClick={() => { setBattleState(null); setPendingBattle(null); }} className="qlog-btn" style={{ background: "#8A2E44", border: "none", borderRadius: 10, padding: "12px 36px", fontSize: 14, fontWeight: 700, color: "#EDE4D3", cursor: "pointer" }}>End Battle</button>
                </div>
              )}
            </div>

            {/* Action buttons */}
            {battleState.phase === "fighting" && (
              <div style={{ padding: "10px 16px 14px", borderTop: "1px solid #33414F", flexShrink: 0, display: "flex", gap: 8 }}>
                <button onClick={() => doPlayerTurn(false)} disabled={battleAnimating} className="qlog-btn"
                  style={{ flex: 2, background: battleAnimating ? "#2C3947" : "#8A2E44", border: "none", borderRadius: 10, padding: "13px 0", fontSize: 14, fontWeight: 700, color: battleAnimating ? "#5C6773" : "#EDE4D3", cursor: battleAnimating ? "default" : "pointer" }}>
                  ⚔ Attack
                </button>
                <button onClick={doBlock} disabled={battleAnimating || blockCooldown > 0} className="qlog-btn"
                  style={{ flex: 1, background: battleAnimating || blockCooldown > 0 ? "#2C3947" : "#232E3D", border: `1px solid ${blockCooldown > 0 ? "#33414F" : "#4FA3C9"}`, borderRadius: 10, padding: "13px 0", fontSize: 12, fontWeight: 700, color: battleAnimating || blockCooldown > 0 ? "#5C6773" : "#4FA3C9", cursor: battleAnimating || blockCooldown > 0 ? "default" : "pointer" }}>
                  {blockCooldown > 0 ? `🛡 (${blockCooldown})` : "🛡 Block"}
                </button>
                <button onClick={abandonBattle} className="qlog-btn"
                  style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 10, padding: "13px 10px", fontSize: 11, color: "#8A8578", cursor: "pointer" }}>Flee</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating timer */}
      {focus && focus.started && !focusOpen && (
        <button onClick={() => setFocusOpen(true)} className="qlog-btn" style={{ position: "fixed", bottom: 20, right: 20, zIndex: 55, display: "flex", alignItems: "center", gap: 8, background: "#232E3D", border: `1.5px solid ${timerColor}`, borderRadius: 30, padding: "10px 16px", cursor: "pointer", boxShadow: "0 6px 20px rgba(0,0,0,0.4)" }}>
          <Timer size={16} color={timerColor} className={focus.secondsLeft === 0 ? "pulse" : ""} />
          <span style={{ fontFamily: "ui-monospace, Menlo, monospace", fontWeight: 700, color: timerColor, fontSize: 14 }}>{focus.secondsLeft === 0 ? "Time's up" : fmtTime(focus.secondsLeft)}</span>
          <span style={{ fontSize: 11, color: "#8A8578", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{focus.title}</span>
        </button>
      )}

      {/* Focus modal */}
      {focus && focusOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10,14,20,0.7)", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 16, padding: 24, width: "100%", maxWidth: 340, position: "relative" }}>
            <button onClick={() => setFocusOpen(false)} aria-label="Close" style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "#8A8578", cursor: "pointer" }}><X size={18} /></button>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}><Timer size={17} color={accent} /><span style={{ fontSize: 12, color: "#8A8578", fontWeight: 600 }}>FOCUS SESSION</span></div>
            <h3 style={{ margin: "4px 0 18px", fontSize: 16, fontWeight: 700, fontFamily: "Georgia, serif" }}>{focus.title}</h3>
            {!focus.started ? (<>
              <label style={{ fontSize: 12, color: "#8A8578" }}>Minutes to race the clock:</label>
              <input type="number" min={1} max={240} value={focus.minutesInput} onChange={(e) => setFocus((f) => ({ ...f, minutesInput: Math.max(1, Math.min(240, Number(e.target.value) || 1)) }))} style={{ width: "100%", margin: "8px 0 18px", background: "#141C27", border: "1px solid #33414F", borderRadius: 8, padding: "10px 12px", color: "#EDE4D3", fontSize: 16, fontFamily: "ui-monospace, Menlo, monospace" }} />
              <button onClick={startFocus} className="qlog-btn" style={{ width: "100%", background: accent, border: "none", borderRadius: 8, padding: "12px 0", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#1B2430" }}><Play size={16} /> Start</button>
            </>) : (<>
              <div style={{ textAlign: "center", margin: "8px 0 16px" }}>
                <div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 44, fontWeight: 700, color: timerColor }}>{fmtTime(focus.secondsLeft)}</div>
                {focus.secondsLeft === 0 && <div style={{ fontSize: 12, color: "#8A2E44", marginTop: 4 }}>Time's up — finish strong or mark it done.</div>}
              </div>
              <div style={{ height: 8, background: "#141C27", borderRadius: 6, overflow: "hidden", marginBottom: 18 }}>
                <div style={{ height: "100%", width: `${timerPct}%`, background: timerColor, borderRadius: 6, transition: "width 1s linear, background 0.3s ease" }} />
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <button onClick={toggleRun} className="qlog-btn" style={{ flex: 1, background: "#141C27", border: "1px solid #33414F", borderRadius: 8, padding: "10px 0", color: "#EDE4D3", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>{focus.running ? <Pause size={15} /> : <Play size={15} />} {focus.running ? "Pause" : "Resume"}</button>
                <button onClick={resetFocus} className="qlog-btn" aria-label="Reset" style={{ background: "#141C27", border: "1px solid #33414F", borderRadius: 8, padding: "10px 12px", color: "#EDE4D3", cursor: "pointer" }}><RotateCcw size={15} /></button>
              </div>
              <button onClick={completeFromFocus} className="qlog-btn" style={{ width: "100%", background: "#4C9A6A", border: "none", borderRadius: 8, padding: "12px 0", fontWeight: 700, cursor: "pointer", color: "#141C27" }}>Mark quest complete</button>
              {focus.secondsLeft > 0 && <p style={{ fontSize: 11, color: "#5C6773", textAlign: "center", marginTop: 8 }}>Finish before time's up for a bonus XP boost.</p>}
            </>)}
          </div>
        </div>
      )}

      {/* Quest detail */}
      {/* Shift modal */}
      {weekShiftModalOpen && (
        <WeekShiftModal
          weekDates={getWeekDates(calAnchor)}
          shifts={shifts}
          accent={accent}
          themePersonality={themePersonality}
          onSave={(newShifts) => {
            addShifts(newShifts);
          }}
          onClose={() => setWeekShiftModalOpen(false)}
          formatShiftTime={formatShiftTime}
          parseLocalDate={parseLocalDate}
        />
      )}

            {questDetailFor && <QuestDetailModal questId={questDetailFor} />}

      {deleteSeriesPromptFor && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10,14,20,0.75)", zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={() => setDeleteSeriesPromptFor(null)}>
          <div style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 16, padding: 22, width: "100%", maxWidth: 340 }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 700, fontFamily: "Georgia, serif" }}>Delete repeated quest?</h3>
            <p style={{ fontSize: 13, color: "#8A8578", margin: "0 0 18px" }}>
              <strong style={{ color: "#EDE4D3" }}>"{deleteSeriesPromptFor.title}"</strong> is part of a repeat series. Delete just this one, or the whole series?
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button onClick={() => deleteQuestOnly(deleteSeriesPromptFor.id)} className="qlog-btn"
                style={{ background: "#1F2836", border: "1px solid #33414F", borderRadius: 8, padding: "11px 0", fontWeight: 600, fontSize: 13, color: "#EDE4D3", cursor: "pointer" }}>
                Delete this one only
              </button>
              <button onClick={() => deleteQuestSeries(deleteSeriesPromptFor.seriesId)} className="qlog-btn"
                style={{ background: "#8A2E44", border: "none", borderRadius: 8, padding: "11px 0", fontWeight: 700, fontSize: 13, color: "#EDE4D3", cursor: "pointer" }}>
                Delete entire series
              </button>
              <button onClick={() => setDeleteSeriesPromptFor(null)} className="qlog-btn"
                style={{ background: "none", border: "1px solid #33414F", borderRadius: 8, padding: "9px 0", fontSize: 12, color: "#8A8578", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 12px" }}>
        {/* Header */}
        <div style={{ padding: "16px 0 14px", borderBottom: `1px solid ${themePersonality.borderCol}`, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span>{(() => { const w = ITEM_CATALOGUE.find((i) => i.id === equipped.weapon); return w ? w.icon(accent) : <Sword size={22} color={accent} />; })()}</span>
            <div>
              <h1 style={{ fontWeight: 700, fontSize: 20, margin: 0, fontFamily: "Georgia, serif" }}>QuestAI</h1>
              {(equipped.badge || equipped.title) && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 1 }}>
                  {equipped.badge && <span>{(() => { const b = ITEM_CATALOGUE.find((i) => i.id === equipped.badge); return b ? b.icon(RARITIES[b.rarity].color) : null; })()}</span>}
                  {equipped.title && <span style={{ fontSize: 10, color: accent, fontWeight: 600 }}>{ITEM_CATALOGUE.find((i) => i.id === equipped.title)?.value}</span>}
                </div>
              )}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button onClick={() => setCollectionOpen(true)} className="qlog-btn" style={{ fontSize: 18, background: "none", border: "none", cursor: "pointer", padding: 4 }} title="Collection">🎒</button>
            <button onClick={() => setCrateModalOpen(true)} className="qlog-btn" style={{ display: "flex", alignItems: "center", gap: 4, background: "#232E3D", border: "1px solid #33414F", borderRadius: 8, padding: "7px 9px", color: "#EDE4D3", cursor: "pointer", fontFamily: "ui-monospace, Menlo, monospace", fontSize: 12, fontWeight: 700 }}><Coins size={13} color="#C9A227" /> {gold}</button>
          </div>
        </div>

        {/* XP / Streak + Action buttons */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
          <div style={{ flex: "1 1 200px", background: themePersonality.cardBase, border: `1px solid ${themePersonality.borderCol}`, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 4 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span onClick={() => {
                  devTapCount.current += 1;
                  if (devTapTimer.current) clearTimeout(devTapTimer.current);
                  devTapTimer.current = setTimeout(() => { devTapCount.current = 0; }, 1500);
                  if (devTapCount.current >= 5) { devTapCount.current = 0; setDevMode((v) => !v); }
                }} style={{ fontWeight: 700, fontSize: 18, color: auraColor || accent, fontFamily: "Georgia, serif", cursor: "default", userSelect: "none", textShadow: auraColor ? `0 0 12px ${auraColor}88` : "none" }}>Lv {level}</span>
                <span style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 11, color: "#8A8578" }}>{into}/{need} XP</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Flame size={14} color={streak > 0 ? "#C1652B" : "#4A5563"} fill={streak > 0 ? "#C1652B" : "none"} />
                <span style={{ fontFamily: "ui-monospace, Menlo, monospace", fontWeight: 700, fontSize: 12, color: streak > 0 ? "#C1652B" : "#8A8578" }}>{streak}d</span>
                {streak > 0 && lastActiveDate && lastActiveDate < yesterdayStr() && (
                  <span style={{ fontSize: 10, color: "#8A2E44", fontWeight: 600 }}>❄ missed</span>
                )}
              </div>
            </div>
            <div style={{ fontSize: 10, color: "#8A8578", marginBottom: 6 }}>
              {rank}{nextMilestone && ` · Lv ${nextMilestone} next trophy`}
              {activeAura?.value && <span style={{ marginLeft: 8, fontSize: 9, fontWeight: 700, color: auraColor, background: auraColor + "22", borderRadius: 10, padding: "1px 6px", border: `1px solid ${auraColor}44` }}>{activeAura.value}</span>}
            </div>
            {(playerStats.bonusHp > 0 || playerStats.bonusDef > 0 || playerStats.bonusAtk > 0 || playerStats.bonusCrit > 0) && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
                {playerStats.bonusHp > 0 && <span style={{ fontSize: 9, color: "#8A2E44", background: "#8A2E4422", borderRadius: 8, padding: "1px 5px" }}>❤ +{playerStats.bonusHp}HP</span>}
                {playerStats.bonusDef > 0 && <span style={{ fontSize: 9, color: "#4FA3C9", background: "#4FA3C922", borderRadius: 8, padding: "1px 5px" }}>🛡 +{playerStats.bonusDef}DEF</span>}
                {playerStats.bonusAtk > 0 && <span style={{ fontSize: 9, color: accent, background: accent + "22", borderRadius: 8, padding: "1px 5px" }}>⚔ +{playerStats.bonusAtk}ATK</span>}
                {playerStats.bonusCrit > 0 && <span style={{ fontSize: 9, color: "#C1652B", background: "#C1652B22", borderRadius: 8, padding: "1px 5px" }}>💥 +{Math.round(playerStats.bonusCrit * 100)}%crit</span>}
              </div>
            )}
            <div style={{ height: 7, background: "#141C27", borderRadius: 4, overflow: "hidden", marginBottom: 8, position: "relative", boxShadow: themePersonality.xpGlow }}>
              <div style={{ height: "100%", width: `${(into / need) * 100}%`, background: auraColor ? `linear-gradient(90deg, ${auraColor}99, ${auraColor})` : `linear-gradient(90deg, ${accent}88, ${accent})`, borderRadius: 4, transition: "width 0.4s ease" }} />
            </div>
            {/* Aura particles floating above XP bar */}
            {auraColor && (
              <div style={{ position: "relative", height: 28, marginTop: -28, pointerEvents: "none", overflow: "visible" }}>
                <AuraParticles color={auraColor} type={activeAura?.combatEffect?.type} />
              </div>
            )}
            <div style={{ display: "flex", gap: 4 }}>
              {MILESTONE_LEVELS.map((m) => (
                <div key={m} title={`Level ${m}`} style={{ width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: level >= m ? accent : "#2C3947" }}>
                  <Trophy size={10} color={level >= m ? "#1B2430" : "#4A5563"} />
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons panel */}
          <div style={{ flex: "1 1 200px", background: themePersonality.cardBase, border: `1px solid ${themePersonality.borderCol}`, borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
            <button onClick={() => { setAddDate(selectedDate); setAddModalOpen(true); }} className="qlog-btn" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: accent, border: "none", borderRadius: 8, padding: "10px 0", fontWeight: 700, fontSize: 13, color: "#1B2430", cursor: "pointer" }}><Plus size={15} /> Add Quest</button>
            <button onClick={() => setDumpModalOpen(true)} className="qlog-btn" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "#1F2836", border: "1px solid #33414F", borderRadius: 8, padding: "9px 0", fontWeight: 600, fontSize: 12, color: "#EDE4D3", cursor: "pointer" }}><FileText size={14} /> Brain Dump</button>

            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => setStatsOpen(true)} className="qlog-btn" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: "#1F2836", border: "1px solid #33414F", borderRadius: 8, padding: "7px 0", fontSize: 12, color: "#8A8578", cursor: "pointer" }}><BarChart2 size={14} /> Stats</button>
              <button onClick={() => setSettingsOpen(true)} className="qlog-btn" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: "#1F2836", border: "1px solid #33414F", borderRadius: 8, padding: "7px 0", fontSize: 12, color: "#8A8578", cursor: "pointer" }}><Gear size={14} /> Settings</button>
            </div>
            {bossQuest && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 8px", background: "rgba(138,95,191,0.1)", borderRadius: 6, border: "1px solid #8A5FBF" }}>
                <Crown size={12} color="#8A5FBF" />
                <span style={{ fontSize: 11, color: "#8A5FBF", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Boss: {bossQuest.title}</span>
                <button onClick={() => setWeeklyBossId(null)} style={{ background: "none", border: "none", color: "#8A8578", cursor: "pointer", padding: 0 }}><X size={12} /></button>
              </div>
            )}
          </div>
        </div>
        </div>{/* end header gradient */}

        {/* Dev mode panel — tap level 5x to toggle */}
        {devMode && (
          <div style={{ background: "#0D1117", border: "2px dashed #C9A227", borderRadius: 10, padding: "12px 14px", marginBottom: 12, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#C9A227", fontFamily: "ui-monospace, Menlo, monospace" }}>⚗ DEV MODE</span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <input type="number" value={devGold} onChange={(e) => setDevGold(e.target.value)} style={{ width: 60, background: "#141C27", border: "1px solid #33414F", borderRadius: 6, color: "#EDE4D3", padding: "4px 6px", fontSize: 12, fontFamily: "ui-monospace, Menlo, monospace" }} />
              <button onClick={() => setGold((g) => g + Math.max(0, Number(devGold) || 0))} className="qlog-btn" style={{ background: "#C9A227", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "#1B2430", cursor: "pointer" }}>+Gold</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <input type="number" value={devXP} onChange={(e) => setDevXP(e.target.value)} style={{ width: 60, background: "#141C27", border: "1px solid #33414F", borderRadius: 6, color: "#EDE4D3", padding: "4px 6px", fontSize: 12, fontFamily: "ui-monospace, Menlo, monospace" }} />
              <button onClick={() => {
                const amount = Math.max(0, Number(devXP) || 0);
                if (amount <= 0) return;
                const prevLevel = levelFromXP(totalXP).level;
                const newLevel = levelFromXP(totalXP + amount).level;
                setTotalXP((x) => x + amount);
                if (newLevel > prevLevel) {
                  spawnConfetti();
                  const newChoices = Array.from({ length: newLevel - prevLevel }, (_, i) => ({
                    level: prevLevel + i + 1,
                    rank: rankForLevel(prevLevel + i + 1),
                  }));
                  setStatChoiceQueue((q) => [...q, ...newChoices]);
                }
              }} className="qlog-btn" style={{ background: "#4C9A6A", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "#1B2430", cursor: "pointer" }}>+XP</button>
            </div>
            <button onClick={() => { setInventory(ITEM_CATALOGUE.map((i) => i.id)); }} className="qlog-btn" style={{ background: "#8A5FBF", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "#EDE4D3", cursor: "pointer" }}>Unlock All</button>
            <button onClick={simulateBattle} className="qlog-btn" style={{ background: "#C1652B", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "#EDE4D3", cursor: "pointer" }}>⚔ Sim Battle</button>
            <button onClick={() => setDevMode(false)} style={{ background: "none", border: "none", color: "#5C6773", fontSize: 11, cursor: "pointer", marginLeft: "auto" }}>close</button>
          </div>
        )}

        {/* Calendar header */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <button onClick={() => navCalendar(-1)} className="qlog-btn" style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 6, padding: "5px 8px", color: "#EDE4D3", cursor: "pointer" }}><ChevronLeft size={16} /></button>
              <button onClick={() => { setCalAnchor(today); setSelectedDate(today); }} className={`qlog-btn${!todayInView ? " today-glow" : ""}`} style={{ background: !todayInView ? accent + "22" : "#232E3D", border: `1px solid ${!todayInView ? accent : "#33414F"}`, borderRadius: 6, padding: "5px 10px", color: !todayInView ? accent : "#EDE4D3", cursor: "pointer", fontSize: 12, fontWeight: 600, position: "relative" }}>Today{!todayInView && <span style={{ position: "absolute", top: -3, right: -3, width: 7, height: 7, borderRadius: "50%", background: accent, border: "1.5px solid #1B2430" }} />}</button>
              <button onClick={() => navCalendar(1)} className="qlog-btn" style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 6, padding: "5px 8px", color: "#EDE4D3", cursor: "pointer" }}><ChevronRight size={16} /></button>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {["day", "week", "month"].map((v) => (
                <button key={v} onClick={() => setCalView(v)} className="qlog-btn" style={{ fontSize: 11, fontWeight: 700, padding: "5px 8px", borderRadius: 6, border: "1px solid #33414F", background: calView === v ? accent : "#232E3D", color: calView === v ? "#1B2430" : "#8A8578", cursor: "pointer", textTransform: "capitalize" }}>{v}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#8A8578" }}>
              {calView === "day" && parseLocalDate(calAnchor).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
              {calView === "week" && weekLabel(calAnchor)}
              {calView === "month" && monthLabel(calAnchor)}
            </div>
            <button onClick={() => setWeekShiftModalOpen(true)} className="qlog-btn" style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 6, border: `1px solid ${accent}44`, background: accent + "18", color: accent, cursor: "pointer" }}>⏱ Shifts</button>
          </div>
        </div>

        {/* Show completed toggle */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#8A8578", cursor: "pointer" }}>
            <input type="checkbox" checked={showCompleted} onChange={(e) => setShowCompleted(e.target.checked)} />
            Show completed
          </label>
        </div>

        {/* ---- Calendar views ---- */}
        {calView === "day" && (
          <div style={{ background: "#1F2836", border: "1px solid #2C3947", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "10px 12px", borderBottom: "1px solid #2C3947", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: calAnchor === today ? accent : "#EDE4D3" }}>
                {parseLocalDate(calAnchor).toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}
              </span>
              <div style={{ display: "flex", gap: 6 }}>
<button onClick={() => { setAddDate(calAnchor); setAddModalOpen(true); }} className="qlog-btn" style={{ display: "flex", alignItems: "center", gap: 4, background: accent, border: "none", borderRadius: 6, padding: "5px 9px", fontSize: 11, fontWeight: 700, color: "#1B2430", cursor: "pointer" }}><Plus size={12} /> Add</button>
              </div>
            </div>
            <div style={{ padding: 10, minHeight: 200 }}>
              {shifts.filter((s) => s.date === calAnchor).map((s) => (
                <div key={s.id}
                  style={{ background: accent + "22", border: `1px solid ${accent}55`, borderLeft: `3px solid ${accent}`, borderRadius: 6, padding: "8px 10px", marginBottom: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: 0.5 }}>Work Shift</div>
                  <div style={{ fontSize: 12, color: accent + "cc", fontFamily: "ui-monospace, Menlo, monospace", marginTop: 2 }}>{formatShiftTime(s.startTime)} – {formatShiftTime(s.endTime)}</div>
                </div>
              ))}
              {questsForDate(calAnchor).length === 0 && shifts.filter((s) => s.date === calAnchor).length === 0
                ? <div style={{ textAlign: "center", padding: "40px 0", color: "#3F4B58", fontSize: 12 }}>No quests — tap Add to plan your day</div>
                : questsForDate(calAnchor).map((q) => <QuestDot key={q.id} q={q} />)
              }
            </div>
          </div>
        )}

        {calView === "week" && (
          <div style={{ background: "#1F2836", border: "1px solid #2C3947", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ display: "flex", borderBottom: "1px solid #2C3947" }}>
              {getWeekDates(calAnchor).map((date) => {
                const d = parseLocalDate(date);
                const isToday = date === today;
                const count = quests.filter((q) => q.date === date && !q.completed).length;
                return (
                  <div key={date} style={{ flex: 1, padding: "6px 2px", textAlign: "center", borderRight: "1px solid #2C3947", background: date === selectedDate ? accent + "22" : "transparent" }}>
                    <div onClick={() => { setCalAnchor(date); setCalView("day"); }} style={{ cursor: "pointer" }}>
                      <div style={{ fontSize: 10, color: isToday ? accent : "#8A8578", fontWeight: 600, textTransform: "uppercase" }}>{d.toLocaleDateString(undefined, { weekday: "narrow" })}</div>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: isToday ? accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", margin: "2px auto" }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: isToday ? "#1B2430" : "#EDE4D3" }}>{d.getDate()}</span>
                      </div>
                      {count > 0 && <div style={{ width: 6, height: 6, borderRadius: "50%", background: accent, margin: "2px auto 0" }} />}
                    </div>

                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex" }}>
              {getWeekDates(calAnchor).map((date) => {
                const dayQuests = questsForDate(date);
                const dayShifts = shifts.filter((s) => s.date === date);
                const isOver = dragOverDate === date;
                return (
                  <div key={date}
                    onDragOver={(e) => { e.preventDefault(); setDragOverDate(date); }}
                    onDragLeave={() => setDragOverDate((d) => d === date ? null : d)}
                    onDrop={(e) => { e.preventDefault(); const id = Number(e.dataTransfer.getData("text/plain")); moveQuestToDate(id, date); dragIdRef.current = null; setIsDragging(false); setDragOverDate(null); }}
                    style={{ flex: 1, borderRight: "1px solid #2C3947", padding: "4px 3px", minHeight: 160, background: isOver ? accent + "18" : "transparent", transition: "background 0.1s ease" }}
                    onClick={(e) => { if (e.target === e.currentTarget) { setAddDate(date); setAddModalOpen(true); } }}>
                    {dayShifts.map((s) => (
                      <div key={s.id}
                        style={{ background: accent + "22", border: `1px solid ${accent}55`, borderLeft: `3px solid ${accent}`, borderRadius: 4, padding: "3px 4px", marginBottom: 3 }}>
                        <div style={{ fontSize: 8, fontWeight: 700, color: accent, textTransform: "uppercase" }}>Shift</div>
                        <div style={{ fontSize: 8, color: accent + "cc", fontFamily: "ui-monospace, Menlo, monospace" }}>{formatShiftTime(s.startTime)}–{formatShiftTime(s.endTime)}</div>
                      </div>
                    ))}
                    {dayQuests.length === 0 && dayShifts.length === 0
                      ? <div style={{ height: "100%", minHeight: 60 }} onClick={() => { setAddDate(date); setAddModalOpen(true); }} />
                      : dayQuests.map((q) => <QuestDot key={q.id} q={q} />)
                    }
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {calView === "month" && (() => {
          const monthDates = getMonthDates(calAnchor);
          const anchorMonth = parseLocalDate(calAnchor).getMonth();
          return (
            <div style={{ background: "#1F2836", border: "1px solid #2C3947", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid #2C3947" }}>
                {["M","T","W","T","F","S","S"].map((d, i) => (
                  <div key={i} style={{ padding: "6px 0", textAlign: "center", fontSize: 10, fontWeight: 700, color: "#8A8578", borderRight: i < 6 ? "1px solid #2C3947" : "none" }}>{d}</div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
                {monthDates.map((date, i) => {
                  const d = parseLocalDate(date);
                  const isThisMonth = d.getMonth() === anchorMonth;
                  const isToday = date === today;
                  const dayQuests = quests.filter((q) => q.date === date && (showCompleted || !q.completed));
                  const active = dayQuests.filter((q) => !q.completed).length;
                  const done = dayQuests.filter((q) => q.completed).length;
                  const hasOverdue = date < today && active > 0;
                  const isOver = dragOverDate === date;
                  const dayShifts = shifts.filter((s) => s.date === date);
                  return (
                    <div key={date}
                      onDragOver={(e) => { e.preventDefault(); setDragOverDate(date); }}
                      onDragLeave={() => setDragOverDate((d) => d === date ? null : d)}
                      onDrop={(e) => { e.preventDefault(); const id = Number(e.dataTransfer.getData("text/plain")); moveQuestToDate(id, date); dragIdRef.current = null; setIsDragging(false); setDragOverDate(null); }}
                      onClick={() => { setCalAnchor(date); setCalView("day"); }}
                      style={{ borderRight: i % 7 < 6 ? "1px solid #2C3947" : "none", borderBottom: "1px solid #2C3947", padding: "4px", minHeight: 64, cursor: "pointer", background: isOver ? accent + "28" : hasOverdue ? "rgba(138,46,68,0.12)" : isToday ? accent + "18" : "transparent", opacity: isThisMonth ? 1 : 0.4, transition: "background 0.1s ease" }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: isToday ? accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 2 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: isToday ? "#1B2430" : "#EDE4D3" }}>{d.getDate()}</span>
                      </div>
                      {dayShifts.map((s) => (
                        <div key={s.id} style={{ background: accent + "22", borderLeft: `2px solid ${accent}`, borderRadius: 3, padding: "1px 3px", marginBottom: 2, fontSize: 8, color: accent, fontFamily: "ui-monospace, Menlo, monospace", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {formatShiftTime(s.startTime)}–{formatShiftTime(s.endTime)}
                        </div>
                      ))}
                      {active > 0 && <div style={{ fontSize: 9, fontWeight: 700, color: hasOverdue ? "#C1652B" : accent, lineHeight: 1.4 }}>{hasOverdue ? "⚠ " : ""}{active} quest{active !== 1 ? "s" : ""}</div>}
                      {done > 0 && <div style={{ fontSize: 9, color: "#4C9A6A", lineHeight: 1.4 }}>✓ {done}</div>}
                      {active > 0 && (
                        <div style={{ display: "flex", gap: 2, marginTop: 2, flexWrap: "wrap" }}>
                          {quests.filter((q) => q.date === date && !q.completed).slice(0, 4).map((q) => {
                            const d = themedDifficulties.find((df) => df.key === q.difficulty);
                            return <div key={q.id} style={{ width: 5, height: 5, borderRadius: "50%", background: d?.color || accent }} />;
                          })}
                          {active > 4 && <div style={{ fontSize: 8, color: "#5C6773" }}>+{active - 4}</div>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {splitError && <p style={{ fontSize: 11, color: "#C1652B", textAlign: "center", marginTop: 8 }}>Couldn't split that task — try again in a moment.</p>}

        {/* Trash drop zone — appears while dragging */}
        {isDragging && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOverTrash(true); }}
            onDragLeave={() => setDragOverTrash(false)}
            onDrop={(e) => { e.preventDefault(); const id = Number(e.dataTransfer.getData("text/plain")); deleteQuest(id); dragIdRef.current = null; setIsDragging(false); setDragOverTrash(false); }}
            style={{ margin: "10px 0", padding: "14px 0", borderRadius: 10, border: `2px dashed ${dragOverTrash ? "#B33A3A" : "#8A2E44"}`, background: dragOverTrash ? "rgba(179,58,58,0.15)" : "rgba(138,46,68,0.06)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.15s ease", cursor: "copy" }}>
            <Trash2 size={18} color={dragOverTrash ? "#B33A3A" : "#8A2E44"} />
            <span style={{ fontSize: 13, fontWeight: 600, color: dragOverTrash ? "#B33A3A" : "#8A2E44" }}>Drop here to delete</span>
          </div>
        )}

        {/* Daily Habits */}
        <div style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 10, padding: 14, marginTop: 12, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Daily Habits</span>
            <span style={{ fontSize: 10, color: "#5C6773" }}>{HABIT_XP} XP each · 3d bronze · 7d silver · 21d gold · 66d diamond</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
            {habits.length === 0 && <p style={{ fontSize: 12, color: "#5C6773", margin: 0 }}>No habits yet — add one below.</p>}
            {habits.map((h) => {
              const doneToday = h.lastCompletedDate === today;
              const tier = habitTier(h.streak);
              return (
                <div key={h.id} style={{ position: "relative", display: "flex", alignItems: "center", gap: 8, background: "#1F2836", border: "1px solid #2C3947", borderRadius: 8, padding: "7px 10px" }}>
                  {!doneToday
                    ? <button onClick={() => completeHabit(h.id)} className="qlog-btn" style={{ width: 18, height: 18, minWidth: 18, borderRadius: "50%", border: "2px solid #5C6773", background: "transparent", cursor: "pointer" }} />
                    : <button onClick={() => uncompleteHabit(h.id)} className="qlog-btn" style={{ width: 18, height: 18, minWidth: 18, borderRadius: "50%", background: "#4C9A6A", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Check size={11} color="#141C27" /></button>
                  }
                  <span style={{ flex: 1, fontSize: 13, textDecoration: doneToday ? "line-through" : "none", opacity: doneToday ? 0.6 : 1 }}>{h.name}</span>
                  {h.streak > 0 && (
                    <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 700, color: tier.color, fontFamily: "ui-monospace, Menlo, monospace" }}>
                      <Flame size={11} color={tier.color} fill={tier.color} /> {h.streak}{tier.label && <span style={{ opacity: 0.8 }}>· {tier.label}</span>}
                    </span>
                  )}
                  <button onClick={() => deleteHabit(h.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#4A5563", padding: 2 }}><Trash2 size={12} /></button>
                  {habitXpPop && habitXpPop.id === h.id && <div className="xp-pop" style={{ position: "absolute", right: 30, top: -2, fontWeight: 700, fontSize: 11, color: accent, fontFamily: "ui-monospace, Menlo, monospace" }}>+{habitXpPop.xp} XP</div>}
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={newHabitName} onChange={(e) => setNewHabitName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addHabit(newHabitName)} placeholder="Add a habit — e.g. drink water" style={{ flex: 1, background: "#141C27", border: "1px solid #33414F", borderRadius: 8, padding: "7px 10px", color: "#EDE4D3", fontSize: 13 }} />
            <button onClick={() => addHabit(newHabitName)} className="qlog-btn" style={{ background: accent, border: "none", borderRadius: 8, padding: "0 10px", display: "flex", alignItems: "center", cursor: "pointer" }}><Plus size={14} color="#1B2430" /></button>
          </div>
        </div>

        {/* Modals */}
        {addModalOpen && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(10,14,20,0.7)", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 16, padding: 22, width: "100%", maxWidth: 380, position: "relative", maxHeight: "90vh", overflowY: "auto" }}>
              <button onClick={() => { setAddModalOpen(false); setAssessError(false); setRecurringChoice(null); setManualMinutes(""); }} aria-label="Close" style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "#8A8578", cursor: "pointer" }}><X size={18} /></button>
              <h3 style={{ margin: "0 0 14px", fontSize: 16, fontWeight: 700, fontFamily: "Georgia, serif" }}>New Quest</h3>
              <input value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !assessing && (aiQuotaExhausted || assessError ? addQuestManual() : addQuest())} placeholder="What needs doing?" disabled={assessing} autoFocus style={{ width: "100%", marginBottom: 12, background: "#141C27", border: "1px solid #33414F", borderRadius: 8, padding: "10px 12px", color: "#EDE4D3", fontSize: 14, opacity: assessing ? 0.6 : 1 }} />

              {/* Quota / error state — show manual difficulty picker */}
              {aiQuotaExhausted && (
                <div style={{ background: "rgba(193,101,43,0.1)", border: "1px solid #C1652B", borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}>
                  <p style={{ fontSize: 12, color: "#C1652B", fontWeight: 600, margin: "0 0 4px" }}>⚠ AI quota reached for today</p>
                  <p style={{ fontSize: 11, color: "#8A8578", margin: 0 }}>Resets tomorrow. Pick difficulty manually below.</p>
                </div>
              )}
              {assessError && !aiQuotaExhausted && (
                <p style={{ fontSize: 11, color: "#C1652B", margin: "0 0 10px" }}>Assessment failed — pick difficulty manually below or try again.</p>
              )}
              {(aiQuotaExhausted || assessError) && (
                <div style={{ marginBottom: 12 }}>
                  <p style={{ fontSize: 11, color: "#5C6773", margin: "0 0 6px" }}>Difficulty:</p>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {themedDifficulties.map((d) => (
                      <button key={d.key} onClick={() => setDifficulty(d.key)} className="qlog-btn" style={{ cursor: "pointer", fontSize: 11, fontWeight: 600, padding: "5px 9px", borderRadius: 20, border: `1.5px solid ${d.color}`, background: difficulty === d.key ? d.color : "transparent", color: difficulty === d.key ? "#1B2430" : d.color }}>{d.label} · {d.xp}xp</button>
                    ))}
                  </div>
                </div>
              )}
              <p style={{ fontSize: 11, color: "#5C6773", margin: "0 0 5px" }}>Start date:</p>
              <input type="date" value={addDate} onChange={(e) => setAddDate(e.target.value)} style={{ width: "100%", marginBottom: 12, background: "#141C27", border: "1px solid #33414F", borderRadius: 8, padding: "8px 10px", color: "#EDE4D3", fontSize: 13 }} />

              <p style={{ fontSize: 11, color: "#5C6773", margin: "0 0 6px" }}>Repeat:</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: recurringChoice ? 10 : 16 }}>
                {[{ key: null, label: "None" }, { key: "daily", label: "Daily" }, { key: "weekly", label: "Weekly" }].map((r) => (
                  <button key={r.label} onClick={() => setRecurringChoice(r.key)} className="qlog-btn" style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, padding: "6px 10px", borderRadius: 8, border: "1.5px solid #33414F", background: recurringChoice === r.key ? accent : "transparent", color: recurringChoice === r.key ? "#1B2430" : "#8A8578" }}>
                    {r.key && <Repeat size={11} />} {r.label}
                  </button>
                ))}
              </div>
              {recurringChoice && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, background: "#1F2836", borderRadius: 8, padding: "8px 12px" }}>
                  <span style={{ fontSize: 12, color: "#8A8578" }}>For</span>
                  <input type="number" min={1} max={52} value={repeatWeeks} onChange={(e) => setRepeatWeeks(Math.max(1, Math.min(52, Number(e.target.value) || 1)))}
                    style={{ width: 52, background: "#141C27", border: "1px solid #33414F", borderRadius: 6, color: "#EDE4D3", padding: "4px 6px", fontFamily: "ui-monospace, Menlo, monospace", fontSize: 13, textAlign: "center" }} />
                  <span style={{ fontSize: 12, color: "#8A8578" }}>
                    {recurringChoice === "daily" ? `weeks (${Math.max(1, repeatWeeks) * 7} quests)` : `weeks (${Math.max(1, repeatWeeks)} quests)`}
                  </span>
                </div>
              )}

              <p style={{ fontSize: 11, color: "#5C6773", margin: "0 0 5px" }}>Focus timer (minutes, optional):</p>
              <input type="number" min={1} max={240} value={manualMinutes} onChange={(e) => setManualMinutes(e.target.value)} placeholder="AI will estimate if blank" style={{ width: "100%", marginBottom: 16, background: "#141C27", border: "1px solid #33414F", borderRadius: 8, padding: "8px 10px", color: "#EDE4D3", fontSize: 13 }} />
              <button onClick={aiQuotaExhausted || assessError ? addQuestManual : addQuest} className="qlog-btn" disabled={assessing || !title.trim()} style={{ width: "100%", background: accent, border: "none", borderRadius: 8, padding: "12px 0", fontWeight: 700, cursor: assessing || !title.trim() ? "default" : "pointer", opacity: assessing || !title.trim() ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#1B2430" }}>
                {assessing ? <Loader2 size={18} className="spin" /> : <Plus size={18} />} {assessing ? "Assessing..." : aiQuotaExhausted || assessError ? "Add Quest" : "Add Quest (AI)"}
              </button>
              {!aiQuotaExhausted && !assessError && <p style={{ fontSize: 10, color: "#5C6773", margin: "8px 0 0", textAlign: "center" }}>QuestAI will assess difficulty + time automatically</p>}
            </div>
          </div>
        )}

        {dumpModalOpen && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(10,14,20,0.7)", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 16, padding: 22, width: "100%", maxWidth: 400, position: "relative", maxHeight: "90vh", overflowY: "auto" }}>
              <button onClick={() => setDumpModalOpen(false)} aria-label="Close" style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "#8A8578", cursor: "pointer" }}><X size={18} /></button>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}><FileText size={15} color={accent} /><span style={{ fontSize: 11, color: "#8A8578", fontWeight: 600 }}>BRAIN DUMP</span></div>
              <h3 style={{ margin: "4px 0 6px", fontSize: 16, fontWeight: 700, fontFamily: "Georgia, serif" }}>Paste everything at once</h3>
              <p style={{ fontSize: 12, color: "#8A8578", margin: "0 0 12px" }}>QuestAI will split into quests, assign dates across the coming weeks, and pick difficulty + time for each.</p>
              <textarea value={dumpText} onChange={(e) => setDumpText(e.target.value)} disabled={dumpParsing} placeholder="e.g. call dentist, finish slides for monday, laundry, dentist appointment next Thursday..." rows={5} style={{ width: "100%", resize: "vertical", background: "#141C27", border: "1px solid #33414F", borderRadius: 8, padding: "10px 12px", color: "#EDE4D3", fontSize: 13, marginBottom: 12, opacity: dumpParsing ? 0.6 : 1 }} />
              {dumpError && <p style={{ fontSize: 11, color: "#C1652B", margin: "0 0 12px" }}>That didn't go through — try again, or add quests one at a time.</p>}
              <button onClick={submitDump} className="qlog-btn" disabled={dumpParsing || !dumpText.trim()} style={{ width: "100%", background: accent, border: "none", borderRadius: 8, padding: "12px 0", fontWeight: 700, cursor: dumpParsing || !dumpText.trim() ? "default" : "pointer", opacity: dumpParsing || !dumpText.trim() ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#1B2430" }}>
                {dumpParsing ? <Loader2 size={18} className="spin" /> : <Sparkles size={18} />} {dumpParsing ? "Planning..." : "Turn into quests"}
              </button>
            </div>
          </div>
        )}

        {statsOpen && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(10,14,20,0.7)", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 16, padding: 22, width: "100%", maxWidth: 380, position: "relative", maxHeight: "90vh", overflowY: "auto" }}>
              <button onClick={() => setStatsOpen(false)} aria-label="Close" style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "#8A8578", cursor: "pointer" }}><X size={18} /></button>
              <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, fontFamily: "Georgia, serif" }}>Insights</h3>
              <p style={{ fontSize: 11, color: "#8A8578", margin: "0 0 8px", fontWeight: 600 }}>COMPLETED BY DAY</p>
              <div style={{ marginBottom: 18 }}>
                {dayStats.map((d) => (
                  <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                    <span style={{ width: 28, fontSize: 11, color: "#8A8578" }}>{d.label}</span>
                    <div style={{ flex: 1, height: 9, background: "#141C27", borderRadius: 5, overflow: "hidden" }}><div style={{ height: "100%", width: `${(d.count / maxDayCount) * 100}%`, background: accent, borderRadius: 5 }} /></div>
                    <span style={{ width: 16, fontSize: 11, color: "#5C6773", fontFamily: "ui-monospace, Menlo, monospace", textAlign: "right" }}>{d.count}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11, color: "#8A8578", margin: "0 0 8px", fontWeight: 600 }}>COMPLETED BY DIFFICULTY</p>
              <div>
                {diffStats.map((d) => (
                  <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                    <span style={{ width: 46, fontSize: 11, color: "#8A8578" }}>{d.label}</span>
                    <div style={{ flex: 1, height: 9, background: "#141C27", borderRadius: 5, overflow: "hidden" }}><div style={{ height: "100%", width: `${(d.count / maxDiffCount) * 100}%`, background: d.color, borderRadius: 5 }} /></div>
                    <span style={{ width: 16, fontSize: 11, color: "#5C6773", fontFamily: "ui-monospace, Menlo, monospace", textAlign: "right" }}>{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {settingsOpen && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(10,14,20,0.7)", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 16, padding: 22, width: "100%", maxWidth: 400, position: "relative", maxHeight: "90vh", overflowY: "auto" }}>
              <button onClick={() => { setSettingsOpen(false); setConfirmClear(false); }} aria-label="Close" style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "#8A8578", cursor: "pointer" }}><X size={18} /></button>
              <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700, fontFamily: "Georgia, serif" }}>Settings</h3>

              {/* Default calendar view */}
              <p style={{ fontSize: 11, fontWeight: 700, color: "#8A8578", margin: "0 0 8px", letterSpacing: 0.5 }}>DEFAULT CALENDAR VIEW</p>
              <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
                {["day", "week", "month"].map((v) => (
                  <button key={v} onClick={() => setCalView(v)} className="qlog-btn"
                    style={{ flex: 1, fontSize: 12, fontWeight: 700, padding: "8px 0", borderRadius: 8, border: "1px solid #33414F", background: calView === v ? accent : "#1F2836", color: calView === v ? "#1B2430" : "#8A8578", cursor: "pointer", textTransform: "capitalize" }}>
                    {v}
                  </button>
                ))}
              </div>

              {/* XP multiplier breakdown */}
              <p style={{ fontSize: 11, fontWeight: 700, color: "#8A8578", margin: "0 0 8px", letterSpacing: 0.5 }}>HOW XP MULTIPLIERS WORK</p>
              <div style={{ background: "#1F2836", borderRadius: 10, padding: "12px 14px", marginBottom: 20 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#EDE4D3", margin: "0 0 8px" }}>🔥 Streak bonus (stacks daily)</p>
                {[["3+ days", "+10%"], ["7+ days", "+20%"], ["14+ days", "+35%"], ["30+ days", "+50%"]].map(([d, b]) => (
                  <div key={d} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#8A8578", marginBottom: 3 }}>
                    <span>{d}</span><span style={{ color: "#C1652B", fontWeight: 700 }}>{b}</span>
                  </div>
                ))}
                <div style={{ height: 1, background: "#2C3947", margin: "10px 0" }} />
                <p style={{ fontSize: 12, fontWeight: 600, color: "#EDE4D3", margin: "0 0 8px" }}>⚡ Combo bonus (same day)</p>
                {[["1st–2nd quest", "+0%"], ["3rd–4th quest", "+15%"], ["5th+ quest", "+30%"]].map(([d, b]) => (
                  <div key={d} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#8A8578", marginBottom: 3 }}>
                    <span>{d}</span><span style={{ color: accent, fontWeight: 700 }}>{b}</span>
                  </div>
                ))}
                <div style={{ height: 1, background: "#2C3947", margin: "10px 0" }} />
                <p style={{ fontSize: 11, color: "#5C6773", margin: 0 }}>Bonuses add together, then apply to the base XP. Beat the focus timer clock for an extra +25% on top.</p>
              </div>

              {/* Notifications */}
              {"Notification" in window && (
                <>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#8A8578", margin: "0 0 8px", letterSpacing: 0.5 }}>REMINDERS</p>
                  <div style={{ background: "#1F2836", borderRadius: 10, padding: "12px 14px", marginBottom: 20 }}>
                    <p style={{ fontSize: 12, color: "#8A8578", margin: "0 0 10px" }}>
                      {notifPermission === "granted" ? "Reminders are enabled. You'll get nudges for habits, overdue tasks and your weekly battle." : "Get reminded about habits, overdue tasks and your weekly battle."}
                    </p>
                    {notifPermission === "denied" && (
                      <p style={{ fontSize: 11, color: "#8A2E44", margin: "0 0 10px" }}>Notifications are blocked in your browser settings. Enable them there first, then come back here.</p>
                    )}
                    {notifPermission !== "denied" && (
                      <button onClick={async () => {
                        await requestNotifPermission();
                      }} className="qlog-btn" style={{ width: "100%", background: notifPermission === "granted" ? "#1B2430" : accent, border: `1px solid ${notifPermission === "granted" ? "#33414F" : accent}`, borderRadius: 8, padding: "10px 0", fontWeight: 700, fontSize: 13, color: notifPermission === "granted" ? "#8A8578" : "#1B2430", cursor: "pointer" }}>
                        {notifPermission === "granted" ? "🔔 Re-register reminders" : "🔔 Enable reminders"}
                      </button>
                    )}
                  </div>
                </>
              )}

              {/* Clear all data */}
              <p style={{ fontSize: 11, fontWeight: 700, color: "#8A8578", margin: "0 0 8px", letterSpacing: 0.5 }}>DANGER ZONE</p>
              {!confirmClear ? (
                <button onClick={() => setConfirmClear(true)} className="qlog-btn"
                  style={{ width: "100%", background: "transparent", border: "1px solid #8A2E44", borderRadius: 8, padding: "10px 0", fontWeight: 600, fontSize: 13, color: "#8A2E44", cursor: "pointer" }}>
                  Clear all data
                </button>
              ) : (
                <div style={{ background: "rgba(138,46,68,0.1)", border: "1px solid #8A2E44", borderRadius: 10, padding: "14px" }}>
                  <p style={{ fontSize: 13, color: "#EDE4D3", margin: "0 0 12px", fontWeight: 600 }}>This deletes all quests, XP, streaks, and habits permanently. Are you sure?</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={clearAllData} className="qlog-btn" style={{ flex: 1, background: "#8A2E44", border: "none", borderRadius: 8, padding: "10px 0", fontWeight: 700, color: "#EDE4D3", cursor: "pointer" }}>Yes, clear everything</button>
                    <button onClick={() => setConfirmClear(false)} className="qlog-btn" style={{ background: "#141C27", border: "1px solid #33414F", borderRadius: 8, padding: "10px 14px", color: "#8A8578", cursor: "pointer" }}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Crate Shop Modal */}
        {crateModalOpen && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(10,14,20,0.82)", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => setCrateModalOpen(false)}>
            <div style={{ background: "#1B2430", border: "1px solid #33414F", borderRadius: 16, width: "100%", maxWidth: 400, position: "relative", maxHeight: "90vh", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>
              {/* Sticky header */}
              <div style={{ position: "sticky", top: 0, background: "#1B2430", borderRadius: "16px 16px 0 0", borderBottom: "1px solid #33414F", padding: "16px 22px 12px", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}><Coins size={15} color="#C9A227" /><span style={{ fontSize: 13, color: "#C9A227", fontWeight: 700, fontFamily: "ui-monospace, Menlo, monospace" }}>{gold}g</span></div>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, fontFamily: "Georgia, serif" }}>Crate Shop</h3>
                </div>
                <button onClick={() => setCrateModalOpen(false)} aria-label="Close" style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 8, padding: "6px 10px", color: "#EDE4D3", cursor: "pointer" }}><X size={16} /></button>
              </div>
              {/* Scrollable body */}
              <div style={{ overflowY: "auto", padding: "16px 22px 22px" }}>
              <p style={{ fontSize: 11, color: "#5C6773", margin: "0 0 18px" }}>Open crates to discover gear. Earn gold by completing quests.</p>

              {/* Last drop result */}
              {lastDrop && (
                <div style={{ background: RARITIES[lastDrop.item.rarity].glow, border: `1px solid ${RARITIES[lastDrop.item.rarity].color}`, borderRadius: 12, padding: "14px 16px", marginBottom: 18, textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 44, marginBottom: 6 }}>{lastDrop.item.icon(RARITIES[lastDrop.item.rarity].color)}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: RARITIES[lastDrop.item.rarity].color }}>{lastDrop.item.label}</div>
                  <div style={{ fontSize: 11, color: "#8A8578", margin: "3px 0" }}>{lastDrop.item.desc}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: RARITIES[lastDrop.item.rarity].color, textTransform: "uppercase", letterSpacing: 1 }}>
                    {RARITIES[lastDrop.item.rarity].label} · {lastDrop.isNew ? "✨ New item!" : "Duplicate"}
                  </div>
                  {!lastDrop.isNew && lastDrop.dupeGold > 0 && (
                    <div style={{ marginTop: 8, fontSize: 20, fontWeight: 700, color: "#C9A227", fontFamily: "ui-monospace, Menlo, monospace" }}>+{lastDrop.dupeGold}g</div>
                  )}
                  {lastDrop.isNew && (
                    <button onClick={() => { equipItem(lastDrop.item.id); setLastDrop(null); setCrateModalOpen(false); }} className="qlog-btn"
                      style={{ marginTop: 10, background: accent, border: "none", borderRadius: 8, padding: "7px 16px", fontSize: 12, fontWeight: 700, color: "#1B2430", cursor: "pointer" }}>
                      Equip now
                    </button>
                  )}
                  <button onClick={() => setLastDrop(null)} style={{ display: "block", margin: "8px auto 0", background: "none", border: "none", fontSize: 11, color: "#5C6773", cursor: "pointer" }}>Dismiss</button>
                </div>
              )}

              {/* Crate tiers */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {CRATE_TIERS.map((tier) => {
                  const canAfford = gold >= tier.cost;
                  return (
                    <div key={tier.id} style={{ background: "#232E3D", border: `1px solid ${tier.color}33`, borderRadius: 12, padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: 26 }}>{tier.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: tier.color }}>{tier.label}</div>
                          <div style={{ display: "flex", gap: 6, marginTop: 3, flexWrap: "wrap" }}>
                            {Object.entries(tier.weights).map(([r, w]) => w > 0 && (
                              <span key={r} style={{ fontSize: 9, fontWeight: 700, color: RARITIES[r].color, textTransform: "uppercase" }}>{RARITIES[r].label} {w}%</span>
                            ))}
                          </div>
                        </div>
                        <button onClick={() => openCrate(tier)} disabled={!canAfford} className="qlog-btn"
                          style={{ background: canAfford ? tier.color : "#2C3947", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 700, color: canAfford ? "#1B2430" : "#5C6773", cursor: canAfford ? "pointer" : "default" }}>
                          {tier.cost}g
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
              <p style={{ fontSize: 10, color: "#5C6773", margin: "14px 0 0", textAlign: "center" }}>Void and Celestial crates have boosted Legendary rates.</p>
              </div>{/* end scrollable body */}
            </div>
          </div>
        )}

        {/* Collection / Gear Modal */}
        {collectionOpen && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(10,14,20,0.85)", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }} onClick={() => { if (pickingSlot) { setPickingSlot(null); } else { setCollectionOpen(false); } }}>
            <div style={{ background: "#1B2430", border: "1px solid #33414F", borderRadius: 16, width: "100%", maxWidth: 480, maxHeight: "92vh", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>

              {/* Sticky header */}
              <div style={{ background: "#1B2430", borderRadius: "16px 16px 0 0", borderBottom: "1px solid #33414F", padding: "14px 18px 14px", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ margin: "0 0 2px", fontSize: 16, fontWeight: 700, fontFamily: "Georgia, serif" }}>
                      {pickingSlot ? `Choose ${SLOT_LABELS[pickingSlot]}` : "⚔ Gear & Collection"}
                    </h3>
                    <p style={{ fontSize: 10, color: "#5C6773", margin: 0 }}>
                      {pickingSlot ? "Tap an item to equip it" : `${inventory.length} / ${ITEM_CATALOGUE.length} items collected`}
                    </p>
                  </div>
                  <button onClick={() => pickingSlot ? setPickingSlot(null) : setCollectionOpen(false)}
                    style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 8, padding: "5px 9px", color: "#EDE4D3", cursor: "pointer" }}>
                    {pickingSlot ? <ChevronLeft size={15} /> : <X size={15} />}
                  </button>
                </div>
                {/* Collection progress — only on main view */}
                {!pickingSlot && (
                  <div style={{ height: 3, background: "#141C27", borderRadius: 2, overflow: "hidden", marginTop: 10 }}>
                    <div style={{ height: "100%", width: `${(inventory.length / ITEM_CATALOGUE.length) * 100}%`, background: `linear-gradient(90deg, #4C9A6A, ${accent})`, borderRadius: 2 }} />
                  </div>
                )}
              </div>

              <div ref={collectionScrollRef} style={{ overflowY: "auto", padding: "14px 18px 20px", flex: 1 }} key={pickingSlot || "main"}>

                {/* Active stats bar */}
                <div style={{ background: "#232E3D", border: `1px solid ${activeStats.activeSets.length > 0 ? "#C9A227" : "#33414F"}`, borderRadius: 10, padding: "9px 12px", marginBottom: 14, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  {activeStats.activeSets.length > 0 && activeStats.activeSets.map((s) => (
                    <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.color }} />
                      <span style={{ fontSize: 10, fontWeight: 700, color: s.color }}>{s.label}</span>
                    </div>
                  ))}
                  <span style={{ fontSize: 11, fontFamily: "ui-monospace, Menlo, monospace", color: accent }}>⚔ +{Math.round(activeStats.xpPct * 100)}% XP</span>
                  <span style={{ fontSize: 11, fontFamily: "ui-monospace, Menlo, monospace", color: "#C9A227" }}>💰 +{activeStats.goldFlat}g</span>
                  <span style={{ fontSize: 11, fontFamily: "ui-monospace, Menlo, monospace", color: "#4FA3C9" }}>🛡 {activeStats.defense + (playerStats.bonusDef || 0)}</span>
                  <span style={{ fontSize: 11, fontFamily: "ui-monospace, Menlo, monospace", color: "#8A2E44" }}>❤ {activeStats.maxHealth + (playerStats.bonusHp || 0)}</span>
                  {(activeStats.critChance + (playerStats.bonusCrit || 0)) > 0 && <span style={{ fontSize: 11, fontFamily: "ui-monospace, Menlo, monospace", color: "#C1652B" }}>💥 {Math.round((activeStats.critChance + (playerStats.bonusCrit || 0)) * 100)}% crit</span>}
                  {(playerStats.bonusAtk || 0) > 0 && <span style={{ fontSize: 11, fontFamily: "ui-monospace, Menlo, monospace", color: accent }}>+{playerStats.bonusAtk} ATK</span>}
                </div>

                {/* ---- SLOT PICKER VIEW ---- */}
                {pickingSlot && (() => {
                  const slotItems = ITEM_CATALOGUE
                    .filter((i) => i.slot === pickingSlot)
                    .sort((a, b) => RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity));
                  return (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 10 }}>
                      {slotItems.map((item) => {
                        const owned = inventory.includes(item.id);
                        const isEquipped = equipped[pickingSlot] === item.id;
                        const rar = RARITIES[item.rarity];
                        const hasBns = Object.values(item.bonuses || {}).some((v) => v > 0);
                        const itemSets = getItemSets(item.id);
                        return (
                          <div key={item.id} onClick={() => { if (owned) { equipItem(item.id); setPickingSlot(null); } }}
                            style={{ background: isEquipped ? rar.glow : owned ? "#232E3D" : "#1A2330", border: `1.5px solid ${isEquipped ? rar.color : owned ? rar.color + "55" : "#2C3947"}`, borderRadius: 12, padding: "12px 8px 8px", textAlign: "center", cursor: owned ? "pointer" : "default", position: "relative", opacity: owned ? 1 : 0.4 }}>
                            {/* Equipped dot */}
                            {isEquipped && <div style={{ position: "absolute", top: 5, right: 5, width: 7, height: 7, borderRadius: "50%", background: rar.color }} />}
                            {/* Icon */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 28, marginBottom: 4 }}>
                              {owned ? item.icon(rar.color) : <Lock size={16} color="#4A5563" />}
                            </div>
                            {/* Name */}
                            <div style={{ fontSize: 9, fontWeight: 700, color: owned ? rar.color : "#4A5563", lineHeight: 1.2, marginBottom: 2 }}>{owned ? item.label : "???"}</div>
                            {/* Rarity */}
                            <div style={{ fontSize: 8, color: owned ? rar.color + "99" : "#3A4552", marginBottom: 3 }}>{rar.label}</div>
                            {/* Bonuses */}
                            {owned && hasBns && (
                              <div style={{ fontSize: 8, color: "#4C9A6A", marginBottom: 2 }}>
                                {item.bonuses.xpPct ? `+${Math.round(item.bonuses.xpPct*100)}%XP ` : ""}
                                {item.bonuses.goldFlat ? `+${item.bonuses.goldFlat}g` : ""}
                              </div>
                            )}
                            {item.futureStats?.defense > 0 && owned && <div style={{ fontSize: 7, color: "#5C6773", marginBottom: 2 }}>DEF {item.futureStats.defense}</div>}
                            {item.futureStats?.critChance > 0 && owned && <div style={{ fontSize: 7, color: "#C1652B", marginBottom: 2 }}>💥 {Math.round(item.futureStats.critChance * 100)}% crit</div>}
                            {/* Set membership chips */}
                            {owned && itemSets.length > 0 && (
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center", marginTop: 2 }}>
                                {itemSets.map(({ set, ownedCount }) => (
                                  <span key={set.id} style={{ fontSize: 7, padding: "1px 4px", borderRadius: 10, background: set.color + "22", color: set.color, border: `1px solid ${set.color}44`, fontWeight: 700 }}>
                                    {set.label.replace(" Set","").replace(" Knight","").substring(0,8)} {ownedCount}/{set.items.length}
                                  </span>
                                ))}
                              </div>
                            )}
                            {!owned && <div style={{ fontSize: 7, color: "#4A5563", marginTop: 2 }}>Locked</div>}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* ---- MAIN SLOT CARD VIEW ---- */}
                {!pickingSlot && (
                  <div>
                    {/* Gear section */}
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#8A8578", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 0.8 }}>⚔ Gear</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 18 }}>
                      {GEAR_SLOTS.map((slot) => {
                        const equippedItem = equipped[slot] ? ITEM_CATALOGUE.find((i) => i.id === equipped[slot]) : null;
                        const rar = equippedItem ? RARITIES[equippedItem.rarity] : null;
                        const slotItems = ITEM_CATALOGUE.filter((i) => i.slot === slot).sort((a,b) => RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity));
                        const ownedCount = slotItems.filter((i) => inventory.includes(i.id)).length;
                        return (
                          <button key={slot} onClick={() => setPickingSlot(slot)} className="qlog-btn"
                            style={{ background: equippedItem ? rar.glow : "#232E3D", border: `1.5px solid ${equippedItem ? rar.color : "#33414F"}`, borderRadius: 12, padding: "12px 8px", textAlign: "center", cursor: "pointer", position: "relative" }}>
                            <div style={{ fontSize: 9, fontWeight: 700, color: "#8A8578", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>{SLOT_LABELS[slot]}</div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 26, marginBottom: 5 }}>
                              {equippedItem ? equippedItem.icon(rar.color) : <Plus size={16} color="#33414F" />}
                            </div>
                            <div style={{ fontSize: 9, fontWeight: 700, color: equippedItem ? rar.color : "#4A5563", lineHeight: 1.2 }}>{equippedItem ? equippedItem.label : "Empty"}</div>
                            <div style={{ fontSize: 8, color: "#5C6773", marginTop: 2 }}>{ownedCount}/{slotItems.length}</div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Cosmetics section */}
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#8A8578", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 0.8 }}>✨ Cosmetics</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                      {COSMETIC_SLOTS.map((slot) => {
                        const equippedItem = equipped[slot] ? ITEM_CATALOGUE.find((i) => i.id === equipped[slot]) : null;
                        const rar = equippedItem ? RARITIES[equippedItem.rarity] : null;
                        const slotItems = ITEM_CATALOGUE.filter((i) => i.slot === slot).sort((a,b) => RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity));
                        const ownedCount = slotItems.filter((i) => inventory.includes(i.id)).length;
                        return (
                          <button key={slot} onClick={() => setPickingSlot(slot)} className="qlog-btn"
                            style={{ background: equippedItem ? rar.glow : "#232E3D", border: `1.5px solid ${equippedItem ? rar.color : "#33414F"}`, borderRadius: 12, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", textAlign: "left" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, flexShrink: 0 }}>
                              {equippedItem ? equippedItem.icon(rar.color) : <Plus size={16} color="#33414F" />}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 9, fontWeight: 700, color: "#8A8578", textTransform: "uppercase", letterSpacing: 0.5 }}>{SLOT_LABELS[slot]}</div>
                              <div style={{ fontSize: 10, fontWeight: 700, color: equippedItem ? rar.color : "#4A5563", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{equippedItem ? equippedItem.label : "None"}</div>
                              {slot === "theme" && equippedItem && <div style={{ width: 8, height: 8, borderRadius: "50%", background: equippedItem.value, marginTop: 2 }} />}
                            </div>
                            <div style={{ fontSize: 8, color: "#5C6773", flexShrink: 0 }}>{ownedCount}/{slotItems.length}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}