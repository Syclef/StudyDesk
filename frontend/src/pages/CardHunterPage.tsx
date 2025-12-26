import { useNavigate } from "react-router-dom";
import "../styles/card-hunter.css";

export default function CardHunterPage() {
  const navigate = useNavigate();

  return (
    <div className="card-hunter-shell">
      <div className="card-hunter-intro">
        <h2>Card Hunter I</h2>

        <p className="card-hunter-instructions">
          <strong>Instructions:</strong> The object of the game is to match one pair of related terms each round.
          The first round starts with 4 cards showing.
          Two of the cards will be from the same flashcard (side 1 and side 2), the other two cards will be random.
          It is your job to choose the 2 cards from the same flashcard.
          If you choose the two correct cards, you will move on to the next round.
          If you fail to match the cards, you will lose a life and restart the round.
          Two additional cards will be added each round you complete successfully.
          Try to pass as many rounds as you can and get the highest score.
          Points are earned for successful pairings based on how fast you select the correct cards and the round you are on.
          Good luck! 
        </p>

        <div className="card-hunter-actions">
          <button
            className="btn primary"
            onClick={() => navigate("/game-center/card-hunter/play")}
          >
            Start playing
          </button>
        </div>
      </div>
    </div>
  );
}
