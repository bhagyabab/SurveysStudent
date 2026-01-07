import React, { useState, useEffect } from "react";
import axios from "axios";
import { Award, Gift, CheckCircle, TrendingUp } from "lucide-react";

const API_BASE_URL = "http://localhost:8080/api";

const ParticipantReward = () => {
  const [rewards, setRewards] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const participantEmail = sessionStorage.getItem("email"); // ✅ Use sessionStorage

  useEffect(() => {
    if (!participantEmail) {
      setError("No user logged in");
      setLoading(false);
      return;
    }
    fetchRewards();
  }, [participantEmail]);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_BASE_URL}/responses/participant/${participantEmail}/submitted-rewards`
      );

      const rewardsFromBackend = (response.data || []).map(r => ({
        id: r.surveyId,
        name: r.title,
        description: r.description,
        points: r.points,
        response: r.response
      }));

      setRewards(rewardsFromBackend);

      const total = rewardsFromBackend.reduce((sum, r) => sum + (r.points || 0), 0);
      setTotalPoints(total);

    } catch (err) {
      console.error("Error fetching rewards:", err);
      setError("Failed to fetch rewards. Please try again later.");
      setRewards([]);
      setTotalPoints(0);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Loading rewards...</div>;
  if (error) return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700 font-medium">{error}</p>
        <button 
          onClick={fetchRewards}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      {/* Points Balance Card */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Total Points Earned</h2>
            </div>
            <p className="text-5xl font-bold">{totalPoints}</p>
            <p className="text-blue-100 mt-2">
              From {rewards.length} completed survey{rewards.length !== 1 ? 's' : ''}
            </p>
          </div>
          <TrendingUp className="w-20 h-20 text-white opacity-20" />
        </div>
      </div>

      {/* Rewards Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Surveys Completed" value={rewards.length} icon={<CheckCircle className="w-10 h-10 text-green-500" />} />
        <StatCard title="Total Points" value={totalPoints} icon={<Gift className="w-10 h-10 text-purple-500" />} />
        <StatCard title="Average per Survey" value={rewards.length > 0 ? Math.round(totalPoints / rewards.length) : 0} icon={<Award className="w-10 h-10 text-blue-500" />} />
      </div>

      {/* Earned Rewards List */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Earned Rewards</h2>
          <button
            onClick={fetchRewards}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Refresh
          </button>
        </div>

        {rewards.length === 0 ? (
          <div className="text-center py-12">
            <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No rewards earned yet</p>
            <p className="text-gray-400 text-sm mt-2">
              Complete surveys to earn points and rewards
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {rewards.map((reward, index) => (
              <div key={reward.id || index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{reward.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{reward.description}</p>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full">
                      <Award className="w-5 h-5" />
                      <span className="font-bold text-lg">+{reward.points}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Points Earned</p>
                  </div>
                </div>

                {reward.response && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Your Response:</span> {reward.response}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      {rewards.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            🎉 Great job! You've earned <span className="font-bold">{totalPoints} points</span> by completing {rewards.length} survey{rewards.length !== 1 ? 's' : ''}. Keep participating to earn more rewards!
          </p>
        </div>
      )}
    </div>
  );
};

export default ParticipantReward;

/* Helper Component for Stats */
const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
    <div>
      <p className="text-gray-600 text-sm">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
    {icon}
  </div>
);
