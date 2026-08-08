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

async function parseBrainDump(text, todayISO) {
  const futureDates = Array.from({ length: 14 }, (_, i) => addDaysLocal(todayISO, i));
  const dateList = futureDates.join(", ");

  const clean = await callQuestAI(`INSTRUCTIONS: Output ONLY a JSON array. No prose, no explanation, no markdown, no backticks, no commentary before or after. Just the raw JSON array starting with [ and ending with ]. Any text outside the array will break the parser.

Today is ${todayISO} (YYYY-MM-DD format). You are scheduling tasks onto a real calendar.

Valid dates to assign tasks to: ${dateList}
CRITICAL: Only assign dates from the list above. Use real dates like "${todayISO}", not day names like "mon".

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

export default function App() {
  // ---- State ----
  const [quests, setQuests] = useState([]);
  const [totalXP, setTotalXP] = useState(0);
  const [gold, setGold] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastActiveDate, setLastActiveDate] = useState(null);
  const [weeklyBossId, setWeeklyBossId] = useState(null);
  const [weekStart, setWeekStart] = useState(getMondayISO());
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

  // Calendar state
  const [calView, setCalView] = useState("week"); // "day" | "week" | "month"
  const [calAnchor, setCalAnchor] = useState(todayStr()); // focused date
  const [selectedDate, setSelectedDate] = useState(todayStr());

  // UI state
  const [showCompleted, setShowCompleted] = useState(true);
  const [levelUp, setLevelUp] = useState(null);
  const [streakBanner, setStreakBanner] = useState(null);
  const [bossBanner, setBossBanner] = useState(null);
  const [xpPop, setXpPop] = useState(null);
  const [assessing, setAssessing] = useState(false);
  const [assessError, setAssessError] = useState(false);
  const [focus, setFocus] = useState(null);
  const [focusOpen, setFocusOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addDate, setAddDate] = useState(todayStr());
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [recurringChoice, setRecurringChoice] = useState(null);
  const [dumpModalOpen, setDumpModalOpen] = useState(false);
  const [dumpText, setDumpText] = useState("");
  const [dumpParsing, setDumpParsing] = useState(false);
  const [dumpError, setDumpError] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [splittingId, setSplittingId] = useState(null);
  const [splitError, setSplitError] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [moveMenuFor, setMoveMenuFor] = useState(null);
  const [questDetailFor, setQuestDetailFor] = useState(null);
  const [dragOverDate, setDragOverDate] = useState(null);
  const [dragOverTrash, setDragOverTrash] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragIdRef = useRef(null);
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

        // Reset recurring quests
        workingQuests = workingQuests.map((q) => {
          if (!q.recurring || !q.completed) return q;
          if (q.recurring === "daily" && q.completedAt !== today) {
            return { ...q, completed: false, completedAt: null, undo: null, date: today };
          }
          if (q.recurring === "weekly" && q.completedAt && q.completedAt < nowMonday) {
            return { ...q, completed: false, completedAt: null, undo: null };
          }
          return q;
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
        setUnlockedThemes(data.unlockedThemes?.length ? data.unlockedThemes : ["ember"]);
        setSelectedTheme(data.selectedTheme || "ember");
        setHabits(data.habits || []);
        setHabitPerfectDayDate(data.habitPerfectDayDate || null);
        if (data.calView) setCalView(data.calView);
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
          quests, totalXP, gold, streak, lastActiveDate, weekStart, weeklyBossId, unlockedThemes, selectedTheme, historyDay, historyDiff,
          habits, habitPerfectDayDate, calView,
        }));
      } catch (e) { console.error("save failed", e); }
    }, 150);
  }, [quests, totalXP, gold, streak, lastActiveDate, weekStart, weeklyBossId, unlockedThemes, selectedTheme, historyDay, historyDiff, habits, habitPerfectDayDate, calView, loaded]);

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
        setUnlockedThemes(data.unlockedThemes?.length ? data.unlockedThemes : ["ember"]);
        setSelectedTheme(data.selectedTheme || "ember");
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

  // ---- Derived ----
  const { level, into, need } = levelFromXP(totalXP);
  const rank = rankForLevel(level);
  const nextMilestone = MILESTONE_LEVELS.find((m) => level < m);
  const accent = THEMES.find((t) => t.key === selectedTheme)?.color || "#C9A227";
  const today = todayStr();
  const timerPct = focus && focus.totalSeconds ? (focus.secondsLeft / focus.totalSeconds) * 100 : 100;
  const timerColor = timerPct > 50 ? "#4C9A6A" : timerPct > 20 ? "#C9A227" : "#8A2E44";
  const bossQuest = weeklyBossId ? quests.find((q) => q.id === weeklyBossId) : null;
  const completedTodayCount = quests.filter((q) => q.completed && q.completedAt === today).length;
  const comboPctActive = comboBonusPct(completedTodayCount + 1);
  const streakPctActive = streakBonusPct(streak);
  const dayStats = DAYS.map((d) => ({ label: d.label, count: (historyDay[d.key] || 0) + quests.filter((q) => q.completed && q.date && DAYS[new Date(q.date + "T00:00:00").getDay() === 0 ? 6 : new Date(q.date + "T00:00:00").getDay() - 1]?.key === d.key).length }));
  const diffStats = DIFFICULTIES.map((d) => ({ label: d.label, color: d.color, count: (historyDiff[d.key] || 0) + quests.filter((q) => q.completed && q.difficulty === d.key).length }));
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
  function addQuest() {
    const trimmed = title.trim();
    if (!trimmed) return;
    setAssessError(false);
    const finish = (diffKey, reason, estMinutes, closeDelay = 0) => {
      setQuests((q) => [{ id: Date.now() + Math.random(), title: trimmed, difficulty: diffKey, xp: xpFor(diffKey), reason, estMinutes: estMinutes || null, date: addDate, recurring: recurringChoice, completed: false, completedAt: null }, ...q]);
      setTitle("");
      if (closeDelay > 0) setTimeout(() => setAddModalOpen(false), closeDelay);
      else setAddModalOpen(false);
    };
    setAssessing(true);
    assessTask(trimmed).then((r) => finish(r.difficulty, r.reason, r.estMinutes)).catch(() => { setAssessError(true); finish("medium", null, null, 1600); }).finally(() => setAssessing(false));
  }

  function submitDump() {
    const trimmed = dumpText.trim();
    if (!trimmed) return;
    setDumpError(false);
    setDumpParsing(true);
    parseBrainDump(trimmed, today)
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
    const xpGain = workXP + boostXP + milestoneBonus;
    const goldEarned = Math.max(1, Math.round(xpGain / 10));
    const prevLevel = levelFromXP(totalXP).level;
    const newTotal = totalXP + xpGain;
    const newLevel = levelFromXP(newTotal).level;
    const undo = { xpAwarded: xpGain, goldAwarded: goldEarned, streakIncremented: streakChanged, prevStreak: streak, prevLastActiveDate: lastActiveDate };
    setQuests((qs) => qs.map((q) => q.id === id ? { ...q, completed: true, completedAt: today, undo } : q));
    setTotalXP(newTotal);
    setGold((g) => g + goldEarned);
    if (streakChanged) { setStreak(newStreak); setLastActiveDate(today); }
    setXpPop({ id, xp: workXP + boostXP });
    setTimeout(() => setXpPop(null), 900);
    if (isBoss) { setBossBanner(true); setTimeout(() => setBossBanner(false), 2400); }
    if (milestoneBonus > 0) { setStreakBanner({ days: newStreak, bonus: milestoneBonus }); setTimeout(() => setStreakBanner(null), 2400); }
    if (newLevel > prevLevel) { setLevelUp({ level: newLevel, rank: rankForLevel(newLevel) }); setTimeout(() => setLevelUp(null), 2400); }
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
    setWeeklyCompletedCount((c) => Math.max(0, c - 1));
    if (undo.streakIncremented) { setStreak(undo.prevStreak); setLastActiveDate(undo.prevLastActiveDate); }
    setQuests((qs) => qs.map((q) => q.id === id ? { ...q, completed: false, completedAt: null, undo: null } : q));
  }

  function deleteQuest(id) {
    setQuests((qs) => qs.filter((q) => q.id !== id));
    if (weeklyBossId === id) setWeeklyBossId(null);
    setQuestDetailFor(null);
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
    if (newLevel > prevLevel) { setLevelUp({ level: newLevel, rank: rankForLevel(newLevel) }); setTimeout(() => setLevelUp(null), 2400); }
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
    setHabits([
      { id: Date.now() + 0.1, name: "Make the bed", streak: 0, lastCompletedDate: null, totalCompletions: 0, undo: null },
      { id: Date.now() + 0.2, name: "Brush teeth", streak: 0, lastCompletedDate: null, totalCompletions: 0, undo: null },
      { id: Date.now() + 0.3, name: "Wash face", streak: 0, lastCompletedDate: null, totalCompletions: 0, undo: null },
    ]);
    setHabitPerfectDayDate(null);
    setConfirmClear(false);
    setSettingsOpen(false);
  }

    function unlockOrEquipTheme(theme) {
    if (unlockedThemes.includes(theme.key)) { setSelectedTheme(theme.key); return; }
    if (gold < theme.cost) return;
    setGold((g) => g - theme.cost);
    setUnlockedThemes((u) => [...u, theme.key]);
    setSelectedTheme(theme.key);
  }

  // ---- Quest card (compact for calendar cells) ----
  function QuestDot({ q }) {
    const diff = DIFFICULTIES.find((d) => d.key === q.difficulty);
    const isOverdue = !q.completed && q.date < today;
    const swipeRef = useRef(null);
    const startXRef = useRef(null);
    const [swipeOffset, setSwipeOffset] = useState(0);
    const [swipeAction, setSwipeAction] = useState(null); // "complete" | "delete" | null

    function onTouchStart(e) {
      startXRef.current = e.touches[0].clientX;
      setSwipeOffset(0);
      setSwipeAction(null);
    }
    function onTouchMove(e) {
      if (startXRef.current === null) return;
      const dx = e.touches[0].clientX - startXRef.current;
      const clamped = Math.max(-80, Math.min(80, dx));
      setSwipeOffset(clamped);
      if (clamped > 36) setSwipeAction("complete");
      else if (clamped < -36) setSwipeAction("delete");
      else setSwipeAction(null);
    }
    function onTouchEnd() {
      if (swipeAction === "complete" && !q.completed) completeQuest(q.id);
      else if (swipeAction === "delete") deleteQuest(q.id);
      setSwipeOffset(0);
      setSwipeAction(null);
      startXRef.current = null;
    }

    const swipeBg = swipeAction === "complete" ? "#4C9A6A"
                  : swipeAction === "delete" ? "#8A2E44"
                  : "transparent";

    return (
      <div ref={swipeRef} style={{ position: "relative", marginBottom: 2, borderRadius: 4, overflow: "hidden" }}>
        {/* Swipe hint background */}
        {swipeOffset !== 0 && (
          <div style={{ position: "absolute", inset: 0, background: swipeBg, display: "flex", alignItems: "center", justifyContent: swipeOffset > 0 ? "flex-start" : "flex-end", padding: "0 10px", fontSize: 12, color: "#EDE4D3", fontWeight: 700, transition: "background 0.1s ease" }}>
            {swipeOffset > 0 ? "✓ Complete" : "✕ Delete"}
          </div>
        )}
        <div
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData("text/plain", String(q.id));
            dragIdRef.current = q.id;
            setTimeout(() => setIsDragging(true), 0);
          }}
          onDragEnd={() => { dragIdRef.current = null; setIsDragging(false); setDragOverDate(null); setDragOverTrash(false); }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{
            display: "flex", alignItems: "center", gap: 4, padding: "2px 4px", borderRadius: 4,
            background: q.completed ? "#1F2836" : isOverdue ? "rgba(138,46,68,0.15)" : "#232E3D",
            borderLeft: `2px solid ${isOverdue && !q.completed ? "#8A2E44" : diff.color}`,
            opacity: q.completed ? 0.5 : 1, cursor: "grab", userSelect: "none",
            transform: `translateX(${swipeOffset}px)`,
            transition: swipeOffset === 0 ? "transform 0.2s ease" : "none",
          }}>
          {/* Quick-complete dot — tap to complete without opening detail */}
          <div
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); q.completed ? uncompleteQuest(q.id) : completeQuest(q.id); }}
            onTouchEnd={(e) => { e.stopPropagation(); e.preventDefault(); }}
            style={{ width: 8, height: 8, borderRadius: "50%", background: q.completed ? "#4C9A6A" : diff.color, flexShrink: 0, cursor: "pointer", padding: 4, margin: -4 }}
            title={q.completed ? "Undo" : "Complete"}
          />
          <span
            onClick={() => setQuestDetailFor(q.id)}
            style={{ fontSize: 11, lineHeight: 1.2, color: isOverdue && !q.completed ? "#C1652B" : q.completed ? "#5C6773" : "#EDE4D3", textDecoration: q.completed ? "line-through" : "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 120, flex: 1, cursor: "pointer" }}>
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
    const d = parseLocalDate(date);
    const dayName = d.toLocaleDateString(undefined, { weekday: narrow ? "narrow" : "short" });
    const dayNum = d.getDate();
    const isCurrentMonth = d.getMonth() === parseLocalDate(calAnchor).getMonth();

    return (
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", borderRight: "1px solid #2C3947" }}>
        <div onClick={() => { setSelectedDate(date); if (calView === "month") setCalView("day"); }}
          style={{ padding: "6px 4px", textAlign: "center", borderBottom: "1px solid #2C3947", cursor: "pointer", background: isSelected ? accent + "22" : "transparent" }}>
          <div style={{ fontSize: 10, color: isToday ? accent : "#8A8578", fontWeight: 600, textTransform: "uppercase" }}>{dayName}</div>
          <div style={{ width: 24, height: 24, borderRadius: "50%", background: isToday ? accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", margin: "2px auto 0", cursor: "pointer" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: isToday ? "#1B2430" : isCurrentMonth ? "#EDE4D3" : "#4A5563" }}>{dayNum}</span>
          </div>
        </div>
        <div style={{ flex: 1, padding: "4px 3px", overflowY: "auto", maxHeight: 300 }}
          onClick={() => { setAddDate(date); setAddModalOpen(true); }}>
          {dayQuests.map((q) => <QuestDot key={q.id} q={q} />)}
          {dayQuests.length === 0 && <div style={{ height: "100%", minHeight: 40 }} />}
        </div>
      </div>
    );
  }

  // ---- Quest detail modal ----
  function QuestDetailModal({ questId }) {
    const q = quests.find((x) => x.id === questId);
    if (!q) return null;
    const diff = DIFFICULTIES.find((d) => d.key === q.difficulty);
    const isBossCard = q.id === weeklyBossId;
    const isDesktop = window.innerWidth >= 640;
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(10,14,20,0.75)", zIndex: 70, display: "flex", alignItems: isDesktop ? "center" : "flex-end", justifyContent: "center", padding: isDesktop ? 20 : 0 }} onClick={() => setQuestDetailFor(null)}>
        <div style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: isDesktop ? 16 : "16px 16px 0 0", padding: 20, width: "100%", maxWidth: isDesktop ? 440 : 500, position: "relative" }} onClick={(e) => e.stopPropagation()}>
          {!isDesktop && <div style={{ width: 36, height: 4, background: "#33414F", borderRadius: 2, margin: "0 auto 16px" }} />}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
            {!q.completed ? (
              <button onClick={() => completeQuest(q.id)} className="qlog-btn" style={{ width: 22, height: 22, minWidth: 22, borderRadius: "50%", border: `2px solid ${diff.color}`, background: "transparent", cursor: "pointer", marginTop: 2 }} />
            ) : (
              <button onClick={() => uncompleteQuest(q.id)} className="qlog-btn" style={{ width: 22, height: 22, minWidth: 22, borderRadius: "50%", background: "#4C9A6A", border: "none", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2, cursor: "pointer" }}>
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
                <button onClick={() => setMoveMenuFor(q.id)} className="qlog-btn" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, padding: "8px 12px", borderRadius: 8, border: "1px solid #33414F", background: "transparent", color: "#8A8578", cursor: "pointer" }}><ArrowRightLeft size={13} /> Reschedule</button>
              </>
            )}
            <button onClick={() => deleteQuest(q.id)} className="qlog-btn" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, padding: "8px 12px", borderRadius: 8, border: "1px solid #8A2E44", background: "transparent", color: "#8A2E44", cursor: "pointer" }}><Trash2 size={13} /> Delete</button>
          </div>
          {q.completed && <p style={{ fontSize: 11, color: "#5C6773", margin: "10px 0 0" }}>Tap ✓ to undo this completion.</p>}
        </div>
      </div>
    );
  }

  // ---- Reschedule modal ----
  function MoveModal({ questId }) {
    const [pickDate, setPickDate] = useState(quests.find((q) => q.id === questId)?.date || today);
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(10,14,20,0.75)", zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setMoveMenuFor(null)}>
        <div style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 16, padding: 24, width: "100%", maxWidth: 320 }} onClick={(e) => e.stopPropagation()}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, fontFamily: "Georgia, serif" }}>Reschedule quest</h3>
          <input type="date" value={pickDate} onChange={(e) => setPickDate(e.target.value)}
            style={{ width: "100%", marginBottom: 14, background: "#141C27", border: "1px solid #33414F", borderRadius: 8, padding: "10px 12px", color: "#EDE4D3", fontSize: 14 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => moveQuestToDate(questId, pickDate)} className="qlog-btn" style={{ flex: 1, background: accent, border: "none", borderRadius: 8, padding: "10px 0", fontWeight: 700, color: "#1B2430", cursor: "pointer" }}>Move</button>
            <button onClick={() => setMoveMenuFor(null)} className="qlog-btn" style={{ background: "#141C27", border: "1px solid #33414F", borderRadius: 8, padding: "10px 14px", color: "#8A8578", cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  // ---- Render ----
  return (
    <div className="safe-top safe-bottom" style={{ minHeight: "100vh", background: "#1B2430", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: "#EDE4D3", paddingBottom: 60 }}>
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
        input:focus, select:focus, textarea:focus { outline: 2px solid ${accent}; outline-offset: 2px; }
        button:focus-visible { outline: 2px solid ${accent}; outline-offset: 2px; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); }
        .cal-col::-webkit-scrollbar { width: 4px; }
        .cal-col::-webkit-scrollbar-thumb { background: #33414F; border-radius: 2px; }
      `}</style>

      {/* Banners */}
      {levelUp && <div className="level-banner" style={{ position: "fixed", top: 24, left: "50%", zIndex: 60, background: `linear-gradient(135deg, ${accent}, #8A2E44)`, padding: "14px 28px", borderRadius: 10, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 30px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.25)" }}><Trophy size={22} color="#1B2430" /><span style={{ fontWeight: 700, color: "#1B2430", fontSize: 15 }}>Level {levelUp.level} — {levelUp.rank}</span></div>}
      {streakBanner && <div className="level-banner" style={{ position: "fixed", top: (levelUp ? 84 : 24), left: "50%", zIndex: 60, background: "linear-gradient(135deg, #C1652B, #1B2430)", padding: "14px 28px", borderRadius: 10, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 30px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.25)" }}><Flame size={20} color="#EDE4D3" /><span style={{ fontWeight: 700, color: "#EDE4D3", fontSize: 14 }}>{streakBanner.days}-day streak! +{streakBanner.bonus} XP</span></div>}
      {bossBanner && <div className="level-banner" style={{ position: "fixed", top: (levelUp ? 84 : 24) + (streakBanner ? 60 : 0), left: "50%", zIndex: 60, background: "linear-gradient(135deg, #8A5FBF, #1B2430)", padding: "14px 28px", borderRadius: 10, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 30px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.25)" }}><Crown size={20} color="#EDE4D3" /><span style={{ fontWeight: 700, color: "#EDE4D3", fontSize: 14 }}>Boss defeated! Bonus XP earned.</span></div>}
      {perfectDayBanner && <div className="level-banner" style={{ position: "fixed", top: (levelUp ? 84 : 24) + (streakBanner ? 60 : 0) + (bossBanner ? 60 : 0), left: "50%", zIndex: 60, background: "linear-gradient(135deg, #C9A227, #4C9A6A)", padding: "14px 28px", borderRadius: 10, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 30px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.25)" }}><Sparkles size={20} color="#1B2430" /><span style={{ fontWeight: 700, color: "#1B2430", fontSize: 14 }}>Perfect day! All habits done — +{PERFECT_DAY_XP} XP</span></div>}
      {habitBanner && <div className="level-banner" style={{ position: "fixed", top: (levelUp ? 84 : 24) + (streakBanner ? 60 : 0) + (bossBanner ? 60 : 0) + (perfectDayBanner ? 60 : 0), left: "50%", zIndex: 60, background: `linear-gradient(135deg, ${habitTier(habitBanner.days).color}, #1B2430)`, padding: "14px 28px", borderRadius: 10, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 30px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.25)" }}><Flame size={20} color="#EDE4D3" fill="#EDE4D3" /><span style={{ fontWeight: 700, color: "#EDE4D3", fontSize: 14 }}>{habitBanner.name}: {habitBanner.days}-day streak! +{habitBanner.bonus} XP</span></div>}

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
      {questDetailFor && <QuestDetailModal questId={questDetailFor} />}
      {moveMenuFor && <MoveModal questId={moveMenuFor} />}

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 12px 0" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Sword size={22} color={accent} />
            <h1 style={{ fontWeight: 700, fontSize: 20, margin: 0, fontFamily: "Georgia, serif" }}>QuestAI</h1>
          </div>
          <button onClick={() => setThemeModalOpen(true)} className="qlog-btn" style={{ display: "flex", alignItems: "center", gap: 4, background: "#232E3D", border: "1px solid #33414F", borderRadius: 8, padding: "7px 9px", color: "#EDE4D3", cursor: "pointer", fontFamily: "ui-monospace, Menlo, monospace", fontSize: 12, fontWeight: 700 }}><Coins size={13} color="#C9A227" /> {gold}</button>
        </div>

        {/* XP / Streak + Action buttons */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
          <div style={{ flex: "1 1 200px", background: "#232E3D", border: "1px solid #33414F", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 4 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 18, color: accent, fontFamily: "Georgia, serif" }}>Lv {level}</span>
                <span style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 11, color: "#8A8578" }}>{into}/{need} XP</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Flame size={14} color={streak > 0 ? "#C1652B" : "#4A5563"} fill={streak > 0 ? "#C1652B" : "none"} />
                <span style={{ fontFamily: "ui-monospace, Menlo, monospace", fontWeight: 700, fontSize: 12, color: streak > 0 ? "#C1652B" : "#8A8578" }}>{streak}d</span>
              </div>
            </div>
            <div style={{ fontSize: 10, color: "#8A8578", marginBottom: 6 }}>{rank}{nextMilestone && ` · Lv ${nextMilestone} next trophy`}</div>
            <div style={{ height: 7, background: "#141C27", borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
              <div style={{ height: "100%", width: `${(into / need) * 100}%`, background: `linear-gradient(90deg, #4C9A6A, ${accent})`, borderRadius: 4, transition: "width 0.4s ease" }} />
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {MILESTONE_LEVELS.map((m) => (
                <div key={m} title={`Level ${m}`} style={{ width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: level >= m ? accent : "#2C3947" }}>
                  <Trophy size={10} color={level >= m ? "#1B2430" : "#4A5563"} />
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons panel */}
          <div style={{ flex: "1 1 200px", background: "#232E3D", border: "1px solid #33414F", borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
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

        {/* Calendar header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button onClick={() => navCalendar(-1)} className="qlog-btn" style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 6, padding: "5px 8px", color: "#EDE4D3", cursor: "pointer" }}><ChevronLeft size={16} /></button>
            <button onClick={() => { setCalAnchor(today); setSelectedDate(today); }} className="qlog-btn" style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 6, padding: "5px 10px", color: "#EDE4D3", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Today</button>
            <button onClick={() => navCalendar(1)} className="qlog-btn" style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 6, padding: "5px 8px", color: "#EDE4D3", cursor: "pointer" }}><ChevronRight size={16} /></button>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#EDE4D3", marginLeft: 4 }}>
              {calView === "day" && parseLocalDate(calAnchor).toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              {calView === "week" && weekLabel(calAnchor)}
              {calView === "month" && monthLabel(calAnchor)}
            </span>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {["day", "week", "month"].map((v) => (
              <button key={v} onClick={() => setCalView(v)} className="qlog-btn" style={{ fontSize: 11, fontWeight: 700, padding: "5px 8px", borderRadius: 6, border: "1px solid #33414F", background: calView === v ? accent : "#232E3D", color: calView === v ? "#1B2430" : "#8A8578", cursor: "pointer", textTransform: "capitalize" }}>{v}</button>
            ))}
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
              <button onClick={() => { setAddDate(calAnchor); setAddModalOpen(true); }} className="qlog-btn" style={{ display: "flex", alignItems: "center", gap: 4, background: accent, border: "none", borderRadius: 6, padding: "5px 9px", fontSize: 11, fontWeight: 700, color: "#1B2430", cursor: "pointer" }}><Plus size={12} /> Add</button>
            </div>
            <div style={{ padding: 10, minHeight: 200 }}>
              {questsForDate(calAnchor).length === 0
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
                  <div key={date} onClick={() => { setCalAnchor(date); setCalView("day"); }} style={{ flex: 1, padding: "8px 4px", textAlign: "center", cursor: "pointer", borderRight: "1px solid #2C3947", background: date === selectedDate ? accent + "22" : "transparent" }}>
                    <div style={{ fontSize: 10, color: isToday ? accent : "#8A8578", fontWeight: 600, textTransform: "uppercase" }}>{d.toLocaleDateString(undefined, { weekday: "narrow" })}</div>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: isToday ? accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", margin: "2px auto" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: isToday ? "#1B2430" : "#EDE4D3" }}>{d.getDate()}</span>
                    </div>
                    {count > 0 && <div style={{ width: 6, height: 6, borderRadius: "50%", background: accent, margin: "2px auto 0" }} />}
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex" }}>
              {getWeekDates(calAnchor).map((date) => {
                const dayQuests = questsForDate(date);
                const isOver = dragOverDate === date;
                return (
                  <div key={date}
                    onDragOver={(e) => { e.preventDefault(); setDragOverDate(date); }}
                    onDragLeave={() => setDragOverDate((d) => d === date ? null : d)}
                    onDrop={(e) => { e.preventDefault(); const id = Number(e.dataTransfer.getData("text/plain")); moveQuestToDate(id, date); dragIdRef.current = null; setIsDragging(false); setDragOverDate(null); }}
                    style={{ flex: 1, borderRight: "1px solid #2C3947", padding: "6px 4px", minHeight: 160, background: isOver ? accent + "18" : "transparent", transition: "background 0.1s ease" }}
                    onClick={(e) => { if (e.target === e.currentTarget) { setAddDate(date); setAddModalOpen(true); } }}>
                    {dayQuests.length === 0
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
                      {active > 0 && <div style={{ fontSize: 9, fontWeight: 700, color: hasOverdue ? "#C1652B" : accent, lineHeight: 1.4 }}>{hasOverdue ? "⚠ " : ""}{active} quest{active !== 1 ? "s" : ""}</div>}
                      {done > 0 && <div style={{ fontSize: 9, color: "#4C9A6A", lineHeight: 1.4 }}>✓ {done}</div>}
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
              <button onClick={() => setAddModalOpen(false)} aria-label="Close" style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "#8A8578", cursor: "pointer" }}><X size={18} /></button>
              <h3 style={{ margin: "0 0 14px", fontSize: 16, fontWeight: 700, fontFamily: "Georgia, serif" }}>New Quest</h3>
              <input value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !assessing && addQuest()} placeholder="What needs doing?" disabled={assessing} autoFocus style={{ width: "100%", marginBottom: 12, background: "#141C27", border: "1px solid #33414F", borderRadius: 8, padding: "10px 12px", color: "#EDE4D3", fontSize: 14, opacity: assessing ? 0.6 : 1 }} />
              {assessError && <p style={{ fontSize: 11, color: "#C1652B", margin: "0 0 12px" }}>Assessment failed — quest added with default difficulty</p>}
              <p style={{ fontSize: 11, color: "#5C6773", margin: "0 0 5px" }}>Date:</p>
              <input type="date" value={addDate} onChange={(e) => setAddDate(e.target.value)} style={{ width: "100%", marginBottom: 12, background: "#141C27", border: "1px solid #33414F", borderRadius: 8, padding: "8px 10px", color: "#EDE4D3", fontSize: 13 }} />
              <p style={{ fontSize: 11, color: "#5C6773", margin: "0 0 6px" }}>Repeat:</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
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

        {themeModalOpen && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(10,14,20,0.7)", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ background: "#232E3D", border: "1px solid #33414F", borderRadius: 16, padding: 22, width: "100%", maxWidth: 360, position: "relative" }}>
              <button onClick={() => setThemeModalOpen(false)} aria-label="Close" style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "#8A8578", cursor: "pointer" }}><X size={18} /></button>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}><Coins size={15} color="#C9A227" /><span style={{ fontSize: 12, color: "#8A8578", fontWeight: 600 }}>{gold} GOLD</span></div>
              <h3 style={{ margin: "4px 0 14px", fontSize: 16, fontWeight: 700, fontFamily: "Georgia, serif" }}>Themes</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {THEMES.map((t) => {
                  const unlocked = unlockedThemes.includes(t.key);
                  const equipped = selectedTheme === t.key;
                  const canAfford = gold >= t.cost;
                  return (
                    <div key={t.key} style={{ display: "flex", alignItems: "center", gap: 10, background: "#1F2836", border: `1px solid ${equipped ? t.color : "#2C3947"}`, borderRadius: 10, padding: "10px 12px" }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: t.color, flexShrink: 0 }} />
                      <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{t.label}</span>
                      <button onClick={() => unlockOrEquipTheme(t)} disabled={equipped || (!unlocked && !canAfford)} className="qlog-btn" style={{ fontSize: 11, fontWeight: 700, padding: "5px 9px", borderRadius: 8, border: "none", cursor: equipped ? "default" : "pointer", background: equipped ? "#141C27" : unlocked ? t.color : canAfford ? "#3A4552" : "#2C3947", color: equipped ? "#8A8578" : unlocked ? "#1B2430" : canAfford ? "#EDE4D3" : "#5C6773", display: "flex", alignItems: "center", gap: 3 }}>
                        {equipped ? "Equipped" : unlocked ? "Equip" : <>{!canAfford && <Lock size={10} />}{t.cost}g</>}
                      </button>
                    </div>
                  );
                })}
              </div>
              <p style={{ fontSize: 10, color: "#5C6773", margin: "12px 0 0" }}>Earn gold automatically as you complete quests.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
