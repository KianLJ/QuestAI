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
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}><line x1="14.5" y1="3.5" x2="4" y2="14" /><path d="M4 14l2.5 2.5" /><line x1="17" y1="7" x2="14" y2="4" /><line x1="18.5" y1="5.5" x2="20.5" y2="7.5" /></svg>;
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
const THEMES = [
  { key: "ember", label: "Ember", color: "#C9A227", cost: 0 },
  { key: "verdant", label: "Verdant", color: "#4C9A6A", cost: 60 },
  { key: "arcane", label: "Arcane", color: "#8A5FBF", cost: 90 },
  { key: "frost", label: "Frost", color: "#4FA3C9", cost: 120 },
  { key: "blood", label: "Blood", color: "#B33A3A", cost: 150 },
];
const STORAGE_KEY = "quest-log-data";
const XP_BASE = 100;
const XP_INCREMENT = 15;
const WEEKLY_BONUS_XP = 50;

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
  // Try to find a JSON array first, then object
  const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
  if (arrayMatch) return arrayMatch[0];
  const objMatch = cleaned.match(/\{[\s\S]*\}/);
  if (objMatch) return objMatch[0];
  return cleaned;
}

// ---- Gemini AI (via Vercel serverless proxy — no key in browser) ----
async function callQuestAI(prompt, timeoutMs = 60000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let response;
  try {
    response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 1500 },
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
  if (!response.ok) throw new Error(`AI error ${response.status}`);
  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  if (!text) throw new Error("Empty response from Gemini");
  return extractJson(text.replace(/```json|```/g, "").trim());
}

async function assessTask(taskTitle) {
  const clean = await callQuestAI(`INSTRUCTIONS: Output ONLY a single JSON object. No prose, no explanation, no markdown, no backticks. Just the raw JSON object and nothing else. Any text outside the JSON will break the parser.

Task to classify: "${taskTitle}"

Classify effort for someone with ADHD:
- trivial: under 2 minutes, zero activation energy
- easy: quick, low focus needed
- medium: moderate effort, ~20-45 minutes
- hard: significant focus or multiple steps
- epic: large, multi-step, or emotionally taxing

OUTPUT FORMAT (copy this exactly, fill in values):
{"difficulty":"easy","estMinutes":10,"reason":"6 words max"}`);
  const parsed = JSON.parse(clean);
  if (!DIFFICULTIES.some((d) => d.key === parsed.difficulty)) throw new Error("bad difficulty");
  return { difficulty: parsed.difficulty, estMinutes: Math.min(240, Math.max(1, Math.round(Number(parsed.estMinutes) || 15))), reason: parsed.reason };
}

