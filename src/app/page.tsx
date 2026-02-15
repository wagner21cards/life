"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  CheckSquare,
  ShoppingBag,
  StickyNote,
  Plus,
  Heart,
  RefreshCw,
  MoreVertical,
  CheckCircle2,
  User,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  source: "manual" | "outlook";
}

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
}

interface PersonData {
  events: Event[];
  tasks: Task[];
}

interface TogetherData {
  events: Event[];
  tasks: Task[];
  shopping: { id: string; name: string; category: string }[];
  notes: { id: string; title: string; content: string }[];
}

type TabType = "brynna" | "luke" | "together";

// --- Initial Data ---
const INITIAL_BRYNNA: PersonData = {
  events: [{ id: "b1", title: "Pilates Class", date: "2023-11-20", time: "08:00", source: "outlook" }],
  tasks: [{ id: "bt1", text: "Reply to emails", completed: false, priority: "medium" }]
};

const INITIAL_LUKE: PersonData = {
  events: [{ id: "l1", title: "Project Sync", date: "2023-11-20", time: "11:00", source: "outlook" }],
  tasks: [{ id: "lt1", text: "Review PRs", completed: true, priority: "high" }]
};

const INITIAL_TOGETHER: TogetherData = {
  events: [{ id: "t1", title: "Dinner Date", date: "2023-11-20", time: "19:30", source: "manual" }],
  tasks: [{ id: "tt1", text: "Buy wedding gift", completed: false, priority: "high" }],
  shopping: [{ id: "s1", name: "Sparkling Water", category: "Drinks" }],
  notes: [{ id: "n1", title: "Gift Ideas", content: "That fancy coffee machine?" }]
};

