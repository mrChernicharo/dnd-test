/* eslint-disable @typescript-eslint/no-explicit-any */
import "./Shifts.css";
import { DragDropProvider, useDraggable, useDroppable } from "@dnd-kit/react";
import { Fragment, useEffect, useState, type ReactNode } from "react";

const slots = [
  { id: "slot-01", start: 0, end: 60 * 8 },
  { id: "slot-02", start: 60 * 8, end: 60 * 16 },
  { id: "slot-03", start: 60 * 16, end: 60 * 24 },
];

const professionals = [
  { id: "prof-01", name: "Tomaz Renato" },
  { id: "prof-02", name: "Jandira Sales" },
  { id: "prof-03", name: "Roberto Menescau" },
  { id: "prof-04", name: "Rejane França" },
  { id: "prof-05", name: "Amaranta Freitas" },
];

// const rootWidth = 1800;

export function Shifts() {
  const [combinations, setCombinations] = useState<Record<string, string>>(
    slots.reduce((acc, slot) => ({ ...acc, [slot.id]: "" }), {}),
  );

  useEffect(() => {
    console.log(
      combinations,
      Object.keys(combinations),
      Object.values(combinations),
    );
  }, [combinations]);

  function onDragEnd(ev: any) {
    if (ev.canceled) return;

    console.log(ev.operation);

    const profId = ev.operation.source?.id;
    const slotId = ev.operation.target?.id;

    if (slotId && profId) {
      console.log(`IT'S A MATCH! Dropped ${profId} onto ${slotId}`);

      setCombinations((prev) => {
        const clone = { ...prev };

        if (clone[slotId]) {
          console.log("There is already someone there!", clone[slotId]);
        }

        for (const [s, p] of Object.entries(clone)) {
          if (s === slotId) {
            clone[s] = profId;
          } else {
            if (p === profId) {
              clone[s] = "";
            }
          }
        }
        return clone;
      });
    } else if (profId) {
      console.log(`Dropped ${profId} outside`);

      setCombinations((prev) => {
        const clone = { ...prev };

        for (const [s, p] of Object.entries(clone)) {
          if (p === profId) {
            clone[s] = "";
          }
        }

        return clone;
      });
    }
  }

  return (
    <div>
      <h1>Shifts</h1>

      <DragDropProvider onDragEnd={onDragEnd}>
        <div className="root-container">
          <div className="professionals-container">
            {professionals.map((prof) =>
              Object.values(combinations).includes(prof.id) ? (
                <Fragment key={prof.id} />
              ) : (
                <ProfessionalCard key={prof.id} professionalId={prof.id} />
              ),
            )}
          </div>

          <div className="slots-container">
            {slots.map((slot) => (
              <Slot slot={slot} key={slot.id}>
                {combinations[slot.id] ? (
                  <ProfessionalCard
                    key={combinations[slot.id]}
                    professionalId={combinations[slot.id]}
                  />
                ) : (
                  <Fragment key={slot.id} />
                )}
              </Slot>
            ))}
          </div>
        </div>
      </DragDropProvider>
    </div>
  );
}

export function ProfessionalCard({
  professionalId,
}: {
  professionalId: string;
}) {
  const { ref } = useDraggable({
    id: professionalId,
  });

  const professional = professionals.find((p) => p.id === professionalId)!;

  return (
    <div ref={ref} className="professional-card">
      {professional.name}
    </div>
  );
}

export function Slot({
  slot,
  children,
}: {
  slot: { id: string; start: number; end: number };
  children: ReactNode;
}) {
  const { ref } = useDroppable({ id: slot.id });

  return (
    <div ref={ref} className="slot-container">
      <div>{slot.id}</div>
      {children}
    </div>
  );
}
