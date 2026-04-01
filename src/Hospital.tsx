import { useContainerWidth, type GridLayoutProps } from "react-grid-layout";
import "./Hospital.css";

interface Room {
  id: string;
  name: string;
}

interface Sector {
  id: string;
  name: string;
  color: string;
  rooms: Room[];
}

const hospital = {
  id: "h1",
  name: "Meu Hospital",
  sectors: [
    {
      id: "s1",
      name: "1o andar",
      color: "lightgray",
      rooms: [
        { id: "r101", name: "sala 101" },
        { id: "r102", name: "sala 102" },
        { id: "r103", name: "sala 103" },
        { id: "r104", name: "sala 104" },
      ],
    },
    {
      id: "s2",
      name: "2o andar",
      color: "lightblue",
      rooms: [
        { id: "r201", name: "sala 201" },
        { id: "r202", name: "sala 202" },
        { id: "r203", name: "sala 203" },
      ],
    },
  ],
};

export function Hospital() {
  return (
    <div className="hospital">
      {hospital.name}

      <ul>
        {hospital.sectors.map((sector) => (
          <Sector key={sector.id} sector={sector} />
        ))}
      </ul>
    </div>
  );
}

export function Sector({ sector }: { sector: Sector }) {
  //   const { width, mounted, containerRef } = useContainerWidth();

  //   const layout = buildSectorLayout(sector.rooms);

  return (
    <div className="sector">
      {sector.name}
      <ul>
        {sector.rooms.map((room) => (
          <Room key={room.id} room={room} />
        ))}
      </ul>
    </div>
  );
}

export function Room({ room }: { room: Room }) {
  return <li className="room">{room.name}</li>;
}

// function buildSectorLayout(rooms: Room[]) {
//   const layout: GridLayoutProps["layout"] = [];

//   for (const room of rooms) {
//   }
// }
