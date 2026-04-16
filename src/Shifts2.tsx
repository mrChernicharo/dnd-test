import "./Shifts2.css";

const ID_CHARS =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";

function idMaker(length = 12) {
  return Array(length)
    .fill(0)
    .map(() => ID_CHARS.split("")[Math.round(Math.random() * ID_CHARS.length)])
    .join("");
}

function padZero(n: number) {
  if (n < 0) n = 24 + n;
  return n > 9 ? `${n}` : `0${n}`;
}

type TimeString = `${number}${number}:${number}${number}`;

type ShiftBlueprint = {
  id: string;
  name: string;
  startTime: TimeString;
  workHours: number;
  restHours: number;
  color: string;
};

type TickBlueprint = {
  hourText: TimeString;
  durationInHours: number;
};

const shiftBlueprints: ShiftBlueprint[] = [
  {
    id: idMaker(),
    name: "sh-12x48",
    workHours: 12,
    restHours: 48,
    startTime: "00:00",
    color: "orange",
  },
  {
    id: idMaker(),
    name: "sh-12x48",
    workHours: 12,
    restHours: 48,
    startTime: "05:00",
    color: "pink",
  },
  {
    id: idMaker(),
    name: "sh-24x72",
    workHours: 24,
    restHours: 72,
    startTime: "11:00",
    color: "orangered",
  },
  {
    id: idMaker(),
    name: "sh-6x32",
    workHours: 6,
    restHours: 32,
    startTime: "02:00",
    color: "dodgerblue",
  },
  {
    id: idMaker(),
    name: "sh-8x32",
    workHours: 8,
    restHours: 32,
    startTime: "07:00",
    color: "dodgerblue",
  },
  {
    id: idMaker(),
    name: "sh-24x144",
    workHours: 24,
    restHours: 144,
    startTime: "00:00",
    color: "lightcoral",
  },
];

const dayCount = 7;
const pxPerHour = 12.75;
const timeTicksPerDay = 6;

const shiftBandHeight = 38;

function buildDaysArray(days: number) {
  return Array(days)
    .fill(0)
    .map((_, i) => `day-${i + 1}`);
}

function buildTimeTicksArray(days: number) {
  let hour = 0;
  const res: TickBlueprint[] = [];

  Array(days * timeTicksPerDay)
    .fill(0)
    .forEach(() => {
      const hourText = `${padZero(hour)}:00` as TimeString;
      const hoursPerTick = 24 / timeTicksPerDay;
      hour = (hoursPerTick + hour) % 24;
      // console.log(i, hourText, hoursPerTick);
      res.push({ hourText, durationInHours: hoursPerTick });
    });

  // console.log(res);
  return res;
}

function buildShiftSlots(blueprint: ShiftBlueprint) {
  const startHour = parseInt(blueprint.startTime);

  let start = startHour;
  let end = start + blueprint.workHours;

  const slotCount = (dayCount * 24 - startHour) / blueprint.workHours + 1;

  const res = [
    { id: idMaker(), start: start - blueprint.workHours, end: start },
  ];

  while (res.length < slotCount) {
    res.push({ id: idMaker(), start, end });

    start = end;
    end = end + blueprint.workHours;
  }

  console.log(res);
  return res;
}

// console.log(buildDaysArray(dayCount));
// console.log(buildTimeTicksArray(dayCount));
// console.log(buildShiftSlots(shiftBlueprints[0]));

