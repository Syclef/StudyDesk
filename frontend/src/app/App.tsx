import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import { AuthProvider } from "../utils/AuthContext";
import RequireAuth from "./RequireAuth";

/* Auth */
import LoginPage from "../pages/Auth/LoginPage";

/* Main Pages */
import CourseHome from "../pages/Dashboard/Dashboard";

/* Study / Practice Engines */
import StudyPage from "../pages/Study/StudyPage";
import PracticeDashboard from "../pages/Practice/PracticeCategories";
import PracticeSessionPage from "../pages/Practice/PracticeSessionPage";

/* Exam */
import ExamLandingPage from "../pages/Exam/ExamLandingPage";
import ExamSetupPage from "../pages/Exam/ExamSetupPage";
import ExamTakePage from "../pages/Exam/ExamTakePage";
import ExamResultsPage from "../pages/Exam/ExamResultsPage";
import ExamReviewPage from "../pages/Exam/ExamReviewPage";
import ExamHistoryPage from "../pages/Exam/ExamHistoryPage";
import ExamIntroPage from "../pages/Exam/ExamIntroPage";

/* Resources */
import Flashcards from "../pages/Flashcards";
import Resources from "../pages/Resources";


/* The Unified Focus Engine */
import SimulatorPage from "../pages/Simulator/SimulatorPage";

function AppRoutes() {
  return (
    <Routes>
      {/* Public — no session required */}
      <Route path="/login" element={<LoginPage />} />

      {/* Everything below requires a logged-in session */}
      <Route path="/session/:mode/:id" element={<RequireAuth><SimulatorPage /></RequireAuth>} />

      <Route element={<RequireAuth><DashboardLayout /></RequireAuth>}>
        {/* MAIN SECTION */}
        <Route path="/" element={<CourseHome />} />

        {/* MODULES */}
        <Route path="/study" element={<StudyPage />} />
        <Route path="/practice" element={<PracticeDashboard />} />
        <Route path="/practice/session/:category" element={<PracticeSessionPage />} />

        {/* EXAM MODULE */}
        <Route path="/exam" element={<ExamLandingPage />} />
        <Route path="/exam/setup" element={<ExamSetupPage />} />
        <Route path="/exam/take" element={<ExamTakePage />} />
        <Route path="/exam/results" element={<ExamResultsPage />} />
        <Route path="/exam/review" element={<ExamReviewPage />} />
        <Route path="/exam/history" element={<ExamHistoryPage />} />
        <Route path="/exam/intro" element={<ExamIntroPage />} />

        {/* RESOURCES */}
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/resources" element={<Resources />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
