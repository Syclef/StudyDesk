import "../styles/course-home.css";

const CourseHome = () => {
  const daysUntilExam = 11;
  const studyProgress = 90;
  const avgPracticeScore = 68;

  return (
    <div className="space-y-8">
      {/* ===================== PAGE TITLE ===================== */}
      <h1 className="text-2xl font-semibold text-gray-800">
        Course Home
      </h1>

      {/* ===================== KPI CARDS ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Days Until Exam */}
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-500">Days Until Exam</p>
          <p className="text-3xl font-bold mt-2">{daysUntilExam}</p>
        </div>

        {/* Study Plan Progress */}
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-500">Study Plan Progress</p>
          <p className="text-3xl font-bold mt-2">{studyProgress}%</p>

          {/* Progress bar (NO inline styles) */}
          <div
            className="mt-4 w-full bg-gray-200 rounded-full h-2 progress-container"
            data-progress={studyProgress}
          >
            <div className="progress-bar bg-blue-600 h-2 rounded-full"></div>
          </div>
        </div>

        {/* Average Practice Score */}
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-500">Average Practice Score</p>
          <p className="text-3xl font-bold mt-2">
            {avgPracticeScore}%
          </p>
        </div>
      </div>

      {/* ===================== SECOND ROW ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Practice Readiness */}
        <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center justify-center">
          <p className="text-sm text-gray-500 mb-4">
            Practice Readiness
          </p>

          <div className="relative w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
            <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
              <span className="text-2xl font-bold">
                {avgPracticeScore}%
              </span>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-600 text-center">
            Based on recent practice sessions
          </p>
        </div>

        {/* Next Study Task */}
        <div className="bg-white p-6 rounded-xl shadow lg:col-span-2">
          <p className="text-sm text-gray-500">
            Next Study Task
          </p>

          <h2 className="text-lg font-semibold mt-2">
            Practice Exam 3
          </h2>

          <p className="text-gray-600 mt-1">
            300 questions • Estimated 60 minutes
          </p>

          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Start Study Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseHome;
