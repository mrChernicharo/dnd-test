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
  { id: "prof-05", name: "Amaranta de Castro" },
  { id: "prof-06", name: "Bob Fernandes" },
].sort((a, b) => a.name.localeCompare(b.name));

const initalCombinations = slots.reduce(
  (acc, slot) => ({ ...acc, [slot.id]: "" }),
  {},
);

// const rootWidth = 1800;

export function Shifts() {
  const [combinations, setCombinations] =
    useState<Record<string, string>>(initalCombinations);

  useEffect(() => {
    console.log(combinations);
  }, [combinations]);

  function onDragEnd(ev: any) {
    if (ev.canceled) return;

    const dragProfId = ev.operation.source?.id;
    const dropSlotId = ev.operation.target?.id;

    setCombinations((prev) => {
      const clone = { ...prev };

      if (dropSlotId) {
        const allocatedProf = clone[dropSlotId];

        if (allocatedProf) {
          if (allocatedProf === dragProfId) {
            console.log("Dropped back where it was before");
          } else {
            let originalSlot;
            for (const [s, p] of Object.entries(clone)) {
              if (p === dragProfId) {
                originalSlot = s;
                break;
              }
            }

            if (originalSlot) {
              console.log("Swap professionals");
              clone[originalSlot] = allocatedProf;
              clone[dropSlotId] = dragProfId;
            } else {
              console.log("replace item, put prev back in the list");
              clone[dropSlotId] = dragProfId;
            }
          }
        } else {
          console.log("Allocate to slot");

          for (const [s, p] of Object.entries(clone)) {
            if (s === dropSlotId) {
              clone[s] = dragProfId;
            } else {
              if (p === dragProfId) {
                clone[s] = "";
              }
            }
          }
        }
      } else {
        let isDeallocation = false;
        for (const [s, p] of Object.entries(clone)) {
          if (p === dragProfId) {
            isDeallocation = true;
            clone[s] = "";
            break;
          }
        }

        if (isDeallocation) {
          console.log(`De-Allocate item`);
        } else {
          console.log("no op");
        }
      }

      return clone;
    });
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
            {slots.map((slot) => {
              const profId = combinations[slot.id];
              return (
                <Slot slot={slot} key={slot.id}>
                  {profId ? (
                    <ProfessionalCard key={profId} professionalId={profId} />
                  ) : (
                    <Fragment key={slot.id} />
                  )}
                </Slot>
              );
            })}
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
