import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Shield,
  Users,
  FileText,
  Award,
  BarChart3,
  Activity,
  LogOut,
  Menu,
  X
} from "lucide-react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const API_BASE_URL = "http://localhost:8080/api";

const ModeratorAnalytics = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [participants, setParticipants] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      const [participantsRes, surveysRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/participants/all`),
        axios.get(`${API_BASE_URL}/surveys/getAllSurveys`)
      ]);

      setParticipants(participantsRes.data || []);
      setSurveys(surveysRes.data || []);

    } catch (error) {
      console.error("Failed to load moderator analytics", error);
      setParticipants([]);
      setSurveys([]);
    } finally {
      setLoading(false);
    }
  };

  // 📊 Stats
  const totalParticipants = participants.length;
  const activeParticipants = participants.filter(
    p => p.status === "Active"
  ).length;

  const totalSurveys = surveys.length;
  const totalResponses = surveys.reduce(
    (sum, s) => sum + (s.totalResponses || 0),
    0
  );

  // 📈 Chart Data
  const chartData = {
    labels: surveys.map(s => s.title),
    datasets: [
      {
        label: "Responses",
        data: surveys.map(s => s.totalResponses || 0),
        backgroundColor: "rgba(59,130,246,0.7)",
        borderRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Survey Responses Overview"
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
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
            {sidebarItems.map(item => (
              <button
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                  item.label === "Analytics"
                    ? "bg-white/20"
                    : "hover:bg-white/10"
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
                sessionStorage.clear();
                navigate("/login");
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-white/10 rounded-lg"
            >
              <LogOut /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Moderator Analytics</h1>
            <p className="text-sm text-gray-500">
              Insights into survey engagement and participation
            </p>
          </div>
        </header>

        <main className="p-6 flex-1 space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading analytics...</p>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Participants" value={totalParticipants} icon={<Users />} color="from-blue-500 to-blue-600" />
                <StatCard title="Active Participants" value={activeParticipants} icon={<Activity />} color="from-green-500 to-green-600" />
                <StatCard title="Surveys" value={totalSurveys} icon={<FileText />} color="from-purple-500 to-purple-600" />
                <StatCard title="Responses" value={totalResponses} icon={<BarChart3 />} color="from-orange-500 to-orange-600" />
              </div>

              {/* Chart */}
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-4">Survey Responses</h2>
                {totalSurveys === 0 ? (
                  <p className="text-gray-500">No surveys available</p>
                ) : (
                  <div className="h-80">
                    <Bar data={chartData} options={chartOptions} />
                  </div>
                )}
              </div>

              {/* Recent Surveys */}
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-4">Recent Surveys</h2>
                {surveys.length === 0 ? (
                  <p className="text-gray-500">No surveys yet</p>
                ) : (
                  <ul className="space-y-3">
                    {surveys.slice(-5).reverse().map(s => (
                      <li key={s.id} className="flex justify-between border-b pb-2">
                        <span>{s.title}</span>
                        <span className="font-semibold text-gray-600">
                          {s.totalResponses || 0} responses
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

const StatCard = ({ title, value, color, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow">
    <div className={`p-3 inline-block bg-gradient-to-br ${color} text-white rounded-lg mb-4`}>
      {icon}
    </div>
    <p className="text-gray-600 text-sm">{title}</p>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

export default ModeratorAnalytics;
