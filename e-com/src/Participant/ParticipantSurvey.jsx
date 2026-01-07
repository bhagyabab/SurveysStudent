import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Shield,
  Award,
  BarChart3,
  TrendingUp,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const API_BASE_URL = "http://localhost:8080/api";

const SurveyPage = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();

  const [survey, setSurvey] = useState(null);
  const [agree, setAgree] = useState(null);
  const [opinion, setOpinion] = useState("");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch survey details
  useEffect(() => {
    setLoading(true);

    fetch(`${API_BASE_URL}/surveys/${surveyId}`)
      .then(res => {
        if (!res.ok) throw new Error("Survey not found");
        return res.json();
      })
      .then(data => setSurvey(data))
      .catch(() => alert("Survey not found"))
      .finally(() => setLoading(false));
  }, [surveyId]);

  // Submit survey
  const handleSubmit = (e) => {
    e.preventDefault();

    if (agree === null) {
      alert("Please select Agree or Disagree");
      return;
    }

    fetch(`${API_BASE_URL}/responses/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        participantEmail: sessionStorage.getItem("email"),
        surveyId: survey.id,
        response: agree ? "Agree" : "Disagree",
      }),
    })
      .then(res => res.text())
      .then(msg => {
        alert(msg);
        navigate("/participant/dashboard?tab=overview");
      })
      .catch(err => alert("Submission failed: " + err.message));
  };

  // ✅ FIXED SIDEBAR ITEMS
  const sidebarItems = [
    { label: "Overview", icon: <BarChart3 />, tab: "overview" },
    { label: "Analytics", icon: <TrendingUp />, tab: "analytics" },
    { label: "Rewards", icon: <Award />, tab: "rewards" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64
        bg-gradient-to-b from-pink-600 to-rose-500 text-white transition-transform`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-white/20">
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
                key={item.tab}
                onClick={() => {
                  navigate(`/participant/dashboard?tab=${item.tab}`);
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10"
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-white/20">
            <button
              onClick={() => {
                sessionStorage.removeItem("email");
                navigate("/login");
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-white/10 rounded-lg"
            >
              <LogOut />
              Logout
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
          <h1 className="text-xl font-bold">Survey</h1>
        </header>

        <main className="p-6 flex-1">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-10 w-10 border-b-2 border-rose-600 rounded-full" />
            </div>
          ) : !survey ? (
            <p className="text-red-600">Survey not found</p>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow max-w-3xl mx-auto space-y-4">
              <h2 className="text-2xl font-bold">{survey.title}</h2>
              <p className="text-gray-600">{survey.description}</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="flex gap-2">
                  <input
                    type="radio"
                    checked={agree === true}
                    onChange={() => setAgree(true)}
                  />
                  Agree
                </label>

                <label className="flex gap-2">
                  <input
                    type="radio"
                    checked={agree === false}
                    onChange={() => setAgree(false)}
                  />
                  Disagree
                </label>

                <textarea
                  placeholder="Your opinion (optional)"
                  value={opinion}
                  onChange={e => setOpinion(e.target.value)}
                  className="w-full border rounded p-2"
                  rows={4}
                />

                <button
                  type="submit"
                  className="bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700"
                >
                  Submit Survey
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default SurveyPage;
