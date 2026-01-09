import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";

/* Core Pages */
import CourseHome from "../pages/CourseHome";
import StudyPlan from "../pages/StudyPlan/StudyPlanPage";
import StudySessionPage from "../pages/StudyPlan/StudySessionPage";
import Tests from "../pages/Tests/TestsPage";
import Flashcards from "../pages/Flashcards";
import Resources from "../pages/Resources";
import Review from "../pages/Review";

/* Practice */
import PracticeDashboard from "../pages/Practice/PracticeDashboard";
import PracticeCategories from "../pages/Practice/PracticeCategories";
import { PracticeQuestionView } from "../components/practice/PracticeQuestionView";

/* Games */
import GamesLayout from "../pages/Games/GamesLayout";
import GameCenter from "../pages/Games/GameCenter";
import CardHunterPage from "../pages/Games/CardHunterPage";
import CardPickerPage from "../pages/Games/CardPickerPage";
import FlashcardBlitzPage from "../pages/Games/FlashcardBlitzPage";
import TimeAttackPage from "../pages/Games/TimeAttackPage";

/* -----------------------------
   App Routes
   ----------------------------- */

function AppRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>

        {/* CORE */}
        <Route path="/" element={<CourseHome />} />

        {/* STUDY PLAN */}
        <Route path="/study-plan" element={<StudyPlan />} />
        <Route
          path="/study/session/:task"
          element={<StudySessionPage />}
        />
        <Route
          path="/study-plan/study/session/:task"
          element={<StudySessionPage />}
        />

        {/* PRACTICE */}
        <Route path="/practice" element={<PracticeDashboard />} />
        <Route
          path="/practice/categories"
          element={<PracticeCategories />}
        />
        <Route
          path="/practice/session/:category"
          element={<PracticeQuestionView />}
        />

        {/* OTHER MODULES */}
        <Route path="/tests" element={<Tests />} />
        <Route path="/flashcards" element={<Flashcards />} />

        {/* =========================
           GAMES
           ========================= */}
        <Route path="/game-center" element={<GamesLayout />}>
          <Route index element={<GameCenter />} />

          <Route
            path="card-hunter"
            element={<CardHunterPage />}
          />

          <Route
            path="card-picker"
            element={<CardPickerPage />}
          />

          <Route
            path="flashcard-blitz"
            element={<FlashcardBlitzPage />}
          />

          <Route
            path="time-attack"
            element={<TimeAttackPage />}
          />
        </Route>

        {/* OTHER */}
        <Route path="/resources" element={<Resources />} />
        <Route path="/review" element={<Review />} />

      </Route>
    </Routes>
  );
}

/* -----------------------------
   App Root
   ----------------------------- */

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
