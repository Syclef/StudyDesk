import { type Flashcard } from "../api/flashcards";

/**
 * FlashcardList
 * -------------
 * Table view of all flashcards
 * Mirrors ISACA Perform list mode
 */
interface Props {
  flashcards: Flashcard[];
}

export default function FlashcardList({ flashcards }: Props) {
  return (
    <div className="overflow-auto">
      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">#</th>
            <th className="border px-2 py-1 text-left">Term</th>
            <th className="border px-2 py-1 text-left">Definition</th>
          </tr>
        </thead>
        <tbody>
          {flashcards.map((c) => (
            <tr key={c.id}>
              <td className="border px-2 py-1">{c.id}</td>
              <td className="border px-2 py-1 font-medium">{c.term}</td>
              <td className="border px-2 py-1">{c.definition}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
