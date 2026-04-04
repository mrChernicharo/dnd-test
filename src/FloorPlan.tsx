import { useEffect, useState } from "react";
import { ResponsiveGridLayout, useContainerWidth } from "react-grid-layout";
import type { Layout, LayoutItem } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./Floors.css";

type Sector = { id: string; rooms: Room[] };
type Room = { id: string; beds: number };

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
          { id: "r202", beds: 80 },
          { id: "r203", beds: 15 },
          { id: "r204", beds: 1254 },
        ],
      },
    ],
  });

  function addRoom(sector: Sector, room: Room) {
    sethospital((prev) => {
      return {
        ...prev,
        sectors: prev.sectors.map((sec) =>
          sec.id !== sector.id
            ? sec
            : {
                ...sector,
                rooms: sector.rooms.map((r) =>
                  r.id !== room.id ? r : { ...r, beds: r.beds + 1 },
                ),
              },
        ),
      };
    });
  }

  useEffect(() => {
    console.log("::::: hospital", hospital);
  }, [hospital]);

  return (
    <div>
      <h1>{hospital.name}</h1>

      {hospital.sectors.map((sector) => (
        <div key={sector.id}>
          <h2 style={{ background: "red" }}>{sector.id}</h2>

          <div>
            {sector.rooms.map((room) => {
              const [rows, cols] = getBedsGrid(room.beds);

              return (
                <div key={room.id}>
                  <h3>Room {room.id}</h3>
                  <button onClick={() => addRoom(sector, room)}>+</button>

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
                          <span>{i + 1}</span>
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
function getBedsGrid(beds: number, maxCols = 24): [number, number] {
  const sqrt = Math.sqrt(beds);
  const sqrtFloor = Math.floor(sqrt);
  const sqrtCeil = Math.ceil(sqrt);

  if (maxCols > 0 && sqrtCeil > maxCols) {
    return [Math.ceil(beds / maxCols), maxCols];
  }

  if (sqrtFloor === sqrtCeil) return [sqrt, sqrt];

  const diff = sqrt - sqrtFloor;

  if (diff > 0.5) return [sqrtCeil, sqrtCeil];
  return [sqrtFloor, sqrtCeil];
}
