import { useState } from "react";
import { ResponsiveGridLayout, useContainerWidth } from "react-grid-layout";
import type { Layout, LayoutItem } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./Floors.css";

const ROW_HEIGHT = 20;
const FLOOR_PADDING = 2.25; // Extra grid units for floor headers/padding

interface FloorProps {
  id: string;
  rooms: Layout;
  onRoomsChange: (floorId: string, newLayout: Layout) => void;
  updateFloorHeight: (floorId: string, newH: number) => void;
  addRoom: (floorId: string) => void;
}

interface FloorsState {
  floors: Layout;
  rooms: Record<string, Layout>;
}

export default function Floors() {
  const { width, containerRef } = useContainerWidth();

  const [layouts, setLayouts] = useState<FloorsState>({
    floors: [
      { i: "floor-1", x: 0, y: 0, w: 12, h: 16 },
      { i: "floor-2", x: 0, y: 8, w: 12, h: 8 },
    ],
    rooms: {
      "floor-1": [
        { i: "1a", x: 0, y: 0, w: 3, h: 4 },
        { i: "1b", x: 4, y: 0, w: 3, h: 4 },
        { i: "1c", x: 0, y: 2, w: 3, h: 4 },
        { i: "1d", x: 7, y: 2, w: 3, h: 4 },
      ],
      "floor-2": [{ i: "2a", x: 0, y: 0, w: 3, h: 4 }],
    },
  });

  // Updates the height of a specific floor in the parent layout
  const updateFloorHeight = (floorId: string, newH: number) => {
    setLayouts((prev) => ({
      ...prev,
      floors: prev.floors.map((f) => (f.i === floorId ? { ...f, h: newH } : f)),
    }));
  };

  const handleFloorLayoutChange = (layout: Layout) => {
    setLayouts((prev) => ({ ...prev, floors: layout }));
  };

  const handleRoomLayoutChange = (floorId: string, newRoomLayout: Layout) => {
    setLayouts((prev) => ({
      ...prev,
      rooms: { ...prev.rooms, [floorId]: newRoomLayout },
    }));
  };

  const addRoom = (floorId: string) => {
    setLayouts((prev) => {
      const floorRooms = prev.rooms[floorId] || [];
      const newRoomId = `${floorId}-r${floorRooms.length + 1}`;
      const newRoom: LayoutItem = {
        i: newRoomId,
        x: 0,
        y: 0,
        w: 3,
        h: 4,
      };
      return {
        ...prev,
        rooms: {
          ...prev.rooms,
          [floorId]: [...floorRooms, newRoom],
        },
      };
    });
  };

  return (
    <div className="floors-root" ref={containerRef}>
      <h1>Building Manager</h1>
      <ResponsiveGridLayout
        width={width}
        layouts={{ lg: layouts.floors }}
        breakpoints={{ lg: 1200 }}
        cols={{ lg: 1 }}
        rowHeight={ROW_HEIGHT}
        dragConfig={{ handle: ".floor-drag-handle" }}
        resizeConfig={{ enabled: false }}
        onLayoutChange={handleFloorLayoutChange}
      >
        {layouts.floors.map((floor) => (
          <div
            key={floor.i}
            style={{
              background: "white",
              border: "1px solid #ccc",
              overflow: "hidden",
            }}
          >
            <Floor
              id={floor.i}
              rooms={layouts.rooms[floor.i]}
              onRoomsChange={handleRoomLayoutChange}
              updateFloorHeight={updateFloorHeight}
              addRoom={addRoom}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}

const Floor = ({
  id,
  rooms,
  onRoomsChange,
  updateFloorHeight,
  addRoom,
}: FloorProps) => {
  const { width, containerRef } = useContainerWidth();

  const handleLayoutChange = (newLayout: Layout) => {
    onRoomsChange(id, newLayout);

    // Calculate the "bottom-most" point of the rooms
    const maxBottom = newLayout.reduce(
      (max: number, item: LayoutItem) => Math.max(max, item.y + item.h),
      0,
    );

    // Update the parent floor's height (Floor Height = Max Room Y+H + Padding)
    updateFloorHeight(id, maxBottom + FLOOR_PADDING);
  };

  return (
    <div className="floor-container">
      <div className="floor-header">
        <span className="floor-drag-handle">⠿ Floor: {id}</span>

        <button onClick={() => addRoom(id)}>+</button>
      </div>
      <div className="floor-content" ref={containerRef}>
        <ResponsiveGridLayout
          width={width}
          layouts={{ lg: rooms }}
          breakpoints={{ lg: 1200, md: 768 }}
          cols={{ lg: 12, md: 8 }}
          rowHeight={ROW_HEIGHT}
          dragConfig={{ handle: ".room-drag-handle" }}
          onLayoutChange={handleLayoutChange}
        >
          {rooms.map((room: LayoutItem) => (
            <div key={room.i} className="room-card">
              <div className="room-drag-handle">::</div>
              Room {room.i}
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>
    </div>
  );
};
