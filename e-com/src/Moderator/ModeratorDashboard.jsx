import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Shield,
  Users,
  FileText,
  Award,
  Activity,
  BarChart3,
  LogOut,
  Menu,
  X,
  TrendingUp
} from "lucide-react";

const ModeratorDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [participants, setParticipants] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://localhost:8080/api";

  // Fetch data from backend
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Fetching dashboard data...");

      // Fetch participants and surveys in parallel
      const [participantsRes, surveysRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/participants/all`),
        axios.get(`${API_BASE_URL}/surveys/getAllSurveys`)
      ]);

      console.log("✅ Participants:", participantsRes.data);
      console.log("✅ Surveys:", surveysRes.data);

      setParticipants(participantsRes.data || []);
      setSurveys(surveysRes.data || []);

    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please ensure backend is running.");
      
      // Set empty arrays on error
      setParticipants([]);
      setSurveys([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const totalSurveys = surveys.length;
  const totalResponses = surveys.reduce(
    (sum, s) => sum + (s.totalResponses || 0),
    0
  );
  const activeParticipants = participants.filter(
    (p) => p.status === "Active"
  ).length;
  const totalRewardsPaid = participants.reduce(
    (sum, p) => sum + (p.reward || 0),
    0
  );

  const sidebarItems = [
    { label: "Overview", icon: <BarChart3 />, path: "/moderator/dashboard" },
    { label: "Participants", icon: <Users />, path: "/moderator/participants" },
    { label: "Rewards", icon: <Award />, path: "/moderator/rewards" },
    { label: "Analytics", icon: <Activity />, path: "/moderator/analytics" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 
        bg-gradient-to-b from-blue-900 to-purple-900 text-white transition-transform duration-300`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8" />
              <span className="text-xl font-bold">SurveyChain</span>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="lg:hidden hover:bg-white/10 p-2 rounded"
            >
              <X />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  item.label === "Overview" ? "bg-white/20" : "hover:bg-white/10"
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
              className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-white/10 rounded-lg transition-colors"
            >
              <LogOut />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="lg:hidden hover:bg-gray-100 p-2 rounded"
            >
              <Menu />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Moderator Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome back! Here's your overview</p>
            </div>
          </div>
          
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </header>

        <main className="p-6 flex-1 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading dashboard...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                  title="My Surveys" 
                  value={totalSurveys}
                  icon={<FileText className="w-6 h-6" />}
                  color="from-blue-500 to-blue-600"
                />
                <StatCard 
                  title="Total Responses" 
                  value={totalResponses}
                  icon={<TrendingUp className="w-6 h-6" />}
                  color="from-green-500 to-green-600"
                />
                <StatCard 
                  title="Active Participants" 
                  value={activeParticipants}
                  icon={<Users className="w-6 h-6" />}
                  color="from-purple-500 to-purple-600"
                />
                <StatCard 
                  title="Rewards Paid" 
                  value={`${totalRewardsPaid} pts`}
                  icon={<Award className="w-6 h-6" />}
                  color="from-orange-500 to-orange-600"
                />
              </div>

              {/* Recent Survey Activity */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Survey Activity</h2>
                  <button
                    onClick={() => navigate("/moderator/surveys")}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View All →
                  </button>
                </div>
                
                {surveys.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No survey activity yet.</p>
                    <p className="text-gray-400 text-xs mt-1">Create your first survey to get started</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b">
                        <tr>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Survey Title</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Responses</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Rewards</th>
                          <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {surveys.slice(-5).reverse().map((s) => (
                          <tr key={s.id} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4">
                              <div className="font-medium text-gray-900">{s.title}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {s.description?.substring(0, 50)}...
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <span className="font-semibold text-gray-700">
                                {s.totalResponses || 0}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <span className="text-green-600 font-semibold">
                                {s.rewards || 0} pts
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                                s.status === 'Active' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {s.status || 'Active'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ActionButton 
                    label="Manage Participants" 
                    onClick={() => navigate("/moderator/participants")}
                    icon={<Users className="w-5 h-5" />}
                  />
                  <ActionButton 
                    label="Distribute Rewards" 
                    onClick={() => navigate("/moderator/rewards")}
                    icon={<Award className="w-5 h-5" />}
                  />
                  <ActionButton 
                    label="View Analytics" 
                    onClick={() => navigate("/moderator/analytics")}
                    icon={<Activity className="w-5 h-5" />}
                  />
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

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
    <div className={`p-3 inline-block bg-gradient-to-br ${color} text-white rounded-lg mb-4`}>
      {icon}
    </div>
    <p className="text-gray-600 text-sm">{title}</p>
    <p className="text-3xl font-bold mt-1 text-gray-900">{value}</p>
  </div>
);

const ActionButton = ({ label, onClick, icon }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
  >
    {icon}
    {label}
  </button>
);

export default ModeratorDashboard;