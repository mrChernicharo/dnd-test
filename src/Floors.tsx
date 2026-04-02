import { useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout/legacy";
import type { Layout, LayoutItem } from "react-grid-layout";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import "./Floors.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

// --- CONSTANTS ---
const ROW_HEIGHT = 20;
const FLOOR_PADDING = 2; // Extra grid units for floor headers/padding

interface FloorProps {
  id: string;
  rooms: Layout;
  onRoomsChange: (floorId: string, newLayout: Layout) => void;
  updateFloorHeight: (floorId: string, newH: number) => void;
}

interface FloorsState {
  floors: LayoutItem[];
  rooms: Record<string, Layout>;
}

export default function Floors() {
  const [layouts, setLayouts] = useState<FloorsState>({
    floors: [
      { i: "floor-1", x: 0, y: 0, w: 12, h: 8 },
      { i: "floor-2", x: 0, y: 8, w: 12, h: 8 },
    ],
    rooms: {
      "floor-1": [
        { i: "1a", x: 0, y: 0, w: 4, h: 4 },
        { i: "1b", x: 4, y: 0, w: 4, h: 4 },
        { i: "1c", x: 0, y: 2, w: 4, h: 4 },
        { i: "1d", x: 7, y: 2, w: 4, h: 4 },
      ],
      "floor-2": [{ i: "2a", x: 0, y: 0, w: 6, h: 4 }],
    },
  });

  // Updates the height of a specific floor in the parent layout
  const updateFloorHeight = (floorId: string, newH: number) => {
    setLayouts((prev) => ({
      ...prev,
      floors: prev.floors.map((f) => (f.i === floorId ? { ...f, h: newH } : f)),
    }));
  };

  // ResponsiveGridLayout's onLayoutChange: (layout: Layout, layouts: Partial<Record<string, Layout>>) => void
  const handleFloorLayoutChange = (layout: Layout) => {
    setLayouts((prev) => ({ ...prev, floors: layout as LayoutItem[] }));
  };

  const handleRoomLayoutChange = (floorId: string, newRoomLayout: Layout) => {
    setLayouts((prev) => ({
      ...prev,
      rooms: { ...prev.rooms, [floorId]: newRoomLayout },
    }));
  };

  return (
    <div className="floors-root">
      <h1>Building Manager</h1>
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layouts.floors }}
        breakpoints={{ lg: 1200 }}
        cols={{ lg: 12 }}
        rowHeight={ROW_HEIGHT}
        draggableHandle=".floor-drag-handle"
        onLayoutChange={handleFloorLayoutChange}
        onResize={console.log}
        // margin={[0, 20]}
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
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}

const Floor = ({ id, rooms, onRoomsChange, updateFloorHeight }: FloorProps) => {
  const handleLayoutChange = (newLayout: Layout) => {
    onRoomsChange(id, newLayout);

    // Calculate the "bottom-most" point of the rooms
    const maxBottom = newLayout.reduce(
      (max: number, item: LayoutItem) => Math.max(max, item.y + item.h),
      0,
    );

    console.log(`Floor ${id} new max bottom:`, maxBottom);

    // Update the parent floor's height (Floor Height = Max Room Y+H + Padding)
    updateFloorHeight(id, maxBottom + FLOOR_PADDING);
  };

  return (
    <div className="floor-container">
      <div className="floor-header">
        <span className="floor-drag-handle">⠿</span> Floor: {id}
      </div>
      <div className="floor-content">
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: rooms }}
          breakpoints={{ lg: 1200 }}
          cols={{ lg: 12 }}
          rowHeight={ROW_HEIGHT}
          draggableHandle=".room-drag-handle" // Prevents floor from dragging when moving a room
          onLayoutChange={handleLayoutChange}
          // margin={[10, 10]}
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
