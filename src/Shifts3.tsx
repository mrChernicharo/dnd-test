import { add, endOfDay, endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns";
import { useEffect, useState, type ChangeEvent } from "react";
import { useContainerWidth } from "react-grid-layout";
import {
  buildDayBoxesArray,
  buildSlotsBand,
  buildTimeRuler,
  getPxPerHour,
  getPxPerMinute,
  getSlotHeight,
  getSlotPosition,
  localeFormat,
  professionals,
  shiftBlueprints,
  topMargin,
  weekStartsOn,
  type ViewMode,
} from "./shift.constants";
import "./Shifts3.css";

export function Shifts3() {
  const { containerRef, width: containerWidth } = useContainerWidth();
  //   const isSmallScreen = containerWidth <= 768;

  const [globalDate, setGlobalDate] = useState(new Date(2026, 4, 31));
  const [viewMode, setViewMode] = useState<ViewMode>((localStorage.getItem("viewMode") as ViewMode) || "day");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dayColumns = viewMode === "day" ? 1 : 7;
  const pxPerHour = getPxPerHour(containerWidth, dayColumns);

  const startMonth = startOfMonth(globalDate);
  const endMonth = endOfMonth(globalDate);
  const startWeek = startOfWeek(globalDate, { weekStartsOn });
  const endWeek = endOfWeek(globalDate, { weekStartsOn });
  const calendarStartDate = viewMode === "day" ? globalDate : viewMode === "week" ? startWeek : startOfWeek(startMonth);
  const calendarEndDate =
    viewMode === "day"
      ? endOfDay(calendarStartDate)
      : viewMode === "week"
        ? endOfWeek(calendarStartDate)
        : endOfWeek(endMonth);
  const bandHeight = getSlotHeight(viewMode);
  const timeRuler = buildTimeRuler(calendarStartDate, pxPerHour, dayColumns);

  const opts = {
    ...(viewMode === "day" && { start: globalDate, end: globalDate }),
    ...(viewMode === "week" && { start: startWeek, end: endWeek }),
    ...(viewMode === "month" && {
      start: startOfWeek(startMonth),
      end: endOfWeek(endMonth),
    }),
  };
  const dayBoxes = buildDayBoxesArray(opts.start!, opts.end!);

  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  function incrementGlobalDate() {
    const opts = {
      ...(viewMode === "day" && { days: 1 }),
      ...(viewMode === "week" && { weeks: 1 }),
      ...(viewMode === "month" && { months: 1 }),
    };

    setGlobalDate(add(globalDate, opts));
  }
  function decrementGlobalDate() {
    const opts = {
      ...(viewMode === "day" && { days: -1 }),
      ...(viewMode === "week" && { weeks: -1 }),
      ...(viewMode === "month" && { months: -1 }),
    };
    setGlobalDate(add(globalDate, opts));
  }
  function onViewModeChange(ev: ChangeEvent) {
    const selectedMode = ev.target.id.replace("-radio", "") as ViewMode;
    setViewMode(selectedMode);
  }

  // const slotsBand = buildSlotsBand(shiftBlueprints[3], calendarStartDate, calendarEndDate, viewMode);
  // const slots = slotsBand.map((slot) => ({
  //   ...slot,
  //   ...getSlotPosition(
  //     slot,
  //     calendarStartDate,
  //     calendarEndDate,
  //     getPxPerMinute(containerWidth, dayColumns),
  //     containerWidth,
  //     42,
  //     viewMode,
  //   ),
  // }));

  const shifts = shiftBlueprints.map((shift, i) => ({
    ...shift,
    slots: buildSlotsBand(shift, calendarStartDate, calendarEndDate, viewMode).map((slot) => ({
      ...slot,
      ...getSlotPosition(
        slot,
        calendarStartDate,
        calendarEndDate,
        getPxPerMinute(containerWidth, dayColumns),
        containerWidth,
        bandHeight,
        i,
        shiftBlueprints.length,
        viewMode,
      ),
    })),
  }));

  // console.log({ slots });

  return (
    <div className="shifts-3">
      <header>
        <button onClick={decrementGlobalDate}>←</button>

        <div>
          <form onChange={onViewModeChange}>
            <label htmlFor="day-radio">
              <input type="radio" name="view-mode" id="day-radio" defaultChecked={viewMode === "day"} />
              day
            </label>
            <label htmlFor="week-radio">
              <input type="radio" name="view-mode" id="week-radio" defaultChecked={viewMode === "week"} />
              week
            </label>
            <label htmlFor="month-radio">
              <input type="radio" name="view-mode" id="month-radio" defaultChecked={viewMode === "month"} />
              month
            </label>
          </form>

          <div>{localeFormat(globalDate, "dd 'de' MMMM yyyy")}</div>
        </div>
        <button onClick={incrementGlobalDate}>→</button>
      </header>

      <div className="root-container">
        <div
          className="professionals-container desktop"
          style={{ width: sidebarOpen ? "var(--sidebar-width-open)" : "var(--sidebar-width-closed)" }}
        >
          <div className="flex justify-between">
            {sidebarOpen && <div>Professionals</div>}
            <button onClick={() => setSidebarOpen((prev) => !prev)}>x</button>
          </div>
          {sidebarOpen &&
            professionals.map((prof) => (
              <div key={prof.id} className="professional-card" onClick={() => console.log(prof)}>
                {prof.name} :: {prof.profession}
              </div>
            ))}
        </div>

        <div className="calendar-container" ref={containerRef}>
          <div className="time-ruler">
            {timeRuler.map((tick) => (
              <div key={tick.id} className="tick" style={{ left: tick.x }}>
                <span>{localeFormat(tick.time, "HH:mm")}</span>
              </div>
            ))}
          </div>

          <div className={`day-boxes-container ${viewMode}`} style={{}}>
            {dayBoxes.map((dayBox, i) => (
              <div
                className={`day-box ${i % 7 === 0 ? "left-side" : ""}`}
                key={dayBox.id}
                style={{ height: bandHeight * shiftBlueprints.length + topMargin }}
              >
                {localeFormat(dayBox.date, "dd MMM")}
              </div>
            ))}
          </div>

          <div
            className="slots-container"
            style={
              {
                "--slots-container-width": `calc(100% - ${sidebarOpen ? `var(--sidebar-width-open)` : `var(--sidebar-width-closed)`})`,
              } as React.CSSProperties
            }
          >
            <div className="slots-wrapper" style={{ top: topMargin }}>
              {shifts.map((shift) =>
                shift.slots.map((slot) => (
                  <div
                    key={slot.id}
                    className="slot"
                    style={{ left: slot.x, top: slot.y, width: slot.width, height: bandHeight }}
                    onMouseEnter={() => console.log(slot)}
                  ></div>
                )),
              )}
            </div>
          </div>
        </div>

        {/* 
          <div
            className="professionals-container mobile"
            style={{
              height: sidebarOpen ? "var(--mobile-bottom-height-open)" : "var(--mobile-bottom-height-closed)",
              width: "100%",
            }}
          >
            <div className="flex justify-between">
              <div>Professionals</div>
              <button onClick={() => setSidebarOpen((prev) => !prev)}>x</button>
            </div>
            {sidebarOpen &&
              professionals.map((prof) => (
                <div key={prof.id} className="professional-card" onClick={() => console.log(prof)}>
                  {prof.name} :: {prof.profession}
                </div>
              ))}
          </div> 
        */}
      </div>
    </div>
  );
}
