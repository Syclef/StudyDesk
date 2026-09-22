import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { AuthProvider } from "../utils/AuthContext";
import RequireAuth from "./RequireAuth";

/* Auth — loaded eagerly, since this is needed immediately regardless of
   login state, unlike everything below it. */
import LoginPage from "../pages/Auth/LoginPage";
import LogoutPage from "../pages/Auth/LogoutPage";

/* Everything below is loaded lazily (React.lazy + Suspense) rather than
   imported eagerly at the top level. Previously every one of these was
   downloaded on ANY page load — including /login, before authenticating
   at all — because a plain `import X from "..."` at the top of this file
   gets bundled/fetched regardless of which route actually renders. That's
   not a real data leak (no user data is in these files, just component
   code), but it does expose the app's internal page/route structure to
   an unauthenticated visitor, and it's needless — code-splitting means
   a page's code only loads once you actually navigate to it. */
const CourseHome = lazy(() => import("../pages/Dashboard/Dashboard"));
const StudyPage = lazy(() => import("../pages/Study/StudyPage"));
const PracticeDashboard = lazy(() => import("../pages/Practice/PracticeCategories"));
const PracticeSessionPage = lazy(() => import("../pages/Practice/PracticeSessionPage"));
const ExamLandingPage = lazy(() => import("../pages/Exam/ExamLandingPage"));
const ExamSetupPage = lazy(() => import("../pages/Exam/ExamSetupPage"));
const ExamTakePage = lazy(() => import("../pages/Exam/ExamTakePage"));
const ExamResultsPage = lazy(() => import("../pages/Exam/ExamResultsPage"));
const ExamReviewPage = lazy(() => import("../pages/Exam/ExamReviewPage"));
const ExamHistoryPage = lazy(() => import("../pages/Exam/ExamHistoryPage"));
const ExamIntroPage = lazy(() => import("../pages/Exam/ExamIntroPage"));
const Flashcards = lazy(() => import("../pages/Flashcards"));
const Resources = lazy(() => import("../pages/Resources"));
const SimulatorPage = lazy(() => import("../pages/Simulator/SimulatorPage"));

function AppRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
        {/* Public — no session required */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />

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
    </Suspense>
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
