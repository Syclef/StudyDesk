import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ReadinessGauge from "../../components/gauges/ReadinessGauge";
import { STUDY_TASKS } from "../../data/studyTasks";
import { getAllSessions } from "../../data/studySessions";
import { calculateStudyMetrics } from "../../utils/studyLogic";
import "../styles/course-home.css";

const CourseHome: React.FC = () => {
  const navigate = useNavigate();

  // Connect to real data while keeping your preferred logic structure
  const metrics = useMemo(() => {
    const sessions = getAllSessions();
    // Pass your target exam date here
    return calculateStudyMetrics(sessions, "2025-12-15");
  }, []);

  // Find the next task to do for the "Resume" button
  const nextTask = useMemo(() => {
    const sessions = getAllSessions();
    const completedTaskIds = new Set(sessions.map(s => s.taskId));
    return STUDY_TASKS.find(task => !completedTaskIds.has(task.id)) || STUDY_TASKS[0];
  }, []);

  // Determine phases based on real progress %
  const phases = [
    { id: 1, name: "Foundation", status: metrics.progressPercent > 15 ? "completed" : "current", color: "bg-green-500" },
    { id: 2, name: "Domain Deep-Dive", status: metrics.progressPercent <= 15 ? "locked" : metrics.progressPercent > 80 ? "completed" : "current", color: "bg-blue-600" },
    { id: 3, name: "Targeted Review", status: metrics.progressPercent <= 80 ? "locked" : metrics.progressPercent > 95 ? "completed" : "current", color: "bg-orange-400" },
    { id: 4, name: "Exam Simulation", status: metrics.progressPercent <= 95 ? "locked" : "current", color: "bg-purple-600" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Study Dashboard</h1>
          <p className="text-gray-500 mt-1">Adaptive CISA Preparation Path</p>
        </div>
        <div className="text-left md:text-right bg-red-50 p-4 rounded-xl border border-red-100">
          <p className="text-xs font-bold text-red-400 uppercase tracking-widest">Exam Countdown</p>
          <p className="text-4xl font-black text-red-600">{metrics.daysLeft} Days</p>
        </div>
      </header>

      {/* Main KPI Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Study Progression Timeline */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-8 text-gray-700">Phase Progression</h3>
          <div className="relative flex justify-between px-2">
            {/* Background Connector Line */}
            <div className="absolute top-5 left-0 w-full h-1 bg-gray-100 -z-0"></div>
            
            {phases.map((phase) => (
              <div key={phase.id} className="relative z-10 flex flex-col items-center w-1/4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all ${phase.status === 'locked' ? 'bg-gray-200' : phase.color} ${phase.status === 'current' ? 'ring-4 ring-blue-100 scale-110' : ''}`}>
                  {phase.status === 'completed' ? '✓' : phase.id}
                </div>
                <p className={`mt-4 text-[10px] md:text-xs font-bold text-center uppercase tracking-tight ${phase.status === 'current' ? 'text-blue-600' : 'text-gray-400'}`}>
                  {phase.name}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 p-6 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl text-white shadow-md">
             <div className="flex justify-between items-start">
               <div>
                 <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Current Goal</p>
                 <h2 className="text-xl font-bold mt-1">{nextTask.title}</h2>
                 <p className="text-blue-100 text-sm mt-1">{metrics.progressPercent}% of curriculum complete</p>
               </div>
               <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                 Active Learning
               </div>
             </div>
             <button 
              onClick={() => navigate(`/study-session/${nextTask.id}`)}
              className="mt-6 w-full py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
             >
               Resume Study Session
             </button>
          </div>
        </div>

        {/* Readiness Score Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <ReadinessGauge score={metrics.readyScore} label="ReadySCORE™" />
          <div className="mt-4 space-y-1">
            <p className="text-sm font-semibold text-gray-800">Exam Readiness</p>
            <p className="text-xs text-gray-500 leading-relaxed px-4">
              Your score is calculated based on accuracy ({metrics.accuracy}%) across {metrics.totalAttempted} questions.
            </p>
          </div>
        </div>
      </div>

      {/* Secondary Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Daily Target</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-3xl font-black text-gray-800">{metrics.dailyTarget}</p>
            <p className="text-sm text-gray-500 font-medium">Questions / Day</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Avg. Accuracy</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-3xl font-black text-gray-800">{metrics.accuracy}%</p>
            <div className={`flex items-center text-xs font-bold ${Number(metrics.accuracy) > 70 ? 'text-green-500' : 'text-orange-500'}`}>
              <span>{Number(metrics.accuracy) > 70 ? 'Target Reached' : 'Keep Improving'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Streak</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-3xl font-black text-orange-500">🔥 5</p>
            <p className="text-sm text-gray-500 font-medium">Days in a row</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseHome;