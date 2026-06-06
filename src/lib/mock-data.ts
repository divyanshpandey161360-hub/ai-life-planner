export type Category = "academic" | "placement" | "dsa" | "gym" | "project" | "club" | "focus";

export const categoryMeta: Record<Category, { label: string; color: string; bg: string; ring: string }> = {
  academic: { label: "Academics", color: "text-cat-academic", bg: "bg-cat-academic/10", ring: "bg-cat-academic" },
  placement: { label: "Placement", color: "text-cat-placement", bg: "bg-cat-placement/10", ring: "bg-cat-placement" },
  dsa: { label: "DSA", color: "text-cat-dsa", bg: "bg-cat-dsa/10", ring: "bg-cat-dsa" },
  gym: { label: "Gym", color: "text-cat-gym", bg: "bg-cat-gym/10", ring: "bg-cat-gym" },
  project: { label: "Project", color: "text-cat-project", bg: "bg-cat-project/10", ring: "bg-cat-project" },
  club: { label: "Club", color: "text-cat-club", bg: "bg-cat-club/10", ring: "bg-cat-club" },
  focus: { label: "Focus", color: "text-cat-focus", bg: "bg-cat-focus/10", ring: "bg-cat-focus" },
};

export type Task = {
  id: string;
  title: string;
  category: Category;
  start: string; // "07:00"
  end: string;
  location?: string;
  aiGenerated?: boolean;
  protected?: boolean;
  done?: boolean;
};

export const todaySchedule: Task[] = [
  { id: "t1", title: "Morning Run + Push Day", category: "gym", start: "06:30", end: "07:45", location: "Hostel Gym", done: true },
  { id: "t2", title: "Operating Systems — Lecture", category: "academic", start: "09:00", end: "10:15", location: "Block C, R-204", done: true },
  { id: "t3", title: "DSA: Graphs — BFS/DFS practice", category: "dsa", start: "10:30", end: "12:00", aiGenerated: true, protected: true },
  { id: "t4", title: "Lunch & recharge", category: "focus", start: "12:30", end: "13:15" },
  { id: "t5", title: "DBMS Lab — Normalization", category: "academic", start: "13:30", end: "15:30", location: "Lab 4" },
  { id: "t6", title: "Placement: Mock Aptitude Test", category: "placement", start: "16:00", end: "17:00", aiGenerated: true },
  { id: "t7", title: "Capstone — Auth flow refactor", category: "project", start: "17:30", end: "19:00", aiGenerated: true, protected: true },
  { id: "t8", title: "Coding Club Meet", category: "club", start: "19:30", end: "20:30", location: "Innovation Lab" },
  { id: "t9", title: "Deep work: System Design notes", category: "focus", start: "21:00", end: "22:00", aiGenerated: true, protected: true },
];

export type Deadline = {
  id: string;
  title: string;
  category: Category;
  due: string; // ISO
  progress: number; // 0-100
  milestones: { label: string; done: boolean }[];
};

export const deadlines: Deadline[] = [
  {
    id: "d1",
    title: "Google STEP Application",
    category: "placement",
    due: "2026-06-14",
    progress: 65,
    milestones: [
      { label: "Resume polished", done: true },
      { label: "Referral request sent", done: true },
      { label: "Cover note draft", done: false },
      { label: "Final submit", done: false },
    ],
  },
  {
    id: "d2",
    title: "OS Mid-Sem Exam",
    category: "academic",
    due: "2026-06-11",
    progress: 42,
    milestones: [
      { label: "Process scheduling", done: true },
      { label: "Memory mgmt", done: false },
      { label: "File systems", done: false },
    ],
  },
  {
    id: "d3",
    title: "Capstone v1 demo",
    category: "project",
    due: "2026-06-20",
    progress: 78,
    milestones: [
      { label: "Auth", done: true },
      { label: "Dashboard", done: true },
      { label: "Reports", done: false },
    ],
  },
  {
    id: "d4",
    title: "Striver SDE Sheet — Phase 2",
    category: "dsa",
    due: "2026-06-30",
    progress: 51,
    milestones: [
      { label: "Arrays + Strings", done: true },
      { label: "Trees", done: true },
      { label: "Graphs", done: false },
      { label: "DP", done: false },
    ],
  },
];

export type AIRecommendation = {
  id: string;
  title: string;
  reason: string;
  action: string;
};

export const recommendations: AIRecommendation[] = [
  {
    id: "r1",
    title: "Move Capstone work to 17:30",
    reason: "You focus 38% better after physical activity. Gym is done — let's ride the momentum.",
    action: "Apply",
  },
  {
    id: "r2",
    title: "Add a 25-min Graphs revision",
    reason: "Mid-sem in 5 days. Graphs accuracy is at 62% — below your target.",
    action: "Schedule",
  },
  {
    id: "r3",
    title: "Protect 21:00–22:00 as deep work",
    reason: "Your last 3 evenings drifted into social apps. Locking the slot improves consistency.",
    action: "Protect",
  },
];

export type Conflict = {
  id: string;
  a: { title: string; time: string; category: Category };
  b: { title: string; time: string; category: Category };
  suggestion: string;
};

