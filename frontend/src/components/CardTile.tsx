type CardTileProps = {
  text: string;
  state: "default" | "correct" | "wrong";
  disabled: boolean;
  onClick: () => void;
};

export function CardTile({ text, state, disabled, onClick }: CardTileProps) {
  return (
    <button
      className={`card-tile ${state}`}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
