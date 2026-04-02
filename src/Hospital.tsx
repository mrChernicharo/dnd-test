import {
  ReactGridLayout,
  useContainerWidth,
  // type GridLayoutProps,
  type LayoutItem,
} from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
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
        { id: "r105", name: "sala 105" },
        { id: "r106", name: "sala 106" },
        { id: "r107", name: "sala 107" },
        { id: "r108", name: "sala 108" },
        { id: "r109", name: "sala 109" },
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

/****************************************************/
/****************************************************/
/****************************************************/

// export function Hospital() {
//   const { width, mounted, containerRef } = useContainerWidth({
//     measureBeforeMount: true,
//     // initialWidth: window.innerWidth,
//   });

//   const hospitalLayout = buildHospitalLayout(hospital.sectors, 1);

//   return (
//     <div className="hospital">
//       <h1>{hospital.name}</h1>

//       <div ref={containerRef}>
//         {mounted && (
//           <ReactGridLayout
//             layout={hospitalLayout}
//             width={width}
//             gridConfig={{ cols: 1 }}
//           >
//             {hospitalLayout?.map((item) => (
//               <div key={item.i}>
//                 <Sector sector={item.sector} />
//               </div>
//             ))}
//           </ReactGridLayout>
//         )}
//       </div>
//     </div>
//   );
// }

export function Hospital() {
  return (
    <div className="hospital">
      <h1>{hospital.name}</h1>

      {hospital.sectors.map((sector) => (
        <Sector key={sector.id} sector={sector} />
      ))}
    </div>
  );
}

export function Sector({ sector }: { sector: Sector }) {
  const { width, mounted, containerRef } = useContainerWidth({
    measureBeforeMount: true,
    // initialWidth: window.innerWidth,
  });

  const cols = 12;
  const sectorLayout = buildSectorLayout(sector.rooms, cols);
  //   console.log({ sectorLayout });

  return (
    <div className="sector">
      <h2>{sector.name}</h2>

      <div ref={containerRef}>
        {mounted && (
          <ReactGridLayout
            layout={sectorLayout}
            width={width}
            gridConfig={{ cols, rowHeight: 40 }}
            onLayoutChange={(ev) => console.log(ev)}
          >
            {sectorLayout?.map((item) => (
              <div key={item.i}>
                <Room room={item.room} />
              </div>
            ))}
          </ReactGridLayout>
        )}
      </div>
    </div>
  );
}

export function Room({ room }: { room: Room }) {
  return <div className="room">{room.name}</div>;
}

/****************************************************/
/****************************************************/
/****************************************************/

// function buildHospitalLayout(
//   sectors: Sector[],
//   cols: number,
//   width = 1,
//   height = 1,
// ) {
//   const layout: (LayoutItem & { sector: Sector })[] = [];

//   let y = 0;
//   let x = 0;

//   for (const sector of sectors) {
//     const item: LayoutItem & { sector: Sector } = {
//       i: sector.id,
//       x,
//       y,
//       w: width,
//       h: height,
//       isResizable: false,
//       isBounded: true,
//       sector,
//     };

//     if (x + width >= cols) y++;
//     x = (x + width) % cols;

//     layout.push(item);
//   }

//   console.log("buildHospitalLayout :::", layout);

//   return layout;
// }

function buildSectorLayout(rooms: Room[], cols: number, width = 3, height = 2) {
  const layout: (LayoutItem & { room: Room })[] = [];

  let y = 0;
  let x = 0;

  for (const room of rooms) {
    // const isLong = Math.random() > 0.75;
    // const isTall = Math.random() < 0.25;

    const item: LayoutItem & { room: Room } = {
      i: room.id,
      x,
      y,
      //   w: isLong ? width * 2 : width,
      //   h: isTall ? height * 2 : height,
      w: width,
      h: height,
      isResizable: false,
      isBounded: true,
      room,
    };

    if (x + width >= cols) y++;
    x = (x + width) % cols;

    layout.push(item);
  }

  return layout;
}
