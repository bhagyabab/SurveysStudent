import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  Shield, FileText, Award, BarChart3, Activity,
  LogOut, Menu, ClipboardList, X, Trash2
} from "lucide-react";
import axios from "axios";

const SurveyManagement = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const tabFromUrl = searchParams.get("tab") || "list";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [surveyForm, setSurveyForm] = useState({
    title: "",
    description: "",
    rewards: ""
  });

  useEffect(() => {
    setActiveTab(tabFromUrl);
  }, [tabFromUrl]);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/surveys/getAllSurveys");
      setSurveys(response.data || []);
    } catch (err) {
      alert("Failed to fetch surveys");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setSurveyForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSurveySubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: surveyForm.title.trim(),
      description: surveyForm.description.trim(),
      rewards: parseInt(surveyForm.rewards, 10)
    };

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/surveys/add",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      setSurveys(prev => [...prev, response.data]);
      setSurveyForm({ title: "", description: "", rewards: "" });

      navigate("/admin/surveys?tab=list");
    } catch (error) {
      alert("Failed to create survey");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSurvey = async (surveyId) => {
    if (!window.confirm("Are you sure you want to delete this survey?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/surveys/${surveyId}`);
      setSurveys(surveys.filter(s => s.id !== surveyId));
    } catch {
      alert("Failed to delete survey");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-900 to-purple-900 text-white transition-transform`}>
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
            <button onClick={() => navigate("/admin/dashboard")} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10">
              <BarChart3 /> Overview
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/20">
              <FileText /> Survey Management
            </button>

            <button onClick={() => navigate("/admin/analytics")} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10">
              <Activity /> Analytics
            </button>
          </nav>

          <div className="p-4 border-t border-white/10">
            <button onClick={() => navigate("/login")} className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-white/10 rounded-lg">
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
          <h1 className="text-2xl font-bold">Survey Management</h1>
        </header>

        <main className="flex-1 p-6 space-y-6">
          {/* Tabs */}
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded-lg font-semibold ${activeTab === "list" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => navigate("/admin/surveys?tab=list")}
            >
              Survey List
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-semibold ${activeTab === "conduct" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => navigate("/admin/surveys?tab=conduct")}
            >
              Conduct Survey
            </button>
          </div>

          {activeTab === "list" && (
            <div className="bg-white rounded-xl shadow p-6">
              {surveys.map(s => (
                <div key={s.id} className="flex justify-between border-b py-2">
                  <span>{s.title}</span>
                  <button onClick={() => handleDeleteSurvey(s.id)} className="text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "conduct" && (
            <form onSubmit={handleSurveySubmit} className="bg-white p-6 rounded-xl shadow space-y-4">
              <input name="title" value={surveyForm.title} onChange={handleFormChange} placeholder="Title" className="w-full border px-4 py-2 rounded" />
              <textarea name="description" value={surveyForm.description} onChange={handleFormChange} placeholder="Description" className="w-full border px-4 py-2 rounded" />
              <input name="rewards" value={surveyForm.rewards} onChange={handleFormChange} placeholder="Rewards" type="number" className="w-full border px-4 py-2 rounded" />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Publish Survey</button>
            </form>
          )}
        </main>
      </div>
    </div>
  );
};

export default SurveyManagement;
