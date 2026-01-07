import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield, Users, FileText, Award, BarChart3,
  LogOut, Menu, X, UserPlus
} from "lucide-react";

const RegisterModerator = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/moderators/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password
        })
      });

      if (!response.ok) {
        throw new Error("Failed to register moderator");
      }

      alert("Moderator registered successfully");
      navigate("/admin/dashboard");

    } catch (error) {
      alert(error.message);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 
        bg-gradient-to-b from-blue-900 to-purple-900 text-white transition-transform`}>

        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 p-6 border-b border-white/10">
            <Shield className="w-8 h-8" />
            <span className="text-xl font-bold">SurveyChain</span>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <button onClick={() => navigate("/admin/dashboard")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10">
              <BarChart3 className="w-5 h-5" />
              Overview
            </button>

            <button onClick={() => navigate("/admin/dashboard")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10">
              <Users className="w-5 h-5" />
              User Management
            </button>

            <button onClick={() => navigate("/admin/conduct-survey")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10">
              <FileText className="w-5 h-5" />
              Conduct Surveys
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/20">
              <UserPlus className="w-5 h-5" />
              Register Moderator
            </button>

            <button onClick={() => navigate("/admin/rewards")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10">
              <Award className="w-5 h-5" />
              Rewards
            </button>
          </nav>

          <div className="p-4 border-t border-white/10">
            <button
              onClick={() => navigate("/login")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-300 hover:bg-white/10">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white shadow-sm px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Register Moderator</h1>
            <p className="text-sm text-gray-500">
              Create and manage moderators who validate surveys
            </p>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm">
            <div className="border-b px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Moderator Details
              </h2>
              <p className="text-sm text-gray-500">
                Fill the details below to register a new moderator
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 
                text-white py-2.5 rounded-lg font-semibold hover:shadow-lg">
                Register Moderator
              </button>
            </form>
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default RegisterModerator;
