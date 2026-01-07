import { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line
} from "recharts";

const API_BASE_URL = "http://localhost:8080/api";

const ParticipantAnalytics = () => {
  const [surveys, setSurveys] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  const participantEmail = sessionStorage.getItem("email");

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [surveyRes, responseRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/surveys/getAllSurveys`),
        axios.get(`${API_BASE_URL}/responses/participant/${participantEmail}/submitted-rewards`)
      ]);

      setSurveys(surveyRes.data || []);
      setResponses(responseRes.data || []);
    } catch (err) {
      console.error("Analytics load failed", err);
    } finally {
      setLoading(false);
    }
  };

  // Derived analytics
  const totalSurveys = surveys.length;
  const respondedSurveys = responses.length;
  const totalPoints = responses.reduce((sum, r) => sum + (r.points || 0), 0);

  // Bar Chart Data: Survey Participation
  const barData = surveys.map(s => ({
    name: s.title,
    responses: responses.filter(r => r.surveyId === s.surveyId).length
  }));

  // Line Chart Data: Participation Trend
  const trendData = responses.map((r, index) => ({
    index: index + 1,
    points: totalPoints / responses.length || 0
  }));

  if (loading) return <div className="p-6">Loading analytics...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Survey Analytics</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPI title="Total Surveys" value={totalSurveys} />
        <KPI title="Surveys Participated" value={respondedSurveys} />
        <KPI title="Total Points Earned" value={`${totalPoints} `} />
        <KPI title="Completion Rate" value={`${Math.round((respondedSurveys / (totalSurveys || 1)) * 100)}%`} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Survey Participation Bar Chart */}
        <ChartCard title="Survey Participation">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="responses" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Participation Trend Line Chart */}
        <ChartCard title="Participation Trend">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="points" stroke="#8B5CF6" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default ParticipantAnalytics;

/* Helper components */
const KPI = ({ title, value }) => (
  <div className="bg-white p-6 rounded-xl shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    {children}
  </div>
);
