import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Shield, BarChart3, Award, TrendingUp, LogOut, Menu, X } from "lucide-react";
import ParticipantAnalytics from "./ParticipantAnalytics";
import ParticipantReward from "./ParticipantReward";

const API_BASE_URL = "http://localhost:8080/api";

const ParticipantDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const tabFromUrl = searchParams.get("tab") || "overview";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [surveys, setSurveys] = useState([]);
  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const participantEmail = sessionStorage.getItem("email");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // 🔑 SYNC TAB WITH URL (THIS FIXES YOUR ISSUE)
  useEffect(() => {
    setActiveTab(tabFromUrl);
  }, [tabFromUrl]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [participantRes, surveysRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/participants/email/${participantEmail}`),
        axios.get(`${API_BASE_URL}/surveys/getAllSurveys`)
      ]);

      setParticipant(participantRes.data);
      setSurveys(surveysRes.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const sidebarItems = [
    { label: "Overview", icon: <BarChart3 />, key: "overview" },
    { label: "Analytics", icon: <TrendingUp />, key: "analytics" },
    { label: "Rewards", icon: <Award />, key: "rewards" },
  ];

  const changeTab = (tab) => {
    navigate(`/participant/dashboard?tab=${tab}`);
    setSidebarOpen(false);
  };

  const logout = () => {
    sessionStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-pink-600 to-rose-500 text-white transition-transform`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8" />
              <span className="text-xl font-bold">SurveyChain</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2"><X /></button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map(item => (
              <button
                key={item.key}
                onClick={() => changeTab(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition ${
                  activeTab === item.key ? "bg-white/20" : ""
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-white/20">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-200 hover:bg-white/10 rounded-lg"
            >
              <LogOut /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2"><Menu /></button>
          <div>
            <h1 className="text-2xl font-bold">Participant Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, {participant?.name || "Participant"}</p>
          </div>
        </header>

        <main className="p-6 flex-1 space-y-6">
          {error && <div className="bg-red-50 border border-red-200 p-4 rounded">{error}</div>}

          {activeTab === "overview" && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Available Surveys</h2>

              {loading ? (
                <p className="text-gray-500">Loading surveys...</p>
              ) : surveys.length === 0 ? (
                <p className="text-gray-500">No surveys available.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full table-auto border-collapse">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Title</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Description</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Reward</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {surveys.map(s => (
                        <tr key={s.id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-2">{s.title}</td>
                          <td className="px-4 py-2 max-w-xs truncate">{s.description}</td>
                          <td className="px-4 py-2">{s.rewards}</td>
                          <td className="px-4 py-2">
                            <button
                              className="bg-rose-600 text-white px-3 py-1 rounded hover:bg-rose-700"
                              onClick={() => navigate(`/participant/survey/${s.id}`)}
                            >
                              Take Survey
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "analytics" && <ParticipantAnalytics />}
          {activeTab === "rewards" && <ParticipantReward />}
        </main>
      </div>
    </div>
  );
};

export default ParticipantDashboard;
