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
function IconHome({ size = 16, color = "currentColor", style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}><path d="M4 11l8-7 8 7" /><path d="M6 10v10h12V10" /><path d="M10 20v-6h4v6" /></svg>;
}
function IconCalendar({ size = 16, color = "currentColor", style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}><rect x="3.5" y="5" width="17" height="16" rx="2" /><line x1="3.5" y1="10" x2="20.5" y2="10" /><line x1="8" y1="3" x2="8" y2="7" /><line x1="16" y1="3" x2="16" y2="7" /></svg>;
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

export { Sym, Plus, Check, X, Play, Pause, RotateCcw, ChevronLeft, ChevronRight, ArrowRightLeft, Columns3, Rows3, Sparkles, Wand2, Repeat, Crown, Coins, FileText, Lock, Scissors, Target, Gear, Flame, Trophy, Sword, Trash2, Timer, Loader2, Edit2, IconHome, IconCalendar, IconAxe, IconStaff, IconScythe, IconShield, IconStar, IconDragon, IconSkull, IconCrown, IconTitle, IconPalette };
