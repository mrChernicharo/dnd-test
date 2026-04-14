/* eslint-disable @typescript-eslint/no-explicit-any */
import "./Shifts.css";
import { DragDropProvider, useDraggable, useDroppable } from "@dnd-kit/react";
import { Fragment, useEffect, useState, type ReactNode } from "react";

type Slot = { id: string; start: number; end: number };
type Professional = { id: string; name: string; profession: string };

const slots = [
  { id: "slot-01", start: 0, end: 60 * 8 },
  { id: "slot-02", start: 60 * 8, end: 60 * 16 },
  { id: "slot-03", start: 60 * 16, end: 60 * 24 },
];

const shifts: Record<string, Slot[]> = {
  doc: [
    { id: "doc-slot-01", start: 0, end: 60 * 8 },
    { id: "doc-slot-02", start: 60 * 8, end: 60 * 16 },
    { id: "doc-slot-03", start: 60 * 16, end: 60 * 24 },
  ],
  nurse: [
    { id: "nurse-slot-01", start: 0, end: 60 * 8 },
    { id: "nurse-slot-02", start: 60 * 12, end: 60 * 24 },
  ],
};

const professionals: Professional[] = [
  { id: "prof-01", name: "Tomaz Renato", profession: "doc" },
  { id: "prof-02", name: "Jandira Sales", profession: "doc" },
  { id: "prof-03", name: "Roberto Menescau", profession: "nurse" },
  { id: "prof-04", name: "Rejane França", profession: "nurse" },
  { id: "prof-05", name: "Amaranta de Castro", profession: "nurse" },
  { id: "prof-06", name: "Bob Fernandes", profession: "nurse" },
].sort((a, b) => a.name.localeCompare(b.name));

// const initalCombinations = slots.reduce(
//   (acc, slot) => ({ ...acc, [slot.id]: "" }),
//   {},
// );

const initalCombinations = Object.entries(shifts).reduce(
  (acc, [roleBand, slots]) => {
    const slotCombinations = slots.reduce(
      (slotAcc, slot) => ({ ...slotAcc, [slot.id]: "" }),
      {},
    );

    return { ...acc, [roleBand]: slotCombinations };
  },
  {},
);

export function Shifts() {
  const [combinations, setCombinations] =
    useState<Record<string, Record<string, string>>>(initalCombinations);

  console.log("combinations", combinations);

  function onDragEnd(ev: any) {
    if (ev.canceled) return;

    const dragProfId = ev.operation.source?.id;
    const dropSlotId = ev.operation.target?.id;

    setCombinations((prev) => {
      const clone = { ...prev };

      if (dropSlotId) {
        console.log(`prof ${dragProfId} dropped at ${dropSlotId}`);

        const bandName = dropSlotId.split("-")[0];
        const allocatedProf = clone[bandName][dropSlotId];
        // console.log("allocatedProf", allocatedProf);
        if (allocatedProf) {
          if (allocatedProf === dragProfId) {
            console.log("Dropped back where it was before");
          } else {
            let originalSlot;
            let originalBand;
            for (const [b, sd] of Object.entries(clone)) {
              for (const [s, p] of Object.entries(clone[b])) {
                if (p === dragProfId) {
                  originalBand = b;
                  originalSlot = s;
                  break;
                }
              }
            }
            if (originalSlot && originalBand) {
              console.log("Swap professionals");
              clone[originalBand][originalSlot] = allocatedProf;
              clone[bandName][dropSlotId] = dragProfId;
            } else {
              console.log("replace item, put prev back in the list");
              clone[bandName][dropSlotId] = dragProfId;
            }
          }
        } else {
          console.log("Allocate to slot");
          for (const [b, sd] of Object.entries(clone)) {
            for (const [s, p] of Object.entries(clone[b])) {
              if (s === dropSlotId) {
                clone[b][s] = dragProfId;
              } else {
                if (p === dragProfId) {
                  clone[b][s] = "";
                }
              }
            }
          }
        }
      } else {
        let isDeallocation = false;
        for (const [b, sd] of Object.entries(clone)) {
          for (const [s, p] of Object.entries(clone[b])) {
            console.log({ s, b, sd, p });
            if (p === dragProfId) {
              isDeallocation = true;
              clone[b][s] = "";
              break;
            }
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
            {professionals.map((prof) => {
              const isAllocated = Object.values(combinations).reduce(
                (acc, slots) => {
                  let isAlloc = false;
                  Object.values(slots).forEach((profId) => {
                    if (profId) isAlloc = true;
                  });
                  acc = isAlloc;
                  return acc;
                },
                false,
              );
              return isAllocated ? null : ( // <Fragment key={`fr-${prof.id}`} />
                <ProfessionalCard key={prof.id} professionalId={prof.id} />
              );
            })}
          </div>

          <div className="bands-container">
            {Object.entries(combinations).map(([bandId, slotMap]) => {
              console.log(slotMap, bandId);

              return (
                <div className="band-container" key={bandId}>
                  <div>{bandId}</div>
                  <div className="slots-container">
                    {Object.entries(slotMap).map(([slotId, profId]) => {
                      const slot = shifts[bandId].find((s) => s.id === slotId)!;
                      //   console.log({ slotId, profId, slot });
                      return (
                        <Slot slot={slot} key={slot.id}>
                          {profId ? (
                            <ProfessionalCard
                              key={profId}
                              professionalId={profId}
                            />
                          ) : // <Fragment key={`fr-${slot.id}`} />
                          null}
                        </Slot>
                      );
                    })}
                  </div>
                </div>
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

export function Slot({ slot, children }: { slot: Slot; children: ReactNode }) {
  const { ref } = useDroppable({ id: slot.id });

  return (
    <div ref={ref} className="slot-container">
      <div>{slot.id}</div>
      {children}
    </div>
  );
}
