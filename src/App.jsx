import { useState, useEffect, useRef } from "react";
import {
  Sym, Plus, Check, X, Play, Pause, RotateCcw, ChevronLeft, ChevronRight, ArrowRightLeft, Columns3, Rows3, Info,
  Sparkles, Wand2, Repeat, Crown, Coins, FileText, Lock, Scissors, Target, Gear, Flame, Trophy, Sword, Trash2,
  Timer, Loader2, Edit2, IconHome, IconCalendar, IconUser, IconUsers, IconDumbbell, IconStopwatch, IconAxe, IconStaff, IconScythe, IconShield, IconStar, IconDragon, IconSkull, IconCrown,
  IconTitle, IconPalette,
} from "./icons";
import {
  RARITIES, ITEM_CATALOGUE, SETS, computeActiveStats, CRATE_TIERS, RARITY_ORDER, GEAR_SLOTS, COSMETIC_SLOTS,
  SLOTS, SLOT_LABELS, DEFAULT_GEAR, rollCrate,
} from "./itemCatalogue";
import {
  MUSCLE_GROUPS, MUSCLE_LABELS, EQUIPMENT_TYPES, EQUIPMENT_LABELS, EXERCISE_CATALOGUE, findExercise, summarizeMuscleVolume,
} from "./exerciseCatalogue";
import {
  auth, onAuthChange, logOut, updateUsername, changePassword,
  saveProfile, getProfile, sendFriendRequest, listFriendRequests, declineFriendRequest, cancelFriendRequest, acceptFriendRequest, removeFriend,
} from "./firebase";
import AuthScreen from "./AuthScreen";

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
const WORKOUT_SET_XP = 2;
const WORKOUT_COMPLETE_XP = 20;
const DEFAULT_WORKOUT_SCHEDULE = { mon: null, tue: null, wed: null, thu: null, fri: null, sat: null, sun: null };

// ---- Exercise rank system ----
// Each exercise gets an all-time best "score" (estimated 1-rep max for weighted lifts,
// reps-adjusted for bodyweight moves), which places it on a 10-tier x 3-sublevel ladder
// (30 ranks total). Thresholds grow exponentially per rank so the top tiers take
// meaningfully more progress than the bottom ones.
const RANK_TIER_NAMES = ["Bronze", "Iron", "Silver", "Gold", "Platinum", "Diamond", "Master", "Grandmaster", "Champion", "Legend"];
const RANK_TIER_COLORS = ["#A9673A", "#8B8D91", "#B9C0C9", "#D4AF37", "#4FB0C6", "#5B8DEF", "#8A5FBF", "#C1652B", "#E0455A", "#C9A227"];
const RANK_SUBLABELS = ["III", "II", "I"];
const TOTAL_RANKS = RANK_TIER_NAMES.length * RANK_SUBLABELS.length; // 30

function shadeColor(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const clamp = (v) => Math.max(0, Math.min(255, v));
  const r = clamp((num >> 16) + Math.round(255 * percent));
  const g = clamp(((num >> 8) & 0xff) + Math.round(255 * percent));
  const b = clamp((num & 0xff) + Math.round(255 * percent));
  return "#" + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
}

const UNRANKED_COLOR = "#5C6773";

function rankInfo(idx) {
  if (idx == null || idx < 0) {
    return { idx: -1, label: "Unranked", tier: null, sub: null, color: UNRANKED_COLOR, isMax: false, unranked: true };
  }
  const clamped = Math.max(0, Math.min(idx, TOTAL_RANKS - 1));
  const tierIdx = Math.floor(clamped / 3);
  const subIdx = clamped % 3;
  // Each of the 30 ranks gets its own shade — tier sets the hue, sub-level (III/II/I) lightens it.
  const color = shadeColor(RANK_TIER_COLORS[tierIdx], (subIdx - 1) * 0.13);
  return { idx: clamped, label: `${RANK_TIER_NAMES[tierIdx]} ${RANK_SUBLABELS[subIdx]}`, tier: RANK_TIER_NAMES[tierIdx], sub: RANK_SUBLABELS[subIdx], color, isMax: clamped === TOTAL_RANKS - 1, unranked: false };
}

function getExerciseRankProfile(ex) {
  if (!ex) return null;
  const nameLower = (ex.name || "").toLowerCase();
  if (ex.equipment === "bodyweight") {
    const hard = /pull-up|chin-up|\bdip\b|muscle-up|pistol/.test(nameLower);
    const easy = ["quads", "glutes", "calves"].includes(ex.primaryMuscle);
    const base = hard ? 3 : easy ? 12 : 8;
    const growth = hard ? 1.24 : 1.19;
    return { mode: "reps", base, growth };
  }
  const compound = (ex.muscleGroups?.length || 1) >= 3;
  const BODYPART_BASE = { chest: 30, back: 32, shoulders: 16, quads: 40, hamstrings: 28, glutes: 32, biceps: 8, triceps: 10, calves: 18, abs: 6, forearms: 6, traps: 16, cardio: 6 };
  const base = Math.max(3, (BODYPART_BASE[ex.primaryMuscle] || 15) * (compound ? 1 : 0.55));
  const growth = compound ? 1.155 : 1.135;
  return { mode: "1rm", base, growth };
}

function computeSetScore(profile, weight, reps) {
  if (!profile) return 0;
  const w = Number(weight) || 0, r = Number(reps) || 0;
  if (r <= 0) return 0;
  if (profile.mode === "reps") return r + w * 0.5;
  if (w <= 0) return 0;
  return w * (1 + r / 30); // Epley estimated 1RM
}

function bestScoreForExercise(exerciseId, history, profile) {
  let best = 0;
  for (const h of history || []) {
    const entry = h.exercises?.find((e) => e.exerciseId === exerciseId);
    if (!entry) continue;
    for (const s of entry.sets || []) {
      const score = computeSetScore(profile, s.weight, s.reps);
      if (score > best) best = score;
    }
  }
  return best;
}

// From Master III (idx 18) onward, thresholds grow at only 10% of the normal rate —
// otherwise 30 ranks of pure compounding makes the top tiers require absurd numbers
// (e.g. an 800kg+ bench). This keeps Bronze-through-Diamond feeling like real
// progression while Master-through-Legend stays a plausible, if elite, ceiling.
const RANK_FLATTEN_FROM = 18;
const RANK_FLATTEN_FACTOR = 0.10;

function rankThreshold(profile, idx) {
  if (!profile || idx <= 0) return profile?.base || 0;
  const cut = Math.min(idx, RANK_FLATTEN_FROM);
  let mult = Math.pow(profile.growth, cut);
  if (idx > RANK_FLATTEN_FROM) {
    const flatGrowth = 1 + (profile.growth - 1) * RANK_FLATTEN_FACTOR;
    mult *= Math.pow(flatGrowth, idx - RANK_FLATTEN_FROM);
  }
  return profile.base * mult;
}

function rankIndexForScore(score, profile) {
  if (!profile || score <= 0) return 0;
  let idx = 0;
  while (idx < TOTAL_RANKS - 1 && score >= rankThreshold(profile, idx + 1)) idx++;
  return idx;
}

function rankProgress(score, profile, idx) {
  if (!profile || idx >= TOTAL_RANKS - 1) return 1;
  const cur = rankThreshold(profile, idx);
  const next = rankThreshold(profile, idx + 1);
  return Math.max(0, Math.min(1, (score - cur) / (next - cur)));
}

function computeExerciseRankRows(history, customExercises) {
  const attemptedIds = [...new Set((history || []).flatMap((h) => (h.exercises || []).map((e) => e.exerciseId)))];
  return attemptedIds.map((id) => {
    const ex = findExercise(id, customExercises);
    const profile = getExerciseRankProfile(ex);
    const score = bestScoreForExercise(id, history, profile);
    const idx = rankIndexForScore(score, profile);
    const info = rankInfo(idx);
    const progress = rankProgress(score, profile, idx);
    return { id, ex, profile, score, idx, info, progress };
  }).sort((a, b) => b.idx - a.idx || (a.ex?.name || "").localeCompare(b.ex?.name || ""));
}

// Overall rank rewards being strong across several exercises (not just one lucky lift) — it
// averages your best ranks (capped, so a handful of good lifts is enough to place well) plus
// a small, capped bonus for having ranked in a wide variety of exercises.
function computeOverallRank(rows) {
  if (!rows || rows.length === 0) return null;
  const continuous = rows.map((r) => r.idx + r.progress).sort((a, b) => b - a);
  const top = continuous.slice(0, Math.min(8, continuous.length));
  const avg = top.reduce((s, v) => s + v, 0) / top.length;
  const breadthBonus = Math.min(rows.length, 15) * 0.08;
  const combined = Math.max(0, Math.min(TOTAL_RANKS - 0.001, avg + breadthBonus));
  const idx = Math.min(TOTAL_RANKS - 1, Math.floor(combined));
  const progress = Math.max(0, Math.min(1, combined - idx));
  return { idx, progress, info: rankInfo(idx), exerciseCount: rows.length };
}
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
const MISSED_PENALTY_PCT = 0.25;

function habitTier(streakDays) {
  if (streakDays >= 66) return { label: "Diamond", color: "#4FA3C9" };
  if (streakDays >= 21) return { label: "Gold", color: "#C9A227" };
  if (streakDays >= 7) return { label: "Silver", color: "#B8C4CE" };
  if (streakDays >= 3) return { label: "Bronze", color: "#C1652B" };
  return { label: null, color: "#5C6773" };
}
const HABIT_TIER_DAYS = [3, 7, 21, 66];
function nextHabitMilestone(streakDays) {
  return HABIT_TIER_DAYS.find((d) => d > streakDays) || null;
}
// Last 7 days as filled/empty dots, inferred from the current streak (which
// is always contiguous by construction) rather than a stored history log.
function habitStreakDots(habit, today) {
  const rangeEnd = habit.lastCompletedDate === today ? today
    : habit.lastCompletedDate === addDaysLocal(today, -1) ? addDaysLocal(today, -1)
    : null;
  const rangeStart = rangeEnd && habit.streak > 0 ? addDaysLocal(rangeEnd, -(habit.streak - 1)) : null;
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = addDaysLocal(today, -i);
    days.push({ date: d, filled: !!(rangeStart && d >= rangeStart && d <= rangeEnd), isToday: d === today });
  }
  return days;
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
function nowHHMM() { const d = new Date(); return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`; }
function formatDeadline(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${pad2(m)} ${period}`;
}
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
function extractJson(text) {
  const cleaned = text.replace(/```json|```/g, "").trim();
  // If the response is a top-level object, prefer matching that whole — otherwise a naive
  // array regex would grab a nested array (e.g. {"plans":[...],"schedule":{...}}) instead.
  const preferObject = cleaned.startsWith("{");
  const tryArray = () => { const m = cleaned.match(/\[[\s\S]*\]/); if (m) { try { JSON.parse(m[0]); return m[0]; } catch (_) {} } return null; };
  const tryObject = () => { const m = cleaned.match(/\{[\s\S]*\}/); if (m) { try { JSON.parse(m[0]); return m[0]; } catch (_) {} } return null; };
  const first = preferObject ? tryObject() : tryArray();
  if (first) return first;
  const second = preferObject ? tryArray() : tryObject();
  if (second) return second;
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
    const idToken = await auth.currentUser?.getIdToken();
    response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}) },
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
  if (response.status === 401) throw new Error("Not signed in — please log in again.");
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

async function getExerciseGuide(exerciseName, primaryMuscle, equipment) {
  const clean = await callQuestAI(
    `Explain how to correctly perform the exercise "${exerciseName}" (primary muscle: ${primaryMuscle}, equipment: ${equipment}). Output ONLY a JSON object, nothing else — no prose, no markdown, no backticks.
Give 4-7 short, clear, numbered setup-to-finish steps (each under 20 words) and 1-3 short form-safety tips.
{"steps":["Step one...","Step two..."],"tips":["Tip one..."]}`,
    30000, 1200
  );
  const parsed = JSON.parse(clean);
  if (!Array.isArray(parsed.steps) || parsed.steps.length === 0) throw new Error("bad response");
  return {
    steps: parsed.steps.slice(0, 8).map((s) => String(s).slice(0, 140)),
    tips: Array.isArray(parsed.tips) ? parsed.tips.slice(0, 4).map((s) => String(s).slice(0, 140)) : [],
  };
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

const SPLIT_LABELS = {
  auto: "whatever split best fits the days per week",
  full_body: "Full Body every session",
  upper_lower: "an Upper/Lower split",
  ppl: "a Push/Pull/Legs split",
  bro: "a Bro split (one muscle group focus per day)",
};

async function generateWorkoutPlan({ daysPerWeek, splitType, experience, goal }, availableExercises) {
  const exerciseList = availableExercises.slice(0, 120).map((e) => ({ id: e.id, name: e.name, muscle: e.primaryMuscle, equipment: e.equipment }));

  const clean = await callQuestAI(`INSTRUCTIONS: Output ONLY a JSON object, nothing else — no prose, no explanation, no markdown, no backticks, no commentary before or after.

Design a ${daysPerWeek}-day-per-week workout program for a ${experience} lifter. Goal: ${goal}. Split style: ${SPLIT_LABELS[splitType] || SPLIT_LABELS.auto}.

ONLY use exercises from this list, referenced by their exact "id" field. Never invent an id that isn't in this list — pick the closest real match instead.
${JSON.stringify(exerciseList)}

Rules:
- Create between 1 and ${daysPerWeek} distinct workout plans. A plan may repeat across multiple training days if the split calls for it (e.g. alternating Upper/Lower).
- Each plan needs 4-7 exercises with sensible muscle-group balance for its focus.
- sets: 3-5. targetReps: a short range string like "8-12". restSeconds: 45-120, lower for isolation work, higher for big compound lifts.
- Assign exactly ${daysPerWeek} weekdays (keys from: mon,tue,wed,thu,fri,sat,sun) to plans in "schedule", spreading them out with rest days between when it makes sense for recovery. Omit rest days from "schedule" entirely — only include training days.

OUTPUT FORMAT (nothing else):
{"plans":[{"name":"Push Day","exercises":[{"exerciseId":"bb-bench-press","sets":4,"targetReps":"8-10","restSeconds":90}]}],"schedule":{"mon":"Push Day","thu":"Push Day"}}`, 60000, 8192);

  const parsed = JSON.parse(clean);
  if (!parsed || !Array.isArray(parsed.plans)) throw new Error("bad response");

  const validIds = new Set(availableExercises.map((e) => e.id));
  const plans = parsed.plans
    .filter((p) => p && p.name && Array.isArray(p.exercises))
    .map((p) => ({
      name: String(p.name).slice(0, 40),
      exercises: p.exercises
        .filter((ex) => ex && validIds.has(ex.exerciseId))
        .slice(0, 10)
        .map((ex) => ({
          exerciseId: ex.exerciseId,
          sets: Math.min(8, Math.max(1, Math.round(Number(ex.sets) || 3))),
          targetReps: ex.targetReps ? String(ex.targetReps).slice(0, 12) : "8-12",
          restSeconds: Math.min(300, Math.max(15, Math.round(Number(ex.restSeconds) || 60))),
        })),
    }))
    .filter((p) => p.exercises.length > 0)
    .slice(0, 7);
  if (plans.length === 0) throw new Error("no valid plans");

  const planNames = new Set(plans.map((p) => p.name));
  const dayKeys = new Set(DAYS.map((d) => d.key));
  const schedule = {};
  if (parsed.schedule && typeof parsed.schedule === "object") {
    for (const [day, planName] of Object.entries(parsed.schedule)) {
      if (dayKeys.has(day) && planNames.has(planName)) schedule[day] = planName;
    }
  }
  return { plans, schedule };
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

function SettingsSection({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ border: "1px solid #33414F", borderRadius: 10, overflow: "hidden", marginBottom: 10 }}>
      <button type="button" onClick={() => setOpen((o) => !o)} className="qlog-btn" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#1F2836", border: "none", padding: "12px 14px", cursor: "pointer" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#8A8578", letterSpacing: 0.5 }}>{title}</span>
        <ChevronRight size={14} color="#8A8578" style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform 0.15s ease" }} />
      </button>
      {open && <div style={{ padding: 14 }}>{children}</div>}
    </div>
  );
}

function InfoButton({ onClick, accent = "#C9A227", size = 13 }) {
  return (
    <button onClick={onClick} aria-label="How to perform" title="How to perform" className="qlog-btn"
      style={{ width: size + 11, height: size + 11, borderRadius: "50%", background: accent + "20", border: `1px solid ${accent}55`, color: accent, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0, lineHeight: 1 }}>
      <Info size={size} />
    </button>
  );
}

