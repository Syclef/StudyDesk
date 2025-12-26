import { useNavigate } from "react-router-dom";

export default function CardPickerPage() {
  const navigate = useNavigate();

  return (
    <div className="card-picker-shell">
      <div className="card-picker-intro">
        <h2>Card Picker</h2>
        <p>
          <strong>Instructions:</strong> The object of the game is to correctly
          match Side 1 of the flashcard with Side 2. Each turn, a different term
          from Side 1 of the flashcard will show and 6 possible matches will be
          listed below. It is your job to choose the correct Side 2 from the 6
          possible matches. Points are earned for successful pairings based on
          how fast you select the correct card. Good luck!
        </p>

        <button
          className="btn primary"
          onClick={() => navigate("/game-center/card-picker/play")}
        >
          Start
        </button>
      </div>
    </div>
  );
}
