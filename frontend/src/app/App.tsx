import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";

/* Main Pages */
import CourseHome from "../pages/Dashboard/Dashboard";
import StudyPage from "../pages/Study/StudyPage"; // Renamed from StudyPlan
import PracticeDashboard from "../pages/Practice/PracticeCategories";
import MockExamsPage from "../pages/MockExams/MockExamsPage"; // Renamed from Tests

/* Resources */
import Flashcards from "../pages/Flashcards";
import Resources from "../pages/Resources";

/* Games */
import GamesLayout from "../pages/Games/GamesLayout";
import GameCenter from "../pages/Games/GameCenter";
import CardHunterPage from "../pages/Games/CardHunterPage";
import EliminationPage from "../pages/Games/EliminationPage";
// ... (Import other game pages as needed)

/* The Unified Focus Engine */
import SimulatorPage from "../pages/Simulator/SimulatorPage";

function AppRoutes() {
  return (
    <Routes>
      {/* FOCUS MODE: The Unified Engine 
          - :mode can be 'study', 'practice', or 'exam'
          - :id can be a taskId, a categoryName, or an examId
      */}
      <Route path="/session/:mode/:id" element={<SimulatorPage />} />

      {/* BASE CAMP: All routes below have the Sidebar */}
      <Route element={<DashboardLayout />}>
        
        {/* MAIN SECTION */}
        <Route path="/" element={<CourseHome />} />
        <Route path="/study" element={<StudyPage />} />
        <Route path="/practice" element={<PracticeDashboard />} />
        <Route path="/exam" element={<MockExamsPage />} />

        {/* RESOURCES SECTION */}
        <Route path="/flashcards" element={<Flashcards />} />
        
        {/* GAME CENTER */}
        <Route path="/games" element={<GamesLayout />}>
          <Route index element={<GameCenter />} />
          <Route path="card-hunter" element={<CardHunterPage />} />
          <Route path="elimination" element={<EliminationPage />} />
          {/* ... other game child routes ... */}
        </Route>

        <Route path="/resources" element={<Resources />} />
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