async function parseBrainDump(text, todayKey) {
  const DAYS_ORDER = ["mon","tue","wed","thu","fri","sat","sun"];
  const todayIndex = DAYS_ORDER.indexOf(todayKey);
  const validFutureDays = DAYS_ORDER.slice(todayIndex).join(", ");

  const clean = await callQuestAI(`INSTRUCTIONS: Output ONLY a JSON array. No prose, no explanation, no markdown, no backticks, no commentary before or after. Just the raw JSON array starting with [ and ending with ]. Any text outside the array will break the parser.

Today is ${todayKey}. The ONLY valid days to schedule tasks are: ${validFutureDays}, or "backlog".
CRITICAL: Do NOT assign any task to a day that comes before ${todayKey} in the week. Any day before ${todayKey} is in the past — use "backlog" instead.

Raw notes to convert into tasks:
"""${text}"""

Rules:
- Split into max 12 distinct actionable tasks (across all entries including any splits)
- Skip vague filler
- Classify each: trivial/easy/medium/hard/epic
- Estimate minutes per session: 1-240
- Add a short reason (max 6 words) explaining why you classified it that way
- Spread tasks across the valid future days above, or use "backlog" if no clear deadline
- SMART SPLITTING: If a task is large, ongoing, or benefits from being done in multiple shorter sessions across different days (e.g. "finish reading book", "study for exam", "write essay"), split it into 2-3 separate entries with slightly different titles (e.g. "Read book — session 1", "Read book — session 2") on different days. Only split when it genuinely makes sense — don't split quick one-off tasks.
- Do NOT add explanations outside the JSON

OUTPUT FORMAT (a JSON array, nothing else):
[{"title":"task name","difficulty":"easy","estMinutes":15,"day":"${todayKey}","reason":"why this difficulty"}]`, 45000);
  const parsed = JSON.parse(clean);
  if (!Array.isArray(parsed)) throw new Error("bad response");
  const validDays = new Set(["backlog", ...DAYS.map((d) => d.key)]);
  const DAYS_ORDER = ["mon","tue","wed","thu","fri","sat","sun"];
  const todayIndex = DAYS_ORDER.indexOf(todayKey);
  return parsed
    .filter((it) => it && it.title && DIFFICULTIES.some((d) => d.key === it.difficulty))
    .slice(0, 12)
    .map((it) => {
      let day = validDays.has(it.day) ? it.day : "backlog";
      if (day !== "backlog" && DAYS_ORDER.indexOf(day) < todayIndex) day = "backlog";
      return {
        title: String(it.title).slice(0, 120),
        difficulty: it.difficulty,
        estMinutes: Math.min(240, Math.max(1, Math.round(Number(it.estMinutes) || 15))),
        day,
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
[{"title":"sub-task name","difficulty":"easy","estMinutes":15}]`);
  const parsed = JSON.parse(clean);
  if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("bad response");
  return parsed
    .filter((it) => it && it.title && DIFFICULTIES.some((d) => d.key === it.difficulty))
    .slice(0, 4)
    .map((it) => ({ title: String(it.title).slice(0, 120), difficulty: it.difficulty, estMinutes: Math.min(120, Math.max(1, Math.round(Number(it.estMinutes) || 15))) }));
}

export default function App() {
  const [quests, setQuests] = useState([]);
  const [totalXP, setTotalXP] = useState(0);
  const [gold, setGold] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastActiveDate, setLastActiveDate] = useState(null);
  const [weekStart, setWeekStart] = useState(getMondayISO());
  const [weeklyGoal, setWeeklyGoal] = useState(10);
  const [weeklyCompletedCount, setWeeklyCompletedCount] = useState(0);
  const [weeklyBonusClaimed, setWeeklyBonusClaimed] = useState(false);
  const [weeklyBossId, setWeeklyBossId] = useState(null);
  const [unlockedThemes, setUnlockedThemes] = useState(["ember"]);
  const [selectedTheme, setSelectedTheme] = useState("ember");
  const [historyDay, setHistoryDay] = useState(emptyDayCounts);
  const [historyDiff, setHistoryDiff] = useState(emptyDiffCounts);
  const [habits, setHabits] = useState([]);
  const [habitPerfectDayDate, setHabitPerfectDayDate] = useState(null);
  const [newHabitName, setNewHabitName] = useState("");
  const [habitBanner, setHabitBanner] = useState(null);
  const [perfectDayBanner, setPerfectDayBanner] = useState(false);
  const [habitXpPop, setHabitXpPop] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [selectedDay, setSelectedDay] = useState(currentDayKey());
  const [recurringChoice, setRecurringChoice] = useState(null);
  const [showCompleted, setShowCompleted] = useState(true);
  const [levelUp, setLevelUp] = useState(null);
  const [weekBonusBanner, setWeekBonusBanner] = useState(false);
  const [streakBanner, setStreakBanner] = useState(null);
  const [bossBanner, setBossBanner] = useState(null);
  const [xpPop, setXpPop] = useState(null);
  const [autoAssess, setAutoAssess] = useState(true);
  const [assessing, setAssessing] = useState(false);
  const [assessError, setAssessError] = useState(false);
  const [dragOverKey, setDragOverKey] = useState(null);
  const [viewMode, setViewMode] = useState("day");
  const [activeDayKey, setActiveDayKey] = useState(currentDayKey());
  const [moveMenuFor, setMoveMenuFor] = useState(null);
  const [focus, setFocus] = useState(null);
  const [focusOpen, setFocusOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [dumpModalOpen, setDumpModalOpen] = useState(false);
  const [dumpText, setDumpText] = useState("");
  const [dumpParsing, setDumpParsing] = useState(false);
  const [dumpError, setDumpError] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [splittingId, setSplittingId] = useState(null);
  const [splitError, setSplitError] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    (async () => {
      let data = null;
      try {
        const res = await window.storage.get(STORAGE_KEY);
        if (res && res.value) data = JSON.parse(res.value);
      } catch (e) {}
      const nowMonday = getMondayISO();
      if (data) {
        const today = todayStr();
        const isNewWeek = data.weekStart !== nowMonday;
        let workingQuests = (data.quests || []).map((q) => {
          if (!q.recurring || !q.completed) return q;
          if (q.recurring === "daily" && q.completedAt !== today) return { ...q, completed: false, completedAt: null, undo: null, day: currentDayKey() };
          if (q.recurring === "weekly" && q.completedAt && q.completedAt < nowMonday) return { ...q, completed: false, completedAt: null, undo: null };
          return q;
        });
        const baseHistoryDay = { ...emptyDayCounts(), ...(data.historyDay || {}) };
        const baseHistoryDiff = { ...emptyDiffCounts(), ...(data.historyDiff || {}) };
        if (isNewWeek) {
          const kept = [];
          workingQuests.forEach((q) => {
            if (q.recurring) { kept.push(q); return; }
            if (q.completed) { if (baseHistoryDay[q.day] !== undefined) baseHistoryDay[q.day]++; if (baseHistoryDiff[q.difficulty] !== undefined) baseHistoryDiff[q.difficulty]++; return; }
            kept.push({ ...q, day: "backlog" });
          });
          workingQuests = kept;
        }
        setQuests(workingQuests);
        setHistoryDay(baseHistoryDay);
        setHistoryDiff(baseHistoryDiff);
        setTotalXP(data.totalXP || 0);
        setGold(data.gold || 0);
        setStreak(data.streak || 0);
        setLastActiveDate(data.lastActiveDate || null);
        setWeeklyGoal(data.weeklyGoal ?? 10);
        setUnlockedThemes(data.unlockedThemes?.length ? data.unlockedThemes : ["ember"]);
        setSelectedTheme(data.selectedTheme || "ember");
        setHabits(data.habits || []);
        setHabitPerfectDayDate(data.habitPerfectDayDate || null);
        if (data.viewMode === "board" || data.viewMode === "day") setViewMode(data.viewMode);
        if (data.weekStart === nowMonday) {
          setWeekStart(data.weekStart);
          setWeeklyCompletedCount(data.weeklyCompletedCount || 0);
          setWeeklyBonusClaimed(!!data.weeklyBonusClaimed);
          setWeeklyBossId(data.weeklyBossId || null);
        } else {
          setWeekStart(nowMonday);
          setWeeklyCompletedCount(0);
          setWeeklyBonusClaimed(false);
          setWeeklyBossId(null);
        }
      } else {
        setWeekStart(nowMonday);
        setHabits([
          { id: Date.now() + 0.1, name: "Make the bed", streak: 0, lastCompletedDate: null, totalCompletions: 0, undo: null },
          { id: Date.now() + 0.2, name: "Brush teeth", streak: 0, lastCompletedDate: null, totalCompletions: 0, undo: null },
          { id: Date.now() + 0.3, name: "Wash face", streak: 0, lastCompletedDate: null, totalCompletions: 0, undo: null },
        ]);
      }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await window.storage.set(STORAGE_KEY, JSON.stringify({
          quests, totalXP, gold, streak, lastActiveDate, weekStart, weeklyGoal, weeklyCompletedCount,
          weeklyBonusClaimed, weeklyBossId, unlockedThemes, selectedTheme, viewMode, historyDay, historyDiff,
          habits, habitPerfectDayDate,
        }));
      } catch (e) { console.error("save failed", e); }
    }, 800);
  }, [quests, totalXP, gold, streak, lastActiveDate, weekStart, weeklyGoal, weeklyCompletedCount, weeklyBonusClaimed, weeklyBossId, unlockedThemes, selectedTheme, viewMode, historyDay, historyDiff, habits, habitPerfectDayDate, loaded]);

  useEffect(() => {
    if (!focus || !focus.running) return;
    const id = setInterval(() => {
      setFocus((f) => { if (!f) return f; if (f.secondsLeft <= 1) return { ...f, secondsLeft: 0, running: false }; return { ...f, secondsLeft: f.secondsLeft - 1 }; });
    }, 1000);
    return () => clearInterval(id);
  }, [focus?.running, focus?.questId]);

  const { level, into, need } = levelFromXP(totalXP);
  const rank = rankForLevel(level);
  const nextMilestone = MILESTONE_LEVELS.find((m) => level < m);
  const accent = THEMES.find((t) => t.key === selectedTheme)?.color || "#C9A227";

  function addQuest() {
    const trimmed = title.trim();
    if (!trimmed) return;
    setAssessError(false);
    const finish = (diffKey, reason, estMinutes, closeDelay = 0) => {
      setQuests((q) => [{ id: Date.now() + Math.random(), title: trimmed, difficulty: diffKey, xp: xpFor(diffKey), reason, estMinutes: estMinutes || null, day: selectedDay, recurring: recurringChoice, completed: false, completedAt: null }, ...q]);
      setTitle("");
      if (closeDelay > 0) setTimeout(() => setAddModalOpen(false), closeDelay);
      else setAddModalOpen(false);
    };
    if (autoAssess) {
      setAssessing(true);
      assessTask(trimmed).then((r) => finish(r.difficulty, r.reason, r.estMinutes)).catch(() => { setAssessError(true); finish(difficulty, null, null, 1600); }).finally(() => setAssessing(false));
    } else {
      finish(difficulty, null, null);
    }
  }

  function submitDump() {
    const trimmed = dumpText.trim();
    if (!trimmed) return;
    setDumpError(false);
    setDumpParsing(true);
    parseBrainDump(trimmed, currentDayKey())
      .then((items) => {
        setQuests((qs) => [...items.map((it) => ({ id: Date.now() + Math.random(), title: it.title, difficulty: it.difficulty, xp: xpFor(it.difficulty), reason: it.reason || null, estMinutes: it.estMinutes, day: it.day, recurring: null, completed: false, completedAt: null })), ...qs]);
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
        setQuests((qs) => [...subs.map((s) => ({ id: Date.now() + Math.random(), title: s.title, difficulty: s.difficulty, xp: xpFor(s.difficulty), reason: null, estMinutes: s.estMinutes, day: quest.day, recurring: null, completed: false, completedAt: null })), ...qs.filter((q) => q.id !== quest.id)]);
        if (weeklyBossId === quest.id) setWeeklyBossId(null);
      })
      .catch(() => { setSplitError(true); setTimeout(() => setSplitError(false), 3000); })
      .finally(() => setSplittingId(null));
  }

  function completeQuest(id, opts = {}) {
    const { beatClockBonus = 0 } = opts;
    const quest = quests.find((q) => q.id === id);
    if (!quest || quest.completed) return;
    const newWeeklyCount = weeklyCompletedCount + 1;
    const weeklyBonusEarned = !weeklyBonusClaimed && weeklyGoal > 0 && newWeeklyCount >= weeklyGoal;
    const isBoss = weeklyBossId === id;
    const bossBonus = isBoss ? quest.xp : 0;
    const today = todayStr();
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
    const xpGain = workXP + boostXP + (weeklyBonusEarned ? WEEKLY_BONUS_XP : 0) + milestoneBonus;
    const goldEarned = Math.max(1, Math.round(xpGain / 10));
    const prevLevel = levelFromXP(totalXP).level;
    const newTotal = totalXP + xpGain;
    const newLevel = levelFromXP(newTotal).level;
    const undo = { xpAwarded: xpGain, goldAwarded: goldEarned, weeklyBonusAwarded: weeklyBonusEarned, streakIncremented: streakChanged, prevStreak: streak, prevLastActiveDate: lastActiveDate };
    setQuests((qs) => qs.map((q) => q.id === id ? { ...q, completed: true, completedAt: today, undo } : q));
    setTotalXP(newTotal);
    setGold((g) => g + goldEarned);
    setWeeklyCompletedCount(newWeeklyCount);
    if (weeklyBonusEarned) setWeeklyBonusClaimed(true);
    if (streakChanged) { setStreak(newStreak); setLastActiveDate(today); }
    setXpPop({ id, xp: workXP + boostXP });
    setTimeout(() => setXpPop(null), 900);
    if (isBoss) { setBossBanner(true); setTimeout(() => setBossBanner(false), 2400); }
    if (milestoneBonus > 0) { setStreakBanner({ days: newStreak, bonus: milestoneBonus }); setTimeout(() => setStreakBanner(null), 2400); }
    if (weeklyBonusEarned) { setWeekBonusBanner(true); setTimeout(() => setWeekBonusBanner(false), 2400); }
    if (newLevel > prevLevel) { setLevelUp({ level: newLevel, rank: rankForLevel(newLevel) }); setTimeout(() => setLevelUp(null), 2400); }
    setFocus((f) => f && f.questId === id ? null : f);
    setFocusOpen(false);
  }

  function uncompleteQuest(id) {
    const quest = quests.find((q) => q.id === id);
    if (!quest || !quest.completed) return;
    const undo = quest.undo || { xpAwarded: quest.xp, goldAwarded: 1, weeklyBonusAwarded: false, streakIncremented: false, prevStreak: streak, prevLastActiveDate: lastActiveDate };
    setTotalXP((t) => Math.max(0, t - undo.xpAwarded));
    setGold((g) => Math.max(0, g - (undo.goldAwarded || 0)));
    setWeeklyCompletedCount((c) => Math.max(0, c - 1));
    if (undo.weeklyBonusAwarded) setWeeklyBonusClaimed(false);
    if (undo.streakIncremented) { setStreak(undo.prevStreak); setLastActiveDate(undo.prevLastActiveDate); }
    setQuests((qs) => qs.map((q) => q.id === id ? { ...q, completed: false, completedAt: null, undo: null } : q));
  }

  function deleteQuest(id) { setQuests((qs) => qs.filter((q) => q.id !== id)); if (weeklyBossId === id) setWeeklyBossId(null); }
  function moveQuestToDay(id, day) { setQuests((qs) => qs.map((q) => q.id === id ? { ...q, day } : q)); }

  function completeHabit(id) {
    const habit = habits.find((h) => h.id === id);
    const today = todayStr();
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
    if (newLevel > prevLevel) { setLevelUp({ level: newLevel, rank: rankForLevel(newLevel) }); setTimeout(() => setLevelUp(null), 2400); }
  }

  function uncompleteHabit(id) {
    const habit = habits.find((h) => h.id === id);
    const today = todayStr();
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

  function openFocus(quest) {
    if (focus && focus.questId === quest.id) { setFocusOpen(true); return; }
    setFocus({ questId: quest.id, title: quest.title, xp: quest.xp, minutesInput: quest.estMinutes || 15, totalSeconds: null, secondsLeft: null, running: false, started: false });
    setFocusOpen(true);
  }
  function startFocus() { setFocus((f) => { if (!f) return f; const total = f.minutesInput * 60; return { ...f, totalSeconds: total, secondsLeft: total, running: true, started: true }; }); }
  function toggleRun() { setFocus((f) => f ? { ...f, running: !f.running } : f); }
  function resetFocus() { setFocus((f) => f ? { ...f, secondsLeft: f.totalSeconds, running: false } : f); }
  function completeFromFocus() {
    if (!focus) return;
    const quest = quests.find((q) => q.id === focus.questId);
    if (!quest) return;
    const beatClock = focus.started && focus.secondsLeft > 0 ? Math.max(5, Math.round(quest.xp * 0.25)) : 0;
    completeQuest(focus.questId, { beatClockBonus: beatClock });
  }
  function unlockOrEquipTheme(theme) {
    if (unlockedThemes.includes(theme.key)) { setSelectedTheme(theme.key); return; }
    if (gold < theme.cost) return;
    setGold((g) => g - theme.cost);
    setUnlockedThemes((u) => [...u, theme.key]);
    setSelectedTheme(theme.key);
  }

  const columns = [{ key: "backlog", label: "Backlog" }, ...DAYS.map((d, i) => ({ key: d.key, label: `${d.label} · ${dayDateLabel(weekStart, i)}` }))];
  const weeklyPct = weeklyGoal > 0 ? Math.min(100, (weeklyCompletedCount / weeklyGoal) * 100) : 0;
  const timerPct = focus && focus.totalSeconds ? (focus.secondsLeft / focus.totalSeconds) * 100 : 100;
  const timerColor = timerPct > 50 ? "#4C9A6A" : timerPct > 20 ? "#C9A227" : "#8A2E44";
  const bossQuest = weeklyBossId ? quests.find((q) => q.id === weeklyBossId) : null;
  const todaysActive = quests.filter((q) => q.day === currentDayKey() && !q.completed).length;
  const todaysCompleted = quests.filter((q) => q.day === currentDayKey() && q.completed).length;
  const showNudge = todaysCompleted > 0 && todaysActive > 0 && todaysActive <= 3;
  const dayStats = DAYS.map((d) => ({ label: d.label, count: (historyDay[d.key] || 0) + quests.filter((q) => q.completed && q.day === d.key).length }));
  const diffStats = DIFFICULTIES.map((d) => ({ label: d.label, color: d.color, count: (historyDiff[d.key] || 0) + quests.filter((q) => q.completed && q.difficulty === d.key).length }));
  const maxDayCount = Math.max(1, ...dayStats.map((d) => d.count));
  const maxDiffCount = Math.max(1, ...diffStats.map((d) => d.count));
  const activeDayIndex = columns.findIndex((c) => c.key === activeDayKey);
  const completedTodayCount = quests.filter((q) => q.completed && q.completedAt === todayStr()).length;
  const comboPctActive = comboBonusPct(completedTodayCount + 1);
  const streakPctActive = streakBonusPct(streak);

  function renderQuestCard(q) {
    const diff = DIFFICULTIES.find((d) => d.key === q.difficulty);
    const isBossCard = q.id === weeklyBossId;
    return (
      <div key={q.id} className="quest-card" draggable onDragStart={(e) => e.dataTransfer.setData("text/plain", String(q.id))}
        style={{ position: "relative", background: "#232E3D", border: `1px solid ${isBossCard ? "#8A5FBF" : q.completed ? "#33414F" : diff.color + "55"}`, borderLeft: `3px solid ${isBossCard ? "#8A5FBF" : diff.color}`, borderRadius: 8, padding: "9px 10px", opacity: q.completed ? 0.55 : 1 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          {!q.completed ? (
            <button onClick={() => completeQuest(q.id)} className="qlog-btn" aria-label="Complete quest" style={{ width: 20, height: 20, minWidth: 20, borderRadius: "50%", border: `2px solid ${diff.color}`, background: "transparent", cursor: "pointer", marginTop: 1 }} />
          ) : (
            <button onClick={() => uncompleteQuest(q.id)} className="qlog-btn" aria-label="Undo completion" style={{ width: 20, height: 20, minWidth: 20, borderRadius: "50%", background: "#4C9A6A", border: "none", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1, cursor: "pointer" }}>
              <Check size={12} color="#141C27" />
            </button>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {isBossCard && <Crown size={11} color="#8A5FBF" />}
              <div style={{ fontSize: 13, fontWeight: 500, textDecoration: q.completed ? "line-through" : "none", wordBreak: "break-word" }}>{q.title}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, color: diff.color, fontWeight: 600, fontFamily: "ui-monospace, Menlo, monospace" }}>{diff.label.toUpperCase()} · {q.xp} XP</span>
              {q.estMinutes && <span style={{ fontSize: 10, color: "#5C6773", fontFamily: "ui-monospace, Menlo, monospace" }}>~{q.estMinutes}m</span>}
              {q.recurring && <Repeat size={10} color="#5C6773" />}
            </div>
            {q.reason && !q.completed && <div style={{ fontSize: 10, color: "#5C6773", marginTop: 1, fontStyle: "italic" }}>{q.reason}</div>}
            {q.completed && <div style={{ fontSize: 10, color: "#5C6773", marginTop: 1 }}>Tap ✓ to undo</div>}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
            {!q.completed && (<>
              <button onClick={() => setMoveMenuFor(q.id)} aria-label="Move to another day" style={{ background: "none", border: "none", cursor: "pointer", color: "#5C6773", padding: 2 }}><ArrowRightLeft size={13} /></button>
              <button onClick={() => openFocus(q)} aria-label="Start focus timer" style={{ background: "none", border: "none", cursor: "pointer", color: accent, padding: 2 }}><Timer size={13} /></button>
              {(q.difficulty === "hard" || q.difficulty === "epic") && !isBossCard && (
                <button onClick={() => setWeeklyBossId(q.id)} aria-label="Make boss" style={{ background: "none", border: "none", cursor: "pointer", color: "#8A5FBF", padding: 2 }}><Crown size={13} /></button>
              )}
              {q.difficulty === "epic" && (
                splittingId === q.id ? <Loader2 size={13} className="spin" color="#5C6773" style={{ padding: 2 }} />
                : <button onClick={() => splitEpicQuest(q)} aria-label="Split" style={{ background: "none", border: "none", cursor: "pointer", color: "#5C6773", padding: 2 }}><Scissors size={13} /></button>
              )}
            </>)}
            <button onClick={() => deleteQuest(q.id)} aria-label="Delete" style={{ background: "none", border: "none", cursor: "pointer", color: "#4A5563", padding: 2 }}><Trash2 size={13} /></button>
          </div>
        </div>
        {xpPop && xpPop.id === q.id && <div className="xp-pop" style={{ position: "absolute", right: 8, top: -4, fontWeight: 700, fontSize: 12, color: accent, fontFamily: "ui-monospace, Menlo, monospace" }}>+{xpPop.xp} XP</div>}
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#1B2430", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: "#EDE4D3", paddingBottom: 60 }}>
      <style>{`
        * { box-sizing: border-box; }
        .qlog-btn { transition: transform 0.12s ease; }
        .qlog-btn:active { transform: scale(0.96); }
        .quest-card { transition: transform 0.15s ease, opacity 0.3s ease; cursor: grab; }
        .quest-card:hover { transform: translateY(-2px); }
        .quest-card:active { cursor: grabbing; }
        @keyframes floatUp { 0% { opacity:0; transform: translateY(6px) scale(0.9);} 20% { opacity:1; transform: translateY(-4px) scale(1.05);} 100% { opacity:0; transform: translateY(-32px) scale(1);} }
        @keyframes bannerIn { 0% { opacity:0; transform: translate(-50%,-20px) scale(0.9);} 15% { opacity:1; transform: translate(-50%,0) scale(1);} 85% { opacity:1; transform: translate(-50%,0) scale(1);} 100% { opacity:0; transform: translate(-50%,-10px) scale(0.95);} }
        .xp-pop { animation: floatUp 0.9s ease forwards; }
        .level-banner { animation: bannerIn 2.4s ease forwards; }
        @keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        .pulse { animation: pulse 1s ease-in-out infinite; }
        input:focus, select:focus, textarea:focus { outline: 2px solid ${accent}; outline-offset: 2px; }
        button:focus-visible { outline: 2px solid ${accent}; outline-offset: 2px; }
        .kanban-scroll::-webkit-scrollbar { height: 8px; }
        .kanban-scroll::-webkit-scrollbar-thumb { background: #33414F; border-radius: 4px; }
        .col-scroll::-webkit-scrollbar { width: 6px; }
        .col-scroll::-webkit-scrollbar-thumb { background: #33414F; border-radius: 4px; }
      `}</style>

      {/* Banners */}
      {levelUp && <div className="level-banner" style={{ position: "fixed", top: 24, left: "50%", zIndex: 60, background: `linear-gradient(135deg, ${accent}, #8A2E44)`, padding: "14px 28px", borderRadius: 10, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 30px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.25)" }}><Trophy size={22} color="#1B2430" /><span style={{ fontWeight: 700, color: "#1B2430", fontSize: 15 }}>Level {levelUp.level} — {levelUp.rank}</span></div>}
      {weekBonusBanner && <div className="level-banner" style={{ position: "fixed", top: levelUp ? 84 : 24, left: "50%", zIndex: 60, background: "linear-gradient(135deg, #4C9A6A, #1B2430)", padding: "14px 28px", borderRadius: 10, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 30px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.25)" }}><Target size={20} color="#EDE4D3" /><span style={{ fontWeight: 700, color: "#EDE4D3", fontSize: 14 }}>Weekly goal hit! +{WEEKLY_BONUS_XP} XP</span></div>}
      {streakBanner && <div className="level-banner" style={{ position: "fixed", top: (levelUp ? 84 : 24) + (weekBonusBanner ? 60 : 0), left: "50%", zIndex: 60, background: "linear-gradient(135deg, #C1652B, #1B2430)", padding: "14px 28px", borderRadius: 10, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 30px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.25)" }}><Flame size={20} color="#EDE4D3" /><span style={{ fontWeight: 700, color: "#EDE4D3", fontSize: 14 }}>{streakBanner.days}-day streak! +{streakBanner.bonus} XP</span></div>}
      {bossBanner && <div className="level-banner" style={{ position: "fixed", top: (levelUp ? 84 : 24) + (weekBonusBanner ? 60 : 0) + (streakBanner ? 60 : 0), left: "50%", zIndex: 60, background: "linear-gradient(135deg, #8A5FBF, #1B2430)", padding: "14px 28px", borderRadius: 10, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 30px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.25)" }}><Crown size={20} color="#EDE4D3" /><span style={{ fontWeight: 700, color: "#EDE4D3", fontSize: 14 }}>Boss defeated! Bonus XP earned.</span></div>}
      {perfectDayBanner && <div className="level-banner" style={{ position: "fixed", top: (levelUp ? 84 : 24) + (weekBonusBanner ? 60 : 0) + (streakBanner ? 60 : 0) + (bossBanner ? 60 : 0), left: "50%", zIndex: 60, background: "linear-gradient(135deg, #C9A227, #4C9A6A)", padding: "14px 28px", borderRadius: 10, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 30px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.25)" }}><Sparkles size={20} color="#1B2430" /><span style={{ fontWeight: 700, color: "#1B2430", fontSize: 14 }}>Perfect day! All habits done — +{PERFECT_DAY_XP} XP</span></div>}
      {habitBanner && <div className="level-banner" style={{ position: "fixed", top: (levelUp ? 84 : 24) + (weekBonusBanner ? 60 : 0) + (streakBanner ? 60 : 0) + (bossBanner ? 60 : 0) + (perfectDayBanner ? 60 : 0), left: "50%", zIndex: 60, background: `linear-gradient(135deg, ${habitTier(habitBanner.days).color}, #1B2430)`, padding: "14px 28px", borderRadius: 10, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 30px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.25)" }}><Flame size={20} color="#EDE4D3" fill="#EDE4D3" /><span style={{ fontWeight: 700, color: "#EDE4D3", fontSize: 14 }}>{habitBanner.name}: {habitBanner.days}-day streak! +{habitBanner.bonus} XP</span></div>}

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

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 0" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Sword size={26} color={accent} />
            <h1 style={{ fontWeight: 700, fontSize: 26, margin: 0, letterSpacing: 0.3, fontFamily: "Georgia, serif" }}>Quest Log</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <button onClick={() => setThemeModalOpen(true)} className="qlog-btn" aria-label="Gold & themes" style={{ display: "flex", alignItems: "center", gap: 5, background: "#232E3D", border: "1px solid #33414F", borderRadius: 8, padding: "8px 10px", color: "#EDE4D3", cursor: "pointer", fontFamily: "ui-monospace, Menlo, monospace", fontSize: 13, fontWeight: 700 }}><Coins size={15} color="#C9A227" /> {gold}</button>
            <button onClick={() => setStatsOpen(true)} className="qlog-btn" aria-label="Stats" style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 8, padding: "8px 10px", color: "#8A8578", cursor: "pointer" }}><BarChart2 size={16} /></button>
            <button onClick={() => setViewMode((v) => v === "day" ? "board" : "day")} className="qlog-btn" aria-label="Toggle view" style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 8, padding: "8px 10px", color: "#8A8578", cursor: "pointer" }}>{viewMode === "day" ? <Columns3 size={16} /> : <Rows3 size={16} />}</button>
            <button onClick={() => setDumpModalOpen(true)} className="qlog-btn" aria-label="Brain dump" style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 8, padding: "8px 10px", color: "#8A8578", cursor: "pointer" }}><FileText size={16} /></button>
            <button onClick={() => { setSettingsOpen(true); }} className="qlog-btn" aria-label="Settings" style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 8, padding: "8px 10px", color: "#8A8578", cursor: "pointer" }}><Gear size={16} /></button>
            <button onClick={() => setAddModalOpen(true)} className="qlog-btn" style={{ display: "flex", alignItems: "center", gap: 6, background: accent, border: "none", borderRadius: 8, padding: "9px 14px", fontWeight: 700, fontSize: 13, color: "#1B2430", cursor: "pointer" }}><Plus size={16} /> Add Quest</button>
          </div>
        </div>

        {/* Stats panels */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 16 }}>
          <div style={{ flex: "1 1 260px", background: "#232E3D", border: "1px solid #33414F", borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 21, color: accent, fontFamily: "Georgia, serif" }}>Lv {level}</span>
                <span style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 12, color: "#8A8578" }}>{into} / {need} XP</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Flame size={17} color={streak > 0 ? "#C1652B" : "#4A5563"} fill={streak > 0 ? "#C1652B" : "none"} />
                <span style={{ fontFamily: "ui-monospace, Menlo, monospace", fontWeight: 700, fontSize: 14, color: streak > 0 ? "#C1652B" : "#8A8578" }}>{streak} day{streak === 1 ? "" : "s"}</span>
              </div>
            </div>
            <div style={{ fontSize: 11, color: "#8A8578", marginBottom: 8 }}>{rank}{nextMilestone && <span> · trophy at Lv {nextMilestone}</span>}</div>
            <div style={{ height: 9, background: "#141C27", borderRadius: 6, overflow: "hidden", marginBottom: 10 }}>
              <div style={{ height: "100%", width: `${(into / need) * 100}%`, background: `linear-gradient(90deg, #4C9A6A, ${accent})`, borderRadius: 6, transition: "width 0.4s ease" }} />
            </div>
            <div style={{ display: "flex", gap: 5, marginBottom: (comboPctActive > 0 || streakPctActive > 0) ? 8 : 0 }}>
              {MILESTONE_LEVELS.map((m) => (
                <div key={m} title={`Level ${m}`} style={{ width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: level >= m ? accent : "#2C3947" }}>
                  <Trophy size={11} color={level >= m ? "#1B2430" : "#4A5563"} />
                </div>
              ))}
            </div>
            {(comboPctActive > 0 || streakPctActive > 0) && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {streakPctActive > 0 && <span style={{ fontSize: 10, fontWeight: 700, color: "#C1652B", background: "#2A1D16", borderRadius: 20, padding: "3px 8px" }}>🔥 +{Math.round(streakPctActive * 100)}% streak</span>}
                {comboPctActive > 0 && <span style={{ fontSize: 10, fontWeight: 700, color: accent, background: "#141C27", borderRadius: 20, padding: "3px 8px" }}>⚡ +{Math.round(comboPctActive * 100)}% combo</span>}
              </div>
            )}
          </div>
          <div style={{ flex: "1 1 260px", background: "#232E3D", border: "1px solid #33414F", borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Target size={15} color="#4C9A6A" /><span style={{ fontSize: 13, fontWeight: 600 }}>Weekly goal</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "ui-monospace, Menlo, monospace", fontSize: 12 }}>
                <span>{weeklyCompletedCount} / </span>
                <input type="number" min={1} value={weeklyGoal} onChange={(e) => setWeeklyGoal(Math.max(1, Number(e.target.value) || 1))} style={{ width: 44, background: "#141C27", border: "1px solid #33414F", borderRadius: 6, color: "#EDE4D3", padding: "2px 4px", fontFamily: "ui-monospace, Menlo, monospace" }} />
                <span>quests</span>
              </div>
            </div>
            <div style={{ height: 9, background: "#141C27", borderRadius: 6, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${weeklyPct}%`, background: weeklyBonusClaimed ? "#4C9A6A" : "linear-gradient(90deg, #4C9A6A, #2E6B4A)", borderRadius: 6, transition: "width 0.4s ease" }} />
            </div>
            <p style={{ fontSize: 11, color: "#5C6773", margin: "6px 0 0" }}>{weeklyBonusClaimed ? "Bonus claimed for this week — nice work." : `Hit your goal for a +${WEEKLY_BONUS_XP} XP bonus. Resets Monday.`}</p>
          </div>
        </div>

        {/* Boss bar */}
        {bossQuest ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "linear-gradient(90deg, #2A1F3D, #232E3D)", border: "1px solid #8A5FBF", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
            <Crown size={18} color="#8A5FBF" />
            <span style={{ fontSize: 13, fontWeight: 700, flex: 1 }}>Boss: {bossQuest.title}</span>
            <span style={{ fontSize: 11, color: "#8A5FBF", fontFamily: "ui-monospace, Menlo, monospace" }}>{bossQuest.completed ? "Defeated 🎉" : `2x XP · ${bossQuest.xp * 2}`}</span>
            <button onClick={() => setWeeklyBossId(null)} aria-label="Clear boss" style={{ background: "none", border: "none", color: "#8A8578", cursor: "pointer" }}><X size={14} /></button>
          </div>
        ) : (
          <p style={{ fontSize: 11, color: "#5C6773", margin: "0 0 16px" }}>Tip: crown a hard or epic quest as this week's boss for 2x XP.</p>
        )}

        {showNudge && <div style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 10, padding: "8px 14px", marginBottom: 14, fontSize: 12, color: "#C9A227" }}>🔥 {todaysActive} quest{todaysActive === 1 ? "" : "s"} left today — you've got this.</div>}

        {/* Modals */}
        {addModalOpen && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(10,14,20,0.7)", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 16, padding: 24, width: "100%", maxWidth: 380, position: "relative", maxHeight: "85vh", overflowY: "auto" }}>
              <button onClick={() => setAddModalOpen(false)} aria-label="Close" style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "#8A8578", cursor: "pointer" }}><X size={18} /></button>
              <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, fontFamily: "Georgia, serif" }}>New Quest</h3>
              <input value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !assessing && addQuest()} placeholder="What needs doing?" disabled={assessing} autoFocus style={{ width: "100%", marginBottom: 12, background: "#141C27", border: "1px solid #33414F", borderRadius: 8, padding: "10px 12px", color: "#EDE4D3", fontSize: 14, opacity: assessing ? 0.6 : 1 }} />
              <button onClick={() => setAutoAssess((v) => !v)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 10, color: autoAssess ? accent : "#5C6773" }}>
                <span style={{ width: 30, height: 17, borderRadius: 20, background: autoAssess ? accent : "#3A4552", position: "relative", transition: "background 0.15s ease", flexShrink: 0 }}>
                  <span style={{ position: "absolute", top: 2, left: autoAssess ? 15 : 2, width: 13, height: 13, borderRadius: "50%", background: "#141C27", transition: "left 0.15s ease" }} />
                </span>
                <Wand2 size={13} /><span style={{ fontSize: 12, fontWeight: 600 }}>Let QuestAI assess difficulty + time</span>
              </button>
              {assessError && <p style={{ fontSize: 11, color: "#C1652B", margin: "0 0 8px" }}>Assessment failed — used manual pick</p>}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", opacity: autoAssess ? 0.5 : 1, marginBottom: 14 }}>
                {DIFFICULTIES.map((d) => <button key={d.key} onClick={() => setDifficulty(d.key)} className="qlog-btn" style={{ cursor: "pointer", fontSize: 12, fontWeight: 600, padding: "6px 10px", borderRadius: 20, border: `1.5px solid ${d.color}`, background: difficulty === d.key ? d.color : "transparent", color: difficulty === d.key ? "#1B2430" : d.color }}>{d.label} · {d.xp}xp</button>)}
              </div>
              <p style={{ fontSize: 11, color: "#5C6773", margin: "0 0 6px" }}>Plan it for:</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                {columns.map((c) => <button key={c.key} onClick={() => setSelectedDay(c.key)} className="qlog-btn" style={{ cursor: "pointer", fontSize: 12, fontWeight: 600, padding: "6px 10px", borderRadius: 8, border: "1.5px solid #33414F", background: selectedDay === c.key ? accent : "transparent", color: selectedDay === c.key ? "#1B2430" : "#8A8578" }}>{c.label.split(" · ")[0]}</button>)}
              </div>
              <p style={{ fontSize: 11, color: "#5C6773", margin: "0 0 6px" }}>Repeat:</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
                {[{ key: null, label: "None" }, { key: "daily", label: "Daily" }, { key: "weekly", label: "Weekly" }].map((r) => (
                  <button key={r.label} onClick={() => setRecurringChoice(r.key)} className="qlog-btn" style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, padding: "6px 10px", borderRadius: 8, border: "1.5px solid #33414F", background: recurringChoice === r.key ? accent : "transparent", color: recurringChoice === r.key ? "#1B2430" : "#8A8578" }}>
                    {r.key && <Repeat size={11} />} {r.label}
                  </button>
                ))}
              </div>
              <button onClick={addQuest} className="qlog-btn" disabled={assessing || !title.trim()} style={{ width: "100%", background: accent, border: "none", borderRadius: 8, padding: "12px 0", fontWeight: 700, cursor: assessing || !title.trim() ? "default" : "pointer", opacity: assessing || !title.trim() ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#1B2430" }}>
                {assessing ? <Loader2 size={18} className="spin" /> : <Plus size={18} />} {assessing ? "Assessing..." : "Add Quest"}
              </button>
            </div>
          </div>
        )}

        {dumpModalOpen && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(10,14,20,0.7)", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 16, padding: 24, width: "100%", maxWidth: 400, position: "relative", maxHeight: "85vh", overflowY: "auto" }}>
              <button onClick={() => setDumpModalOpen(false)} aria-label="Close" style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "#8A8578", cursor: "pointer" }}><X size={18} /></button>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}><FileText size={16} color={accent} /><span style={{ fontSize: 12, color: "#8A8578", fontWeight: 600 }}>BRAIN DUMP</span></div>
              <h3 style={{ margin: "4px 0 6px", fontSize: 16, fontWeight: 700, fontFamily: "Georgia, serif" }}>Paste everything at once</h3>
              <p style={{ fontSize: 12, color: "#8A8578", margin: "0 0 12px" }}>QuestAI will split it into quests, set difficulty + time, and pick a day for each.</p>
              <textarea value={dumpText} onChange={(e) => setDumpText(e.target.value)} disabled={dumpParsing} placeholder="e.g. call dentist, finish slides for monday, laundry, reply to landlord..." rows={5} style={{ width: "100%", resize: "vertical", background: "#141C27", border: "1px solid #33414F", borderRadius: 8, padding: "10px 12px", color: "#EDE4D3", fontSize: 13, marginBottom: 12, opacity: dumpParsing ? 0.6 : 1 }} />
              {dumpError && <p style={{ fontSize: 11, color: "#C1652B", margin: "0 0 12px" }}>That didn't go through — try again, or add quests one at a time.</p>}
              <button onClick={submitDump} className="qlog-btn" disabled={dumpParsing || !dumpText.trim()} style={{ width: "100%", background: accent, border: "none", borderRadius: 8, padding: "12px 0", fontWeight: 700, cursor: dumpParsing || !dumpText.trim() ? "default" : "pointer", opacity: dumpParsing || !dumpText.trim() ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#1B2430" }}>
                {dumpParsing ? <Loader2 size={18} className="spin" /> : <Sparkles size={18} />} {dumpParsing ? "Splitting..." : "Turn into quests"}
              </button>
            </div>
          </div>
        )}

        {statsOpen && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(10,14,20,0.7)", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 16, padding: 24, width: "100%", maxWidth: 380, position: "relative", maxHeight: "85vh", overflowY: "auto" }}>
              <button onClick={() => setStatsOpen(false)} aria-label="Close" style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "#8A8578", cursor: "pointer" }}><X size={18} /></button>
              <h3 style={{ margin: "0 0 18px", fontSize: 16, fontWeight: 700, fontFamily: "Georgia, serif" }}>Insights</h3>
              <p style={{ fontSize: 11, color: "#8A8578", margin: "0 0 8px", fontWeight: 600 }}>COMPLETED BY DAY</p>
              <div style={{ marginBottom: 20 }}>
                {dayStats.map((d) => (
                  <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ width: 30, fontSize: 11, color: "#8A8578" }}>{d.label}</span>
                    <div style={{ flex: 1, height: 10, background: "#141C27", borderRadius: 5, overflow: "hidden" }}><div style={{ height: "100%", width: `${(d.count / maxDayCount) * 100}%`, background: accent, borderRadius: 5 }} /></div>
                    <span style={{ width: 18, fontSize: 11, color: "#5C6773", fontFamily: "ui-monospace, Menlo, monospace", textAlign: "right" }}>{d.count}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11, color: "#8A8578", margin: "0 0 8px", fontWeight: 600 }}>COMPLETED BY DIFFICULTY</p>
              <div>
                {diffStats.map((d) => (
                  <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ width: 50, fontSize: 11, color: "#8A8578" }}>{d.label}</span>
                    <div style={{ flex: 1, height: 10, background: "#141C27", borderRadius: 5, overflow: "hidden" }}><div style={{ height: "100%", width: `${(d.count / maxDiffCount) * 100}%`, background: d.color, borderRadius: 5 }} /></div>
                    <span style={{ width: 18, fontSize: 11, color: "#5C6773", fontFamily: "ui-monospace, Menlo, monospace", textAlign: "right" }}>{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {settingsOpen && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(10,14,20,0.7)", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 16, padding: 24, width: "100%", maxWidth: 380, position: "relative" }}>
              <button onClick={() => setSettingsOpen(false)} aria-label="Close" style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "#8A8578", cursor: "pointer" }}><X size={18} /></button>
              <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, fontFamily: "Georgia, serif" }}>Settings</h3>
              <p style={{ fontSize: 12, color: "#8A8578", margin: "0 0 16px" }}>AI features (auto-difficulty, brain dump, epic split) are powered by Gemini, running securely on the server. No setup needed here — everything is already configured.</p>
              <button onClick={() => setSettingsOpen(false)} className="qlog-btn" style={{ width: "100%", background: accent, border: "none", borderRadius: 8, padding: "10px 0", fontWeight: 700, color: "#1B2430", cursor: "pointer" }}>Got it</button>
            </div>
          </div>
        )}

        {themeModalOpen && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(10,14,20,0.7)", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 16, padding: 24, width: "100%", maxWidth: 360, position: "relative" }}>
              <button onClick={() => setThemeModalOpen(false)} aria-label="Close" style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "#8A8578", cursor: "pointer" }}><X size={18} /></button>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}><Coins size={16} color="#C9A227" /><span style={{ fontSize: 12, color: "#8A8578", fontWeight: 600 }}>{gold} GOLD</span></div>
              <h3 style={{ margin: "4px 0 16px", fontSize: 16, fontWeight: 700, fontFamily: "Georgia, serif" }}>Themes</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {THEMES.map((t) => {
                  const unlocked = unlockedThemes.includes(t.key);
                  const equipped = selectedTheme === t.key;
                  const canAfford = gold >= t.cost;
                  return (
                    <div key={t.key} style={{ display: "flex", alignItems: "center", gap: 10, background: "#1F2836", border: `1px solid ${equipped ? t.color : "#2C3947"}`, borderRadius: 10, padding: "10px 12px" }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: t.color, flexShrink: 0 }} />
                      <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{t.label}</span>
                      <button onClick={() => unlockOrEquipTheme(t)} disabled={equipped || (!unlocked && !canAfford)} className="qlog-btn" style={{ fontSize: 11, fontWeight: 700, padding: "6px 10px", borderRadius: 8, border: "none", cursor: equipped ? "default" : "pointer", background: equipped ? "#141C27" : unlocked ? t.color : canAfford ? "#3A4552" : "#2C3947", color: equipped ? "#8A8578" : unlocked ? "#1B2430" : canAfford ? "#EDE4D3" : "#5C6773", display: "flex", alignItems: "center", gap: 4 }}>
                        {equipped ? "Equipped" : unlocked ? "Equip" : <>{!canAfford && <Lock size={11} />}{t.cost}g</>}
                      </button>
                    </div>
                  );
                })}
              </div>
              <p style={{ fontSize: 11, color: "#5C6773", margin: "14px 0 0" }}>Earn gold automatically as you complete quests.</p>
            </div>
          </div>
        )}

        {/* Show completed toggle */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#8A8578", cursor: "pointer" }}>
            <input type="checkbox" checked={showCompleted} onChange={(e) => setShowCompleted(e.target.checked)} />
            Show completed
          </label>
        </div>

        {/* Day view */}
        {viewMode === "day" ? (<>
          <div className="kanban-scroll" style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, marginBottom: 4 }}>
            {columns.map((col) => {
              const count = quests.filter((q) => q.day === col.key && !q.completed).length;
              const isToday = col.key === currentDayKey();
              return (
                <button key={col.key} onClick={() => setActiveDayKey(col.key)} className="qlog-btn" style={{ flexShrink: 0, cursor: "pointer", fontSize: 12, fontWeight: 700, padding: "8px 12px", borderRadius: 8, border: `1.5px solid ${activeDayKey === col.key ? accent : isToday ? "#4A5563" : "#2C3947"}`, background: activeDayKey === col.key ? accent : "transparent", color: activeDayKey === col.key ? "#1B2430" : isToday ? "#EDE4D3" : "#8A8578", whiteSpace: "nowrap" }}>
                  {col.label.split(" · ")[0]}{count > 0 && <span style={{ opacity: 0.8 }}> · {count}</span>}
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <button onClick={() => setActiveDayKey(columns[Math.max(0, activeDayIndex - 1)].key)} disabled={activeDayIndex <= 0} aria-label="Previous day" style={{ background: "none", border: "none", color: activeDayIndex <= 0 ? "#3A4552" : "#8A8578", cursor: activeDayIndex <= 0 ? "default" : "pointer", padding: 4 }}><ChevronLeft size={20} /></button>
            <span style={{ fontSize: 14, fontWeight: 700, color: activeDayKey === currentDayKey() ? accent : "#EDE4D3" }}>{columns[activeDayIndex]?.label}</span>
            <button onClick={() => setActiveDayKey(columns[Math.min(columns.length - 1, activeDayIndex + 1)].key)} disabled={activeDayIndex >= columns.length - 1} aria-label="Next day" style={{ background: "none", border: "none", color: activeDayIndex >= columns.length - 1 ? "#3A4552" : "#8A8578", cursor: activeDayIndex >= columns.length - 1 ? "default" : "pointer", padding: 4 }}><ChevronRight size={20} /></button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {quests.filter((q) => q.day === activeDayKey && (showCompleted || !q.completed)).length === 0 && (
              <div style={{ fontSize: 12, color: "#3F4B58", textAlign: "center", padding: "24px 0", border: "1px dashed #2C3947", borderRadius: 10 }}>Nothing here yet</div>
            )}
            {quests.filter((q) => q.day === activeDayKey && (showCompleted || !q.completed)).map((q) => renderQuestCard(q))}
          </div>
        </>) : (
          <div className="kanban-scroll" style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 24 }}>
            {columns.map((col) => {
              const colQuests = quests.filter((q) => q.day === col.key && (showCompleted || !q.completed));
              const isToday = col.key === currentDayKey();
              return (
                <div key={col.key} onDragOver={(e) => { e.preventDefault(); setDragOverKey(col.key); }} onDragLeave={() => setDragOverKey((k) => k === col.key ? null : k)} onDrop={(e) => { e.preventDefault(); const id = Number(e.dataTransfer.getData("text/plain")); moveQuestToDay(id, col.key); setDragOverKey(null); }}
                  style={{ minWidth: 210, width: 210, background: dragOverKey === col.key ? "#2A3648" : "#1F2836", border: `1px solid ${isToday ? accent : "#2C3947"}`, borderRadius: 12, padding: 10, display: "flex", flexDirection: "column", flexShrink: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2px 4px 10px", borderBottom: "1px solid #2C3947", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: isToday ? accent : "#8A8578" }}>{col.label}</span>
                    <span style={{ fontSize: 11, color: "#5C6773", fontFamily: "ui-monospace, Menlo, monospace" }}>{colQuests.length}</span>
                  </div>
                  <div className="col-scroll" style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 40, maxHeight: 520, overflowY: "auto" }}>
                    {colQuests.length === 0 && <div style={{ fontSize: 11, color: "#3F4B58", textAlign: "center", padding: "10px 0" }}>Drop here</div>}
                    {colQuests.map((q) => renderQuestCard(q))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {splitError && <p style={{ fontSize: 11, color: "#C1652B", textAlign: "center" }}>Couldn't split that task — try again in a moment.</p>}

        {/* Daily Habits */}
        <div style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 12, padding: 16, marginTop: 8, marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Daily Habits</span>
            <span style={{ fontSize: 11, color: "#5C6773" }}>{HABIT_XP} XP each · tiny, fast, every day</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
            {habits.length === 0 && <p style={{ fontSize: 12, color: "#5C6773", margin: 0 }}>No habits yet — add one below.</p>}
            {habits.map((h) => {
              const doneToday = h.lastCompletedDate === todayStr();
              const tier = habitTier(h.streak);
              return (
                <div key={h.id} style={{ position: "relative", display: "flex", alignItems: "center", gap: 10, background: "#1F2836", border: "1px solid #2C3947", borderRadius: 8, padding: "8px 10px" }}>
                  {!doneToday ? (
                    <button onClick={() => completeHabit(h.id)} className="qlog-btn" aria-label={`Complete ${h.name}`} style={{ width: 18, height: 18, minWidth: 18, borderRadius: "50%", border: "2px solid #5C6773", background: "transparent", cursor: "pointer" }} />
                  ) : (
                    <button onClick={() => uncompleteHabit(h.id)} className="qlog-btn" aria-label="Undo" style={{ width: 18, height: 18, minWidth: 18, borderRadius: "50%", background: "#4C9A6A", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Check size={11} color="#141C27" /></button>
                  )}
                  <span style={{ flex: 1, fontSize: 13, textDecoration: doneToday ? "line-through" : "none", opacity: doneToday ? 0.6 : 1 }}>{h.name}</span>
                  {h.streak > 0 && (
                    <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 700, color: tier.color, fontFamily: "ui-monospace, Menlo, monospace" }}>
                      <Flame size={12} color={tier.color} fill={tier.color} /> {h.streak}{tier.label && <span style={{ opacity: 0.8 }}>· {tier.label}</span>}
                    </span>
                  )}
                  <button onClick={() => deleteHabit(h.id)} aria-label="Delete habit" style={{ background: "none", border: "none", cursor: "pointer", color: "#4A5563", padding: 2 }}><Trash2 size={12} /></button>
                  {habitXpPop && habitXpPop.id === h.id && <div className="xp-pop" style={{ position: "absolute", right: 30, top: -2, fontWeight: 700, fontSize: 11, color: accent, fontFamily: "ui-monospace, Menlo, monospace" }}>+{habitXpPop.xp} XP</div>}
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={newHabitName} onChange={(e) => setNewHabitName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addHabit(newHabitName)} placeholder="Add a habit — e.g. drink water" style={{ flex: 1, background: "#141C27", border: "1px solid #33414F", borderRadius: 8, padding: "8px 10px", color: "#EDE4D3", fontSize: 13 }} />
            <button onClick={() => addHabit(newHabitName)} className="qlog-btn" style={{ background: accent, border: "none", borderRadius: 8, padding: "0 12px", display: "flex", alignItems: "center", cursor: "pointer" }} aria-label="Add habit"><Plus size={15} color="#1B2430" /></button>
          </div>
          {habits.length > 0 && <p style={{ fontSize: 10, color: "#5C6773", margin: "10px 0 0" }}>Complete every habit in one day for a +{PERFECT_DAY_XP} XP Perfect Day bonus. Streaks: 3d bronze · 7d silver · 21d gold · 66d diamond.</p>}
        </div>

        {/* Move-to-day modal */}
        {moveMenuFor && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(10,14,20,0.7)", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setMoveMenuFor(null)}>
            <div style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 16, padding: 22, width: "100%", maxWidth: 320, position: "relative" }} onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setMoveMenuFor(null)} aria-label="Close" style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "#8A8578", cursor: "pointer" }}><X size={18} /></button>
              <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, fontFamily: "Georgia, serif" }}>Move quest to...</h3>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {columns.map((c) => (
                  <button key={c.key} onClick={() => { moveQuestToDay(moveMenuFor, c.key); if (viewMode === "day") setActiveDayKey(c.key); setMoveMenuFor(null); }} className="qlog-btn" style={{ cursor: "pointer", fontSize: 12, fontWeight: 600, padding: "8px 12px", borderRadius: 8, border: "1.5px solid #33414F", background: "transparent", color: "#8A8578" }}>{c.label.split(" · ")[0]}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {quests.length === 0 && (
          <div style={{ textAlign: "center", padding: "20px 0 40px", color: "#5C6773" }}>
            <Sparkles size={22} style={{ marginBottom: 6 }} />
            <p style={{ fontSize: 13, margin: 0 }}>Add your first quest to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