export default function Home() {
  // --- State ---
  const [activeTab, setActiveTab] = useState<TabType>("together");
  const [isSyncing, setIsSyncing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [brynnaData, setBrynnaData] = useState<PersonData>(INITIAL_BRYNNA);
  const [lukeData, setLukeData] = useState<PersonData>(INITIAL_LUKE);
  const [togetherData, setTogetherData] = useState<TogetherData>(INITIAL_TOGETHER);

  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [lastSync, setLastSync] = useState("");

  // --- Persistence ---
  useEffect(() => {
    setIsMounted(true);
    setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    const savedBrynna = localStorage.getItem("brynnaData");
    const savedLuke = localStorage.getItem("lukeData");
    const savedTogether = localStorage.getItem("togetherData");

    if (savedBrynna) setBrynnaData(JSON.parse(savedBrynna));
    if (savedLuke) setLukeData(JSON.parse(savedLuke));
    if (savedTogether) setTogetherData(JSON.parse(savedTogether));
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("brynnaData", JSON.stringify(brynnaData));
      localStorage.setItem("lukeData", JSON.stringify(lukeData));
      localStorage.setItem("togetherData", JSON.stringify(togetherData));
    }
  }, [brynnaData, lukeData, togetherData, isMounted]);

  // --- Actions ---
  const syncOutlook = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

      // Simulate adding an outlook event for demonstration
      const demoEvent: Event = {
        id: Date.now().toString(),
        title: "Team Sync (Outlook)",
        date: "2023-11-21",
        time: "10:00",
        source: "outlook"
      };

      if (activeTab === "brynna") {
        setBrynnaData(prev => ({ ...prev, events: [demoEvent, ...prev.events] }));
      } else if (activeTab === "luke") {
        setLukeData(prev => ({ ...prev, events: [demoEvent, ...prev.events] }));
      }
    }, 1200);
  };

  const addTask = (text: string, tab: TabType) => {
    const newTask: Task = { id: Date.now().toString(), text, completed: false, priority: "medium" };
    if (tab === "brynna") setBrynnaData(prev => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
    else if (tab === "luke") setLukeData(prev => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
    else setTogetherData(prev => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
  };

  const toggleTask = (id: string, tab: TabType) => {
    if (tab === "brynna") setBrynnaData(prev => ({ ...prev, tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t) }));
    else if (tab === "luke") setLukeData(prev => ({ ...prev, tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t) }));
    else setTogetherData(prev => ({ ...prev, tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t) }));
  };

  // --- Helpers ---
  const getActiveData = () => {
    if (activeTab === "brynna") return brynnaData;
    if (activeTab === "luke") return lukeData;
    return togetherData;
  };

  if (!isMounted) return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col max-w-md mx-auto shadow-2xl relative overflow-hidden pb-20">
      {/* iOS Status Bar Mock */}
      <div className="h-12 flex items-center justify-between px-8 z-30 w-full shrink-0">
        <span className="text-sm font-bold">9:41</span>
        <div className="flex gap-1.5 items-center">
          <svg width="17" height="11" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.5 1H2.5C1.67157 1 1 1.67157 1 2.5V8.5C1 9.32843 1.67157 10 2.5 10H14.5C15.3284 10 16 9.32843 16 8.5V2.5C16 1.67157 15.3284 10 14.5 1Z" stroke="black" strokeWidth="1.2"/>
            <path d="M1 5H0V6H1V5Z" fill="black"/>
          </svg>
        </div>
      </div>

      <header className="px-6 pt-4 pb-6 bg-white sticky top-0 z-20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-rose-500 p-1.5 rounded-lg shadow-lg shadow-rose-100">
              <Heart className="text-white w-5 h-5 fill-white" />
            </div>
            <h1 className="text-xl font-black tracking-tight uppercase italic">Us</h1>
          </div>
          <button
            onClick={syncOutlook}
            className={cn(
              "flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full transition-all",
              isSyncing && "text-rose-500 bg-rose-50"
            )}
          >
            <RefreshCw className={cn("w-3 h-3", isSyncing && "animate-spin")} />
            {isSyncing ? "Syncing..." : `Updated ${lastSync}`}
          </button>
        </div>

        <div className="flex p-1 bg-slate-100 rounded-2xl relative">
          {["brynna", "luke", "together"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as TabType)}
              className={cn(
                "relative z-10 flex-1 py-2.5 text-xs font-black uppercase tracking-wider transition-colors",
                activeTab === tab ? "text-slate-900" : "text-slate-400"
              )}
            >
              {tab === "together" ? "Together" : tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white rounded-xl shadow-sm -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 px-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            {(activeTab !== "together") && (
              <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3">
                <div className="bg-blue-500 p-2 rounded-xl shrink-0">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-blue-900 leading-none mb-1">Outlook Integration</p>
                  <p className="text-[10px] text-blue-700 font-medium">Demo Mode: Syncing with mock account</p>
                </div>
                <Info className="w-4 h-4 text-blue-300" />
              </div>
            )}

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Schedule</h2>
                <div className="h-[1px] flex-1 mx-4 bg-slate-100" />
              </div>
              <div className="space-y-3">
                {getActiveData().events.length > 0 ? getActiveData().events.map(event => (
                  <div key={event.id} className="group relative flex items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black leading-none",
                      event.source === 'outlook' ? "bg-blue-50 text-blue-600" : "bg-rose-50 text-rose-600"
                    )}>
                      <span className="text-[10px] uppercase">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="text-lg">{new Date(event.date).getDate()}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-800">{event.title}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{event.time} • {event.source}</p>
                    </div>
                    <button className="text-slate-200 group-hover:text-slate-400">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                )) : (
                  <p className="text-xs text-slate-400 text-center py-4">No upcoming events</p>
                )}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">To-Do</h2>
                <div className="h-[1px] flex-1 mx-4 bg-slate-100" />
              </div>
              <div className="space-y-2">
                {getActiveData().tasks.length > 0 ? getActiveData().tasks.map(task => (
                  <div key={task.id} className="flex items-center gap-3 group">
                    <button
                      onClick={() => toggleTask(task.id, activeTab)}
                      className={cn(
                        "w-6 h-6 rounded-lg flex items-center justify-center transition-all border-2",
                        task.completed ? "bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-100" : "border-slate-200"
                      )}
                    >
                      {task.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </button>
                    <span className={cn(
                      "text-sm font-bold transition-all",
                      task.completed ? "text-slate-300 line-through" : "text-slate-700"
                    )}>
                      {task.text}
                    </span>
                    {task.priority === 'high' && !task.completed && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    )}
                  </div>
                )) : (
                  <p className="text-xs text-slate-400 text-center py-4">All caught up!</p>
                )}
              </div>
            </section>

            {activeTab === "together" && (
              <section className="grid grid-cols-2 gap-4">
                <div className="bg-orange-50/50 p-5 rounded-[2.5rem] border border-orange-100">
                  <div className="bg-orange-500 w-10 h-10 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-orange-100">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <p className="font-black text-xs uppercase tracking-widest text-orange-900 mb-1">Shopping</p>
                  <p className="text-lg font-black text-orange-950">{togetherData.shopping.length} Items</p>
                </div>
                <div className="bg-purple-50/50 p-5 rounded-[2.5rem] border border-purple-100">
                  <div className="bg-purple-500 w-10 h-10 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-100">
                    <StickyNote className="w-5 h-5 text-white" />
                  </div>
                  <p className="font-black text-xs uppercase tracking-widest text-purple-900 mb-1">The Vault</p>
                  <p className="text-lg font-black text-purple-950">{togetherData.notes.length} Notes</p>
                </div>
              </section>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <button
        onClick={() => setShowAddDrawer(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-30"
      >
        <Plus className="w-6 h-6 stroke-[3px]" />
      </button>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 h-20 px-8 flex items-center justify-between z-20 max-w-md mx-auto">
        <button className="flex flex-col items-center gap-1 text-rose-500">
          <Heart className="w-6 h-6 fill-rose-500" />
          <span className="text-[10px] font-black uppercase">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-300 hover:text-slate-600 transition-colors">
          <CheckSquare className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase">List</span>
        </button>
        <div className="w-12 h-1" />
        <button className="flex flex-col items-center gap-1 text-slate-300 hover:text-slate-600 transition-colors">
          <ShoppingBag className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase">Shop</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-300 hover:text-slate-600 transition-colors">
          <User className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase">Me</span>
        </button>
      </nav>

      <AnimatePresence>
        {showAddDrawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddDrawer(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 max-w-md mx-auto"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[3rem] p-8 z-50 max-w-md mx-auto shadow-2xl border-t border-slate-100"
            >
              <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-8" />
              <h2 className="text-2xl font-black mb-6">Quick Add</h2>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Calendar, label: "Event", color: "bg-blue-500" },
                  { icon: CheckSquare, label: "Task", color: "bg-emerald-500" },
                  { icon: ShoppingBag, label: "Grocery", color: "bg-orange-500" },
                  { icon: StickyNote, label: "Note", color: "bg-purple-500" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.label === "Task") addTask("New Task", activeTab);
                      setShowAddDrawer(false);
                    }}
                    className="flex items-center gap-3 p-4 bg-slate-50 rounded-3xl hover:bg-slate-100 transition-colors text-left"
                  >
                    <div className={cn("p-2 rounded-xl shrink-0", item.color)}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold">{item.label}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowAddDrawer(false)}
                className="w-full py-4 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-widest text-sm"
              >
                Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
