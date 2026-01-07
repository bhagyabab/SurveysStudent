import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Users, FileText, Award, TrendingUp,
  LogOut, Menu, X, Search, Bell, ChevronDown, Database,
  UserCheck, BarChart3, Activity, Lock, AlertCircle,
  Trash2
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchParticipants = fetch("http://localhost:8080/api/participants/all").then(res => res.json());
    const fetchModerators = fetch("http://localhost:8080/api/moderators/all").then(res => res.json());

    Promise.all([fetchParticipants, fetchModerators])
      .then(([participantsData, moderatorsData]) => {
        const mappedParticipants = participantsData.map(p => ({
          id: p.id,
          name: p.name,
          email: p.email,
          role: "Participant",
          status: p.status || "Active"
        }));

        const mappedModerators = moderatorsData.map(m => ({
          id: m.id,
          name: m.name,
          email: m.email,
          role: "Moderator",
          status: m.status || "Active"
        }));

        setUsers([...mappedParticipants, ...mappedModerators]);
      })
      .catch(err => console.error("Failed to fetch users", err));
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('currentUser');
    navigate('/login');
  };

  const handleRemoveModerator = (id) => {
    if (!window.confirm("Are you sure you want to remove this moderator?")) return;

    fetch(`http://localhost:8080/api/moderators/${id}`, {
      method: "DELETE"
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to delete");
        return res.json();
      })
      .then(() => {
        setUsers(users.filter(u => u.id !== id));
        alert("Moderator removed successfully");
      })
      .catch(err => {
        console.error(err);
        alert("Failed to remove moderator");
      });
  };

  const handleStatusChange = (id, newStatus) => {
    fetch(`http://localhost:8080/api/admin/users/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    })
      .then(() => {
        setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
      })
      .catch(err => console.error("Failed to update status", err));
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'Active').length;
  const totalResponses = users.reduce((s, u) => s + (u.responses || 0), 0);
  const totalRewards = users.reduce((s, u) => s + (u.reward || 0), 0);

  const stats = [
    { title: 'Total Users', value: totalUsers, icon: <Users />, color: 'from-blue-500 to-blue-600' },
    { title: 'Active Users', value: activeUsers, icon: <UserCheck />, color: 'from-green-500 to-green-600' },
    { title: 'Total Responses', value: totalResponses, icon: <TrendingUp />, color: 'from-purple-500 to-purple-600' },
    { title: 'Rewards Distributed', value: `₹${totalRewards}`, icon: <Award />, color: 'from-orange-500 to-orange-600' }
  ];

  const recentActivities = users.slice(-5).map(u => ({
    user: u.name,
    action: `Registered as ${u.role}`,
    time: 'Recently',
    type: 'info'
  }));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-900 to-purple-900 text-white transition-transform`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8" />
              <span className="text-xl font-bold">SurveyChain</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden"><X /></button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {[
              { id: 'overview', label: 'Overview', icon: <BarChart3 />, route: '/admin/dashboard' },
              { id: 'users', label: 'User Management', icon: <Users />, route: null },
              { id: 'surveys', label: 'Survey Management', icon: <FileText />, route: '/admin/surveys' },
              { id: 'rewards', label: 'Rewards', icon: <Award />, route: '/admin/rewards' },
              { id: 'analytics', label: 'Analytics', icon: <Activity />, route: '/admin/analytics' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.route) {
                    navigate(item.route);
                  } else {
                    setActiveTab(item.id);
                  }
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === item.id ? 'bg-white/20' : 'hover:bg-white/10'}`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-white/10 rounded-lg">
              <LogOut /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden"><Menu /></button>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
        </header>

        <main className="p-6 flex-1 space-y-6">
          {/* Overview */}
          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl shadow">
                    <div className={`p-3 inline-block bg-gradient-to-br ${s.color} text-white rounded-lg mb-4`}>
                      {s.icon}
                    </div>
                    <h3 className="text-gray-600">{s.title}</h3>
                    <p className="text-3xl font-bold">{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow">
                  <h2 className="font-bold mb-4">Recent Activity</h2>
                  {recentActivities.length === 0 ? <p>No activity yet</p> :
                    recentActivities.map((a, i) => (<p key={i} className="text-sm text-gray-600">{a.user} — {a.action}</p>))
                  }
                </div>
                <div className="bg-white p-6 rounded-xl shadow">
                  <h2 className="font-bold mb-4">System Status</h2>
                  <p className="text-green-600 flex items-center gap-2"><Database /> Blockchain Operational</p>
                  <p className="text-green-600 flex items-center gap-2"><Lock /> Security Active</p>
                </div>
              </div>
            </>
          )}

          {/* User Management */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-xl shadow">
              <div className="flex justify-between p-6 border-b">
                <h2 className="font-bold text-xl">User Management</h2>
                <button
                  onClick={() => navigate('/admin/register-moderator')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg"
                >
                  Add Moderator
                </button>
              </div>

              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Role</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-t">
                      <td className="px-6 py-3">{u.name}</td>
                      <td className="px-6 py-3">{u.email}</td>
                      <td className="px-6 py-3">{u.role}</td>
                      <td className="px-6 py-3">{u.status}</td>
                      <td className="px-6 py-3">
                        {u.role === "Moderator" && u.status === "Active" && (
                          <button
                            onClick={() => handleRemoveModerator(u.id)}
                            className="text-red-600 flex items-center gap-1"
                          >
                            <Trash2 size={16} /> Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!['overview', 'users'].includes(activeTab) && (
            <div className="bg-white p-12 rounded-xl shadow text-center">
              <AlertCircle className="mx-auto mb-4" size={40} />
              <p>Section handled in separate page</p>
            </div>
          )}
        </main>
      </div>

      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden"></div>}
    </div>
  );
};

export default AdminDashboard;