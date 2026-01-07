import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Shield,
  Users,
  Award,
  Activity,
  BarChart3,
  LogOut,
  Menu,
  X
} from "lucide-react";

const API_BASE_URL = "http://localhost:8080/api";

const ModeratorRewards = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSurveys();
  }, []);

  // Fetch all surveys
  const fetchSurveys = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/surveys/getAllSurveys`);
      setSurveys(res.data || []);
    } catch (err) {
      alert("Failed to load surveys");
    }
  };

  // Fetch responses for selected survey
  const fetchResponses = async (surveyId) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/responses/survey/${surveyId}`);
      setResponses(res.data || []);
    } catch (err) {
      alert("Failed to load responses");
    } finally {
      setLoading(false);
    }
  };

  const sidebarItems = [
    { label: "Overview", path: "/moderator/dashboard", icon: <BarChart3 /> },
    { label: "Participants", path: "/moderator/participants", icon: <Users /> },
    { label: "Rewards", path: "/moderator/rewards", icon: <Award /> },
    { label: "Analytics", path: "/moderator/analytics", icon: <Activity /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 
        bg-gradient-to-b from-blue-900 to-purple-900 text-white transition-transform`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2">
              <Shield />
              <span className="font-bold text-lg">SurveyChain</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X />
            </button>
          </div>

          <nav className="p-4 space-y-2 flex-1">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                  item.label === "Rewards" ? "bg-white/20" : "hover:bg-white/10"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <button
              onClick={() => navigate("/login")}
              className="w-full flex items-center gap-3 text-red-300 hover:bg-white/10 px-4 py-3 rounded-lg"
            >
              <LogOut />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1">
        <header className="bg-white shadow px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu />
          </button>
          <h1 className="text-2xl font-bold">Survey Rewards Overview</h1>
        </header>

        <main className="p-6 space-y-6">
          {/* Survey Selector */}
          <div className="bg-white p-4 rounded-lg shadow">
            <label className="block text-sm font-semibold mb-2">
              Select Survey
            </label>
            <select
              className="w-full border p-2 rounded"
              onChange={(e) => {
                const survey = surveys.find(
                  (s) => s.id === Number(e.target.value)
                );
                setSelectedSurvey(survey || null);
                if (survey) fetchResponses(survey.id);
              }}
            >
              <option value="">-- Select Survey --</option>
              {surveys.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          {/* Responses Table */}
          {loading ? (
            <p>Loading responses...</p>
          ) : (
            selectedSurvey && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-1">
                  Responses for "{selectedSurvey.title}"
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                  {selectedSurvey.description || "No description provided"}
                </p>

                {responses.length === 0 ? (
                  <p className="text-gray-500">No responses yet</p>
                ) : (
                  <table className="w-full border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left">Participant</th>
                        <th className="p-2 text-center">Response</th>
                        <th className="p-2 text-center">Reward</th>
                      </tr>
                    </thead>
                    <tbody>
                      {responses.map((r) => (
                        <tr key={r.id} className="border-t">
                          <td className="p-2">{r.participantEmail}</td>
                          <td className="p-2 text-center">{r.response}</td>
                          <td className="p-2 text-center text-green-600 font-semibold">
                            {selectedSurvey.rewards} pts
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
};

export default ModeratorRewards;
