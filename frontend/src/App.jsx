import { useState, useEffect } from "react";
import {
  fetchEmails,
  summarizeEmail,
  draftReply,
  classifyEmail,
} from "./api";
import {
  Bell,
  Filter,
  Inbox,
  Smile,
  Flag,
  Mail,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Reply,
  Brain,
} from "lucide-react";

export default function App() {
  const [emails, setEmails] = useState([]);
  const [selectedMail, setSelectedMail] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);

  // New states to hold AI results
  const [summary, setSummary] = useState("");
  const [classification, setClassification] = useState("");
  const [draft, setDraft] = useState("");

  // Fetch emails from backend
  useEffect(() => {
    const loadEmails = async () => {
      try {
        const data = await fetchEmails();
        setEmails(data);
      } catch (err) {
        console.error("Error fetching emails:", err);
      }
    };
    loadEmails();
  }, []);

  // AI Action Handlers
  const handleSummarize = async () => {
    if (!selectedMail) return;
    setLoadingAction(true);
    try {
      const result = await summarizeEmail(selectedMail.id);
      setSummary(result.summary || "No summary generated.");
    } catch (err) {
      console.error("Summarize failed:", err);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDraftReply = async () => {
    if (!selectedMail) return;
    setLoadingAction(true);
    try {
      const result = await draftReply(selectedMail.id);
      setDraft(result.draft || "No draft generated.");
    } catch (err) {
      console.error("Draft reply failed:", err);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleClassify = async () => {
    if (!selectedMail) return;
    setLoadingAction(true);
    try {
      const result = await classifyEmail(selectedMail.id);
      setClassification(result.classification || "Unclassified");
    } catch (err) {
      console.error("Classify failed:", err);
    } finally {
      setLoadingAction(false);
    }
  };

  // Reset AI results when switching to a new email
  const handleSelectMail = (mail) => {
    setSelectedMail(mail);
    setSummary("");
    setClassification("");
    setDraft("");
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
      {/* Navbar */}
      <nav className="h-16 bg-white/70 backdrop-blur-md shadow-md flex items-center justify-between px-6 border-b border-gray-200">
        <h1 className="text-2xl font-extrabold text-indigo-600 tracking-tight">
          AI Comm Assistant 🚀
        </h1>
        <div className="flex items-center space-x-6">
          <button className="relative p-2 rounded-full hover:bg-indigo-100 transition">
            <Bell className="w-6 h-6 text-gray-700" />
          </button>
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow">
            AJ
          </div>
        </div>
      </nav>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-72 bg-white/80 backdrop-blur-lg border-r border-gray-200 p-6 hidden md:block relative">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filters
            </h2>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 cursor-pointer hover:bg-indigo-50 p-3 rounded-xl transition bg-indigo-100 font-medium">
                <Inbox className="w-5 h-5 text-indigo-500" /> Inbox
              </li>
              <li className="flex items-center gap-2 cursor-pointer hover:bg-indigo-50 p-3 rounded-xl transition">
                <Flag className="w-5 h-5 text-indigo-500" /> Priority
              </li>
              <li className="flex items-center gap-2 cursor-pointer hover:bg-indigo-50 p-3 rounded-xl transition">
                <Smile className="w-5 h-5 text-indigo-500" /> Sentiment
              </li>
            </ul>
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute -right-4 top-6 bg-indigo-500 text-white rounded-full p-1 shadow hover:bg-indigo-600"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </aside>
        )}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="hidden md:flex items-center justify-center w-6 bg-indigo-500 text-white hover:bg-indigo-600 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Main Content */}
        <main className="flex-1 flex relative">
          {/* Email list */}
          <div className="w-full md:w-1/2 lg:w-2/5 p-6 overflow-y-auto border-r border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-600" /> Inbox
            </h2>

            {emails.map((mail) => (
              <div
                key={mail.id}
                onClick={() => handleSelectMail(mail)}
                className={`bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg mb-6 hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer ${
                  selectedMail?.id === mail.id ? "ring-2 ring-indigo-400" : ""
                }`}
              >
                <h3 className="font-semibold text-lg text-gray-800 mb-1">
                  {mail.subject}
                </h3>
                <p className="text-sm text-gray-600 truncate">{mail.preview}</p>
                <div className="flex justify-between mt-4 text-xs text-gray-500">
                  <span>📧 {mail.sender}</span>
                  {selectedMail?.id === mail.id && classification && (
                    <span className="px-2 py-1 rounded-lg bg-purple-100 text-purple-700 font-medium text-xs">
                      {classification}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Mail Preview */}
          <div className="hidden md:block flex-1 p-6 overflow-y-auto">
            {selectedMail ? (
              <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {selectedMail.subject}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  From: {selectedMail.sender}
                </p>
                <p className="whitespace-pre-line text-gray-700 leading-relaxed mb-6">
                  {selectedMail.body}
                </p>

                {/* AI Actions */}
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={handleSummarize}
                    disabled={loadingAction}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition shadow"
                  >
                    <Sparkles className="w-4 h-4" /> Summarize
                  </button>
                  <button
                    onClick={handleDraftReply}
                    disabled={loadingAction}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition shadow"
                  >
                    <Reply className="w-4 h-4" /> Draft Reply
                  </button>
                  <button
                    onClick={handleClassify}
                    disabled={loadingAction}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500 text-white hover:bg-purple-600 transition shadow"
                  >
                    <Brain className="w-4 h-4" /> Classify
                  </button>
                </div>

                {/* AI Results Section */}
                {summary && (
                  <div className="mb-4 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                    <h4 className="font-semibold text-indigo-700 mb-2">
                      📌 Summary
                    </h4>
                    <p className="text-gray-700">{summary}</p>
                  </div>
                )}

                {draft && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <h4 className="font-semibold text-green-700 mb-2">
                      ✉️ Draft Reply
                    </h4>
                    <p className="text-gray-700 whitespace-pre-line">{draft}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400 italic">
                Select an email to read its content 📩
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
