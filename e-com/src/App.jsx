import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./Home/LandingPage";
import Login from "./Home/Login";
import Signup from "./Home/Signup";

// Admin Pages
import AdminDashboard from "./Admin/AdminDashboard";
import RegisterModerator from "./Admin/RegisterModerator";
import SurveyManagement from "./Admin/SurveyManagement";
import Rewards from "./Admin/Rewards";
import Analytics from "./Admin/Analytics";

// Moderator Pages
import ModeratorDashboard from "./Moderator/ModeratorDashboard";
import ParticipantManagement from "./Moderator/ParticipantManagement";
import ModeratorRewards from "./Moderator/ModeratorRewards";
import ModeratorAnalytics from "./Moderator/ModeratorAnalytics";

// Participant Pages
import ParticipantDashboard from "./Participant/ParticipantDashboard";
import SurveyPage from "./Participant/ParticipantSurvey";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/register-moderator" element={<RegisterModerator />} />
        <Route path="/admin/surveys" element={<SurveyManagement />} />
        <Route path="/admin/rewards" element={<Rewards />} />
        <Route path="/admin/analytics" element={<Analytics />} />

        {/* Moderator */}
        <Route path="/moderator/dashboard" element={<ModeratorDashboard />} />
        <Route path="/moderator/participants" element={<ParticipantManagement />} />
        <Route path="/moderator/rewards" element={<ModeratorRewards />} />
        <Route path="/moderator/analytics" element={<ModeratorAnalytics />} />

        {/* Participant */}
        <Route path="/participant/dashboard" element={<ParticipantDashboard />} />
        <Route path="/participant/survey/:surveyId" element={<SurveyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
