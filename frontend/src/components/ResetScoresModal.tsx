type Props = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  label: string;
};

export default function ResetScoresModal({
  open,
  onConfirm,
  onCancel,
  label
}: Props) {
  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Reset Scores</h3>
        <p>{label}</p>

        <div className="modal-actions">
          <button className="danger" onClick={onConfirm}>
            Reset
          </button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
