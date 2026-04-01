import {
  ReactGridLayout,
  useContainerWidth,
  type GridLayoutProps,
} from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./GridLayout.css";

const layout: GridLayoutProps["layout"] = [
  { i: "a", x: 0, y: 0, w: 1, h: 2 },
  { i: "b", x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
  { i: "c", x: 4, y: 0, w: 2, h: 4, isResizable: false },
];

export function GridLayout() {
  const { width, mounted, containerRef } = useContainerWidth();

  return (
    <div ref={containerRef}>
      {mounted && (
        <ReactGridLayout
          layout={layout}
          width={width}
          gridConfig={{ cols: 12, rowHeight: 30 }}
          style={{ background: "forestgreen" }}
        >
          {layout?.map((ele) => (
            <div className="card" key={ele.i}>
              {ele.i}
            </div>
          ))}
        </ReactGridLayout>
      )}
    </div>
  );
}
