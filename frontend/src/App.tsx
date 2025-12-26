import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";

import CourseHome from "./pages/CourseHome";
import StudyPlan from "./pages/StudyPlan";
import Practice from "./pages/Practice";
import Tests from "./pages/Tests";
import Flashcards from "./pages/Flashcards";
import GameCenter from "./pages/GameCenter";
import Resources from "./pages/Resources";
import Review from "./pages/Review";

import CardPickerPage from "./pages/CardPickerPage";
import { CardPickerGame } from "./components/CardPickerGame";

import CardHunterPage from "./pages/CardHunterPage";
import CardHunterGame from "./components/CardHunterGame";

import { PracticeQuestionView } from "./components/practice/PracticeQuestionView";

import { ExamDashboard } from "./components/exam/ExamDashboard";
import { ExamQuestionView } from "./components/exam/ExamQuestionView";

/* ---------- Practice Session Page ---------- */
const PracticeSessionPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();

  if (!sessionId) return null;

  return <PracticeQuestionView sessionId={sessionId} />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<CourseHome />} />
        <Route path="/study-plan" element={<StudyPlan />} />
        <Route path="/practice" element={<Practice />} />

        {/* ✅ Practice Session */}
        <Route
          path="/practice/session/:sessionId"
          element={<PracticeSessionPage />}
        />

        <Route path="/tests" element={<Tests />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/game-center" element={<GameCenter />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/review" element={<Review />} />

        {/* Card Picker */}
        <Route path="/game-center/card-picker" element={<CardPickerPage />} />
        <Route
          path="/game-center/card-picker/play"
          element={<CardPickerGame onExit={() => window.history.back()} />}
        />

        {/* Card Hunter */}
        <Route path="/game-center/card-hunter" element={<CardHunterPage />} />
        <Route
          path="/game-center/card-hunter/play"
          element={<CardHunterGame />}
        />

        <Route path="/exam/start" element={<ExamDashboard />} />
        <Route path="/exam/session/:examSessionId" element={<ExamQuestionView />} />

      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
