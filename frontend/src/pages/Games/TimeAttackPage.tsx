import { TimeAttackGame } from "../../components/games/TimeAttackGame";

export default function TimeAttackPage() {
  return <TimeAttackGame onExit={() => window.history.back()} />;
}
