import React from "react";
import { PracticeDashboard } from "../components/practice/PracticeDashboard";
import { CategoryPracticeTable } from "../components/practice/CategoryPracticeTable";

const Practice: React.FC = () => {
  return (
    <main>
      <PracticeDashboard />
      <CategoryPracticeTable />
    </main>
  );
};

export default Practice;
