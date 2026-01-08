import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";

/* Core Pages */
import CourseHome from "../pages/CourseHome";
import StudyPlan from "../pages/StudyPlan/StudyPlanPage";
import StudySessionPage from "../pages/StudyPlan/StudySessionPage";
import Tests from "../pages/Tests/TestsPage";
import Flashcards from "../pages/Flashcards";
import GameCenter from "../pages/GameCenter";
import Resources from "../pages/Resources";
import Review from "../pages/Review";

/* Practice */
import PracticeDashboard from "../pages/Practice/PracticeDashboard";
import PracticeCategories from "../pages/Practice/PracticeCategories";
import { PracticeQuestionView } from "../components/practice/PracticeQuestionView";

/* Games */
import CardPickerGame from "../components/games/CardPickerGame";
import CardHunterGame from "../components/games/CardHunterGame";

/* -----------------------------
   Game Route Wrappers
   ----------------------------- */

/**
 * CardPicker REQUIRES onExit → wrap it
 */
function CardPickerRoute() {
  const navigate = useNavigate();

  return (
    <CardPickerGame onExit={() => navigate("/game-center")} />
  );
}

/* -----------------------------
   App Routes
   ----------------------------- */

function AppRoutes() {
  return (
    <Routes>
      {/* All routes use dashboard layout */}
      <Route element={<DashboardLayout />}>
        {/* Core */}
        <Route path="/" element={<CourseHome />} />

        {/* STUDY PLAN */}
        <Route path="/study-plan" element={<StudyPlan />} />

        {/* Study Session (support BOTH paths) */}
        <Route
          path="/study/session/:task"
          element={<StudySessionPage />}
        />
        <Route
          path="/study-plan/study/session/:task"
          element={<StudySessionPage />}
        />

        {/* PRACTICE (ISACA FLOW) */}
        <Route path="/practice" element={<PracticeDashboard />} />
        <Route path="/practice/categories" element={<PracticeCategories />} />
        <Route
          path="/practice/session/:category"
          element={<PracticeQuestionView />}
        />

        {/* OTHER MODULES */}
        <Route path="/tests" element={<Tests />} />
        <Route path="/flashcards" element={<Flashcards />} />

        {/* GAME CENTER */}
        <Route path="/game-center" element={<GameCenter />} />
        <Route
          path="/game-center/card-picker"
          element={<CardPickerRoute />}
        />
        <Route
          path="/game-center/card-hunter"
          element={<CardHunterGame />}
        />

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
