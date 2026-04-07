import {
  useMemo,
  // useEffect,
  useState,
} from "react";
import {
  ReactGridLayout,
  // ResponsiveGridLayout,
  useContainerWidth,
  type LayoutItem,
} from "react-grid-layout";
// import type { Layout, LayoutItem } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./Floors.css";

type Sector = { id: string; rooms: Room[] };
type Room = { id: string; beds: number };

interface SectorProps {
  sector: Sector;
  addBed: (sector: Sector, room: Room) => void;
}

const initialHospital = {
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
        // { id: "r106", beds: 10 },
      ],
    },
    {
      id: "s2",
      rooms: [
        { id: "r201", beds: 6 },
        { id: "r202", beds: 8 },
        { id: "r203", beds: 15 },
        // { id: "r204", beds: 1254 },
      ],
    },
  ],
};

export function FloorPlan() {
  const { width, containerRef, mounted } = useContainerWidth();

  const [hospital, sethospital] = useState(initialHospital);

  function addBed(sector: Sector, room: Room) {
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

  const sectorsLayout = useMemo(() => {
    return hospital.sectors.map((sector, i) => {
      const layoutItem: LayoutItem = {
        i: sector.id,
        h: sector.rooms.reduce((acc, room) => {
          const headingRows = 3;
          const roomRows = getBedsGrid(room.beds)[0];
          acc += roomRows + headingRows;
          return acc;
        }, 0),
        w: 12,
        x: 0,
        y: sector.rooms.length * i,
        isBounded: true,
      };

      return layoutItem;
    });
  }, [hospital.sectors]);

  console.log(sectorsLayout, width);

  return (
    <div style={{ margin: 16 }}>
      <h1>{hospital.name}</h1>

      <div ref={containerRef}>
        {mounted && (
          <ReactGridLayout
            layout={sectorsLayout}
            width={width}
            gridConfig={{ cols: 12, rowHeight: 24 }}
            dragConfig={{ handle: ".sector-drag-handle" }}
            onLayoutChange={(ev) => console.log(ev)}
          >
            {sectorsLayout?.map((item, i) => (
              <div key={item.i}>
                <Sector sector={hospital.sectors[i]} addBed={addBed} />
              </div>
            ))}
          </ReactGridLayout>
        )}
      </div>
    </div>
  );
}

export function Sector({ sector, addBed }: SectorProps) {
  const { width, containerRef, mounted } = useContainerWidth();

  const roomsLayout = useMemo(() => {
    return sector.rooms.map((room) => {
      const layoutItem: LayoutItem = {
        i: room.id,
        h: getBedsGrid(room.beds)[0] + 3, // room rows + heading rows
        w: getBedsGrid(room.beds)[1],
        x: 0,
        // y: i * 10, // just for spacing
        y: 0,
        // isBounded: true,
      };

      return layoutItem;
    });
  }, [sector.rooms]);

  return (
    <div key={sector.id}>
      <div>
        <button className="sector-drag-handle">drag me</button>
      </div>
      <div
        ref={containerRef}
        style={{
          background: "darkblue",
          margin: 16,
          padding: 16,
          cursor: "grab",
        }}
      >
        {mounted && (
          <ReactGridLayout
            width={width}
            layout={roomsLayout}
            gridConfig={{ cols: 12, rowHeight: 20 }}
          >
            {roomsLayout?.map((item, i) => (
              <div key={item.i}>
                <Room
                  room={sector.rooms[i]}
                  addAddBed={() => {
                    addBed(sector, sector.rooms[i]);
                  }}
                />
              </div>
            ))}
          </ReactGridLayout>
        )}
      </div>
    </div>
  );
}

export function Room({
  room,
  addAddBed,
}: {
  room: Room;
  addAddBed: () => void;
}) {
  const [rows, cols] = getBedsGrid(room.beds, 12);

  return (
    <>
      <div key={room.id} style={{ width: cols * 100, border: "2px dotted" }}>
        <div style={{ textAlign: "left" }}>
          <h3>Room {room.id}</h3>
          <button onClick={addAddBed}>+</button>
        </div>
        <div
          style={{
            border: "1px dashed",
            display: "grid",
            // gap: 8,
            // padding: 16,
            // width: cols * 100,
            // height: rows * 16,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
          }}
        >
          {Array(room.beds)
            .fill(0)
            .map((_, i) => (
              <Bed key={`${room.id}-${i}`} room={room} i={i} />
            ))}
        </div>
      </div>
    </>
  );
}

export function Bed({ room, i }: { room: Room; i: number }) {
  return (
    <div
      style={{
        // height: 48,
        // width: 200,
        border: "1px solid",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      key={`${room.id}-${i + 1}`}
    >
      <span>bed {i + 1}</span>
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