export const conflicts: Conflict[] = [
  {
    id: "c1",
    a: { title: "Coding Club Meet", time: "Thu · 19:30 – 20:30", category: "club" },
    b: { title: "Capstone Sprint Review", time: "Thu · 19:00 – 20:00", category: "project" },
    suggestion: "Shift Sprint Review to Wed 20:00 — your team is free and Thursday energy is low.",
  },
  {
    id: "c2",
    a: { title: "DSA: Graphs deep dive", time: "Sat · 10:00 – 12:00", category: "dsa" },
    b: { title: "Gym — Leg Day", time: "Sat · 10:30 – 11:30", category: "gym" },
    suggestion: "Move Leg Day to 07:00. Saturday mornings have your highest gym adherence (92%).",
  },
];

export type Goal = {
  id: string;
  title: string;
  category: Category;
  progress: number;
  weekly: number[];
  streak: number;
  nextStep: string;
};

export const goals: Goal[] = [
  { id: "g1", title: "Crack Top-Tier Placement", category: "placement", progress: 58, streak: 12, weekly: [3, 5, 4, 6, 7, 5, 8], nextStep: "Complete 2 DP mock interviews" },
  { id: "g2", title: "Finish Striver SDE Sheet", category: "dsa", progress: 51, streak: 9, weekly: [4, 6, 5, 7, 5, 6, 7], nextStep: "Solve 5 Graphs problems today" },
  { id: "g3", title: "Maintain 9+ CGPA", category: "academic", progress: 84, streak: 22, weekly: [6, 5, 7, 6, 6, 7, 6], nextStep: "Revise OS Chapter 4" },
  { id: "g4", title: "Strength: Bench 80kg", category: "gym", progress: 72, streak: 28, weekly: [1, 1, 1, 0, 1, 1, 1], nextStep: "Push day at 06:30" },
];

export const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const hours = Array.from({ length: 16 }, (_, i) => i + 6); // 6 - 21

export type WeekEvent = { day: number; start: number; end: number; title: string; category: Category };
export const weekEvents: WeekEvent[] = [
  { day: 0, start: 9, end: 10.25, title: "OS Lecture", category: "academic" },
  { day: 0, start: 10.5, end: 12, title: "DSA Graphs", category: "dsa" },
  { day: 0, start: 13.5, end: 15.5, title: "DBMS Lab", category: "academic" },
  { day: 0, start: 16, end: 17, title: "Mock Aptitude", category: "placement" },
  { day: 0, start: 17.5, end: 19, title: "Capstone", category: "project" },
  { day: 1, start: 6.5, end: 7.75, title: "Gym Pull", category: "gym" },
  { day: 1, start: 9, end: 10.25, title: "CN Lecture", category: "academic" },
  { day: 1, start: 11, end: 12.5, title: "DSA Trees", category: "dsa" },
  { day: 1, start: 15, end: 17, title: "Capstone", category: "project" },
  { day: 1, start: 19, end: 20.5, title: "Club Meet", category: "club" },
  { day: 2, start: 9, end: 11, title: "DAA Lecture", category: "academic" },
  { day: 2, start: 11.5, end: 13, title: "Placement Prep", category: "placement" },
  { day: 2, start: 16, end: 17.5, title: "DSA Mock", category: "dsa" },
  { day: 2, start: 20, end: 21, title: "Capstone", category: "project" },
  { day: 3, start: 6.5, end: 7.75, title: "Gym Push", category: "gym" },
  { day: 3, start: 10, end: 12, title: "Project Sprint", category: "project" },
  { day: 3, start: 14, end: 15.5, title: "DSA DP", category: "dsa" },
  { day: 3, start: 19.5, end: 20.5, title: "Club Meet", category: "club" },
  { day: 4, start: 9, end: 10.5, title: "OS Tutorial", category: "academic" },
  { day: 4, start: 11, end: 13, title: "Placement Group", category: "placement" },
  { day: 4, start: 16, end: 18, title: "Capstone", category: "project" },
  { day: 5, start: 7, end: 8, title: "Gym Legs", category: "gym" },
  { day: 5, start: 10, end: 12, title: "DSA Graphs", category: "dsa" },
  { day: 5, start: 15, end: 17, title: "Hackathon Build", category: "project" },
  { day: 6, start: 9, end: 11, title: "Weekly Review", category: "focus" },
  { day: 6, start: 16, end: 18, title: "DSA Contest", category: "dsa" },
];

export const productivity = {
  focusHours: 28.5,
  focusTarget: 32,
  tasksDone: 41,
  tasksTotal: 48,
  streak: 12,
  weeklyByCategory: [
    { cat: "academic" as Category, hours: 11 },
    { cat: "dsa" as Category, hours: 7.5 },
    { cat: "placement" as Category, hours: 4 },
    { cat: "project" as Category, hours: 6 },
    { cat: "gym" as Category, hours: 4.5 },
    { cat: "club" as Category, hours: 2 },
  ],
};

export const student = {
  name: "Aarav",
  year: "3rd Year, B.Tech CSE",
  avatar: "AR",
};