export function Shifts2() {
  console.log(shiftBlueprints);
  const days = buildDaysArray(dayCount);
  const ticks = buildTimeTicksArray(dayCount);

  return (
    <div className="shifts-2 window-container">
      <h1>Shifts2</h1>

      <div
        className="root-container"
        style={{ width: dayCount * 24 * pxPerHour }}
      >
        <div
          className="time-ruler"
          style={{ width: dayCount * 24 * pxPerHour }}
        >
          {ticks.map((tick, i) => (
            <div
              key={`tick-${i}`}
              className="tick"
              style={{ width: tick.durationInHours * pxPerHour }}
            >
              <div
                style={{
                  transform: `translate(-${(tick.durationInHours * pxPerHour) / 2}px, -20px)`,
                  fontSize: 9,
                }}
              >
                {tick.hourText}
              </div>
            </div>
          ))}
          <div className="tick" style={{ width: 0 }}>
            <div
              style={{
                transform: `translate(-16px, -20px)`,
                fontSize: 9,
              }}
            >
              00:00
            </div>
          </div>
        </div>

        <div className="day-boxes-container">
          {days.map((day) => (
            <div key={day}>
              <div>{day}</div>

              <div className="day-box" style={{ width: 24 * pxPerHour }}>
                {shiftBlueprints.map((blueprint) => (
                  <div
                    key={`${day}-${blueprint.id}`}
                    id={blueprint.id}
                    className="shift-band"
                    style={{ height: shiftBandHeight }}
                  ></div>
                ))}
              </div>
            </div>
          ))}

          {shiftBlueprints.map((blueprint, i) => (
            <div
              key={blueprint.id}
              id={blueprint.id}
              className="slots-container"
              style={{ top: i * shiftBandHeight + 28 }}
            >
              {buildShiftSlots(blueprint).map((slot) => (
                <div
                  key={slot.id}
                  id={slot.id}
                  className="slot-item"
                  style={{
                    left: slot.start * pxPerHour,
                    width: (slot.end - slot.start) * pxPerHour,
                    height: shiftBandHeight,
                  }}
                  onClick={() => console.log(slot)}
                >
                  <small>{`${padZero(slot.start % 24)}:00`}</small>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="day-boxes-container">
          {days.map((day) => (
            <div key={day}>
              <div>{`${day.replace(/\d+/, "")}${+day.replace(/\D+/, "") + dayCount}`}</div>

              <div className="day-box" style={{ width: 24 * pxPerHour }}>
                {shiftBlueprints.map((blueprint) => (
                  <div
                    key={`${day}-${blueprint.id}`}
                    id={blueprint.id}
                    className="shift-band"
                    style={{ height: shiftBandHeight }}
                  ></div>
                ))}
              </div>
            </div>
          ))}

          {shiftBlueprints.map((blueprint, i) => (
            <div
              key={blueprint.id}
              id={blueprint.id}
              className="slots-container"
              style={{ top: i * shiftBandHeight + 28 }}
            >
              {buildShiftSlots(blueprint).map((slot) => (
                <div
                  key={slot.id}
                  id={slot.id}
                  className="slot-item"
                  style={{
                    left: slot.start * pxPerHour,
                    width: (slot.end - slot.start) * pxPerHour,
                    height: shiftBandHeight,
                  }}
                  onClick={() => console.log(slot)}
                >
                  <small>{`${padZero(slot.start % 24)}:00`}</small>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="day-boxes-container">
          {days.map((day) => (
            <div key={day}>
              <div>{`${day.replace(/\d+/, "")}${+day.replace(/\D+/, "") + dayCount * 2}`}</div>

              <div className="day-box" style={{ width: 24 * pxPerHour }}>
                {shiftBlueprints.map((blueprint) => (
                  <div
                    key={`${day}-${blueprint.id}`}
                    id={blueprint.id}
                    className="shift-band"
                    style={{ height: shiftBandHeight }}
                  ></div>
                ))}
              </div>
            </div>
          ))}

          {shiftBlueprints.map((blueprint, i) => (
            <div
              key={blueprint.id}
              id={blueprint.id}
              className="slots-container"
              style={{ top: i * shiftBandHeight + 28 }}
            >
              {buildShiftSlots(blueprint).map((slot) => (
                <div
                  key={slot.id}
                  id={slot.id}
                  className="slot-item"
                  style={{
                    left: slot.start * pxPerHour,
                    width: (slot.end - slot.start) * pxPerHour,
                    height: shiftBandHeight,
                  }}
                  onClick={() => console.log(slot)}
                >
                  <small>{`${padZero(slot.start % 24)}:00`}</small>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="day-boxes-container">
          {days.map((day) => (
            <div key={day}>
              <div>{`${day.replace(/\d+/, "")}${+day.replace(/\D+/, "") + dayCount * 3}`}</div>

              <div className="day-box" style={{ width: 24 * pxPerHour }}>
                {shiftBlueprints.map((blueprint) => (
                  <div
                    key={`${day}-${blueprint.id}`}
                    id={blueprint.id}
                    className="shift-band"
                    style={{ height: shiftBandHeight }}
                  ></div>
                ))}
              </div>
            </div>
          ))}

          {shiftBlueprints.map((blueprint, i) => (
            <div
              key={blueprint.id}
              id={blueprint.id}
              className="slots-container"
              style={{ top: i * shiftBandHeight + 28 }}
            >
              {buildShiftSlots(blueprint).map((slot) => (
                <div
                  key={slot.id}
                  id={slot.id}
                  className="slot-item"
                  style={{
                    left: slot.start * pxPerHour,
                    width: (slot.end - slot.start) * pxPerHour,
                    height: shiftBandHeight,
                  }}
                  onClick={() => console.log(slot)}
                >
                  <small>{`${padZero(slot.start % 24)}:00`}</small>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