function WorkoutSetRow({ setNum, set, accent, onLog, onUncomplete }) {
  const [weight, setWeight] = useState(set.weight || "");
  const [reps, setReps] = useState(set.reps || "");
  if (set.completed) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#1F2836", border: "1px solid #2C3947", borderRadius: 8, padding: "7px 10px" }}>
        <button onClick={onUncomplete} className="qlog-btn" style={{ width: 18, height: 18, minWidth: 18, borderRadius: "50%", background: "#4C9A6A", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Check size={10} color="#141C27" /></button>
        <span style={{ fontSize: 11, color: "#5C6773", width: 46 }}>Set {setNum}</span>
        <span style={{ fontSize: 13, color: "#EDE4D3", fontFamily: "ui-monospace, Menlo, monospace" }}>{set.weight || 0} × {set.reps || 0}</span>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#1F2836", border: "1px solid #2C3947", borderRadius: 8, padding: "6px 8px" }}>
      <span style={{ fontSize: 11, color: "#5C6773", width: 46, flexShrink: 0 }}>Set {setNum}</span>
      <input type="number" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="kg" style={{ flex: 1, minWidth: 0, background: "#141C27", border: "1px solid #33414F", borderRadius: 6, padding: "6px 8px", color: "#EDE4D3", fontSize: 12 }} />
      <input type="number" inputMode="numeric" value={reps} onChange={(e) => setReps(e.target.value)} placeholder="reps" style={{ flex: 1, minWidth: 0, background: "#141C27", border: "1px solid #33414F", borderRadius: 6, padding: "6px 8px", color: "#EDE4D3", fontSize: 12 }} />
      <button onClick={() => onLog(weight, reps)} disabled={!weight || !reps} className="qlog-btn" style={{ width: 28, height: 28, minWidth: 28, borderRadius: "50%", border: `2px solid ${!weight || !reps ? "#33414F" : accent}`, background: "transparent", cursor: !weight || !reps ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={13} color={!weight || !reps ? "#33414F" : accent} /></button>
    </div>
  );
}

function AppContent({ user }) {
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
  const [habits, setHabits] = useState([]);
  const [habitPerfectDayDate, setHabitPerfectDayDate] = useState(null);
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitDeadline, setNewHabitDeadline] = useState("");
  const [habitBanner, setHabitBanner] = useState(null);
  const [perfectDayBanner, setPerfectDayBanner] = useState(false);
  const [habitXpPop, setHabitXpPop] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [, setClockTick] = useState(0);
  const [activeTab, setActiveTab] = useState("home"); // "home" | "quests" | "habits" | "workout" | "gear"
  const [fabMenuOpen, setFabMenuOpen] = useState(false);

  // Workout state
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [workoutSchedule, setWorkoutSchedule] = useState(DEFAULT_WORKOUT_SCHEDULE);
  const [workoutSession, setWorkoutSession] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [customExercises, setCustomExercises] = useState([]);
  const [autoRestTimer, setAutoRestTimer] = useState(true);
  const [activeWorkoutTab, setActiveWorkoutTab] = useState("today"); // "today" | "plans" | "schedule" | "history"
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [exercisePickerFor, setExercisePickerFor] = useState(null); // planId while picking an exercise to add
  const [exercisePickerFilter, setExercisePickerFilter] = useState({ muscle: null, equipment: null, q: "" });
  const [newPlanName, setNewPlanName] = useState("");
  const [customExerciseForm, setCustomExerciseForm] = useState(null); // { name, primaryMuscle, equipment } while adding a custom exercise
  const [workoutXpPop, setWorkoutXpPop] = useState(null);
  const [historyExerciseId, setHistoryExerciseId] = useState(null); // set to view per-exercise progress
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);
  const [sessionOverlayOpen, setSessionOverlayOpen] = useState(false);
  const [discardConfirmOpen, setDiscardConfirmOpen] = useState(false);
  const [, setWorkoutClockTick] = useState(0);
  const [aiEquipment, setAiEquipment] = useState([...EQUIPMENT_TYPES]);
  const [aiDaysPerWeek, setAiDaysPerWeek] = useState(3);
  const [aiSplitType, setAiSplitType] = useState("auto");
  const [aiExperience, setAiExperience] = useState("beginner");
  const [aiGoal, setAiGoal] = useState("general");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [aiPreview, setAiPreview] = useState(null); // { plans, schedule } once generated, before the user applies it
  const [exerciseGuides, setExerciseGuides] = useState({}); // exerciseId -> { steps: [], tips: [] }, cached AI how-to
  const [guideModalExerciseId, setGuideModalExerciseId] = useState(null);
  const [guideLoadingId, setGuideLoadingId] = useState(null);
  const [guideError, setGuideError] = useState(null);
  const [exerciseBrowseFilter, setExerciseBrowseFilter] = useState({ muscle: null, equipment: null, q: "" });
  const [rankLeaderboardId, setRankLeaderboardId] = useState(null);
  const [rankInfoModalOpen, setRankInfoModalOpen] = useState(false);

  // Calendar state
  const [calView, setCalView] = useState("week"); // "day" | "week" | "month"
  const [calAnchor, setCalAnchor] = useState(todayStr()); // focused date
  const [selectedDate, setSelectedDate] = useState(todayStr());

  // UI state
  const [showCompleted, setShowCompleted] = useState(true);
  const [questFilterOpen, setQuestFilterOpen] = useState(false);
  const [questSearch, setQuestSearch] = useState("");
  const [questDifficultyFilter, setQuestDifficultyFilter] = useState([]); // empty = all difficulties
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

  const [splittingId, setSplittingId] = useState(null);
  const [splitError, setSplitError] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [usernameInput, setUsernameInput] = useState(user?.displayName || "");
  const [usernameMsg, setUsernameMsg] = useState(null);
  const [usernameBusy, setUsernameBusy] = useState(false);
  const [myUsername, setMyUsername] = useState(user?.displayName || "");

  // Friends
  const [activeFriendsTab, setActiveFriendsTab] = useState("friends"); // "friends" | "requests" | "add"
  const [friendIds, setFriendIds] = useState([]);
  const [friendsData, setFriendsData] = useState({}); // uid -> profile
  const [friendsLoading, setFriendsLoading] = useState(false);
  const [friendRequests, setFriendRequests] = useState({ incoming: [], outgoing: [] });
  const [friendSearchInput, setFriendSearchInput] = useState("");
  const [friendSearchMsg, setFriendSearchMsg] = useState(null);
  const [friendSearchBusy, setFriendSearchBusy] = useState(false);
  const [selectedFriendUid, setSelectedFriendUid] = useState(null);
  const [friendsRefreshTick, setFriendsRefreshTick] = useState(0);
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [passwordMsg, setPasswordMsg] = useState(null);
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [moveMenuFor, setMoveMenuFor] = useState(null);
  const [questDetailFor, setQuestDetailFor] = useState(null);
  const [deleteSeriesPromptFor, setDeleteSeriesPromptFor] = useState(null); // { id, seriesId, title }
  const [dragOverDate, setDragOverDate] = useState(null);
  const [dragOverTrash, setDragOverTrash] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragIdRef = useRef(null);
  const [confettiPieces, setConfettiPieces] = useState([]);
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
        setWorkoutPlans(data.workoutPlans || []);
        setWorkoutSchedule(data.workoutSchedule || DEFAULT_WORKOUT_SCHEDULE);
        setWorkoutHistory(data.workoutHistory || []);
        setCustomExercises(data.customExercises || []);
        setAutoRestTimer(data.autoRestTimer === undefined ? true : data.autoRestTimer);
        setExerciseGuides(data.exerciseGuides || {});
        if (data.workoutSession) {
          const s = data.workoutSession;
          if (s.restTimer && s.restTimer.running && s.restTimer.endsAt) {
            const remaining = Math.floor((s.restTimer.endsAt - Date.now()) / 1000);
            setWorkoutSession({ ...s, restTimer: remaining > 0 ? { ...s.restTimer, secondsLeft: remaining } : null });
          } else {
            setWorkoutSession(s);
          }
        }
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
          { id: Date.now() + 0.1, name: "Make the bed", streak: 0, lastCompletedDate: null, totalCompletions: 0, undo: null, deadlineTime: null },
          { id: Date.now() + 0.2, name: "Brush teeth", streak: 0, lastCompletedDate: null, totalCompletions: 0, undo: null, deadlineTime: null },
          { id: Date.now() + 0.3, name: "Wash face", streak: 0, lastCompletedDate: null, totalCompletions: 0, undo: null, deadlineTime: null },
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
          quests, totalXP, gold, streak, lastActiveDate, weekStart, weeklyBossId, inventory, equipped, playerStats, statHistory, shifts,
          habits, habitPerfectDayDate, calView, pendingBattle, battleState, focus,
          workoutPlans, workoutSchedule, workoutSession, workoutHistory, customExercises, autoRestTimer, exerciseGuides,
        }));
      } catch (e) { console.error("save failed", e); }
    }, 150);
  }, [quests, totalXP, gold, streak, lastActiveDate, weekStart, weeklyBossId, inventory, equipped, playerStats, statHistory, shifts, habits, habitPerfectDayDate, calView, pendingBattle, battleState, focus, loaded, workoutPlans, workoutSchedule, workoutSession, workoutHistory, customExercises, autoRestTimer, exerciseGuides]);

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
        setWorkoutPlans(data.workoutPlans || []);
        setWorkoutSchedule(data.workoutSchedule || DEFAULT_WORKOUT_SCHEDULE);
        setWorkoutSession(data.workoutSession || null);
        setWorkoutHistory(data.workoutHistory || []);
        setCustomExercises(data.customExercises || []);
        setAutoRestTimer(data.autoRestTimer === undefined ? true : data.autoRestTimer);
        setExerciseGuides(data.exerciseGuides || {});
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
  // ---- Tick every minute so habit deadlines flip to "late" live ----
  useEffect(() => {
    const id = setInterval(() => setClockTick((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, []);
  // ---- Workout rest-timer countdown ----
  useEffect(() => {
    if (!workoutSession?.restTimer?.running) return;
    const id = setInterval(() => {
      setWorkoutSession((s) => {
        if (!s || !s.restTimer) return s;
        const remaining = Math.round((s.restTimer.endsAt - Date.now()) / 1000);
        if (remaining <= 0) return { ...s, restTimer: null };
        return { ...s, restTimer: { ...s.restTimer, secondsLeft: remaining } };
      });
    }, 1000);
    return () => clearInterval(id);
  }, [workoutSession?.restTimer?.running, workoutSession?.restTimer?.endsAt]);
  // ---- Workout session elapsed-time tick ----
  useEffect(() => {
    if (!workoutSession) return;
    const id = setInterval(() => setWorkoutClockTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [workoutSession?.startedAt]);
  // ---- Mirror the shareable subset of data to profiles/{uid} for friends ----
  useEffect(() => {
    if (!loaded || !myUsername) return;
    const timer = setTimeout(() => {
      saveProfile({
        username: myUsername,
        level: levelFromXP(totalXP).level,
        totalXP, streak, lastActiveDate,
        equipped, workoutPlans,
        workoutHistory: workoutHistory.slice(0, 10),
        updatedAt: Date.now(),
      });
    }, 800);
    return () => clearTimeout(timer);
  }, [loaded, myUsername, totalXP, streak, lastActiveDate, equipped, workoutPlans, workoutHistory]);

  // ---- Re-sync the username from Firebase on mount ----
  // The `user` prop can be a snapshot taken by onAuthStateChanged before a
  // just-completed sign-up's updateProfile(displayName) call has finished —
  // that event fires as soon as the account exists, not after the profile
  // update, so `user.displayName` here can still be empty even though a
  // username really was set moments earlier. reload() pulls the current
  // value straight from Firebase so the Friends tab's "set a username"
  // prompt doesn't show for someone who already has one.
  useEffect(() => {
    (async () => {
      try {
        await auth.currentUser?.reload();
        const name = auth.currentUser?.displayName;
        if (name) { setMyUsername(name); setUsernameInput(name); }
      } catch (e) {}
    })();
  }, []);

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

  // ---- Carry missed quests forward to today, flagged for a reduced-XP penalty ----
  useEffect(() => {
    if (!loaded) return;
    setQuests((qs) => {
      let changed = false;
      const next = qs.map((q) => {
        if (!q.completed && q.date < today) {
          changed = true;
          return { ...q, date: today, missedPenalty: true };
        }
        return q;
      });
      return changed ? next : qs;
    });
  }, [loaded, today]);

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

  // ---- Home tab snapshot data ----
  const todayQuestsTotal = quests.filter((q) => q.date === today).length;
  const todayHabitsDone = habits.filter((h) => h.lastCompletedDate === today).length;
  const weekCompletedQuests = quests.filter((q) => q.completed && q.completedAt >= weekStart);
  const weekXP = weekCompletedQuests.reduce((sum, q) => sum + (q.xp || 0), 0);
  const recentCompleted = quests.filter((q) => q.completed && q.completedAt).sort((a, b) => (a.completedAt < b.completedAt ? 1 : a.completedAt > b.completedAt ? -1 : b.id - a.id)).slice(0, 5);
  const recentDateLabel = (d) => d === today ? "Today" : d === yesterdayStr() ? "Yesterday" : parseLocalDate(d).toLocaleDateString(undefined, { day: "numeric", month: "short" });

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

  function matchesQuestFilter(q) {
    if (questDifficultyFilter.length > 0 && !questDifficultyFilter.includes(q.difficulty)) return false;
    if (questSearch.trim() && !q.title.toLowerCase().includes(questSearch.trim().toLowerCase())) return false;
    return true;
  }
  function questsForDate(date) {
    return quests.filter((q) => q.date === date && (showCompleted || !q.completed) && matchesQuestFilter(q));
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
    const baseXP = quest.missedPenalty ? Math.round(quest.xp * (1 - MISSED_PENALTY_PCT)) : quest.xp;
    const workXP = baseXP + beatClockBonus + bossBonus;
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
    const steppedHabits = habits.map((h) => h.id === id ? { ...h, streak: newStreak, lastCompletedDate: today, totalCompletions: h.totalCompletions + 1, completionLog: [...(h.completionLog || []), today].slice(-120) } : h);
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
    setHabits((hs) => hs.map((h) => h.id === id ? { ...h, streak: u.prevStreak, lastCompletedDate: u.prevLastCompletedDate, totalCompletions: Math.max(0, h.totalCompletions - 1), undo: null, completionLog: (h.completionLog || []).filter((d) => d !== today) } : h));
  }
  function addHabit(name, deadlineTime = "") {
    const trimmed = name.trim();
    if (!trimmed) return;
    setHabits((hs) => [...hs, { id: Date.now() + Math.random(), name: trimmed, streak: 0, lastCompletedDate: null, totalCompletions: 0, undo: null, deadlineTime: deadlineTime || null, completionLog: [] }]);
    setNewHabitName("");
    setNewHabitDeadline("");
  }
  function deleteHabit(id) { setHabits((hs) => hs.filter((h) => h.id !== id)); }
  function setHabitDeadline(id, deadlineTime) {
    setHabits((hs) => hs.map((h) => h.id === id ? { ...h, deadlineTime: deadlineTime || null } : h));
  }

  // ---- Workout: plan CRUD ----
  function addWorkoutPlan(name) {
    const trimmed = name.trim();
    if (!trimmed) return;
    const id = Date.now() + Math.random();
    setWorkoutPlans((ps) => [...ps, { id, name: trimmed, exercises: [] }]);
    setNewPlanName("");
    setEditingPlanId(id);
  }
  function deleteWorkoutPlan(id) {
    setWorkoutPlans((ps) => ps.filter((p) => p.id !== id));
    setWorkoutSchedule((s) => {
      const next = { ...s };
      for (const day of Object.keys(next)) if (next[day] === id) next[day] = null;
      return next;
    });
    if (editingPlanId === id) setEditingPlanId(null);
  }
  function addExerciseToPlan(planId, exerciseId) {
    setWorkoutPlans((ps) => ps.map((p) => p.id === planId
      ? { ...p, exercises: [...p.exercises, { id: Date.now() + Math.random(), exerciseId, sets: 3, targetReps: "8-12", restSeconds: 90, targetWeight: "" }] }
      : p));
    setExercisePickerFor(null);
    setExercisePickerFilter({ muscle: null, equipment: null, q: "" });
  }
  function updatePlanExercise(planId, exId, patch) {
    setWorkoutPlans((ps) => ps.map((p) => p.id === planId
      ? { ...p, exercises: p.exercises.map((e) => e.id === exId ? { ...e, ...patch } : e) }
      : p));
  }
  function removePlanExercise(planId, exId) {
    setWorkoutPlans((ps) => ps.map((p) => p.id === planId ? { ...p, exercises: p.exercises.filter((e) => e.id !== exId) } : p));
  }
  function addCustomExercise(form) {
    const trimmed = (form.name || "").trim();
    if (!trimmed || !form.primaryMuscle || !form.equipment) return null;
    const id = "custom-" + Date.now() + Math.random();
    const ex = { id, name: trimmed, equipment: form.equipment, primaryMuscle: form.primaryMuscle, muscleGroups: [form.primaryMuscle], category: "custom" };
    setCustomExercises((cs) => [...cs, ex]);
    setCustomExerciseForm(null);
    return id;
  }
  function setScheduleDay(dayKey, planId) {
    setWorkoutSchedule((s) => ({ ...s, [dayKey]: planId || null }));
  }

  // ---- Workout: active session ----
  function startWorkout(plan) {
    const exercises = plan.exercises.map((pe) => {
      const ex = findExercise(pe.exerciseId, customExercises);
      return {
        exerciseId: pe.exerciseId, name: ex?.name || "Exercise", restSeconds: pe.restSeconds || 90, targetReps: pe.targetReps || "",
        sets: Array.from({ length: pe.sets || 3 }, () => ({ weight: pe.targetWeight || "", reps: "", completed: false })),
      };
    });
    setWorkoutSession({ planId: plan.id, planName: plan.name, startedAt: Date.now(), exercises, restTimer: null, setsXp: 0 });
    setSessionOverlayOpen(true);
  }
  function startRestTimer(seconds, exIdx, setIdx) {
    if (!seconds || seconds <= 0) return;
    const endsAt = Date.now() + seconds * 1000;
    setWorkoutSession((s) => s ? { ...s, restTimer: { totalSeconds: seconds, secondsLeft: seconds, endsAt, running: true, exerciseIdx: exIdx, setIdx } } : s);
  }
  function adjustRestTimer(deltaSeconds) {
    setWorkoutSession((s) => {
      if (!s || !s.restTimer) return s;
      const newEndsAt = s.restTimer.endsAt + deltaSeconds * 1000;
      const secondsLeft = Math.max(0, Math.round((newEndsAt - Date.now()) / 1000));
      if (secondsLeft <= 0) return { ...s, restTimer: null };
      return { ...s, restTimer: { ...s.restTimer, endsAt: newEndsAt, secondsLeft } };
    });
  }
  function skipRestTimer() {
    setWorkoutSession((s) => s ? { ...s, restTimer: null } : s);
  }
  function logSet(exIdx, setIdx, weight, reps, restSeconds) {
    setWorkoutSession((s) => {
      if (!s) return s;
      const exercises = s.exercises.map((e, i) => i !== exIdx ? e : {
        ...e, sets: e.sets.map((st, j) => j !== setIdx ? st : { ...st, weight, reps, completed: true }),
      });
      const nextSetsXp = (s.setsXp || 0) + WORKOUT_SET_XP;
      const restTimer = autoRestTimer ? { totalSeconds: restSeconds, secondsLeft: restSeconds, endsAt: Date.now() + restSeconds * 1000, running: true, exerciseIdx: exIdx, setIdx } : s.restTimer;
      if (weight !== "" && weight != null) {
        const exerciseId = s.exercises[exIdx].exerciseId;
        setWorkoutPlans((ps) => ps.map((p) => p.id !== s.planId ? p : {
          ...p, exercises: p.exercises.map((pe) => pe.exerciseId === exerciseId ? { ...pe, targetWeight: weight } : pe),
        }));
      }
      return { ...s, exercises, setsXp: nextSetsXp, restTimer };
    });
    setTotalXP((t) => t + WORKOUT_SET_XP);
    setWorkoutXpPop({ key: `${exIdx}-${setIdx}-${Date.now()}`, xp: WORKOUT_SET_XP });
    setTimeout(() => setWorkoutXpPop(null), 900);
  }
  function uncompleteSet(exIdx, setIdx) {
    setWorkoutSession((s) => {
      if (!s) return s;
      const exercises = s.exercises.map((e, i) => i !== exIdx ? e : {
        ...e, sets: e.sets.map((st, j) => j !== setIdx ? st : { ...st, completed: false }),
      });
      return { ...s, exercises, setsXp: Math.max(0, (s.setsXp || 0) - WORKOUT_SET_XP) };
    });
    setTotalXP((t) => Math.max(0, t - WORKOUT_SET_XP));
  }
  function finishWorkout() {
    if (!workoutSession) return;
    const completedSets = workoutSession.exercises.reduce((sum, e) => sum + e.sets.filter((s) => s.completed).length, 0);
    if (completedSets === 0) { setWorkoutSession(null); return; }
    const durationSeconds = Math.max(1, Math.floor((Date.now() - workoutSession.startedAt) / 1000));
    const totalVolume = workoutSession.exercises.reduce((sum, e) => sum + e.sets.reduce((s2, st) => s2 + (st.completed ? (Number(st.weight) || 0) * (Number(st.reps) || 0) : 0), 0), 0);
    const prevLevel = levelFromXP(totalXP).level;
    const xpGain = WORKOUT_COMPLETE_XP;
    const goldEarned = Math.max(1, Math.round(xpGain / 10));
    const newTotal = totalXP + xpGain;
    const newLevel = levelFromXP(newTotal).level;
    setTotalXP(newTotal);
    setGold((g) => g + goldEarned);
    const historyEntry = {
      id: Date.now() + Math.random(), planId: workoutSession.planId, planName: workoutSession.planName, date: todayStr(),
      durationSeconds, totalVolume, xpEarned: (workoutSession.setsXp || 0) + xpGain, goldEarned,
      exercises: workoutSession.exercises.map((e) => ({ exerciseId: e.exerciseId, name: e.name, sets: e.sets.filter((s) => s.completed).map((s) => ({ weight: Number(s.weight) || 0, reps: Number(s.reps) || 0 })) })),
    };
    setWorkoutHistory((h) => [historyEntry, ...h]);
    setWorkoutXpPop({ key: "complete-" + Date.now(), xp: xpGain });
    setTimeout(() => setWorkoutXpPop(null), 1200);
    if (newLevel > prevLevel) { spawnConfetti(); setStatChoiceQueue((q) => [...q, { level: newLevel, rank: rankForLevel(newLevel) }]); }
    setWorkoutSession(null);
    setSessionOverlayOpen(false);
  }
  function discardWorkout() { setWorkoutSession(null); setSessionOverlayOpen(false); }
  function deleteWorkoutHistoryEntry(id) { setWorkoutHistory((h) => h.filter((e) => e.id !== id)); }

  function openExerciseGuide(ex) {
    if (!ex) return;
    setGuideModalExerciseId(ex.id);
    setGuideError(null);
    if (exerciseGuides[ex.id]) return;
    setGuideLoadingId(ex.id);
    getExerciseGuide(ex.name, ex.primaryMuscle, ex.equipment)
      .then((guide) => setExerciseGuides((g) => ({ ...g, [ex.id]: guide })))
      .catch((e) => { console.error("getExerciseGuide failed:", e); setGuideError(e?.message ? `Couldn't load instructions: ${e.message}` : "Couldn't load instructions right now. Try again."); })
      .finally(() => setGuideLoadingId(null));
  }

  async function handleGenerateWorkout() {
    if (aiGenerating) return;
    setAiGenerating(true);
    setAiError(null);
    setAiPreview(null);
    const availableExercises = [...EXERCISE_CATALOGUE, ...customExercises].filter((e) => aiEquipment.includes(e.equipment));
    if (availableExercises.length === 0) {
      setAiGenerating(false);
      setAiError("Select at least one equipment type you have access to.");
      return;
    }
    generateWorkoutPlan({ daysPerWeek: aiDaysPerWeek, splitType: aiSplitType, experience: aiExperience, goal: aiGoal }, availableExercises)
      .then((result) => setAiPreview(result))
      .catch((e) => { console.error("generateWorkoutPlan failed:", e); setAiError(e?.message ? `Couldn't generate a plan: ${e.message}` : "Couldn't generate a plan right now. Try again in a moment."); })
      .finally(() => setAiGenerating(false));
  }

  function applyGeneratedWorkout() {
    if (!aiPreview) return;
    const nameToId = {};
    const newPlans = aiPreview.plans.map((p) => {
      const id = Date.now() + Math.random();
      nameToId[p.name] = id;
      return { id, name: p.name, exercises: p.exercises.map((ex) => ({ id: Date.now() + Math.random(), ...ex })) };
    });
    setWorkoutPlans((ps) => [...ps, ...newPlans]);
    setWorkoutSchedule((s) => {
      const next = { ...s };
      for (const [day, planName] of Object.entries(aiPreview.schedule)) {
        if (nameToId[planName] != null) next[day] = nameToId[planName];
      }
      return next;
    });
    setAiPreview(null);
    setActiveWorkoutTab("today");
  }

  async function handleSaveUsername() {
    const trimmed = usernameInput.trim();
    if (!trimmed || usernameBusy) return;
    setUsernameBusy(true);
    setUsernameMsg(null);
    const result = await updateUsername(trimmed);
    setUsernameBusy(false);
    if (!result.error) setMyUsername(trimmed);
    setUsernameMsg(result.error ? { type: "error", text: result.error } : { type: "success", text: "Username saved." });
  }

  async function handleChangePassword() {
    if (passwordBusy) return;
    if (!currentPasswordInput || !newPasswordInput) { setPasswordMsg({ type: "error", text: "Enter your current and new password." }); return; }
    setPasswordBusy(true);
    setPasswordMsg(null);
    const result = await changePassword(currentPasswordInput, newPasswordInput);
    setPasswordBusy(false);
    if (result.error) {
      setPasswordMsg({ type: "error", text: result.error });
    } else {
      setCurrentPasswordInput("");
      setNewPasswordInput("");
      setPasswordMsg({ type: "success", text: "Password updated." });
    }
  }

  // ---- Friends ----
  async function refreshFriends() {
    setFriendsLoading(true);
    const myProfile = await getProfile(user.uid);
    const ids = myProfile?.friendUids || [];
    setFriendIds(ids);
    const entries = await Promise.all(ids.map(async (uid) => [uid, await getProfile(uid)]));
    setFriendsData(Object.fromEntries(entries.filter(([, p]) => p)));
    setFriendsLoading(false);
  }

  async function refreshFriendRequests() {
    const result = await listFriendRequests();
    setFriendRequests(result);
  }

  useEffect(() => {
    const wantsFriendsData = activeTab === "friends" || (activeTab === "workout" && activeWorkoutTab === "ranks");
    if (!wantsFriendsData || !myUsername) return;
    refreshFriends();
    refreshFriendRequests();
  }, [activeTab, activeWorkoutTab, myUsername, friendsRefreshTick]);

  async function handleSendFriendRequest() {
    if (friendSearchBusy || !friendSearchInput.trim()) return;
    setFriendSearchBusy(true);
    setFriendSearchMsg(null);
    const result = await sendFriendRequest(friendSearchInput.trim());
    setFriendSearchBusy(false);
    if (result.error) {
      setFriendSearchMsg({ type: "error", text: result.error });
    } else {
      setFriendSearchInput("");
      setFriendSearchMsg({ type: "success", text: "Request sent!" });
      setFriendsRefreshTick((t) => t + 1);
    }
  }

  async function handleAcceptRequest(requestId) {
    await acceptFriendRequest(requestId);
    setFriendsRefreshTick((t) => t + 1);
  }
  async function handleDeclineRequest(requestId) {
    await declineFriendRequest(requestId);
    setFriendsRefreshTick((t) => t + 1);
  }
  async function handleCancelRequest(requestId) {
    await cancelFriendRequest(requestId);
    setFriendsRefreshTick((t) => t + 1);
  }
  async function handleRemoveFriend(friendUid) {
    await removeFriend(friendUid);
    setSelectedFriendUid(null);
    setFriendsRefreshTick((t) => t + 1);
  }

  async function clearAllData() {
    try { await window.storage.delete(STORAGE_KEY); } catch (e) {}
    setQuests([]);
    setTotalXP(0);
    setGold(0);
    setStreak(0);
    setLastActiveDate(null);
    setWeeklyBossId(null);
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
      { id: Date.now() + 0.1, name: "Make the bed", streak: 0, lastCompletedDate: null, totalCompletions: 0, undo: null, deadlineTime: null },
      { id: Date.now() + 0.2, name: "Brush teeth", streak: 0, lastCompletedDate: null, totalCompletions: 0, undo: null, deadlineTime: null },
      { id: Date.now() + 0.3, name: "Wash face", streak: 0, lastCompletedDate: null, totalCompletions: 0, undo: null, deadlineTime: null },
    ]);
    setHabitPerfectDayDate(null);
    setWorkoutPlans([]);
    setWorkoutSchedule(DEFAULT_WORKOUT_SCHEDULE);
    setWorkoutSession(null);
    setWorkoutHistory([]);
    setCustomExercises([]);
    setAutoRestTimer(true);
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
    const isMissed = !q.completed && q.missedPenalty;

    return (
      <div style={{ position: "relative", marginBottom: 2, borderRadius: 4, overflow: "hidden", height: 22 }}>
        <div
          draggable
          onDragStart={(e) => { e.dataTransfer.setData("text/plain", String(q.id)); dragIdRef.current = q.id; setTimeout(() => setIsDragging(true), 0); }}
          onDragEnd={() => { dragIdRef.current = null; setIsDragging(false); setDragOverDate(null); setDragOverTrash(false); }}
          style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", gap: 6, padding: "5px 6px", borderRadius: 4,
            background: q.completed ? themePersonality.deepBase : isMissed ? "rgba(138,46,68,0.15)" : themePersonality.cardBase,
            borderLeft: `2px solid ${isMissed ? "#8A2E44" : diff.color}`,
            opacity: q.completed ? 0.5 : 1, cursor: "grab", userSelect: "none",
          }}>
          {/* Quick-complete dot */}
          <div
            onClick={(e) => { e.stopPropagation(); q.completed ? uncompleteQuest(q.id) : completeQuest(q.id); }}
            style={{ width: 8, height: 8, borderRadius: "50%", background: q.completed ? "#4C9A6A" : diff.color, flexShrink: 0, cursor: "pointer", padding: 6, margin: "-6px -2px -6px -5px" }}
            title={q.completed ? "Undo" : "Complete"}
          />
          <span
            onClick={() => setQuestDetailFor(q.id)}
            style={{ fontSize: 11, lineHeight: 1.2, color: isMissed ? "#C1652B" : q.completed ? "#5C6773" : "#EDE4D3", textDecoration: q.completed ? "line-through" : "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, cursor: "pointer" }}
            title={isMissed ? `Missed original due date — XP reduced ${Math.round(MISSED_PENALTY_PCT * 100)}%` : undefined}>
            {isMissed ? "❄ " : ""}{q.title}
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
                    <span style={{ fontSize: 11, color: diff.color, fontWeight: 700, fontFamily: "ui-monospace, Menlo, monospace" }}>{diff.label.toUpperCase()} · {q.missedPenalty ? Math.round(q.xp * (1 - MISSED_PENALTY_PCT)) : q.xp} XP</span>
                    {q.estMinutes && <span style={{ fontSize: 11, color: "#5C6773", fontFamily: "ui-monospace, Menlo, monospace" }}>~{q.estMinutes}m</span>}
                    {q.recurring && <Repeat size={11} color="#5C6773" />}
                    {!q.completed && q.missedPenalty && <span style={{ fontSize: 11, color: "#8A2E44", fontWeight: 700 }}>❄ Missed (-{Math.round(MISSED_PENALTY_PCT * 100)}% XP)</span>}
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
        await window.storage.set("pushSubscription", sub.toJSON());
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
    <div className="safe-top" style={{ minHeight: "100vh", background: themePersonality.bgBase, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: "#EDE4D3", paddingBottom: 84 }}>
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

      {/* Floating workout session pill */}
      {workoutSession && !sessionOverlayOpen && (
        <button onClick={() => setSessionOverlayOpen(true)} className="qlog-btn" style={{ position: "fixed", bottom: 20, left: 20, zIndex: 55, display: "flex", alignItems: "center", gap: 8, background: "#232E3D", border: `1.5px solid ${accent}`, borderRadius: 30, padding: "10px 16px", cursor: "pointer", boxShadow: "0 6px 20px rgba(0,0,0,0.4)" }}>
          <IconDumbbell size={16} color={accent} />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#EDE4D3", maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{workoutSession.planName}</span>
          {workoutSession.restTimer && <span style={{ fontFamily: "ui-monospace, Menlo, monospace", fontWeight: 700, color: accent, fontSize: 12 }}>{fmtTime(workoutSession.restTimer.secondsLeft)}</span>}
        </button>
      )}

      {/* Active workout session overlay */}
      {workoutSession && sessionOverlayOpen && (
        <div style={{ position: "fixed", inset: 0, background: "#141C27", zIndex: 72, overflowY: "auto", padding: "16px 14px 100px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <button onClick={() => setSessionOverlayOpen(false)} className="qlog-btn" style={{ background: "none", border: "none", color: "#8A8578", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}><ChevronLeft size={16} /> Minimize</button>
            <button onClick={() => setDiscardConfirmOpen(true)} className="qlog-btn" style={{ background: "none", border: "none", color: "#8A2E44", cursor: "pointer", fontSize: 12 }}>Discard</button>
          </div>
          <h2 style={{ margin: "6px 0 2px", fontSize: 18, fontWeight: 700, fontFamily: "Georgia, serif" }}>{workoutSession.planName}</h2>
          <div style={{ fontSize: 12, color: "#8A8578", marginBottom: 14, fontFamily: "ui-monospace, Menlo, monospace" }}>{fmtTime(Math.floor((Date.now() - workoutSession.startedAt) / 1000))} elapsed</div>

          {workoutSession.restTimer && (
            <div style={{ background: "rgba(201,162,39,0.1)", border: `1px solid ${accent}`, borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: 0.4 }}>Rest</span>
                <span style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 20, fontWeight: 700, color: accent }}>{fmtTime(workoutSession.restTimer.secondsLeft)}</span>
              </div>
              <div style={{ height: 6, background: "#141C27", borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
                <div style={{ height: "100%", width: `${(workoutSession.restTimer.secondsLeft / workoutSession.restTimer.totalSeconds) * 100}%`, background: accent, borderRadius: 4, transition: "width 1s linear" }} />
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => adjustRestTimer(30)} className="qlog-btn" style={{ flex: 1, background: "#1F2836", border: "1px solid #33414F", borderRadius: 6, padding: "6px 0", fontSize: 11, color: "#EDE4D3", cursor: "pointer" }}>+30s</button>
                <button onClick={skipRestTimer} className="qlog-btn" style={{ flex: 1, background: "#1F2836", border: "1px solid #33414F", borderRadius: 6, padding: "6px 0", fontSize: 11, color: "#8A8578", cursor: "pointer" }}>Skip</button>
              </div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {workoutSession.exercises.map((ex, exIdx) => (
              <div key={exIdx} style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 10, padding: "10px 12px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#EDE4D3", display: "flex", alignItems: "center", gap: 6 }}>{ex.name} <InfoButton accent={accent} size={12} onClick={() => openExerciseGuide(findExercise(ex.exerciseId, customExercises))} /></span>
                  <span style={{ fontSize: 10, color: "#5C6773" }}>{ex.targetReps && `Target ${ex.targetReps}`}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {ex.sets.map((st, setIdx) => (
                    <WorkoutSetRow
                      key={setIdx}
                      setNum={setIdx + 1}
                      set={st}
                      accent={accent}
                      onLog={(weight, reps) => logSet(exIdx, setIdx, weight, reps, ex.restSeconds)}
                      onUncomplete={() => uncompleteSet(exIdx, setIdx)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button onClick={finishWorkout} className="qlog-btn" style={{ width: "100%", marginTop: 16, background: accent, border: "none", borderRadius: 10, padding: "13px 0", fontWeight: 700, fontSize: 14, color: "#1B2430", cursor: "pointer" }}>Finish Workout</button>

          {workoutXpPop && <div className="xp-pop" style={{ position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)", fontWeight: 700, fontSize: 14, color: accent, fontFamily: "ui-monospace, Menlo, monospace" }}>+{workoutXpPop.xp} XP</div>}
        </div>
      )}

      {discardConfirmOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10,14,20,0.75)", zIndex: 90, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setDiscardConfirmOpen(false)}>
          <div style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 16, padding: 22, width: "100%", maxWidth: 340 }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 700, fontFamily: "Georgia, serif" }}>Discard this workout?</h3>
            <p style={{ fontSize: 13, color: "#8A8578", margin: "0 0 18px" }}>Logged sets won't be saved.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button onClick={() => { discardWorkout(); setDiscardConfirmOpen(false); }} className="qlog-btn" style={{ background: "#8A2E44", border: "none", borderRadius: 8, padding: "11px 0", fontWeight: 700, fontSize: 13, color: "#EDE4D3", cursor: "pointer" }}>Discard workout</button>
              <button onClick={() => setDiscardConfirmOpen(false)} className="qlog-btn" style={{ background: "none", border: "1px solid #33414F", borderRadius: 8, padding: "10px 0", fontWeight: 600, fontSize: 13, color: "#8A8578", cursor: "pointer" }}>Cancel</button>
            </div>
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
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <h1 style={{ fontWeight: 700, fontSize: 20, margin: 0, fontFamily: "Georgia, serif" }}>Quest Log</h1>
                {equipped.badge && <span>{(() => { const b = ITEM_CATALOGUE.find((i) => i.id === equipped.badge); return b ? b.icon(RARITIES[b.rarity].color) : null; })()}</span>}
              </div>
              {equipped.title && (
                <span style={{ fontSize: 10, color: accent, fontWeight: 600 }}>{ITEM_CATALOGUE.find((i) => i.id === equipped.title)?.value}</span>
              )}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button onClick={() => setCrateModalOpen(true)} className="qlog-btn" style={{ display: "flex", alignItems: "center", gap: 4, background: "#232E3D", border: "1px solid #33414F", borderRadius: 8, padding: "7px 9px", color: "#EDE4D3", cursor: "pointer", fontFamily: "ui-monospace, Menlo, monospace", fontSize: 12, fontWeight: 700 }}><Coins size={13} color="#C9A227" /> {gold}</button>
            <button onClick={() => setSettingsOpen(true)} aria-label="Account & Settings" className="qlog-btn" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#232E3D", border: "1px solid #33414F", borderRadius: 8, width: 30, height: 30, color: "#8A8578", cursor: "pointer" }}><IconUser size={15} /></button>
          </div>
        </div>

        {/* XP / Streak (Home tab) */}
        {activeTab === "home" && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
          <div style={{ flex: "1 1 100%", background: themePersonality.cardBase, border: `1px solid ${themePersonality.borderCol}`, borderRadius: 10, padding: "12px 14px" }}>
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

          {bossQuest && (
            <div style={{ flex: "1 1 100%", display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", background: "rgba(138,95,191,0.1)", borderRadius: 8, border: "1px solid #8A5FBF" }}>
              <Crown size={12} color="#8A5FBF" />
              <span style={{ fontSize: 11, color: "#8A5FBF", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Boss: {bossQuest.title}</span>
              <button onClick={() => setWeeklyBossId(null)} style={{ background: "none", border: "none", color: "#8A8578", cursor: "pointer", padding: 0 }}><X size={12} /></button>
            </div>
          )}
        </div>
        )}
        </div>{/* end header gradient */}

        {/* Home tab snapshot cards */}
        {activeTab === "home" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
            {/* Today at a glance */}
            <div style={{ background: themePersonality.cardBase, border: `1px solid ${themePersonality.borderCol}`, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#8A8578", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>Today at a glance</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setActiveTab("quests")} className="qlog-btn" style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "#1F2836", border: "1px solid #2C3947", borderRadius: 8, padding: "9px 10px", cursor: "pointer", textAlign: "left" }}>
                  <IconCalendar size={16} color={accent} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#EDE4D3" }}>{completedTodayCount}/{todayQuestsTotal}</div>
                    <div style={{ fontSize: 10, color: "#8A8578" }}>Quests today</div>
                  </div>
                </button>
                <button onClick={() => setActiveTab("habits")} className="qlog-btn" style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "#1F2836", border: "1px solid #2C3947", borderRadius: 8, padding: "9px 10px", cursor: "pointer", textAlign: "left" }}>
                  <Repeat size={16} color={accent} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#EDE4D3" }}>{todayHabitsDone}/{habits.length}</div>
                    <div style={{ fontSize: 10, color: "#8A8578" }}>Habits today</div>
                  </div>
                </button>
              </div>
            </div>

            {/* This week */}
            <div style={{ background: themePersonality.cardBase, border: `1px solid ${themePersonality.borderCol}`, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#8A8578", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>This week</div>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#EDE4D3", fontFamily: "ui-monospace, Menlo, monospace" }}>{weekCompletedQuests.length}</div>
                  <div style={{ fontSize: 10, color: "#8A8578" }}>Quests completed</div>
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: accent, fontFamily: "ui-monospace, Menlo, monospace" }}>{weekXP} XP</div>
                  <div style={{ fontSize: 10, color: "#8A8578" }}>Earned this week</div>
                </div>
                {bossQuest && (
                  <div style={{ flex: 1, minWidth: 140, display: "flex", alignItems: "center", gap: 6, padding: "5px 8px", background: "rgba(138,95,191,0.1)", borderRadius: 6, border: "1px solid #8A5FBF" }}>
                    <Crown size={12} color="#8A5FBF" />
                    <span style={{ fontSize: 11, color: "#8A5FBF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Boss: {bossQuest.title}{bossQuest.completed ? " ✓ ready" : ""}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Workout summary */}
            {(() => {
              const rankRows = computeExerciseRankRows(workoutHistory, customExercises);
              const overall = computeOverallRank(rankRows) || { info: rankInfo(-1) };
              const top = [...rankRows].sort((a, b) => (b.idx + b.progress) - (a.idx + a.progress)).slice(0, 3);
              const weakest = rankRows.length > 3 ? [...rankRows].sort((a, b) => (a.idx + a.progress) - (b.idx + b.progress)).slice(0, 3) : [];
              const sessionsThisWeek = workoutHistory.filter((h) => h.date >= weekStart).length;
              const lastSession = workoutHistory[0];
              return (
                <div onClick={() => { setActiveTab("workout"); setActiveWorkoutTab("ranks"); }} className="qlog-btn" style={{ background: themePersonality.cardBase, border: `1px solid ${themePersonality.borderCol}`, borderRadius: 10, padding: "12px 14px", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#8A8578", textTransform: "uppercase", letterSpacing: 0.4 }}>Workout summary</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, color: overall.info.color, background: overall.info.color + "22", borderRadius: 10, padding: "2px 8px" }}>
                      {overall.info.unranked ? <IconShield size={11} color={overall.info.color} /> : <Trophy size={11} color={overall.info.color} />}
                      {overall.info.label}
                    </span>
                  </div>

                  {workoutHistory.length > 0 && (
                  <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#EDE4D3", fontFamily: "ui-monospace, Menlo, monospace" }}>{sessionsThisWeek}</div>
                      <div style={{ fontSize: 10, color: "#8A8578" }}>Sessions this week</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#EDE4D3", fontFamily: "ui-monospace, Menlo, monospace" }}>{workoutHistory.length}</div>
                      <div style={{ fontSize: 10, color: "#8A8578" }}>Total workouts</div>
                    </div>
                    {lastSession && (
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#EDE4D3", fontFamily: "ui-monospace, Menlo, monospace" }}>{parseLocalDate(lastSession.date).toLocaleDateString(undefined, { day: "numeric", month: "short" })}</div>
                        <div style={{ fontSize: 10, color: "#8A8578" }}>Last workout</div>
                      </div>
                    )}
                  </div>
                  )}

                  {top.length > 0 && (
                    <div style={{ marginBottom: weakest.length > 0 ? 8 : 0 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: "#5C6773", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 4 }}>Top ranked</div>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {top.map((r) => (
                          <span key={r.id} style={{ fontSize: 10, color: r.info.color, background: r.info.color + "18", border: `1px solid ${r.info.color}44`, borderRadius: 12, padding: "2px 8px" }}>{r.ex?.name || "?"} · {r.info.label}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {weakest.length > 0 && (
                    <div>
                      <div style={{ fontSize: 9, fontWeight: 700, color: "#5C6773", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 4 }}>Needs work</div>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {weakest.map((r) => (
                          <span key={r.id} style={{ fontSize: 10, color: "#8A8578", background: "#1F2836", border: "1px solid #2C3947", borderRadius: 12, padding: "2px 8px" }}>{r.ex?.name || "?"} · {r.info.label}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {rankRows.length === 0 && <p style={{ fontSize: 11, color: "#5C6773", margin: 0 }}>Complete a workout to start earning ranks.</p>}
                </div>
              );
            })()}

            {/* Equipped gear preview */}
            <button onClick={() => setActiveTab("gear")} className="qlog-btn" style={{ background: themePersonality.cardBase, border: `1px solid ${themePersonality.borderCol}`, borderRadius: 10, padding: "12px 14px", cursor: "pointer", textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#8A8578", textTransform: "uppercase", letterSpacing: 0.4 }}>Equipped</span>
                <span style={{ fontSize: 10, color: "#5C6773" }}>{inventory.length}/{ITEM_CATALOGUE.length} collected</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {GEAR_SLOTS.map((slot) => {
                  const item = equipped[slot] ? ITEM_CATALOGUE.find((i) => i.id === equipped[slot]) : null;
                  const rar = item ? RARITIES[item.rarity] : null;
                  return (
                    <div key={slot} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: item ? rar.glow : "#1F2836", border: `1px solid ${item ? rar.color : "#2C3947"}`, borderRadius: 8, padding: "7px 4px" }}>
                      <div style={{ height: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>{item ? item.icon(rar.color) : <Plus size={12} color="#33414F" />}</div>
                      <span style={{ fontSize: 8, fontWeight: 700, color: item ? rar.color : "#4A5563", textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}>{item ? item.label : SLOT_LABELS[slot]}</span>
                    </div>
                  );
                })}
              </div>
            </button>

            {/* Recent activity */}
            {recentCompleted.length > 0 && (
              <div style={{ background: themePersonality.cardBase, border: `1px solid ${themePersonality.borderCol}`, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#8A8578", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>Recent activity</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {recentCompleted.map((q) => (
                    <div key={q.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                      <Check size={11} color="#4C9A6A" />
                      <span style={{ flex: 1, color: "#EDE4D3", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{q.title}</span>
                      <span style={{ fontSize: 10, color: "#5C6773" }}>{recentDateLabel(q.completedAt)}</span>
                      <span style={{ fontSize: 10, color: accent, fontFamily: "ui-monospace, Menlo, monospace" }}>+{q.xp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dev mode panel — tap level 5x to toggle (Home tab) */}
        {activeTab === "home" && devMode && (
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

        {activeTab === "quests" && (
        <>
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

        {/* Filter toggle + show completed */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <button onClick={() => setQuestFilterOpen((v) => !v)} className="qlog-btn" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, padding: "4px 9px", borderRadius: 6, border: `1px solid ${questFilterOpen || questSearch || questDifficultyFilter.length > 0 ? accent : "#33414F"}`, background: questFilterOpen || questSearch || questDifficultyFilter.length > 0 ? accent + "18" : "#232E3D", color: questFilterOpen || questSearch || questDifficultyFilter.length > 0 ? accent : "#8A8578", cursor: "pointer" }}>
            Filter{questDifficultyFilter.length > 0 && ` (${questDifficultyFilter.length})`}
          </button>
          <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#8A8578", cursor: "pointer" }}>
            <input type="checkbox" checked={showCompleted} onChange={(e) => setShowCompleted(e.target.checked)} />
            Show completed
          </label>
        </div>

        {questFilterOpen && (
          <div style={{ background: "#1F2836", border: "1px solid #2C3947", borderRadius: 8, padding: "8px 10px", marginBottom: 8 }}>
            <input value={questSearch} onChange={(e) => setQuestSearch(e.target.value)} placeholder="Search quest titles..." style={{ width: "100%", marginBottom: 8, background: "#141C27", border: "1px solid #33414F", borderRadius: 6, padding: "6px 8px", color: "#EDE4D3", fontSize: 12 }} />
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {themedDifficulties.map((d) => {
                const active = questDifficultyFilter.includes(d.key);
                return (
                  <button key={d.key} onClick={() => setQuestDifficultyFilter((f) => active ? f.filter((k) => k !== d.key) : [...f, d.key])} className="qlog-btn"
                    style={{ fontSize: 10, fontWeight: 700, padding: "4px 9px", borderRadius: 14, border: `1.5px solid ${d.color}`, background: active ? d.color : "transparent", color: active ? "#1B2430" : d.color, cursor: "pointer" }}>
                    {d.label}
                  </button>
                );
              })}
              {(questSearch || questDifficultyFilter.length > 0) && (
                <button onClick={() => { setQuestSearch(""); setQuestDifficultyFilter([]); }} className="qlog-btn" style={{ fontSize: 10, padding: "4px 9px", borderRadius: 14, border: "1px solid #33414F", background: "none", color: "#8A8578", cursor: "pointer" }}>Clear</button>
              )}
            </div>
          </div>
        )}

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
            <div style={{ overflowX: "auto" }}>
              <div style={{ display: "flex", borderBottom: "1px solid #2C3947", minWidth: 490 }}>
                {getWeekDates(calAnchor).map((date) => {
                  const d = parseLocalDate(date);
                  const isToday = date === today;
                  const count = quests.filter((q) => q.date === date && !q.completed).length;
                  return (
                    <div key={date} style={{ flex: "1 0 70px", padding: "6px 2px", textAlign: "center", borderRight: "1px solid #2C3947", background: date === selectedDate ? accent + "22" : "transparent" }}>
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
              <div style={{ display: "flex", minWidth: 490 }}>
                {getWeekDates(calAnchor).map((date) => {
                  const dayQuests = questsForDate(date);
                  const dayShifts = shifts.filter((s) => s.date === date);
                  const isOver = dragOverDate === date;
                  return (
                    <div key={date}
                      onDragOver={(e) => { e.preventDefault(); setDragOverDate(date); }}
                      onDragLeave={() => setDragOverDate((d) => d === date ? null : d)}
                      onDrop={(e) => { e.preventDefault(); const id = Number(e.dataTransfer.getData("text/plain")); moveQuestToDate(id, date); dragIdRef.current = null; setIsDragging(false); setDragOverDate(null); }}
                      style={{ flex: "1 0 70px", borderRight: "1px solid #2C3947", padding: "4px 3px", minHeight: 160, background: isOver ? accent + "18" : "transparent", transition: "background 0.1s ease" }}
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
                  const dayQuests = quests.filter((q) => q.date === date && (showCompleted || !q.completed) && matchesQuestFilter(q));
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
                          {dayQuests.filter((q) => !q.completed).slice(0, 4).map((q) => {
                            const d = themedDifficulties.find((df) => df.key === q.difficulty);
                            return <div key={q.id} style={{ width: 5, height: 5, borderRadius: "50%", background: d?.color || accent }} />;
                          })}
                          {active > 4 && <div style={{ fontSize: 8, color: "#5C6773" }}>+{active - 4}</div>}
                        </div>
                      )}
                      {dayQuests.length > 0 && (
                        <div title={`${done}/${dayQuests.length} completed`} style={{ height: 3, borderRadius: 2, marginTop: 3, background: "#141C27", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${(done / dayQuests.length) * 100}%`, background: "#4C9A6A", borderRadius: 2 }} />
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
        </>
        )}

        {/* Daily Habits */}
        {activeTab === "habits" && (() => {
          const doneCount = habits.filter((h) => h.lastCompletedDate === today).length;
          const allDoneToday = habits.length > 0 && doneCount === habits.length;
          const perfectDayEarnedToday = habitPerfectDayDate === today;
          const bestHabit = habits.reduce((best, h) => (h.streak > (best?.streak || 0) ? h : best), null);
          const totalCompletions = habits.reduce((sum, h) => sum + (h.totalCompletions || 0), 0);
          const last30Days = Array.from({ length: 30 }, (_, i) => {
            const d = addDaysLocal(today, -(29 - i));
            const done = habits.filter((h) => (h.completionLog || []).includes(d)).length;
            return { date: d, done, ratio: habits.length ? done / habits.length : 0 };
          });
          const tiers = [
            { label: "Bronze", days: 3, color: "#C1652B" },
            { label: "Silver", days: 7, color: "#B8C4CE" },
            { label: "Gold", days: 21, color: "#C9A227" },
            { label: "Diamond", days: 66, color: "#4FA3C9" },
          ];
          return (
          <div style={{ marginBottom: 20 }}>

          {/* Daily Habits */}
          <div style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 10, padding: 10, marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>Daily Habits</span>
              <span style={{ fontSize: 9, color: "#5C6773" }}>{HABIT_XP} XP each · 3d bronze · 7d silver · 21d gold · 66d diamond</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 4, marginBottom: 8 }}>
              {habits.length === 0 && <p style={{ fontSize: 11, color: "#5C6773", margin: 0 }}>No habits yet — add one below.</p>}
              {habits.map((h) => {
                const doneToday = h.lastCompletedDate === today;
                const tier = habitTier(h.streak);
                const isLate = !!h.deadlineTime && !doneToday && nowHHMM() > h.deadlineTime;
                const dots = habitStreakDots(h, today);
                return (
                  <div key={h.id} style={{ position: "relative", display: "flex", flexDirection: "column", gap: 4, background: "#1F2836", border: isLate ? "1px solid #8A2E44" : "1px solid #2C3947", borderRadius: 6, padding: "4px 8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {!doneToday
                        ? <button onClick={() => completeHabit(h.id)} className="qlog-btn" style={{ width: 15, height: 15, minWidth: 15, borderRadius: "50%", border: "2px solid #5C6773", background: "transparent", cursor: "pointer" }} />
                        : <button onClick={() => uncompleteHabit(h.id)} className="qlog-btn" style={{ width: 15, height: 15, minWidth: 15, borderRadius: "50%", background: "#4C9A6A", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Check size={9} color="#141C27" /></button>
                      }
                      <span style={{ flex: 1, fontSize: 12, textDecoration: doneToday ? "line-through" : "none", opacity: doneToday ? 0.6 : 1 }}>{h.name}</span>
                      {isLate && <span style={{ fontSize: 9, fontWeight: 700, color: "#D9536A" }}>LATE</span>}
                      <label title={h.deadlineTime ? `Due by ${formatDeadline(h.deadlineTime)}` : "Set a due time"} style={{ display: "flex", alignItems: "center", gap: 2, cursor: "pointer" }}>
                        <Timer size={10} color={isLate ? "#D9536A" : h.deadlineTime ? "#8A8578" : "#4A5563"} />
                        <input
                          type="time"
                          value={h.deadlineTime || ""}
                          onChange={(e) => setHabitDeadline(h.id, e.target.value)}
                          style={{ width: 62, background: "transparent", border: "none", color: isLate ? "#D9536A" : h.deadlineTime ? "#8A8578" : "#4A5563", fontSize: 10, fontFamily: "ui-monospace, Menlo, monospace", colorScheme: "dark" }}
                        />
                      </label>
                      {h.streak > 0 && (
                        <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 9, fontWeight: 700, color: tier.color, fontFamily: "ui-monospace, Menlo, monospace" }}>
                          <Flame size={10} color={tier.color} fill={tier.color} /> {h.streak}{tier.label && <span style={{ opacity: 0.8 }}>· {tier.label}</span>}
                        </span>
                      )}
                      <button onClick={() => deleteHabit(h.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#4A5563", padding: 2 }}><Trash2 size={11} /></button>
                      {habitXpPop && habitXpPop.id === h.id && <div className="xp-pop" style={{ position: "absolute", right: 30, top: -2, fontWeight: 700, fontSize: 11, color: accent, fontFamily: "ui-monospace, Menlo, monospace" }}>+{habitXpPop.xp} XP</div>}
                    </div>
                    <div style={{ display: "flex", gap: 3, paddingLeft: 21 }}>
                      {dots.map((d) => (
                        <div key={d.date} title={d.date} style={{ width: 12, height: 12, borderRadius: 3, background: d.filled ? tier.color || accent : "transparent", border: `1.5px solid ${d.filled ? (tier.color || accent) : d.isToday ? "#5C6773" : "#2C3947"}` }} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <input value={newHabitName} onChange={(e) => setNewHabitName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addHabit(newHabitName, newHabitDeadline)} placeholder="Add a habit — e.g. drink water" style={{ flex: 1, background: "#141C27", border: "1px solid #33414F", borderRadius: 6, padding: "5px 8px", color: "#EDE4D3", fontSize: 12 }} />
              <input type="time" value={newHabitDeadline} onChange={(e) => setNewHabitDeadline(e.target.value)} title="Optional due time" style={{ background: "#141C27", border: "1px solid #33414F", borderRadius: 6, padding: "5px 6px", color: "#EDE4D3", fontSize: 11, colorScheme: "dark" }} />
              <button onClick={() => addHabit(newHabitName, newHabitDeadline)} className="qlog-btn" style={{ background: accent, border: "none", borderRadius: 6, padding: "0 8px", display: "flex", alignItems: "center", cursor: "pointer" }}><Plus size={13} color="#1B2430" /></button>
            </div>
          </div>

          {/* Today's progress */}
          <div style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 10, padding: "12px 14px", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#8A8578", textTransform: "uppercase", letterSpacing: 0.4 }}>Today's Progress</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: accent, fontFamily: "ui-monospace, Menlo, monospace" }}>{doneCount}/{habits.length}</span>
            </div>
            <div style={{ height: 7, background: "#141C27", borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
              <div style={{ height: "100%", width: `${habits.length ? (doneCount / habits.length) * 100 : 0}%`, background: allDoneToday ? "#4C9A6A" : accent, borderRadius: 4, transition: "width 0.3s ease" }} />
            </div>
            {perfectDayEarnedToday ? (
              <p style={{ fontSize: 11, color: "#4C9A6A", margin: 0 }}>✓ Perfect day complete — +{PERFECT_DAY_XP} bonus XP earned!</p>
            ) : habits.length > 0 ? (
              <p style={{ fontSize: 11, color: "#8A8578", margin: 0 }}>Complete all {habits.length} for a +{PERFECT_DAY_XP} XP perfect-day bonus.</p>
            ) : null}
          </div>

          {/* 30-day consistency heatmap */}
          <div style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 10, padding: "12px 14px", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#8A8578", textTransform: "uppercase", letterSpacing: 0.4 }}>Last 30 Days</span>
              <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <span style={{ fontSize: 8, color: "#5C6773" }}>Less</span>
                {[0.001, 0.34, 0.67, 1].map((r) => (
                  <div key={r} style={{ width: 6, height: 6, borderRadius: 2, background: r === 0.001 ? "#141C27" : accent, opacity: r === 0.001 ? 1 : Math.max(0.25, r) }} />
                ))}
                <span style={{ fontSize: 8, color: "#5C6773" }}>More</span>
              </div>
            </div>
            {habits.length === 0 ? (
              <p style={{ fontSize: 11, color: "#5C6773", margin: 0 }}>Add a habit to start tracking consistency.</p>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {last30Days.map((d) => (
                  <div key={d.date} title={`${d.date}: ${d.done}/${habits.length} habits`} style={{ width: 10, height: 10, borderRadius: 2, background: d.ratio > 0 ? accent : "#141C27", opacity: d.ratio > 0 ? Math.max(0.3, d.ratio) : 1, border: d.date === today ? `1px solid ${accent}` : "1px solid transparent" }} />
                ))}
              </div>
            )}
          </div>

          {/* Streak stats + tier legend */}
          <div style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 10, padding: "12px 14px", marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#8A8578", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>Streaks</div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: bestHabit?.streak > 0 ? "#C1652B" : "#5C6773", fontFamily: "ui-monospace, Menlo, monospace" }}>{bestHabit?.streak > 0 ? `${bestHabit.streak}d` : "—"}</div>
                <div style={{ fontSize: 10, color: "#5C6773" }}>{bestHabit?.streak > 0 ? `Best: ${bestHabit.name}` : "No active streaks"}</div>
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: accent, fontFamily: "ui-monospace, Menlo, monospace" }}>{totalCompletions}</div>
                <div style={{ fontSize: 10, color: "#5C6773" }}>Total completions</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {tiers.map((t) => (
                <span key={t.label} style={{ fontSize: 9, fontWeight: 700, color: t.color, background: t.color + "18", border: `1px solid ${t.color}44`, borderRadius: 12, padding: "3px 8px" }}>{t.label} · {t.days}d+</span>
              ))}
            </div>
          </div>

          {/* Next milestones */}
          {habits.some((h) => h.streak > 0 && nextHabitMilestone(h.streak)) && (
            <div style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#8A8578", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>Next Milestones</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {habits
                  .filter((h) => h.streak > 0 && nextHabitMilestone(h.streak))
                  .map((h) => ({ h, next: nextHabitMilestone(h.streak) }))
                  .sort((a, b) => (a.next - a.h.streak) - (b.next - b.h.streak))
                  .map(({ h, next }) => {
                    const tier = habitTier(next);
                    const prevThreshold = [0, ...HABIT_TIER_DAYS].reverse().find((d) => d < next) || 0;
                    const pct = ((h.streak - prevThreshold) / (next - prevThreshold)) * 100;
                    return (
                      <div key={h.id}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
                          <span style={{ color: "#EDE4D3" }}>{h.name}</span>
                          <span style={{ color: tier.color, fontWeight: 700 }}>{next - h.streak}d to {tier.label}</span>
                        </div>
                        <div style={{ height: 5, background: "#141C27", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: tier.color, borderRadius: 3 }} />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
          </div>
          );
        })()}

        {/* Workout */}
        {activeTab === "workout" && (
          <div style={{ marginBottom: 20 }}>
            {(() => {
              const rankRows = computeExerciseRankRows(workoutHistory, customExercises);
              const overall = computeOverallRank(rankRows) || { info: rankInfo(-1) };
              const top = [...rankRows].sort((a, b) => (b.idx + b.progress) - (a.idx + a.progress)).slice(0, 3);
              return (
                <button onClick={() => setActiveWorkoutTab("ranks")} className="qlog-btn" style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, background: "#1F2836", border: "1px solid #2C3947", borderRadius: 10, padding: "9px 12px", marginBottom: 10, cursor: "pointer", textAlign: "left" }}>
                  {overall.info.unranked ? <IconShield size={18} color={overall.info.color} style={{ flexShrink: 0 }} /> : <Trophy size={18} color={overall.info.color} style={{ flexShrink: 0 }} />}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: overall.info.color }}>{overall.info.label}</span>
                      <span style={{ fontSize: 9, color: "#5C6773", textTransform: "uppercase", letterSpacing: 0.4 }}>Overall Rank</span>
                    </div>
                    {top.length > 0 ? (
                      <div style={{ fontSize: 10, color: "#8A8578", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        Best: {top.map((r) => r.ex?.name || "?").join(", ")}
                      </div>
                    ) : (
                      <div style={{ fontSize: 10, color: "#5C6773" }}>Complete a workout to start earning ranks</div>
                    )}
                  </div>
                  <ChevronRight size={14} color="#5C6773" style={{ flexShrink: 0 }} />
                </button>
              );
            })()}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4, marginBottom: 10, background: "#1F2836", border: "1px solid #2C3947", borderRadius: 12, padding: 4 }}>
              {[
                { key: "today", label: "Today", Icon: Target },
                { key: "plans", label: "Plans", Icon: FileText },
                { key: "schedule", label: "Schedule", Icon: IconCalendar },
                { key: "history", label: "History", Icon: Timer },
                { key: "generate", label: "Generate", Icon: Wand2 },
                { key: "exercises", label: "Exercises", Icon: IconDumbbell },
                { key: "ranks", label: "Ranks", Icon: Trophy },
              ].map((t) => {
                const on = activeWorkoutTab === t.key;
                return (
                  <button key={t.key} onClick={() => { setActiveWorkoutTab(t.key); setHistoryExerciseId(null); }} className="qlog-btn"
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, fontSize: 10, fontWeight: 700, padding: "8px 2px", borderRadius: 8, border: "none", background: on ? accent : "transparent", color: on ? "#1B2430" : "#8A8578", cursor: "pointer", transition: "background 0.15s, color 0.15s" }}>
                    <t.Icon size={15} />
                    {t.label}
                  </button>
                );
              })}
            </div>

            {activeWorkoutTab === "today" && (() => {
              const dayKey = currentDayKey();
              const todayPlan = workoutPlans.find((p) => p.id === workoutSchedule[dayKey]);
              const muscleVolume = todayPlan ? summarizeMuscleVolume(todayPlan.exercises, customExercises) : [];
              const maxVol = muscleVolume[0]?.volume || 1;
              return (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {workoutSession && (
                    <div style={{ background: "rgba(201,162,39,0.1)", border: `1px solid ${accent}`, borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: accent }}>Workout in progress</div>
                        <div style={{ fontSize: 10, color: "#8A8578" }}>{workoutSession.planName}</div>
                      </div>
                      <button onClick={() => setSessionOverlayOpen(true)} className="qlog-btn" style={{ background: accent, border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 11, fontWeight: 700, color: "#1B2430", cursor: "pointer" }}>Resume</button>
                    </div>
                  )}
                  {!todayPlan && (
                    <div style={{ background: themePersonality.cardBase, border: `1px solid ${themePersonality.borderCol}`, borderRadius: 10, padding: "24px 14px", textAlign: "center" }}>
                      <IconDumbbell size={26} color="#5C6773" style={{ marginBottom: 8 }} />
                      <p style={{ fontSize: 13, color: "#8A8578", margin: 0 }}>No workout scheduled for today.</p>
                      <button onClick={() => setActiveWorkoutTab("schedule")} className="qlog-btn" style={{ marginTop: 10, background: "#1F2836", border: "1px solid #33414F", borderRadius: 8, padding: "7px 14px", fontSize: 12, color: accent, cursor: "pointer" }}>Set up split</button>
                    </div>
                  )}
                  {todayPlan && (
                    <div style={{ background: themePersonality.cardBase, border: `1px solid ${themePersonality.borderCol}`, borderRadius: 10, padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 700 }}>{todayPlan.name}</span>
                        <span style={{ fontSize: 10, color: "#5C6773" }}>{todayPlan.exercises.length} exercises</span>
                      </div>
                      {muscleVolume.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 10 }}>
                          {muscleVolume.slice(0, 5).map((m) => (
                            <div key={m.muscle} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ fontSize: 10, color: "#8A8578", width: 72, flexShrink: 0 }}>{MUSCLE_LABELS[m.muscle]}</span>
                              <div style={{ flex: 1, height: 5, background: "#141C27", borderRadius: 3, overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${(m.volume / maxVol) * 100}%`, background: accent, borderRadius: 3 }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
                        {todayPlan.exercises.map((pe) => {
                          const ex = findExercise(pe.exerciseId, customExercises);
                          return (
                            <div key={pe.id} style={{ fontSize: 12, color: "#EDE4D3", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>{ex?.name || "?"} <InfoButton accent={accent} size={11} onClick={() => openExerciseGuide(ex)} /></span>
                              <span style={{ color: "#5C6773" }}>{pe.sets} × {pe.targetReps}{pe.targetWeight ? ` @ ${pe.targetWeight}` : ""}</span>
                            </div>
                          );
                        })}
                      </div>
                      {!workoutSession && (
                        <button onClick={() => startWorkout(todayPlan)} className="qlog-btn" style={{ width: "100%", background: accent, border: "none", borderRadius: 8, padding: "10px 0", fontWeight: 700, fontSize: 13, color: "#1B2430", cursor: "pointer" }}>Start Workout</button>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {activeWorkoutTab === "plans" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {workoutPlans.length === 0 && <p style={{ fontSize: 12, color: "#5C6773", textAlign: "center" }}>No plans yet — create one below.</p>}
                {workoutPlans.map((plan) => {
                  const isEditing = editingPlanId === plan.id;
                  const muscleVolume = summarizeMuscleVolume(plan.exercises, customExercises);
                  return (
                    <div key={plan.id} style={{ background: themePersonality.cardBase, border: `1px solid ${themePersonality.borderCol}`, borderRadius: 10, padding: "10px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <button onClick={() => setEditingPlanId(isEditing ? null : plan.id)} className="qlog-btn" style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", flex: 1, padding: 0 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#EDE4D3" }}>{plan.name}</span>
                          <span style={{ fontSize: 10, color: "#5C6773", marginLeft: 8 }}>{plan.exercises.length} exercises</span>
                        </button>
                        <button onClick={() => deleteWorkoutPlan(plan.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#4A5563", padding: 2 }}><Trash2 size={13} /></button>
                      </div>
                      {muscleVolume.length > 0 && (
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 6 }}>
                          {muscleVolume.slice(0, 4).map((m) => <span key={m.muscle} style={{ fontSize: 9, color: accent, background: accent + "18", borderRadius: 10, padding: "2px 7px" }}>{MUSCLE_LABELS[m.muscle]}</span>)}
                        </div>
                      )}
                      {isEditing && (
                        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                          {plan.exercises.map((pe) => {
                            const ex = findExercise(pe.exerciseId, customExercises);
                            return (
                              <div key={pe.id} style={{ background: "#1F2836", border: "1px solid #2C3947", borderRadius: 8, padding: "6px 8px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                                  <span style={{ fontSize: 12, color: "#EDE4D3", display: "flex", alignItems: "center", gap: 6 }}>{ex?.name || "?"} <InfoButton accent={accent} size={11} onClick={() => openExerciseGuide(ex)} /></span>
                                  <button onClick={() => removePlanExercise(plan.id, pe.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#4A5563" }}><X size={12} /></button>
                                </div>
                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                                  <label style={{ fontSize: 9, color: "#5C6773", display: "flex", alignItems: "center", gap: 4 }}>Sets <input type="number" min="1" value={pe.sets} onChange={(e) => updatePlanExercise(plan.id, pe.id, { sets: Math.max(1, Number(e.target.value) || 1) })} style={{ width: 40, background: "#141C27", border: "1px solid #33414F", borderRadius: 4, color: "#EDE4D3", padding: "3px 5px" }} /></label>
                                  <label style={{ fontSize: 9, color: "#5C6773", display: "flex", alignItems: "center", gap: 4 }}>Reps <input value={pe.targetReps} onChange={(e) => updatePlanExercise(plan.id, pe.id, { targetReps: e.target.value })} style={{ width: 50, background: "#141C27", border: "1px solid #33414F", borderRadius: 4, color: "#EDE4D3", padding: "3px 5px" }} /></label>
                                  <label style={{ fontSize: 9, color: "#5C6773", display: "flex", alignItems: "center", gap: 4 }}>Rest(s) <input type="number" min="0" value={pe.restSeconds} onChange={(e) => updatePlanExercise(plan.id, pe.id, { restSeconds: Math.max(0, Number(e.target.value) || 0) })} style={{ width: 50, background: "#141C27", border: "1px solid #33414F", borderRadius: 4, color: "#EDE4D3", padding: "3px 5px" }} /></label>
                                  <label style={{ fontSize: 9, color: "#5C6773", display: "flex", alignItems: "center", gap: 4 }}>Weight <input type="number" min="0" step="0.5" value={pe.targetWeight || ""} onChange={(e) => updatePlanExercise(plan.id, pe.id, { targetWeight: e.target.value === "" ? "" : Math.max(0, Number(e.target.value) || 0) })} placeholder="0" style={{ width: 50, background: "#141C27", border: "1px solid #33414F", borderRadius: 4, color: "#EDE4D3", padding: "3px 5px" }} /></label>
                                </div>
                              </div>
                            );
                          })}
                          <button onClick={() => setExercisePickerFor(plan.id)} className="qlog-btn" style={{ background: "#1F2836", border: "1px solid #33414F", borderRadius: 8, padding: "7px 0", fontSize: 12, color: accent, cursor: "pointer" }}>+ Add Exercise</button>
                        </div>
                      )}
                    </div>
                  );
                })}
                <div style={{ display: "flex", gap: 6 }}>
                  <input value={newPlanName} onChange={(e) => setNewPlanName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addWorkoutPlan(newPlanName)} placeholder="New plan — e.g. Push Day" style={{ flex: 1, background: "#141C27", border: "1px solid #33414F", borderRadius: 6, padding: "7px 10px", color: "#EDE4D3", fontSize: 12 }} />
                  <button onClick={() => addWorkoutPlan(newPlanName)} className="qlog-btn" style={{ background: accent, border: "none", borderRadius: 6, padding: "0 10px", display: "flex", alignItems: "center", cursor: "pointer" }}><Plus size={14} color="#1B2430" /></button>
                </div>
              </div>
            )}

            {activeWorkoutTab === "schedule" && (
              <div style={{ background: themePersonality.cardBase, border: `1px solid ${themePersonality.borderCol}`, borderRadius: 10, padding: "12px 14px" }}>
                <p style={{ fontSize: 11, color: "#8A8578", margin: "0 0 10px" }}>Assign a plan to each weekday — it repeats every week.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {DAYS.map((d) => (
                    <div key={d.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 36, fontSize: 12, fontWeight: 700, color: d.key === currentDayKey() ? accent : "#8A8578" }}>{d.label}</span>
                      <select value={workoutSchedule[d.key] || ""} onChange={(e) => setScheduleDay(d.key, e.target.value ? Number(e.target.value) : null)} style={{ flex: 1, background: "#141C27", border: "1px solid #33414F", borderRadius: 6, padding: "6px 8px", color: "#EDE4D3", fontSize: 12 }}>
                        <option value="">Rest day</option>
                        {workoutPlans.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                {workoutPlans.length === 0 && <p style={{ fontSize: 11, color: "#5C6773", marginTop: 10, marginBottom: 0 }}>Create a plan first in the Plans tab.</p>}
              </div>
            )}

            {activeWorkoutTab === "history" && (
              historyExerciseId ? (() => {
                const ex = findExercise(historyExerciseId, customExercises);
                const sessions = workoutHistory.filter((h) => h.exercises.some((e) => e.exerciseId === historyExerciseId)).sort((a, b) => (a.date < b.date ? 1 : -1));
                const points = sessions.map((h) => {
                  const entry = h.exercises.find((e) => e.exerciseId === historyExerciseId);
                  const best = entry.sets.reduce((b, s) => (s.weight > (b?.weight || 0) ? s : b), null);
                  const volume = entry.sets.reduce((v, s) => v + s.weight * s.reps, 0);
                  return { date: h.date, weight: best?.weight || 0, reps: best?.reps || 0, volume };
                }).reverse(); // oldest first for the chart
                const maxWeight = Math.max(1, ...points.map((p) => p.weight));
                const minWeight = Math.min(...points.map((p) => p.weight), maxWeight);
                const prWeight = maxWeight;
                const chartW = 300, chartH = 90, padX = 6, padY = 10;
                const stepX = points.length > 1 ? (chartW - padX * 2) / (points.length - 1) : 0;
                const yFor = (w) => {
                  if (maxWeight === minWeight) return chartH / 2;
                  return padY + (chartH - padY * 2) * (1 - (w - minWeight) / (maxWeight - minWeight));
                };
                const linePoints = points.map((p, i) => `${padX + i * stepX},${yFor(p.weight)}`).join(" ");
                return (
                  <div>
                    <button onClick={() => setHistoryExerciseId(null)} className="qlog-btn" style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", color: accent, cursor: "pointer", fontSize: 12, marginBottom: 10, padding: 0 }}><ChevronLeft size={14} /> All exercises</button>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                      <span style={{ fontSize: 14, fontWeight: 700 }}>{ex?.name || "Exercise"}</span>
                      <InfoButton accent={accent} onClick={() => openExerciseGuide(ex)} />
                    </div>
                    {points.length === 0 && <p style={{ fontSize: 12, color: "#5C6773" }}>No history for this exercise yet.</p>}
                    {points.length > 0 && (
                      <div style={{ background: "#1F2836", border: "1px solid #2C3947", borderRadius: 10, padding: "10px 10px 6px", marginBottom: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: "#8A8578", textTransform: "uppercase", letterSpacing: 0.4 }}>Weight progress</span>
                          <span style={{ fontSize: 11, color: accent, fontWeight: 700 }}>PR {prWeight}{points[points.length - 1]?.weight === prWeight ? " 🔥" : ""}</span>
                        </div>
                        {points.length > 1 ? (
                          <svg viewBox={`0 0 ${chartW} ${chartH}`} width="100%" height={chartH} preserveAspectRatio="none">
                            <polyline points={linePoints} fill="none" stroke={accent} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                            {points.map((p, i) => (
                              <circle key={i} cx={padX + i * stepX} cy={yFor(p.weight)} r={p.weight === prWeight ? 3.5 : 2.5} fill={p.weight === prWeight ? accent : "#EDE4D3"} />
                            ))}
                          </svg>
                        ) : (
                          <p style={{ fontSize: 11, color: "#5C6773", margin: "4px 0 8px" }}>Log another session to see a trend line.</p>
                        )}
                      </div>
                    )}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {sessions.map((h) => {
                        const entry = h.exercises.find((e) => e.exerciseId === historyExerciseId);
                        const best = entry.sets.reduce((b, s) => (s.weight > (b?.weight || 0) ? s : b), null);
                        const volume = entry.sets.reduce((v, s) => v + s.weight * s.reps, 0);
                        return (
                          <div key={h.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1F2836", border: "1px solid #2C3947", borderRadius: 8, padding: "7px 10px" }}>
                            <span style={{ fontSize: 11, color: "#8A8578" }}>{parseLocalDate(h.date).toLocaleDateString(undefined, { day: "numeric", month: "short" })}</span>
                            <span style={{ fontSize: 12, color: "#EDE4D3", fontFamily: "ui-monospace, Menlo, monospace" }}>{best ? `${best.weight} × ${best.reps}` : "-"}{best?.weight === prWeight && prWeight > 0 ? " 🏆" : ""}</span>
                            <span style={{ fontSize: 10, color: accent }}>{volume} vol</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })() : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#8A8578", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>By exercise</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {[...new Set(workoutHistory.flatMap((h) => h.exercises.map((e) => e.exerciseId)))].map((exId) => {
                        const ex = findExercise(exId, customExercises);
                        return <button key={exId} onClick={() => setHistoryExerciseId(exId)} className="qlog-btn" style={{ fontSize: 11, background: "#1F2836", border: "1px solid #2C3947", borderRadius: 16, padding: "5px 10px", color: "#8A8578", cursor: "pointer" }}>{ex?.name || "?"}</button>;
                      })}
                      {workoutHistory.length === 0 && <span style={{ fontSize: 11, color: "#5C6773" }}>Complete a workout to see progress here.</span>}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#8A8578", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>Sessions</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {workoutHistory.map((h) => (
                        <div key={h.id} style={{ background: "#1F2836", border: "1px solid #2C3947", borderRadius: 8, padding: "8px 10px" }}>
                          <div onClick={() => setExpandedHistoryId(expandedHistoryId === h.id ? null : h.id)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                            <div>
                              <div style={{ fontSize: 12, fontWeight: 700, color: "#EDE4D3" }}>{h.planName}</div>
                              <div style={{ fontSize: 10, color: "#5C6773" }}>{parseLocalDate(h.date).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })} · {fmtTime(h.durationSeconds)} · {h.totalVolume} vol</div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 11, color: accent, fontFamily: "ui-monospace, Menlo, monospace" }}>+{h.xpEarned} XP</span>
                              <button onClick={(e) => { e.stopPropagation(); deleteWorkoutHistoryEntry(h.id); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#4A5563" }}><Trash2 size={12} /></button>
                            </div>
                          </div>
                          {expandedHistoryId === h.id && (
                            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                              {h.exercises.map((e, i) => (
                                <div key={i} style={{ fontSize: 11, color: "#8A8578" }}>{e.name}: {e.sets.map((s, j) => <span key={j} style={{ marginRight: 6, fontFamily: "ui-monospace, Menlo, monospace" }}>{s.weight}×{s.reps}</span>)}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      {workoutHistory.length === 0 && <p style={{ fontSize: 12, color: "#5C6773" }}>No workouts completed yet.</p>}
                    </div>
                  </div>
                </div>
              )
            )}

            {activeWorkoutTab === "generate" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {!aiPreview && (
                  <div style={{ background: "#1F2836", border: "1px solid #2C3947", borderRadius: 10, padding: 12, display: "flex", flexDirection: "column", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#8A8578", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>Equipment you have</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {EQUIPMENT_TYPES.map((eq) => {
                          const on = aiEquipment.includes(eq);
                          return (
                            <button key={eq} onClick={() => setAiEquipment((cur) => on ? cur.filter((e) => e !== eq) : [...cur, eq])} className="qlog-btn"
                              style={{ fontSize: 11, background: on ? accent : "#141C27", border: `1px solid ${on ? accent : "#33414F"}`, borderRadius: 16, padding: "5px 10px", color: on ? "#1B2430" : "#8A8578", cursor: "pointer", fontWeight: on ? 700 : 400 }}>
                              {EQUIPMENT_LABELS[eq] || eq}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#8A8578", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>Days per week</div>
                      <div style={{ display: "flex", gap: 6 }}>
                        {[2, 3, 4, 5, 6].map((n) => (
                          <button key={n} onClick={() => setAiDaysPerWeek(n)} className="qlog-btn"
                            style={{ flex: 1, fontSize: 12, fontWeight: 700, background: aiDaysPerWeek === n ? accent : "#141C27", border: `1px solid ${aiDaysPerWeek === n ? accent : "#33414F"}`, borderRadius: 8, padding: "8px 0", color: aiDaysPerWeek === n ? "#1B2430" : "#8A8578", cursor: "pointer" }}>
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#8A8578", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>Split</div>
                        <select value={aiSplitType} onChange={(e) => setAiSplitType(e.target.value)} style={{ width: "100%", background: "#141C27", border: "1px solid #33414F", borderRadius: 6, padding: "8px", color: "#EDE4D3", fontSize: 12 }}>
                          <option value="auto">Auto</option>
                          <option value="full_body">Full Body</option>
                          <option value="upper_lower">Upper/Lower</option>
                          <option value="ppl">Push/Pull/Legs</option>
                          <option value="bro">Bro split</option>
                        </select>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#8A8578", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>Experience</div>
                        <select value={aiExperience} onChange={(e) => setAiExperience(e.target.value)} style={{ width: "100%", background: "#141C27", border: "1px solid #33414F", borderRadius: 6, padding: "8px", color: "#EDE4D3", fontSize: 12 }}>
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#8A8578", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>Goal</div>
                      <select value={aiGoal} onChange={(e) => setAiGoal(e.target.value)} style={{ width: "100%", background: "#141C27", border: "1px solid #33414F", borderRadius: 6, padding: "8px", color: "#EDE4D3", fontSize: 12 }}>
                        <option value="general">General fitness</option>
                        <option value="strength">Strength</option>
                        <option value="hypertrophy">Muscle growth</option>
                        <option value="fat_loss">Fat loss</option>
                        <option value="endurance">Endurance</option>
                      </select>
                    </div>

                    {aiError && <p style={{ fontSize: 12, color: "#C1652B", margin: 0 }}>{aiError}</p>}

                    <button onClick={handleGenerateWorkout} disabled={aiGenerating} className="qlog-btn" style={{ width: "100%", background: accent, border: "none", borderRadius: 8, padding: "12px 0", fontWeight: 700, fontSize: 13, color: "#1B2430", cursor: aiGenerating ? "default" : "pointer", opacity: aiGenerating ? 0.6 : 1 }}>
                      {aiGenerating ? "Generating..." : "✨ Generate Plan"}
                    </button>
                  </div>
                )}

                {aiPreview && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {aiPreview.plans.map((p, i) => (
                        <div key={i} style={{ background: "#1F2836", border: "1px solid #2C3947", borderRadius: 10, padding: 10 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{p.name}</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            {p.exercises.map((ex, j) => {
                              const exInfo = findExercise(ex.exerciseId, customExercises);
                              return (
                                <div key={j} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#8A8578" }}>
                                  <span>{exInfo?.name || ex.exerciseId}</span>
                                  <span style={{ fontFamily: "ui-monospace, Menlo, monospace", color: "#EDE4D3" }}>{ex.sets} × {ex.targetReps}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ background: "#1F2836", border: "1px solid #2C3947", borderRadius: 10, padding: 10 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#8A8578", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>Weekly Schedule</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {DAYS.map((d) => (
                          <div key={d.key} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                            <span style={{ color: "#8A8578" }}>{d.label}</span>
                            <span style={{ color: aiPreview.schedule[d.key] ? accent : "#5C6773" }}>{aiPreview.schedule[d.key] || "Rest"}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => setAiPreview(null)} className="qlog-btn" style={{ flex: 1, background: "#1F2836", border: "1px solid #33414F", borderRadius: 8, padding: "10px 0", fontWeight: 700, fontSize: 12, color: "#8A8578", cursor: "pointer" }}>Discard</button>
                      <button onClick={applyGeneratedWorkout} className="qlog-btn" style={{ flex: 1, background: accent, border: "none", borderRadius: 8, padding: "10px 0", fontWeight: 700, fontSize: 12, color: "#1B2430", cursor: "pointer" }}>Apply Plan</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeWorkoutTab === "exercises" && (() => {
              const allExercises = [...EXERCISE_CATALOGUE, ...customExercises];
              const filtered = allExercises.filter((ex) =>
                (!exerciseBrowseFilter.muscle || ex.muscleGroups.includes(exerciseBrowseFilter.muscle)) &&
                (!exerciseBrowseFilter.equipment || ex.equipment === exerciseBrowseFilter.equipment) &&
                (!exerciseBrowseFilter.q || ex.name.toLowerCase().includes(exerciseBrowseFilter.q.toLowerCase()))
              );
              return (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <input value={exerciseBrowseFilter.q} onChange={(e) => setExerciseBrowseFilter((f) => ({ ...f, q: e.target.value }))} placeholder="Search exercises..." style={{ width: "100%", background: "#141C27", border: "1px solid #33414F", borderRadius: 8, padding: "8px 10px", color: "#EDE4D3", fontSize: 13 }} />
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    <button onClick={() => setExerciseBrowseFilter((f) => ({ ...f, muscle: null }))} className="qlog-btn" style={{ fontSize: 10, padding: "3px 8px", borderRadius: 12, border: `1px solid ${!exerciseBrowseFilter.muscle ? accent : "#33414F"}`, background: !exerciseBrowseFilter.muscle ? accent : "transparent", color: !exerciseBrowseFilter.muscle ? "#1B2430" : "#8A8578", cursor: "pointer" }}>All muscles</button>
                    {MUSCLE_GROUPS.map((m) => (
                      <button key={m} onClick={() => setExerciseBrowseFilter((f) => ({ ...f, muscle: f.muscle === m ? null : m }))} className="qlog-btn" style={{ fontSize: 10, padding: "3px 8px", borderRadius: 12, border: `1px solid ${exerciseBrowseFilter.muscle === m ? accent : "#33414F"}`, background: exerciseBrowseFilter.muscle === m ? accent : "transparent", color: exerciseBrowseFilter.muscle === m ? "#1B2430" : "#8A8578", cursor: "pointer" }}>{MUSCLE_LABELS[m]}</button>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    <button onClick={() => setExerciseBrowseFilter((f) => ({ ...f, equipment: null }))} className="qlog-btn" style={{ fontSize: 10, padding: "3px 8px", borderRadius: 12, border: `1px solid ${!exerciseBrowseFilter.equipment ? accent : "#33414F"}`, background: !exerciseBrowseFilter.equipment ? accent : "transparent", color: !exerciseBrowseFilter.equipment ? "#1B2430" : "#8A8578", cursor: "pointer" }}>All equipment</button>
                    {EQUIPMENT_TYPES.map((eq) => (
                      <button key={eq} onClick={() => setExerciseBrowseFilter((f) => ({ ...f, equipment: f.equipment === eq ? null : eq }))} className="qlog-btn" style={{ fontSize: 10, padding: "3px 8px", borderRadius: 12, border: `1px solid ${exerciseBrowseFilter.equipment === eq ? accent : "#33414F"}`, background: exerciseBrowseFilter.equipment === eq ? accent : "transparent", color: exerciseBrowseFilter.equipment === eq ? "#1B2430" : "#8A8578", cursor: "pointer" }}>{EQUIPMENT_LABELS[eq]}</button>
                    ))}
                  </div>
                  <div style={{ fontSize: 10, color: "#5C6773" }}>{filtered.length} exercise{filtered.length === 1 ? "" : "s"}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {filtered.map((ex) => (
                      <div key={ex.id} style={{ display: "flex", flexDirection: "column", gap: 6, background: "#1F2836", border: "1px solid #2C3947", borderRadius: 10, padding: "10px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 4 }}>
                          <div style={{ fontSize: 12, color: "#EDE4D3", fontWeight: 600, lineHeight: 1.25 }}>{ex.name}</div>
                          <InfoButton accent={accent} size={12} onClick={() => openExerciseGuide(ex)} />
                        </div>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {ex.muscleGroups.slice(0, 2).map((m) => <span key={m} style={{ fontSize: 9, color: accent, background: accent + "18", borderRadius: 10, padding: "1px 6px" }}>{MUSCLE_LABELS[m]}</span>)}
                        </div>
                        <span style={{ fontSize: 9, color: "#5C6773" }}>{EQUIPMENT_LABELS[ex.equipment]}</span>
                      </div>
                    ))}
                    {filtered.length === 0 && <p style={{ fontSize: 12, color: "#5C6773", gridColumn: "1 / -1" }}>No exercises match those filters.</p>}
                  </div>
                </div>
              );
            })()}

            {activeWorkoutTab === "ranks" && (() => {
              const rows = computeExerciseRankRows(workoutHistory, customExercises);
              const overall = computeOverallRank(rows);

              if (rankLeaderboardId) {
                const row = rows.find((r) => r.id === rankLeaderboardId);
                if (!row) {
                  return (
                    <div>
                      <button onClick={() => setRankLeaderboardId(null)} className="qlog-btn" style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", color: accent, cursor: "pointer", fontSize: 12, padding: 0 }}><ChevronLeft size={14} /> All ranks</button>
                      <p style={{ fontSize: 12, color: "#5C6773", marginTop: 10 }}>No rank data for that exercise yet.</p>
                    </div>
                  );
                }
                const entries = [{ uid: user.uid, username: myUsername || "You", isSelf: true, score: row.score, idx: row.idx, info: row.info }];
                Object.entries(friendsData).forEach(([uid, profile]) => {
                  const friendProfile = getExerciseRankProfile(row.ex);
                  const friendScore = bestScoreForExercise(rankLeaderboardId, profile.workoutHistory || [], friendProfile);
                  const friendIdx = friendScore > 0 ? rankIndexForScore(friendScore, friendProfile) : -1;
                  entries.push({ uid, username: profile.username || "?", isSelf: false, score: friendScore, idx: friendIdx, info: rankInfo(friendIdx) });
                });
                entries.sort((a, b) => b.score - a.score);
                const medals = ["🥇", "🥈", "🥉"];
                return (
                  <div>
                    <button onClick={() => setRankLeaderboardId(null)} className="qlog-btn" style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", color: accent, cursor: "pointer", fontSize: 12, marginBottom: 10, padding: 0 }}><ChevronLeft size={14} /> All ranks</button>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                      <span style={{ fontSize: 14, fontWeight: 700 }}>{row.ex?.name || "Exercise"}</span>
                      <InfoButton accent={accent} onClick={() => openExerciseGuide(row.ex)} />
                    </div>
                    <div style={{ fontSize: 10, color: "#5C6773", marginBottom: 10 }}>Ranked by {row.profile?.mode === "reps" ? "best reps" : "estimated 1-rep max"}. Friend scores use their last 10 synced sessions.</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {entries.map((e, i) => (
                        <div key={e.uid} style={{ display: "flex", alignItems: "center", gap: 10, background: e.isSelf ? `${accent}14` : "#1F2836", border: `1px solid ${e.isSelf ? accent : "#2C3947"}`, borderRadius: 8, padding: "8px 10px" }}>
                          <span style={{ fontSize: 13, width: 22, textAlign: "center", flexShrink: 0 }}>{e.info.unranked ? <IconShield size={13} color={UNRANKED_COLOR} /> : (medals[i] || `#${i + 1}`)}</span>
                          <span style={{ flex: 1, fontSize: 12, color: "#EDE4D3", fontWeight: e.isSelf ? 700 : 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.isSelf ? `${e.username} (you)` : e.username}</span>
                          <span style={{ fontSize: 10, fontWeight: 700, color: e.info.color, background: e.info.color + "22", borderRadius: 10, padding: "2px 8px", flexShrink: 0 }}>{e.info.label}</span>
                          <span style={{ fontSize: 11, color: "#8A8578", fontFamily: "ui-monospace, Menlo, monospace", flexShrink: 0, width: 44, textAlign: "right" }}>{e.info.unranked ? "—" : Math.round(e.score)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {(() => {
                    const shown = overall || { info: rankInfo(-1), progress: 0, exerciseCount: 0 };
                    return (
                      <div style={{ background: `linear-gradient(135deg, ${shown.info.color}22, #1F2836)`, border: `1px solid ${shown.info.color}66`, borderRadius: 10, padding: "12px 14px", marginBottom: 2 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#8A8578", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 4 }}>Overall Rank</div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                          <span style={{ fontSize: 20, fontWeight: 700, color: shown.info.color, fontFamily: "Georgia, serif" }}>{shown.info.label}</span>
                          {shown.info.unranked ? <IconShield size={22} color={shown.info.color} /> : <Trophy size={22} color={shown.info.color} />}
                        </div>
                        <div style={{ height: 6, background: "#141C27", borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${shown.info.unranked ? 0 : shown.info.isMax ? 100 : shown.progress * 100}%`, background: shown.info.color, borderRadius: 4 }} />
                        </div>
                        <div style={{ fontSize: 9, color: "#5C6773", marginTop: 4 }}>
                          {shown.info.unranked ? "Complete a workout to start earning ranks" : shown.info.isMax ? "Max rank reached" : `${Math.round(shown.progress * 100)}% to next rank`}
                          {!shown.info.unranked && ` · from your top ${Math.min(8, shown.exerciseCount)} ranked exercise${Math.min(8, shown.exerciseCount) === 1 ? "" : "s"}`}
                        </div>
                      </div>
                    );
                  })()}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                    <p style={{ fontSize: 11, color: "#5C6773", margin: "0 0 4px", flex: 1 }}>Ranks are calculated from your all-time best weight and reps per exercise. Tap one to see how you compare to friends.</p>
                    <button onClick={() => setRankInfoModalOpen(true)} aria-label="How ranks work" title="How ranks work" className="qlog-btn" style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 4, background: "#1F2836", border: "1px solid #2C3947", borderRadius: 12, padding: "3px 9px", fontSize: 10, fontWeight: 700, color: accent, cursor: "pointer" }}>
                      <Info size={11} /> How ranks work
                    </button>
                  </div>
                  {rows.length === 0 && <p style={{ fontSize: 12, color: "#5C6773" }}>Complete a workout to start earning ranks.</p>}
                  {rows.map((r) => (
                    <button key={r.id} onClick={() => setRankLeaderboardId(r.id)} className="qlog-btn" style={{ display: "flex", flexDirection: "column", gap: 6, background: "#1F2836", border: "1px solid #2C3947", borderRadius: 10, padding: "10px 12px", cursor: "pointer", textAlign: "left" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 12.5, color: "#EDE4D3", fontWeight: 600 }}>{r.ex?.name || "?"}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: r.info.color, background: r.info.color + "22", borderRadius: 10, padding: "2px 8px" }}>{r.info.label}</span>
                      </div>
                      <div style={{ height: 5, background: "#141C27", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${r.info.isMax ? 100 : r.progress * 100}%`, background: r.info.color, borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 9, color: "#5C6773" }}>{r.info.isMax ? "Max rank reached" : `${Math.round(r.progress * 100)}% to ${RANK_TIER_NAMES[Math.floor(Math.min(r.idx + 1, TOTAL_RANKS - 1) / 3)]} ${RANK_SUBLABELS[Math.min(r.idx + 1, TOTAL_RANKS - 1) % 3]}`}</span>
                    </button>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* Gear */}
        {activeTab === "gear" && (
          <div style={{ marginBottom: 20 }}>
          <div style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 10, padding: 10, marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>⚔ Gear</span>
              <span style={{ fontSize: 9, color: "#5C6773", fontWeight: 600 }}>{inventory.length}/{ITEM_CATALOGUE.length} collected</span>
            </div>

            {/* Active stats bar */}
            <div style={{ background: "#1F2836", border: `1px solid ${activeStats.activeSets.length > 0 ? "#C9A227" : "#2C3947"}`, borderRadius: 8, padding: "7px 9px", marginBottom: 8, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              {activeStats.activeSets.length > 0 && activeStats.activeSets.map((s) => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: s.color }} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: s.color }}>{s.label}</span>
                </div>
              ))}
              <span style={{ fontSize: 10, fontFamily: "ui-monospace, Menlo, monospace", color: accent }}>⚔ +{Math.round(activeStats.xpPct * 100)}% XP</span>
              <span style={{ fontSize: 10, fontFamily: "ui-monospace, Menlo, monospace", color: "#C9A227" }}>💰 +{activeStats.goldFlat}g</span>
              <span style={{ fontSize: 10, fontFamily: "ui-monospace, Menlo, monospace", color: "#4FA3C9" }}>🛡 {activeStats.defense + (playerStats.bonusDef || 0)}</span>
              <span style={{ fontSize: 10, fontFamily: "ui-monospace, Menlo, monospace", color: "#8A2E44" }}>❤ {activeStats.maxHealth + (playerStats.bonusHp || 0)}</span>
              {(activeStats.critChance + (playerStats.bonusCrit || 0)) > 0 && <span style={{ fontSize: 10, fontFamily: "ui-monospace, Menlo, monospace", color: "#C1652B" }}>💥 {Math.round((activeStats.critChance + (playerStats.bonusCrit || 0)) * 100)}% crit</span>}
              {(playerStats.bonusAtk || 0) > 0 && <span style={{ fontSize: 10, fontFamily: "ui-monospace, Menlo, monospace", color: accent }}>+{playerStats.bonusAtk} ATK</span>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 6 }}>
              {SLOTS.map((slot) => {
                const equippedItem = equipped[slot] ? ITEM_CATALOGUE.find((i) => i.id === equipped[slot]) : null;
                const rar = equippedItem ? RARITIES[equippedItem.rarity] : null;
                return (
                  <button key={slot} onClick={() => { setPickingSlot(slot); setCollectionOpen(true); }} className="qlog-btn"
                    style={{ background: equippedItem ? rar.glow : "#1F2836", border: `1.5px solid ${equippedItem ? rar.color : "#2C3947"}`, borderRadius: 8, padding: "8px 4px", textAlign: "center", cursor: "pointer" }}>
                    <div style={{ fontSize: 8, fontWeight: 700, color: "#8A8578", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 4 }}>{SLOT_LABELS[slot]}</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 20, marginBottom: 3 }}>
                      {equippedItem ? equippedItem.icon(rar.color) : <Plus size={13} color="#33414F" />}
                    </div>
                    <div style={{ fontSize: 8, fontWeight: 700, color: equippedItem ? rar.color : "#4A5563", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{equippedItem ? equippedItem.label : "Empty"}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Collection by rarity */}
          <div style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 10, padding: "12px 14px", marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#8A8578", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>Collection by Rarity</div>
            {RARITY_ORDER.map((r) => {
              const total = ITEM_CATALOGUE.filter((i) => i.rarity === r).length;
              const owned = ITEM_CATALOGUE.filter((i) => i.rarity === r && inventory.includes(i.id)).length;
              const rar = RARITIES[r];
              return (
                <div key={r} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 10, color: rar.color, width: 66, flexShrink: 0, fontWeight: 700 }}>{rar.label}</span>
                  <div style={{ flex: 1, height: 6, background: "#141C27", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${total ? (owned / total) * 100 : 0}%`, background: rar.color, borderRadius: 4 }} />
                  </div>
                  <span style={{ fontSize: 10, color: "#8A8578", fontFamily: "ui-monospace, Menlo, monospace", width: 38, textAlign: "right", flexShrink: 0 }}>{owned}/{total}</span>
                </div>
              );
            })}
          </div>

          {/* Set bonuses */}
          <div style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#8A8578", textTransform: "uppercase", letterSpacing: 0.4 }}>Set Bonuses</span>
              <span style={{ fontSize: 9, color: "#5C6773" }}>{activeStats.activeSets.length} active</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {SETS.map((set) => {
                const equippedCount = set.items.filter((id) => Object.values(equipped).includes(id)).length;
                const isActive = activeStats.activeSets.some((s) => s.id === set.id);
                return { set, equippedCount, isActive };
              })
                .sort((a, b) => (b.isActive - a.isActive) || (b.equippedCount / b.set.requiredCount - a.equippedCount / a.set.requiredCount))
                .map(({ set, equippedCount, isActive }) => (
                  <div key={set.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: isActive ? set.color + "18" : "#1F2836", border: `1px solid ${isActive ? set.color : "#2C3947"}`, borderRadius: 8, padding: "7px 10px" }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: isActive ? set.color : "#8A8578" }}>{set.label}</div>
                      <div style={{ fontSize: 9, color: "#5C6773" }}>{set.desc}</div>
                    </div>
                    <span style={{ fontSize: 10, fontFamily: "ui-monospace, Menlo, monospace", color: isActive ? set.color : "#5C6773", flexShrink: 0 }}>{equippedCount}/{set.requiredCount} equipped</span>
                  </div>
                ))}
            </div>
          </div>
          </div>
        )}

        {/* Friends */}
        {activeTab === "friends" && (
          <div style={{ marginBottom: 20 }}>
            {!myUsername ? (
              <div style={{ background: themePersonality.cardBase, border: `1px solid ${themePersonality.borderCol}`, borderRadius: 10, padding: "20px 14px", textAlign: "center" }}>
                <IconUsers size={26} color="#5C6773" style={{ marginBottom: 8 }} />
                <p style={{ fontSize: 13, color: "#8A8578", margin: "0 0 12px" }}>Set a username to add friends and let them find you.</p>
                <div style={{ display: "flex", gap: 6, maxWidth: 280, margin: "0 auto" }}>
                  <input value={usernameInput} onChange={(e) => { setUsernameInput(e.target.value); setUsernameMsg(null); }} placeholder="Choose a username" style={{ flex: 1, background: "#141C27", border: "1px solid #33414F", borderRadius: 8, padding: "8px 10px", color: "#EDE4D3", fontSize: 13 }} />
                  <button onClick={handleSaveUsername} disabled={usernameBusy || !usernameInput.trim()} className="qlog-btn" style={{ background: accent, border: "none", borderRadius: 8, padding: "0 14px", fontWeight: 700, fontSize: 12, color: "#1B2430", cursor: "pointer" }}>Save</button>
                </div>
                {usernameMsg && <p style={{ fontSize: 11, marginTop: 8, color: usernameMsg.type === "error" ? "#C1652B" : "#4C9A6A" }}>{usernameMsg.text}</p>}
              </div>
            ) : selectedFriendUid ? (() => {
              const friend = friendsData[selectedFriendUid];
              if (!friend) return null;
              const friendLevel = levelFromXP(friend.totalXP || 0);
              const friendRankRows = computeExerciseRankRows(friend.workoutHistory || [], customExercises);
              const friendOverall = computeOverallRank(friendRankRows) || { info: rankInfo(-1) };
              return (
                <div>
                  <button onClick={() => setSelectedFriendUid(null)} className="qlog-btn" style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", color: accent, cursor: "pointer", fontSize: 12, marginBottom: 12, padding: 0 }}><ChevronLeft size={14} /> All friends</button>

                  <div style={{ background: themePersonality.cardBase, border: `1px solid ${themePersonality.borderCol}`, borderRadius: 10, padding: "12px 14px", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 15, fontWeight: 700 }}>{friend.username}</span>
                      <button onClick={() => handleRemoveFriend(selectedFriendUid)} className="qlog-btn" style={{ background: "none", border: "1px solid #33414F", borderRadius: 6, padding: "4px 10px", fontSize: 10, color: "#8A2E44", cursor: "pointer" }}>Remove Friend</button>
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 16, color: accent, fontFamily: "Georgia, serif" }}>Lv {friendLevel.level}</span>
                      <Flame size={13} color={friend.streak > 0 ? "#C1652B" : "#4A5563"} fill={friend.streak > 0 ? "#C1652B" : "none"} />
                      <span style={{ fontSize: 12, color: friend.streak > 0 ? "#C1652B" : "#8A8578", fontFamily: "ui-monospace, Menlo, monospace" }}>{friend.streak || 0}d streak</span>
                    </div>
                    <div style={{ height: 6, background: "#141C27", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(friendLevel.into / friendLevel.need) * 100}%`, background: accent, borderRadius: 4 }} />
                    </div>
                  </div>

                  <div style={{ background: themePersonality.cardBase, border: `1px solid ${themePersonality.borderCol}`, borderRadius: 10, padding: "12px 14px", marginBottom: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#8A8578", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>Equipped</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {GEAR_SLOTS.map((slot) => {
                        const itemId = friend.equipped?.[slot];
                        const item = itemId ? ITEM_CATALOGUE.find((i) => i.id === itemId) : null;
                        const rar = item ? RARITIES[item.rarity] : null;
                        return (
                          <div key={slot} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: item ? rar.glow : "#1F2836", border: `1px solid ${item ? rar.color : "#2C3947"}`, borderRadius: 8, padding: "7px 4px" }}>
                            <div style={{ height: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>{item ? item.icon(rar.color) : <X size={12} color="#33414F" />}</div>
                            <span style={{ fontSize: 8, fontWeight: 700, color: item ? rar.color : "#4A5563", textAlign: "center" }}>{item ? item.label : SLOT_LABELS[slot]}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ background: `linear-gradient(135deg, ${friendOverall.info.color}22, #1F2836)`, border: `1px solid ${friendOverall.info.color}66`, borderRadius: 10, padding: "12px 14px", marginBottom: 10 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#8A8578", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 4 }}>Overall Rank</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 17, fontWeight: 700, color: friendOverall.info.color, fontFamily: "Georgia, serif" }}>{friendOverall.info.label}</span>
                      {friendOverall.info.unranked ? <IconShield size={18} color={friendOverall.info.color} /> : <Trophy size={18} color={friendOverall.info.color} />}
                    </div>
                  </div>

                  {friendRankRows.length === 0 && (
                    <p style={{ fontSize: 11, color: "#5C6773", margin: "0 0 10px" }}>No ranked exercises yet — they haven't logged a synced workout.</p>
                  )}

                  {friendRankRows.length > 0 && (
                    <div style={{ background: themePersonality.cardBase, border: `1px solid ${themePersonality.borderCol}`, borderRadius: 10, padding: "12px 14px", marginBottom: 10 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#8A8578", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>Exercise Ranks</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {friendRankRows.map((r) => (
                          <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 12, color: "#EDE4D3" }}>{r.ex?.name || "?"}</span>
                            <span style={{ fontSize: 10, fontWeight: 700, color: r.info.color, background: r.info.color + "22", borderRadius: 10, padding: "2px 8px" }}>{r.info.label}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize: 9, color: "#5C6773", marginTop: 8 }}>Based on their last 10 synced sessions.</div>
                    </div>
                  )}

                  <div style={{ background: themePersonality.cardBase, border: `1px solid ${themePersonality.borderCol}`, borderRadius: 10, padding: "12px 14px", marginBottom: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#8A8578", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>Routines</div>
                    {(friend.workoutPlans || []).length === 0 && <p style={{ fontSize: 12, color: "#5C6773", margin: 0 }}>No workout plans yet.</p>}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {(friend.workoutPlans || []).map((plan) => (
                        <div key={plan.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#EDE4D3" }}>
                          <span>{plan.name}</span>
                          <span style={{ color: "#5C6773" }}>{plan.exercises.length} exercises</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: themePersonality.cardBase, border: `1px solid ${themePersonality.borderCol}`, borderRadius: 10, padding: "12px 14px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#8A8578", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>Recent Workouts</div>
                    {(friend.workoutHistory || []).length === 0 && <p style={{ fontSize: 12, color: "#5C6773", margin: 0 }}>No workouts logged yet.</p>}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {(friend.workoutHistory || []).map((h) => (
                        <div key={h.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1F2836", border: "1px solid #2C3947", borderRadius: 8, padding: "7px 10px" }}>
                          <span style={{ fontSize: 12, color: "#EDE4D3" }}>{h.planName}</span>
                          <span style={{ fontSize: 10, color: "#8A8578" }}>{parseLocalDate(h.date).toLocaleDateString(undefined, { day: "numeric", month: "short" })}</span>
                          <span style={{ fontSize: 10, color: accent }}>{h.totalVolume} vol</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })() : (
              <>
                <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                  {[
                    { key: "friends", label: "Friends" },
                    { key: "requests", label: "Requests" },
                    { key: "add", label: "Add" },
                  ].map((t) => (
                    <button key={t.key} onClick={() => setActiveFriendsTab(t.key)} className="qlog-btn" style={{ flex: "0 0 auto", fontSize: 11, fontWeight: 700, padding: "6px 12px", borderRadius: 20, border: `1px solid ${activeFriendsTab === t.key ? accent : "#33414F"}`, background: activeFriendsTab === t.key ? accent : "#232E3D", color: activeFriendsTab === t.key ? "#1B2430" : "#8A8578", cursor: "pointer", position: "relative" }}>
                      {t.label}
                      {t.key === "requests" && friendRequests.incoming.length > 0 && (
                        <span style={{ position: "absolute", top: -4, right: -4, width: 16, height: 16, borderRadius: "50%", background: "#8A2E44", color: "#EDE4D3", fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>{friendRequests.incoming.length}</span>
                      )}
                    </button>
                  ))}
                </div>

                {activeFriendsTab === "friends" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {friendsLoading && <p style={{ fontSize: 12, color: "#5C6773", textAlign: "center" }}>Loading...</p>}
                    {!friendsLoading && friendIds.length === 0 && <p style={{ fontSize: 12, color: "#5C6773", textAlign: "center" }}>No friends yet — add one in the Add tab.</p>}
                    {friendIds.map((uid) => {
                      const friend = friendsData[uid];
                      if (!friend) return null;
                      const friendLevel = levelFromXP(friend.totalXP || 0);
                      const friendOverall = computeOverallRank(computeExerciseRankRows(friend.workoutHistory || [], customExercises)) || { info: rankInfo(-1) };
                      return (
                        <button key={uid} onClick={() => setSelectedFriendUid(uid)} className="qlog-btn" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#1F2836", border: "1px solid #2C3947", borderRadius: 8, padding: "10px 12px", cursor: "pointer", textAlign: "left" }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#EDE4D3" }}>{friend.username}</span>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 700, color: friendOverall.info.color, background: friendOverall.info.color + "22", borderRadius: 10, padding: "2px 7px" }}>
                              {friendOverall.info.unranked ? <IconShield size={10} color={friendOverall.info.color} /> : <Trophy size={10} color={friendOverall.info.color} />}
                              {friendOverall.info.label}
                            </span>
                            <span style={{ fontSize: 11, color: accent, fontFamily: "ui-monospace, Menlo, monospace" }}>Lv {friendLevel.level}</span>
                            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: friend.streak > 0 ? "#C1652B" : "#5C6773" }}><Flame size={11} color={friend.streak > 0 ? "#C1652B" : "#5C6773"} /> {friend.streak || 0}d</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {activeFriendsTab === "requests" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#8A8578", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>Incoming</div>
                      {friendRequests.incoming.length === 0 && <p style={{ fontSize: 12, color: "#5C6773" }}>No incoming requests.</p>}
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {friendRequests.incoming.map((r) => (
                          <div key={r.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#1F2836", border: "1px solid #2C3947", borderRadius: 8, padding: "8px 10px" }}>
                            <span style={{ fontSize: 12, color: "#EDE4D3" }}>{r.fromUsername}</span>
                            <div style={{ display: "flex", gap: 6 }}>
                              <button onClick={() => handleAcceptRequest(r.id)} className="qlog-btn" style={{ background: accent, border: "none", borderRadius: 6, padding: "5px 10px", fontSize: 11, fontWeight: 700, color: "#1B2430", cursor: "pointer" }}>Accept</button>
                              <button onClick={() => handleDeclineRequest(r.id)} className="qlog-btn" style={{ background: "none", border: "1px solid #33414F", borderRadius: 6, padding: "5px 10px", fontSize: 11, color: "#8A8578", cursor: "pointer" }}>Decline</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#8A8578", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>Outgoing</div>
                      {friendRequests.outgoing.length === 0 && <p style={{ fontSize: 12, color: "#5C6773" }}>No outgoing requests.</p>}
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {friendRequests.outgoing.map((r) => (
                          <div key={r.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#1F2836", border: "1px solid #2C3947", borderRadius: 8, padding: "8px 10px" }}>
                            <span style={{ fontSize: 12, color: "#8A8578" }}>{r.toUsername} <span style={{ color: "#5C6773" }}>· pending</span></span>
                            <button onClick={() => handleCancelRequest(r.id)} className="qlog-btn" style={{ background: "none", border: "1px solid #33414F", borderRadius: 6, padding: "5px 10px", fontSize: 11, color: "#8A8578", cursor: "pointer" }}>Cancel</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeFriendsTab === "add" && (
                  <div style={{ background: themePersonality.cardBase, border: `1px solid ${themePersonality.borderCol}`, borderRadius: 10, padding: "12px 14px" }}>
                    <p style={{ fontSize: 11, color: "#8A8578", margin: "0 0 10px" }}>Enter a friend's username to send them a request.</p>
                    <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                      <input value={friendSearchInput} onChange={(e) => { setFriendSearchInput(e.target.value); setFriendSearchMsg(null); }} onKeyDown={(e) => e.key === "Enter" && handleSendFriendRequest()} placeholder="username" style={{ flex: 1, background: "#141C27", border: "1px solid #33414F", borderRadius: 8, padding: "8px 10px", color: "#EDE4D3", fontSize: 13 }} />
                      <button onClick={handleSendFriendRequest} disabled={friendSearchBusy || !friendSearchInput.trim()} className="qlog-btn" style={{ background: accent, border: "none", borderRadius: 8, padding: "0 14px", fontWeight: 700, fontSize: 12, color: "#1B2430", cursor: "pointer" }}>Send</button>
                    </div>
                    {friendSearchMsg && <p style={{ fontSize: 12, margin: 0, color: friendSearchMsg.type === "error" ? "#C1652B" : "#4C9A6A" }}>{friendSearchMsg.text}</p>}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Exercise picker */}
        {exercisePickerFor && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(10,14,20,0.7)", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => { setExercisePickerFor(null); setCustomExerciseForm(null); }}>
            <div onClick={(e) => e.stopPropagation()} style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 16, padding: 18, width: "100%", maxWidth: 420, maxHeight: "85vh", overflowY: "auto", position: "relative" }}>
              <button onClick={() => { setExercisePickerFor(null); setCustomExerciseForm(null); }} aria-label="Close" style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "#8A8578", cursor: "pointer" }}><X size={18} /></button>
              <h3 style={{ margin: "0 0 10px", fontSize: 15, fontWeight: 700, fontFamily: "Georgia, serif" }}>Add Exercise</h3>
              <input value={exercisePickerFilter.q} onChange={(e) => setExercisePickerFilter((f) => ({ ...f, q: e.target.value }))} placeholder="Search exercises..." style={{ width: "100%", marginBottom: 8, background: "#141C27", border: "1px solid #33414F", borderRadius: 8, padding: "8px 10px", color: "#EDE4D3", fontSize: 13 }} />
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 6 }}>
                <button onClick={() => setExercisePickerFilter((f) => ({ ...f, muscle: null }))} className="qlog-btn" style={{ fontSize: 10, padding: "3px 8px", borderRadius: 12, border: `1px solid ${!exercisePickerFilter.muscle ? accent : "#33414F"}`, background: !exercisePickerFilter.muscle ? accent : "transparent", color: !exercisePickerFilter.muscle ? "#1B2430" : "#8A8578", cursor: "pointer" }}>All muscles</button>
                {MUSCLE_GROUPS.map((m) => (
                  <button key={m} onClick={() => setExercisePickerFilter((f) => ({ ...f, muscle: f.muscle === m ? null : m }))} className="qlog-btn" style={{ fontSize: 10, padding: "3px 8px", borderRadius: 12, border: `1px solid ${exercisePickerFilter.muscle === m ? accent : "#33414F"}`, background: exercisePickerFilter.muscle === m ? accent : "transparent", color: exercisePickerFilter.muscle === m ? "#1B2430" : "#8A8578", cursor: "pointer" }}>{MUSCLE_LABELS[m]}</button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
                <button onClick={() => setExercisePickerFilter((f) => ({ ...f, equipment: null }))} className="qlog-btn" style={{ fontSize: 10, padding: "3px 8px", borderRadius: 12, border: `1px solid ${!exercisePickerFilter.equipment ? accent : "#33414F"}`, background: !exercisePickerFilter.equipment ? accent : "transparent", color: !exercisePickerFilter.equipment ? "#1B2430" : "#8A8578", cursor: "pointer" }}>All equipment</button>
                {EQUIPMENT_TYPES.map((eq) => (
                  <button key={eq} onClick={() => setExercisePickerFilter((f) => ({ ...f, equipment: f.equipment === eq ? null : eq }))} className="qlog-btn" style={{ fontSize: 10, padding: "3px 8px", borderRadius: 12, border: `1px solid ${exercisePickerFilter.equipment === eq ? accent : "#33414F"}`, background: exercisePickerFilter.equipment === eq ? accent : "transparent", color: exercisePickerFilter.equipment === eq ? "#1B2430" : "#8A8578", cursor: "pointer" }}>{EQUIPMENT_LABELS[eq]}</button>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 280, overflowY: "auto", marginBottom: 10 }}>
                {[...EXERCISE_CATALOGUE, ...customExercises]
                  .filter((ex) => (!exercisePickerFilter.muscle || ex.muscleGroups.includes(exercisePickerFilter.muscle)) && (!exercisePickerFilter.equipment || ex.equipment === exercisePickerFilter.equipment) && (!exercisePickerFilter.q || ex.name.toLowerCase().includes(exercisePickerFilter.q.toLowerCase())))
                  .map((ex) => (
                    <div key={ex.id} style={{ display: "flex", alignItems: "center", gap: 4, background: "#1F2836", border: "1px solid #2C3947", borderRadius: 8, padding: "8px 10px" }}>
                      <button onClick={() => addExerciseToPlan(exercisePickerFor, ex.id)} className="qlog-btn" style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}>
                        <span style={{ fontSize: 12, color: "#EDE4D3" }}>{ex.name}</span>
                        <span style={{ fontSize: 9, color: "#5C6773" }}>{EQUIPMENT_LABELS[ex.equipment]}</span>
                      </button>
                      <InfoButton accent={accent} onClick={(e) => { e.stopPropagation(); openExerciseGuide(ex); }} />
                    </div>
                  ))}
              </div>
              {customExerciseForm ? (
                <div style={{ background: "#1F2836", border: "1px solid #2C3947", borderRadius: 8, padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                  <input value={customExerciseForm.name} onChange={(e) => setCustomExerciseForm((f) => ({ ...f, name: e.target.value }))} placeholder="Exercise name" style={{ background: "#141C27", border: "1px solid #33414F", borderRadius: 6, padding: "6px 8px", color: "#EDE4D3", fontSize: 12 }} />
                  <div style={{ display: "flex", gap: 6 }}>
                    <select value={customExerciseForm.primaryMuscle || ""} onChange={(e) => setCustomExerciseForm((f) => ({ ...f, primaryMuscle: e.target.value }))} style={{ flex: 1, background: "#141C27", border: "1px solid #33414F", borderRadius: 6, padding: "6px 8px", color: "#EDE4D3", fontSize: 12 }}>
                      <option value="">Muscle...</option>
                      {MUSCLE_GROUPS.map((m) => <option key={m} value={m}>{MUSCLE_LABELS[m]}</option>)}
                    </select>
                    <select value={customExerciseForm.equipment || ""} onChange={(e) => setCustomExerciseForm((f) => ({ ...f, equipment: e.target.value }))} style={{ flex: 1, background: "#141C27", border: "1px solid #33414F", borderRadius: 6, padding: "6px 8px", color: "#EDE4D3", fontSize: 12 }}>
                      <option value="">Equipment...</option>
                      {EQUIPMENT_TYPES.map((eq) => <option key={eq} value={eq}>{EQUIPMENT_LABELS[eq]}</option>)}
                    </select>
                  </div>
                  <button onClick={() => { const id = addCustomExercise(customExerciseForm); if (id) addExerciseToPlan(exercisePickerFor, id); }} className="qlog-btn" style={{ background: accent, border: "none", borderRadius: 6, padding: "7px 0", fontSize: 12, fontWeight: 700, color: "#1B2430", cursor: "pointer" }}>Add & Use</button>
                </div>
              ) : (
                <button onClick={() => setCustomExerciseForm({ name: "", primaryMuscle: "", equipment: "" })} className="qlog-btn" style={{ width: "100%", background: "none", border: "1px dashed #33414F", borderRadius: 8, padding: "8px 0", fontSize: 12, color: "#8A8578", cursor: "pointer" }}>+ Add custom exercise</button>
              )}
            </div>
          </div>
        )}

        {guideModalExerciseId && (() => {
          const ex = findExercise(guideModalExerciseId, customExercises);
          const guide = exerciseGuides[guideModalExerciseId];
          const loading = guideLoadingId === guideModalExerciseId;
          return (
            <div style={{ position: "fixed", inset: 0, background: "rgba(10,14,20,0.7)", zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => setGuideModalExerciseId(null)}>
              <div onClick={(e) => e.stopPropagation()} style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 16, padding: 18, width: "100%", maxWidth: 400, maxHeight: "80vh", overflowY: "auto", position: "relative" }}>
                <button onClick={() => setGuideModalExerciseId(null)} aria-label="Close" style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "#8A8578", cursor: "pointer" }}><X size={18} /></button>
                <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, fontFamily: "Georgia, serif" }}>{ex?.name || "Exercise"}</h3>
                <p style={{ margin: "0 0 14px", fontSize: 11, color: "#8A8578" }}>{MUSCLE_LABELS[ex?.primaryMuscle] || ""} · {EQUIPMENT_LABELS[ex?.equipment] || ""}</p>
                {loading && <p style={{ fontSize: 12, color: "#8A8578", display: "flex", alignItems: "center", gap: 6 }}><Loader2 size={14} className="spin" /> Loading instructions...</p>}
                {!loading && guideError && !guide && (
                  <div>
                    <p style={{ fontSize: 12, color: "#C1652B", marginBottom: 8 }}>{guideError}</p>
                    <button onClick={() => openExerciseGuide(ex)} className="qlog-btn" style={{ background: accent, border: "none", borderRadius: 6, padding: "7px 14px", fontSize: 12, fontWeight: 700, color: "#1B2430", cursor: "pointer" }}>Retry</button>
                  </div>
                )}
                {!loading && guide && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#8A8578", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>How to perform</div>
                      <ol style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 6 }}>
                        {guide.steps.map((s, i) => <li key={i} style={{ fontSize: 12.5, color: "#EDE4D3", lineHeight: 1.4 }}>{s}</li>)}
                      </ol>
                    </div>
                    {guide.tips.length > 0 && (
                      <div style={{ background: "#1F2836", border: "1px solid #2C3947", borderRadius: 8, padding: 10 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: accent, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>Form tips</div>
                        <ul style={{ margin: 0, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 4 }}>
                          {guide.tips.map((t, i) => <li key={i} style={{ fontSize: 12, color: "#8A8578", lineHeight: 1.4 }}>{t}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {rankInfoModalOpen && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(10,14,20,0.7)", zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => setRankInfoModalOpen(false)}>
            <div onClick={(e) => e.stopPropagation()} style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 16, padding: 18, width: "100%", maxWidth: 420, maxHeight: "80vh", overflowY: "auto", position: "relative" }}>
              <button onClick={() => setRankInfoModalOpen(false)} aria-label="Close" style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "#8A8578", cursor: "pointer" }}><X size={18} /></button>
              <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, fontFamily: "Georgia, serif", display: "flex", alignItems: "center", gap: 8 }}><Trophy size={16} color={accent} /> How ranks work</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: accent, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.4 }}>Tiers</div>
                  <p style={{ fontSize: 12.5, color: "#EDE4D3", lineHeight: 1.5, margin: 0 }}>There are 10 tiers — Bronze, Iron, Silver, Gold, Platinum, Diamond, Master, Grandmaster, Champion, Legend — each split into III, II and I, where I is the best. That's 30 ranks per exercise.</p>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: accent, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.4 }}>Your score</div>
                  <p style={{ fontSize: 12.5, color: "#EDE4D3", lineHeight: 1.5, margin: 0 }}>Each exercise is ranked from your all-time best logged set. For weighted lifts, that's an estimated 1-rep max from your weight and reps. For bodyweight moves, it's based on reps (with a bonus if you add weight).</p>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: accent, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.4 }}>Why exercises differ</div>
                  <p style={{ fontSize: 12.5, color: "#EDE4D3", lineHeight: 1.5, margin: 0 }}>The weight or reps needed to hit each rank depends on the exercise — big compound lifts (squats, deadlifts) need more weight than isolation moves (curls, extensions) to reach the same rank, and harder bodyweight moves (pull-ups, dips) need far fewer reps than easier ones (push-ups, bodyweight squats).</p>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: accent, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.4 }}>Getting harder</div>
                  <p style={{ fontSize: 12.5, color: "#EDE4D3", lineHeight: 1.5, margin: 0 }}>Each rank needs more than the last, and it compounds — climbing from Bronze to Diamond takes steady progress, but Master through Legend is an elite ceiling that takes real dedication to reach.</p>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: accent, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.4 }}>Overall Rank</div>
                  <p style={{ fontSize: 12.5, color: "#EDE4D3", lineHeight: 1.5, margin: 0 }}>Your Overall Rank averages your best 8 exercise ranks, plus a small bonus for having ranked in many different exercises. A few strong lifts is enough to place well — piling on easy exercises won't inflate it much on its own.</p>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: accent, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.4 }}>Leaderboards</div>
                  <p style={{ fontSize: 12.5, color: "#EDE4D3", lineHeight: 1.5, margin: 0 }}>Tapping an exercise shows how you compare to friends. Friend scores are based on their last 10 synced workout sessions, so their true best may be a little higher than shown.</p>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: accent, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>All ranks</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5 }}>
                    {Array.from({ length: TOTAL_RANKS }, (_, i) => TOTAL_RANKS - 1 - i).map((idx) => {
                      const info = rankInfo(idx);
                      return (
                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: 5, background: info.color + "18", border: `1px solid ${info.color}44`, borderRadius: 6, padding: "4px 6px" }}>
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: info.color, flexShrink: 0 }} />
                          <span style={{ fontSize: 10.5, color: info.color, fontWeight: 600, whiteSpace: "nowrap" }}>{info.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
              {!aiQuotaExhausted && !assessError && <p style={{ fontSize: 10, color: "#5C6773", margin: "8px 0 0", textAlign: "center" }}>Quest Log will assess difficulty + time automatically</p>}
            </div>
          </div>
        )}

        {dumpModalOpen && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(10,14,20,0.7)", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 16, padding: 22, width: "100%", maxWidth: 400, position: "relative", maxHeight: "90vh", overflowY: "auto" }}>
              <button onClick={() => setDumpModalOpen(false)} aria-label="Close" style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "#8A8578", cursor: "pointer" }}><X size={18} /></button>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}><FileText size={15} color={accent} /><span style={{ fontSize: 11, color: "#8A8578", fontWeight: 600 }}>BRAIN DUMP</span></div>
              <h3 style={{ margin: "4px 0 6px", fontSize: 16, fontWeight: 700, fontFamily: "Georgia, serif" }}>Paste everything at once</h3>
              <p style={{ fontSize: 12, color: "#8A8578", margin: "0 0 12px" }}>Quest Log will split into quests, assign dates across the coming weeks, and pick difficulty + time for each.</p>
              <textarea value={dumpText} onChange={(e) => setDumpText(e.target.value)} disabled={dumpParsing} placeholder="e.g. call dentist, finish slides for monday, laundry, dentist appointment next Thursday..." rows={5} style={{ width: "100%", resize: "vertical", background: "#141C27", border: "1px solid #33414F", borderRadius: 8, padding: "10px 12px", color: "#EDE4D3", fontSize: 13, marginBottom: 12, opacity: dumpParsing ? 0.6 : 1 }} />
              {dumpError && <p style={{ fontSize: 11, color: "#C1652B", margin: "0 0 12px" }}>That didn't go through — try again, or add quests one at a time.</p>}
              <button onClick={submitDump} className="qlog-btn" disabled={dumpParsing || !dumpText.trim()} style={{ width: "100%", background: accent, border: "none", borderRadius: 8, padding: "12px 0", fontWeight: 700, cursor: dumpParsing || !dumpText.trim() ? "default" : "pointer", opacity: dumpParsing || !dumpText.trim() ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#1B2430" }}>
                {dumpParsing ? <Loader2 size={18} className="spin" /> : <Sparkles size={18} />} {dumpParsing ? "Planning..." : "Turn into quests"}
              </button>
            </div>
          </div>
        )}

        {settingsOpen && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(10,14,20,0.7)", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 16, padding: 22, width: "100%", maxWidth: 400, position: "relative", maxHeight: "90vh", overflowY: "auto" }}>
              <button onClick={() => { setSettingsOpen(false); setConfirmClear(false); }} aria-label="Close" style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "#8A8578", cursor: "pointer" }}><X size={18} /></button>
              <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, fontFamily: "Georgia, serif" }}>Settings</h3>

              <SettingsSection title="ACCOUNT" defaultOpen={true}>
                <p style={{ fontSize: 11, color: "#5C6773", margin: "0 0 3px" }}>Email</p>
                <p style={{ fontSize: 13, color: "#EDE4D3", margin: "0 0 14px" }}>{user?.email}</p>

                <p style={{ fontSize: 11, color: "#5C6773", margin: "0 0 5px" }}>Username</p>
                <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                  <input value={usernameInput} onChange={(e) => { setUsernameInput(e.target.value); setUsernameMsg(null); }} placeholder="Add a display name" style={{ flex: 1, background: "#141C27", border: "1px solid #33414F", borderRadius: 8, padding: "8px 10px", color: "#EDE4D3", fontSize: 13 }} />
                  <button onClick={handleSaveUsername} disabled={usernameBusy || !usernameInput.trim()} className="qlog-btn" style={{ background: accent, border: "none", borderRadius: 8, padding: "0 14px", fontWeight: 700, fontSize: 12, color: "#1B2430", cursor: usernameBusy ? "default" : "pointer", opacity: usernameBusy || !usernameInput.trim() ? 0.6 : 1 }}>Save</button>
                </div>
                {usernameMsg && <p style={{ fontSize: 11, margin: "0 0 14px", color: usernameMsg.type === "error" ? "#C1652B" : "#4C9A6A" }}>{usernameMsg.text}</p>}
                {!usernameMsg && <div style={{ marginBottom: 14 }} />}

                <p style={{ fontSize: 11, color: "#5C6773", margin: "0 0 5px" }}>Change password</p>
                <input type="password" autoComplete="current-password" value={currentPasswordInput} onChange={(e) => { setCurrentPasswordInput(e.target.value); setPasswordMsg(null); }} placeholder="Current password" style={{ width: "100%", marginBottom: 6, background: "#141C27", border: "1px solid #33414F", borderRadius: 8, padding: "8px 10px", color: "#EDE4D3", fontSize: 13 }} />
                <input type="password" autoComplete="new-password" value={newPasswordInput} onChange={(e) => { setNewPasswordInput(e.target.value); setPasswordMsg(null); }} placeholder="New password (min 6 characters)" style={{ width: "100%", marginBottom: 8, background: "#141C27", border: "1px solid #33414F", borderRadius: 8, padding: "8px 10px", color: "#EDE4D3", fontSize: 13 }} />
                {passwordMsg && <p style={{ fontSize: 11, margin: "0 0 8px", color: passwordMsg.type === "error" ? "#C1652B" : "#4C9A6A" }}>{passwordMsg.text}</p>}
                <button onClick={handleChangePassword} disabled={passwordBusy} className="qlog-btn" style={{ width: "100%", background: "#1F2836", border: "1px solid #33414F", borderRadius: 8, padding: "9px 0", fontWeight: 600, fontSize: 12, color: "#EDE4D3", cursor: passwordBusy ? "default" : "pointer", opacity: passwordBusy ? 0.6 : 1, marginBottom: 16 }}>
                  {passwordBusy ? "Updating..." : "Update Password"}
                </button>

                <button onClick={logOut} className="qlog-btn" style={{ width: "100%", background: "#141C27", border: "1px solid #33414F", borderRadius: 8, padding: "9px 0", fontSize: 12, fontWeight: 600, color: "#8A8578", cursor: "pointer" }}>Log Out</button>
              </SettingsSection>

              <SettingsSection title="PREFERENCES">
                <p style={{ fontSize: 11, color: "#5C6773", margin: "0 0 6px" }}>Default calendar view</p>
                <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                  {["day", "week", "month"].map((v) => (
                    <button key={v} onClick={() => setCalView(v)} className="qlog-btn"
                      style={{ flex: 1, fontSize: 12, fontWeight: 700, padding: "8px 0", borderRadius: 8, border: "1px solid #33414F", background: calView === v ? accent : "#1F2836", color: calView === v ? "#1B2430" : "#8A8578", cursor: "pointer", textTransform: "capitalize" }}>
                      {v}
                    </button>
                  ))}
                </div>
                <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#1F2836", borderRadius: 10, padding: "10px 14px", cursor: "pointer" }}>
                  <span style={{ fontSize: 12, color: "#EDE4D3" }}>Auto-start rest timer after logging a set</span>
                  <input type="checkbox" checked={autoRestTimer} onChange={(e) => setAutoRestTimer(e.target.checked)} />
                </label>
              </SettingsSection>

              <SettingsSection title="HOW XP MULTIPLIERS WORK">
                <div style={{ background: "#1F2836", borderRadius: 10, padding: "12px 14px" }}>
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
              </SettingsSection>

              {"Notification" in window && (
                <SettingsSection title="REMINDERS">
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
                </SettingsSection>
              )}

              <SettingsSection title="DANGER ZONE">
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
              </SettingsSection>
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
        {collectionOpen && pickingSlot && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(10,14,20,0.85)", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }} onClick={() => { setCollectionOpen(false); setPickingSlot(null); }}>
            <div style={{ background: "#1B2430", border: "1px solid #33414F", borderRadius: 16, width: "100%", maxWidth: 480, maxHeight: "92vh", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>

              {/* Sticky header */}
              <div style={{ background: "#1B2430", borderRadius: "16px 16px 0 0", borderBottom: "1px solid #33414F", padding: "14px 18px 14px", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ margin: "0 0 2px", fontSize: 16, fontWeight: 700, fontFamily: "Georgia, serif" }}>
                      Choose {SLOT_LABELS[pickingSlot]}
                    </h3>
                    <p style={{ fontSize: 10, color: "#5C6773", margin: 0 }}>Tap an item to equip it</p>
                  </div>
                  <button onClick={() => { setCollectionOpen(false); setPickingSlot(null); }}
                    style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 8, padding: "5px 9px", color: "#EDE4D3", cursor: "pointer" }}>
                    <X size={15} />
                  </button>
                </div>
              </div>

              <div ref={collectionScrollRef} style={{ overflowY: "auto", padding: "14px 18px 20px", flex: 1 }} key={pickingSlot}>

                {/* ---- SLOT PICKER VIEW ---- */}
                {(() => {
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

              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Add-Quest / Brain-Dump menu — only on Home/Quests, where "add a quest" is meaningful */}
      {(activeTab === "home" || activeTab === "quests") && (<>
        {fabMenuOpen && activeTab === "quests" && (
          <div style={{ position: "fixed", right: 16, bottom: 148, zIndex: 61, display: "flex", flexDirection: "column", gap: 8 }}>
            <button onClick={() => { setAddDate(selectedDate); setAddModalOpen(true); setFabMenuOpen(false); }} className="qlog-btn" style={{ display: "flex", alignItems: "center", gap: 6, background: accent, border: "none", borderRadius: 8, padding: "10px 14px", fontWeight: 700, fontSize: 13, color: "#1B2430", cursor: "pointer", whiteSpace: "nowrap", boxShadow: "0 4px 14px rgba(0,0,0,0.35)" }}><Plus size={15} /> Add Quest</button>
            <button onClick={() => { setDumpModalOpen(true); setFabMenuOpen(false); }} className="qlog-btn" style={{ display: "flex", alignItems: "center", gap: 6, background: "#232E3D", border: "1px solid #33414F", borderRadius: 8, padding: "10px 14px", fontWeight: 600, fontSize: 13, color: "#EDE4D3", cursor: "pointer", whiteSpace: "nowrap", boxShadow: "0 4px 14px rgba(0,0,0,0.35)" }}><FileText size={14} /> Brain Dump</button>
          </div>
        )}
        <button
          onClick={() => { if (activeTab === "home") { setActiveTab("quests"); setFabMenuOpen(false); } else { setFabMenuOpen((v) => !v); } }}
          aria-label="Add"
          className="qlog-btn"
          style={{ position: "fixed", right: 16, bottom: 76, zIndex: 61, width: 52, height: 52, borderRadius: "50%", background: accent, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 14px rgba(0,0,0,0.4)", transform: fabMenuOpen && activeTab === "quests" ? "rotate(45deg)" : "none", transition: "transform 0.15s ease" }}
        >
          <Plus size={24} color="#1B2430" />
        </button>
      </>)}

      {/* Bottom tab bar */}
      <div className="safe-bottom" style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 60, background: themePersonality.cardBase, borderTop: `1px solid ${themePersonality.borderCol}`, display: "flex" }}>
        {[
          { key: "home", label: "Home", Icon: IconHome },
          { key: "quests", label: "Quests", Icon: IconCalendar },
          { key: "habits", label: "Habits", Icon: Repeat },
          { key: "workout", label: "Workout", Icon: IconDumbbell },
          { key: "gear", label: "Gear", Icon: IconShield },
          { key: "friends", label: "Friends", Icon: IconUsers },
        ].map(({ key, label, Icon }) => (
          <button key={key} onClick={() => { setActiveTab(key); setFabMenuOpen(false); }} className="qlog-btn" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", padding: "9px 0 8px", cursor: "pointer", color: activeTab === key ? accent : "#8A8578" }}>
            <Icon size={19} color={activeTab === key ? accent : "#8A8578"} />
            <span style={{ fontSize: 10, fontWeight: activeTab === key ? 700 : 500 }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [authUser, setAuthUser] = useState(undefined); // undefined = checking, null = logged out, object = logged in

  useEffect(() => {
    const unsub = onAuthChange(setAuthUser);
    return unsub;
  }, []);

  if (authUser === undefined) {
    return <div style={{ minHeight: "100vh", background: "#141C27" }} />;
  }
  if (!authUser) {
    return <AuthScreen />;
  }
  return <AppContent key={authUser.uid} user={authUser} />;
}