import { useEffect, useState } from "react";
import { ResponsiveGridLayout, useContainerWidth } from "react-grid-layout";
import type { Layout, LayoutItem } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./Floors.css";

export function FloorPlan() {
  const [hospital, sethospital] = useState({
    name: "Hospital Geral",
    sectors: [
      {
        id: "s1",
        rooms: [
          { id: "r101", beds: 2 },
          { id: "r102", beds: 4 },
          { id: "r103", beds: 6 },
          { id: "r104", beds: 3 },
          { id: "r105", beds: 1 },
          { id: "r106", beds: 10 },
        ],
      },
      {
        id: "s2",
        rooms: [
          { id: "r201", beds: 6 },
          { id: "r202", beds: 15 },
          { id: "r203", beds: 80 },
        ],
      },
    ],
  });

  useEffect(() => {
    console.log("::::: hospital", hospital);
  }, [hospital]);

  return (
    <div>
      <h1>{hospital.name}</h1>

      {hospital.sectors.map((sector) => (
        <div key={sector.id}>
          <h2>{sector.id}</h2>

          <div>
            {sector.rooms.map((room) => {
              const [rows, cols] = getBedsGrid(room.beds);

              return (
                <div key={room.id}>
                  <h3>Room {room.id}</h3>
                  <button
                    onClick={() => {
                      sethospital((prev) => {
                        return {
                          ...prev,
                          sectors: prev.sectors.map((sec) =>
                            sec.id !== sector.id
                              ? sec
                              : {
                                  ...sector,
                                  rooms: sector.rooms.map((r) =>
                                    r.id !== room.id
                                      ? r
                                      : { ...r, beds: r.beds + 1 },
                                  ),
                                },
                          ),
                        };
                      });
                    }}
                  >
                    +
                  </button>

                  <div
                    style={{
                      border: "1px dashed",
                      display: "grid",
                      gap: 8,
                      padding: 16,
                      gridTemplateRows: `repeat(${rows}, 1fr)`,
                      gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    }}
                  >
                    {Array(room.beds)
                      .fill(0)
                      .map((_, i) => (
                        <div
                          style={{
                            height: 48,
                            border: "1px solid",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          key={`${room.id}-${i + 1}`}
                        >
                          <div>bed {i + 1}</div>
                        </div>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// [rows, cols]
function getBedsGrid(beds: number): [number, number] {
  const sqrt = Math.sqrt(beds);
  const sqrtFloor = Math.trunc(sqrt);

  if (sqrtFloor === sqrt) return [sqrt, sqrt];

  const sqrtCeil = sqrtFloor + 1;
  const diff = sqrt - sqrtFloor;

  if (diff > 0.5) return [sqrtCeil, sqrtCeil];
  return [sqrtFloor, sqrtCeil];
}
