"use client";

import { useState } from "react";
import {
  Calendar,
  CheckSquare,
  ShoppingBag,
  StickyNote,
  Plus,
  Trash2,
  Heart,
  Clock,
  Star,
  CheckCircle2,
  Circle,
  X
} from "lucide-react";
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
  type: "joint" | "person1" | "person2";
}

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
}

interface ShoppingItem {
  id: string;
  name: string;
  category: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
}

export default function Home() {
  // --- State ---
  const [events, setEvents] = useState<Event[]>([
    { id: "1", title: "Dinner with Parents", date: "2023-11-20", time: "19:00", type: "joint" },
    { id: "2", title: "Dentist Appointment", date: "2023-11-21", time: "10:00", type: "person1" },
    { id: "3", title: "Gym Session", date: "2023-11-21", time: "18:30", type: "person2" },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", text: "Pay electricity bill", completed: false, priority: "high" },
    { id: "2", text: "Book flights for Xmas", completed: false, priority: "medium" },
    { id: "3", text: "Water the plants", completed: true, priority: "low" },
  ]);

  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([
    { id: "1", name: "Oat Milk", category: "Dairy" },
    { id: "2", name: "Avocados", category: "Produce" },
    { id: "3", name: "Laundry Detergent", category: "Household" },
  ]);

  const [notes, setNotes] = useState<Note[]>([
    { id: "1", title: "WiFi Password", content: "SuperSecret123!" },
    { id: "2", title: "Holiday Ideas", content: "Italy, Japan, or Iceland?" },
  ]);

  // Input States
  const [newTask, setNewTask] = useState("");
  const [newShoppingItem, setNewShoppingItem] = useState("");

  // Modal States
  const [showEventModal, setShowEventModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", time: "" });
  const [newNote, setNewNote] = useState({ title: "", content: "" });

  // --- Actions ---
  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), text: newTask, completed: false, priority: "medium" }]);
    setNewTask("");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const addShoppingItem = () => {
    if (!newShoppingItem.trim()) return;
    setShoppingItems([...shoppingItems, { id: Date.now().toString(), name: newShoppingItem, category: "General" }]);
    setNewShoppingItem("");
  };

  const deleteShoppingItem = (id: string) => {
    setShoppingItems(shoppingItems.filter(i => i.id !== id));
  };

  const addEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    setEvents([...events, { ...newEvent, id: Date.now().toString(), type: "joint" }]);
    setNewEvent({ title: "", date: "", time: "" });
    setShowEventModal(false);
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const addNote = () => {
    if (!newNote.title || !newNote.content) return;
    setNotes([...notes, { ...newNote, id: Date.now().toString() }]);
    setNewNote({ title: "", content: "" });
    setShowNoteModal(false);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  // --- Summary ---
  const urgentTask = tasks.find(t => !t.completed && t.priority === "high") || tasks.find(t => !t.completed);
  const nextEvent = events.length > 0 ? [...events].sort((a,b) => a.date.localeCompare(b.date))[0] : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="text-rose-500 w-6 h-6 fill-rose-500" />
            <h1 className="text-xl font-bold tracking-tight">Us & Our Life</h1>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Summary Card */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-rose-500 to-orange-400 rounded-2xl p-6 text-white shadow-lg shadow-rose-200">
            <h2 className="text-lg font-semibold mb-4 opacity-90">Daily Pulse</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-start gap-4">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Star className="w-6 h-6 text-yellow-200 fill-yellow-200" />
                </div>
                <div>
                  <p className="text-sm font-medium opacity-80">Next Together</p>
                  <p className="text-xl font-bold">{nextEvent?.title || "Nothing scheduled"}</p>
                  <p className="text-sm opacity-80">{nextEvent ? `${nextEvent.date} at ${nextEvent.time}` : "Time to plan something!"}</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-start gap-4">
                <div className="bg-white/20 p-2 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-emerald-200" />
                </div>
                <div>
                  <p className="text-sm font-medium opacity-80">Most Urgent Task</p>
                  <p className="text-xl font-bold">{urgentTask ? urgentTask.text : "All caught up!"}</p>
                  <p className="text-sm opacity-80">{urgentTask ? `Priority: ${urgentTask.priority}` : "Enjoy your day"}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Calendar Section */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col h-[400px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-bold text-slate-700">
                <Calendar className="w-5 h-5 text-blue-500" />
                Schedule
              </div>
              <button onClick={() => setShowEventModal(true)} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                <Plus className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="space-y-3 overflow-y-auto pr-2">
              {events.map(event => (
                <div key={event.id} className="p-3 bg-slate-50 rounded-lg border-l-4 border-blue-400 relative group">
                  <p className="font-semibold text-sm">{event.title}</p>
                  <p className="text-xs text-slate-500">{event.date} • {event.time}</p>
                  <button onClick={() => deleteEvent(event.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks Section */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col h-[400px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-bold text-slate-700">
                <CheckSquare className="w-5 h-5 text-emerald-500" />
                To-Do
              </div>
            </div>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                placeholder="Add a task..."
                className="flex-1 bg-slate-50 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <button
                onClick={addTask}
                className="bg-emerald-500 text-white p-2 rounded-lg hover:bg-emerald-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 overflow-y-auto pr-2">
              {tasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg group">
                  <button onClick={() => toggleTask(task.id)}>
                    {task.completed ?
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" /> :
                      <Circle className="w-5 h-5 text-slate-300" />
                    }
                  </button>
                  <span className={cn("text-sm flex-1", task.completed && "line-through text-slate-400")}>
                    {task.text}
                  </span>
                  <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Shopping Section */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col h-[400px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-bold text-slate-700">
                <ShoppingBag className="w-5 h-5 text-orange-500" />
                Groceries
              </div>
            </div>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newShoppingItem}
                onChange={(e) => setNewShoppingItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addShoppingItem()}
                placeholder="Add item..."
                className="flex-1 bg-slate-50 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              />
              <button
                onClick={addShoppingItem}
                className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 overflow-y-auto pr-2">
              {shoppingItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg group">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-[10px] uppercase tracking-wider text-orange-600 font-bold opacity-60">{item.category}</p>
                  </div>
                  <button onClick={() => deleteShoppingItem(item.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col h-[400px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-bold text-slate-700">
                <StickyNote className="w-5 h-5 text-purple-500" />
                Vault
              </div>
              <button onClick={() => setShowNoteModal(true)} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                <Plus className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="space-y-4 overflow-y-auto pr-2">
              {notes.map(note => (
                <div key={note.id} className="p-3 bg-purple-50 rounded-lg relative group">
                  <p className="font-bold text-xs text-purple-700 mb-1">{note.title}</p>
                  <p className="text-sm text-slate-600 leading-snug">{note.content}</p>
                  <button onClick={() => deleteNote(note.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Add Event</h3>
              <button onClick={() => setShowEventModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input
                placeholder="Event Title"
                className="w-full bg-slate-50 rounded-lg p-2 border-none outline-none focus:ring-2 focus:ring-blue-500"
                value={newEvent.title}
                onChange={e => setNewEvent({...newEvent, title: e.target.value})}
              />
              <input
                type="date"
                className="w-full bg-slate-50 rounded-lg p-2 border-none outline-none focus:ring-2 focus:ring-blue-500"
                value={newEvent.date}
                onChange={e => setNewEvent({...newEvent, date: e.target.value})}
              />
              <input
                type="time"
                className="w-full bg-slate-50 rounded-lg p-2 border-none outline-none focus:ring-2 focus:ring-blue-500"
                value={newEvent.time}
                onChange={e => setNewEvent({...newEvent, time: e.target.value})}
              />
              <button
                onClick={addEvent}
                className="w-full bg-blue-500 text-white py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors"
              >
                Save Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Add Note</h3>
              <button onClick={() => setShowNoteModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input
                placeholder="Title"
                className="w-full bg-slate-50 rounded-lg p-2 border-none outline-none focus:ring-2 focus:ring-purple-500"
                value={newNote.title}
                onChange={e => setNewNote({...newNote, title: e.target.value})}
              />
              <textarea
                placeholder="Content"
                className="w-full bg-slate-50 rounded-lg p-2 border-none outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"
                value={newNote.content}
                onChange={e => setNewNote({...newNote, content: e.target.value})}
              />
              <button
                onClick={addNote}
                className="w-full bg-purple-500 text-white py-2 rounded-lg font-bold hover:bg-purple-600 transition-colors"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="max-w-6xl mx-auto px-4 mt-8 text-center text-slate-400 text-xs">
        <p>Centralizing our lives, one bit at a time. Built for Us.</p>
      </footer>
    </div>
  );
}
