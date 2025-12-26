import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";

import CourseHome from "./pages/CourseHome";
import StudyPlan from "./pages/StudyPlan";
import Practice from "./pages/Practice";
import Tests from "./pages/Tests";
import Flashcards from "./pages/Flashcards";
import GameCenter from "./pages/GameCenter";
import Resources from "./pages/Resources";
import Exam from "./pages/Exam";
import Review from "./pages/Review";

import CardPickerPage from "./pages/CardPickerPage";
import { CardPickerGame } from "./components/CardPickerGame";

import CardHunterPage from "./pages/CardHunterPage";
import CardHunterGame from "./components/CardHunterGame";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<CourseHome />} />
        <Route path="/study-plan" element={<StudyPlan />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/tests" element={<Tests />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/game-center" element={<GameCenter />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/exam" element={<Exam />} />
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
