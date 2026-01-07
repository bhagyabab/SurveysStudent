import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Shield, Users, FileText, Award, BarChart3, Activity,
  LogOut, Menu, X
} from "lucide-react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analytics = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [users, setUsers] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const [participantsRes, moderatorsRes, surveysRes] = await Promise.all([
          axios.get("http://localhost:8080/api/participants/all"),
          axios.get("http://localhost:8080/api/moderators/all"),
          axios.get("http://localhost:8080/api/surveys/getAllSurveys")
        ]);

        // Combine participants and moderators
        const allUsers = [
          ...participantsRes.data.map(p => ({ ...p, role: 'Participant' })),
          ...moderatorsRes.data.map(m => ({ ...m, role: 'Moderator' }))
        ];

        setUsers(allUsers);
        setSurveys(surveysRes.data || []);

      } catch (error) {
        console.error("Failed to load analytics data", error);
        setUsers([]);
        setSurveys([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  // Stats
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === "Active").length;
  const totalSurveys = surveys.length;
  const totalResponses = surveys.reduce((sum, s) => sum + (s.totalResponses || 0), 0);

  // Prepare chart data
  const chartData = {
    labels: surveys.map(s => s.title),
    datasets: [
      {
        label: 'Responses',
        data: surveys.map(s => s.totalResponses || 0),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Survey Responses Overview' },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

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
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-900 to-purple-900 text-white transition-transform`}>
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
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                  item.id === "analytics" ? "bg-white/20" : "hover:bg-white/10"
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

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <p className="text-sm text-gray-500">
              View comprehensive system statistics and insights
            </p>
          </div>
        </header>

        <main className="p-6 flex-1 space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading analytics data...</p>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                  title="Total Users" 
                  value={totalUsers} 
                  color="from-blue-500 to-blue-600"
                  icon={<Users className="w-6 h-6" />}
                />
                <StatCard 
                  title="Active Users" 
                  value={activeUsers} 
                  color="from-green-500 to-green-600"
                  icon={<Activity className="w-6 h-6" />}
                />
                <StatCard 
                  title="Total Surveys" 
                  value={totalSurveys} 
                  color="from-purple-500 to-purple-600"
                  icon={<FileText className="w-6 h-6" />}
                />
                <StatCard 
                  title="Total Responses" 
                  value={totalResponses} 
                  color="from-orange-500 to-orange-600"
                  icon={<BarChart3 className="w-6 h-6" />}
                />
              </div>

              {/* Chart */}
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-4">Survey Response Analytics</h2>
                {totalSurveys === 0 ? (
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No survey data available yet. Create surveys to see analytics.
                    </p>
                  </div>
                ) : (
                  <div className="h-80">
                    <Bar data={chartData} options={chartOptions} />
                  </div>
                )}
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Surveys */}
                <div className="bg-white p-6 rounded-xl shadow">
                  <h2 className="text-lg font-semibold mb-4">Recent Surveys</h2>
                  {surveys.length === 0 ? (
                    <p className="text-gray-500 text-sm">No surveys created yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {surveys.slice(-5).reverse().map(s => (
                        <li key={s.id} className="flex justify-between items-center border-b py-3 hover:bg-gray-50 px-2 rounded">
                          <div className="flex-1">
                            <p className="font-medium">{s.title}</p>
                            <p className="text-xs text-gray-500">{s.rewards} points reward</p>
                          </div>
                          <span className="text-gray-600 font-semibold">
                            {s.totalResponses || 0} responses
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* User Distribution */}
                <div className="bg-white p-6 rounded-xl shadow">
                  <h2 className="text-lg font-semibold mb-4">User Distribution</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Participants</span>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">
                        {users.filter(u => u.role === 'Participant').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">Moderators</span>
                      </div>
                      <span className="text-2xl font-bold text-purple-600">
                        {users.filter(u => u.role === 'Moderator').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Active Users</span>
                      </div>
                      <span className="text-2xl font-bold text-green-600">
                        {activeUsers}
                      </span>
                    </div>
                  </div>
                </div>
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
    <p className="text-3xl font-bold mt-1">{value}</p>
  </div>
);

export default Analytics;