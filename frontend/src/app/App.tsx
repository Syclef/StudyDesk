import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";

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

/* Games */
import GamesLayout from "../pages/Games/GamesLayout";
import GameCenter from "../pages/Games/GameCenter";
import CardHunterPage from "../pages/Games/CardHunterPage";
import CardPickerPage from "../pages/Games/CardPickerPage";
import EliminationPage from "../pages/Games/EliminationPage";
import FlashcardBlitzPage from "../pages/Games/FlashcardBlitzPage";
import StreakChallengePage from "../pages/Games/StreakChallengePage";
import TimeAttackPage from "../pages/Games/TimeAttackPage";

/* The Unified Focus Engine */
import SimulatorPage from "../pages/Simulator/SimulatorPage";

function AppRoutes() {
  return (
    <Routes>
      {/* FOCUS MODE */}
      <Route path="/session/:mode/:id" element={<SimulatorPage />} />

      {/* BASE CAMP */}
      <Route element={<DashboardLayout />}>
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

        {/* GAME CENTER */}
        <Route path="/games" element={<GamesLayout />}>
          <Route index element={<GameCenter />} />
          <Route path="card-hunter" element={<CardHunterPage />} />
          <Route path="card-picker" element={<CardPickerPage />} />
          <Route path="elimination" element={<EliminationPage />} />
          <Route path="flashcard-blitz" element={<FlashcardBlitzPage />} />
          <Route path="streak-challenge" element={<StreakChallengePage />} />
          <Route path="time-attack" element={<TimeAttackPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
