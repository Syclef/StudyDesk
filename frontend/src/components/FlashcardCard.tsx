interface Props {
  text: string;
  onFlip: () => void;
}

export default function FlashcardCard({ text, onFlip }: Props) {
  return (
    <div
      onClick={onFlip}
      className="
        w-[420px] h-[240px]
        bg-white
        border
        shadow
        flex items-center justify-center
        text-center
        cursor-pointer
        text-lg
        px-6
      "
    >
      {text}
    </div>
  );
}
