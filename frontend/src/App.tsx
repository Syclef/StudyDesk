import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";

/* Core Pages */
import CourseHome from "./pages/CourseHome";
import StudyPlan from "./pages/StudyPlan";
import Tests from "./pages/Tests";
import Flashcards from "./pages/Flashcards";
import GameCenter from "./pages/GameCenter";
import Resources from "./pages/Resources";
import Review from "./pages/Review";

/* Practice */
import PracticeDashboard from "./components/PracticeDashboard";
import PracticeCategories from "./pages/PracticeCategories";
import { PracticeQuestionView } from "./components/practice/PracticeQuestionView";

function AppRoutes() {
  return (
    <Routes>
      {/* All routes use dashboard layout */}
      <Route element={<DashboardLayout />}>
        {/* Core */}
        <Route path="/" element={<CourseHome />} />
        <Route path="/study-plan" element={<StudyPlan />} />

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
        <Route path="/game-center" element={<GameCenter />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/review" element={<Review />} />
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
