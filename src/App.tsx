import { useDraggable } from "@dnd-kit/react";
import "./App.css";

interface Card {
  id: string;
  title: string;
}

const cards: Card[] = [
  { id: "1", title: "Card 1" },
  { id: "2", title: "Card 2" },
  { id: "3", title: "Card 3" },
  { id: "4", title: "Card 4" },
];

export function App() {
  return (
    <>
      <ul className="cards-container">
        {cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </ul>
    </>
  );
}

export function Card({ card }: { card: Card }) {
  const { ref } = useDraggable({
    id: card.id,
  });

  return (
    <li ref={ref} className="card">
      {card.title}
    </li>
  );
}
