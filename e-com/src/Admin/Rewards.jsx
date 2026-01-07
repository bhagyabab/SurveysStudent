import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Shield, Award, BarChart3, Users, FileText, Activity,
  LogOut, Menu, X
} from "lucide-react";

const API_BASE_URL = "http://localhost:8080/api";

const Rewards = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loadingSurveys, setLoadingSurveys] = useState(true);
  const [loadingResponses, setLoadingResponses] = useState(false);

  // Fetch all surveys
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        setLoadingSurveys(true);
        const res = await axios.get(`${API_BASE_URL}/surveys/getAllSurveys`);
        setSurveys(res.data || []);
      } catch (error) {
        console.error("Failed to load surveys", error);
        setSurveys([]);
      } finally {
        setLoadingSurveys(false);
      }
    };

    fetchSurveys();
  }, []);

  // Fetch responses for a survey
  const fetchResponses = async (surveyId) => {
    try {
      setLoadingResponses(true);
      const res = await axios.get(`${API_BASE_URL}/responses/survey/${surveyId}`);
      setResponses(res.data || []);
    } catch (error) {
      console.error("Failed to load responses", error);
      setResponses([]);
    } finally {
      setLoadingResponses(false);
    }
  };

  const totalRewards = surveys.reduce(
    (sum, s) => sum + (s.rewards * (s.totalResponses || 0)),
    0
  );

  const sidebarItems = [
    { id: "overview", label: "Overview", path: "/admin/dashboard", icon: <BarChart3 /> },
    { id: "users", label: "User Management", path: "/admin/dashboard", icon: <Users /> },
    { id: "surveys", label: "Survey Management", path: "/admin/surveys", icon: <FileText /> },
    { id: "rewards", label: "Rewards", path: "/admin/rewards", icon: <Award /> },
    { id: "analytics", label: "Analytics", path: "/admin/analytics", icon: <Activity /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-900 to-purple-900
        text-white transition-transform`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8" />
              <span className="text-xl font-bold">SurveyChain</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                  item.id === "rewards" ? "bg-white/20" : "hover:bg-white/10"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <button
              onClick={() => {
                sessionStorage.removeItem("currentUser");
                localStorage.removeItem("currentUser");
                navigate("/login");
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-white/10 rounded-lg"
            >
              <LogOut /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Rewards Overview</h1>
            <p className="text-sm text-gray-500">
              Track distributed rewards and participant responses
            </p>
          </div>
        </header>

        <main className="p-6 flex-1 space-y-6">
          {/* Total Rewards */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700">
              Total Rewards Distributed
            </h2>
            <p className="text-4xl font-bold text-green-600 mt-2">
              {totalRewards} points
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Across {surveys.length} surveys
            </p>
          </div>

          {/* Survey Selector */}
          <div className="bg-white p-4 rounded-xl shadow">
            <label className="block text-sm font-semibold mb-2">
              Select Survey
            </label>
            <select
              className="w-full border p-2 rounded"
              onChange={(e) => {
                const survey = surveys.find(s => s.id === Number(e.target.value));
                setSelectedSurvey(survey || null);
                setResponses([]);
                if (survey) fetchResponses(survey.id);
              }}
            >
              <option value="">-- Select Survey --</option>
              {surveys.map(s => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </div>

          {/* Participant Responses Table */}
          {selectedSurvey && (
            <div className="bg-white rounded-xl shadow overflow-x-auto">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold">
                  Responses for "{selectedSurvey.title}"
                </h2>
              </div>

              {loadingResponses ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-4">Loading responses...</p>
                </div>
              ) : (
                <table className="w-full table-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">#</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Participant Email</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Response</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responses.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                          No responses yet for this survey.
                        </td>
                      </tr>
                    ) : (
                      responses.map((r, index) => (
                        <tr key={r.id} className="border-t hover:bg-gray-50">
                          <td className="px-6 py-3">{index + 1}</td>
                          <td className="px-6 py-3">{r.participantEmail}</td>
                          <td className="px-6 py-3">{r.response}</td>
                          <td className="px-6 py-3">{r.description || "—"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Rewards;
