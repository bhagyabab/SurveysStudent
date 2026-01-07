import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Shield, Users, FileText, Award, Activity, BarChart3,
  LogOut, Menu, X, CheckCircle, XCircle, Search
} from "lucide-react";

const ParticipantManagement = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const API_BASE_URL = "http://localhost:8080/api";

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    setLoading(true);
    try {
      console.log("🔄 Fetching participants from backend...");
      const response = await axios.get(`${API_BASE_URL}/participants/all`);
      console.log("✅ Participants fetched:", response.data);
      setParticipants(response.data || []);
    } catch (error) {
      console.error("❌ Error fetching participants:", error);
      if (error.response) {
        alert(`Failed to fetch participants. Server error: ${error.response.status}`);
      } else if (error.request) {
        alert("Backend not reachable. Please ensure Spring Boot is running on http://localhost:8080");
      } else {
        alert("Error: " + error.message);
      }
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter participants based on search
  const filteredParticipants = participants.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const totalParticipants = participants.length;
  const activeParticipants = participants.filter(p => p.status === "Active").length;
  const totalRewards = participants.reduce((sum, p) => sum + (p.reward || 0), 0);
  const avgRewardsPerParticipant = totalParticipants > 0 ? Math.round(totalRewards / totalParticipants) : 0;

  const sidebarItems = [
    { label: "Overview", icon: <BarChart3 />, path: "/moderator/dashboard" },
    { label: "Participants", icon: <Users />, path: "/moderator/participants" },
    { label: "Rewards", icon: <Award />, path: "/moderator/rewards" },
    { label: "Analytics", icon: <Activity />, path: "/moderator/analytics" }
  ];

  const handleNavigation = (path) => {
    console.log("🔄 Navigating to:", path);
    setSidebarOpen(false);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-900 to-purple-900 text-white transition-transform duration-300`}>
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
            {sidebarItems.map(item => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  item.label === "Participants" ? "bg-white/20" : "hover:bg-white/10"
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
              <LogOut /> Logout
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
              <h1 className="text-2xl font-bold text-gray-900">Participant Management</h1>
              <p className="text-sm text-gray-500">View and manage all registered participants</p>
            </div>
          </div>
          
          <button 
            onClick={fetchParticipants}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </header>

        <main className="p-6 flex-1 space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Participants"
              value={totalParticipants}
              icon={<Users className="w-6 h-6" />}
              color="from-blue-500 to-blue-600"
            />
            <StatCard
              title="Active Participants"
              value={activeParticipants}
              icon={<CheckCircle className="w-6 h-6" />}
              color="from-green-500 to-green-600"
            />
            <StatCard
              title="Total Rewards Earned"
              value={`${totalRewards} pts`}
              icon={<Award className="w-6 h-6" />}
              color="from-orange-500 to-orange-600"
            />
            <StatCard
              title="Avg Rewards/Participant"
              value={`${avgRewardsPerParticipant} pts`}
              icon={<BarChart3 className="w-6 h-6" />}
              color="from-purple-500 to-purple-600"
            />
          </div>

          {/* Participants Table */}
          <div className="bg-white rounded-xl shadow-lg">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">All Participants</h2>
              
              {/* Search Bar */}
              <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent outline-none ml-2 w-64"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading participants...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Rewards Earned</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredParticipants.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-12">
                          <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500 font-medium">
                            {searchTerm ? "No participants found matching your search" : "No participants registered yet"}
                          </p>
                          <p className="text-gray-400 text-sm mt-1">
                            {searchTerm ? "Try adjusting your search criteria" : "Participants will appear here once they register"}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredParticipants.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-gray-600 font-medium">{p.id}</td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{p.name}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{p.email}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                              p.status === "Active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}>
                              {p.status === "Active" ? (
                                <CheckCircle size={14} />
                              ) : (
                                <XCircle size={14} />
                              )}
                              {p.status || "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full text-sm font-bold">
                              {p.reward || 0} points
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer with count */}
            {!loading && filteredParticipants.length > 0 && (
              <div className="px-6 py-4 border-t bg-gray-50">
                <p className="text-sm text-gray-600">
                  Showing {filteredParticipants.length} of {totalParticipants} participants
                  {searchTerm && ` • Filtered by: "${searchTerm}"`}
                </p>
              </div>
            )}
          </div>
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

export default ParticipantManagement;