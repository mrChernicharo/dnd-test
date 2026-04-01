import { useDraggable, useDroppable } from "@dnd-kit/react";
import "./DndKit.css";

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

const dropZones = [
  { id: "d1", title: "DropZone 1" },
  { id: "d2", title: "DropZone 2" },
  { id: "d3", title: "DropZone 3" },
];

export function DnDKit01() {
  return (
    <>
      <ul className="cards-container">
        {cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </ul>

      <ul className="cards-container">
        {dropZones.map((dropzone) => (
          <DropZone key={dropzone.id} dropZone={dropzone} />
        ))}
      </ul>
    </>
  );
}

export function Card({ card }: { card: Card }) {
  const { ref, handleRef } = useDraggable({
    id: card.id,
  });

  return (
    <li ref={ref} className="card">
      <div>{card.title}</div>
      <button className="drag-handle" ref={handleRef}>
        drag here
      </button>
    </li>
  );
}

export function DropZone({
  dropZone,
}: {
  dropZone: { id: string; title: string };
}) {
  const { ref } = useDroppable({
    id: dropZone.id,
  });

  return (
    <li ref={ref} className="drop-zone">
      <div>{dropZone.title}</div>
    </li>
  );
}
