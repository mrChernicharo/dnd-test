import { ptBR } from "date-fns/locale/pt-BR";

import {
  add,
  differenceInHours,
  differenceInMinutes,
  differenceInWeeks,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameWeek,
  startOfDay,
  startOfWeek,
} from "date-fns";

export type ViewMode = "month" | "week" | "day";

export type Profession = "doctor" | "nurse" | "technician";

export type Professional = {
  id: string;
  name: string;
  profession: Profession;
};

export type ShiftBlueprint = {
  id: string;
  profession: Profession;
  workHours: number;
  restHours: number;
  startDate: Date;
};

export type Slot = {
  id: string;
  start: Date;
  end: Date;
  isPartial?: boolean;
};

export type Tick = {
  id: string;
  time: Date;
  x: number;
};

export type DayBox = {
  id: string;
  date: Date;
};

export const weekStartsOn = 0; // 0 - sun, 1 - mon, 3 - tue, ...
export const topMargin = 40;

export const getSlotHeight = (viewMode: ViewMode) => {
  if (viewMode === "month") return 40;
  return 120;
};

// export const sidebarSize = {
//   desktop: { open: 320, closed: 60 },
//   mobile: { open: 400, closed: 60 },
// };

export const professionals: Professional[] = [
  { id: "p1", name: "Alice O'Connor", profession: "doctor" },
  { id: "p2", name: "Bob Marley", profession: "nurse" },
  { id: "p3", name: "Charlie Sheen", profession: "technician" },
  { id: "p4", name: "Diana Prince", profession: "doctor" },
  { id: "p5", name: "Eve Adams", profession: "nurse" },
  { id: "p6", name: "Frank Castle", profession: "technician" },
  { id: "p7", name: "Grace Hopper", profession: "doctor" },
  { id: "p8", name: "Hank Pym", profession: "nurse" },
  { id: "p9", name: "Ivy Soerensen", profession: "technician" },
];

export const shiftBlueprints: ShiftBlueprint[] = [
  {
    id: "sh-12x144",
    profession: "doctor",
    workHours: 24,
    restHours: 36,
    startDate: new Date(new Date().setHours(7, 0, 0, 0)),
  },
  {
    id: "sh-8x16",
    profession: "nurse",
    workHours: 8,
    restHours: 16,
    startDate: new Date(new Date().setHours(6, 0, 0, 0)),
  },
  {
    id: "sh-8x16-b",
    profession: "nurse",
    workHours: 8,
    restHours: 25,
    startDate: new Date(new Date().setHours(15, 0, 0, 0)),
  },
  {
    id: "sh-8x16-c",
    profession: "nurse",
    workHours: 8,
    restHours: 16,
    startDate: new Date(new Date().setHours(12, 0, 0, 0)),
  },
  {
    id: "sh-6x12",
    profession: "technician",
    workHours: 8,
    restHours: 12,
    startDate: new Date(new Date().setHours(2, 0, 0, 0)),
  },
];

const ID_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";
export function idMaker(length = 12) {
  return Array(length)
    .fill(0)
    .map(() => ID_CHARS.split("")[Math.round(Math.random() * ID_CHARS.length)])
    .join("");
}

export function padZero(n: number) {
  if (n < 0) n = 24 + n;
  return n > 9 ? `${n}` : `0${n}`;
}

export function localeFormat(date: Date | number | string, dateFormat: string) {
  return format(date, dateFormat, { locale: ptBR });
}

export function buildDayBoxesArray(start: Date, end: Date): DayBox[] {
  const dayBoxes: DayBox[] = [];
  let currentDate = start;

  while (currentDate <= end) {
    dayBoxes.push({ id: idMaker(), date: currentDate });
    currentDate = add(currentDate, { days: 1 });
  }

  return dayBoxes;
}
export function getPxPerHour(width: number, days: number) {
  const dw = width / days;
  return dw / 24;
}

export function getPxPerMinute(width: number, days: number) {
  return getPxPerHour(width, days) / 60;
}

function getTickCountPerDay(pxPerHour: number) {
  let tickCount = 1;
  let tickGapInHours = 24;
  if (pxPerHour > 40) {
    tickCount = 24;
    tickGapInHours = 1;
  } else if (pxPerHour > 30) {
    tickCount = 12;
    tickGapInHours = 2;
  } else if (pxPerHour > 20) {
    tickCount = 6;
    tickGapInHours = 4;
  } else if (pxPerHour > 12) {
    tickCount = 4;
    tickGapInHours = 5;
  } else if (pxPerHour > 6) {
    tickCount = 3;
    tickGapInHours = 8;
  } else if (pxPerHour > 3) {
    tickCount = 2;
    tickGapInHours = 12;
  }

  return { tickCount, tickGapInHours };
}

export function buildTimeRuler(startDate: Date, pxPerHour: number, days: number) {
  const ticks: Tick[] = [];
  const { tickCount, tickGapInHours } = getTickCountPerDay(pxPerHour);

  let x = 0;
  Array(tickCount * days)
    .fill(0)
    .forEach(() => {
      ticks.push({ id: idMaker(), time: startDate, x });
      startDate = add(startDate, { hours: tickGapInHours });
      x += tickGapInHours * pxPerHour;
    });

  return ticks;
}

export function buildSlotsBand(
  shift: ShiftBlueprint,
  calendarStartDate: Date,
  calendarEndDate: Date,
  viewMode: ViewMode,
): Slot[] {
  let slotStart = null;
  let slotEnd = null;

  if (isAfter(shift.startDate, calendarEndDate)) return [];

  if (isAfter(shift.startDate, calendarStartDate) && isBefore(shift.startDate, calendarEndDate)) {
    slotStart = shift.startDate;
    slotEnd = add(shift.startDate, { hours: shift.workHours });
  } else {
    const shiftStartHour = shift.startDate.getHours();
    let fShStart = shiftStartHour;
    let fShEnd = shiftStartHour + shift.workHours;

    while (fShEnd < 24) {
      fShStart += shift.workHours;
      fShEnd += shift.workHours;
    }
    // fShEnd %= 24;

    const dayBeforeFirstCalendarDate = startOfDay(add(calendarStartDate, { days: -1 }));
    slotStart = new Date(new Date(dayBeforeFirstCalendarDate).setHours(fShStart));
    slotEnd = add(slotStart, { hours: shift.workHours });
  }

  const slots = [];

  if (viewMode === "month") {
    while (isBefore(slotStart, calendarEndDate)) {
      if (isSameWeek(slotStart, slotEnd)) {
        slots.push({
          id: idMaker(),
          start: slotStart,
          end: slotEnd,
          isPartial: false,
        });
      } else {
        const id = idMaker();

        slots.push({
          id: `${id}-start`,
          start: slotStart,
          end: add(endOfWeek(slotStart), { seconds: 1 }),
          isPartial: true,
        });
        slots.push({
          id: `${id}-end`,
          start: startOfWeek(slotEnd),
          end: slotEnd,
          isPartial: true,
        });
      }

      slotStart = slotEnd;
      slotEnd = add(slotEnd, { hours: shift.workHours });
    }
  } else {
    while (isBefore(slotStart, calendarEndDate)) {
      const isPartial = isBefore(slotStart, calendarStartDate) || isAfter(slotEnd, calendarEndDate);
      const _id = idMaker();
      const id = isPartial ? (isBefore(slotStart, calendarStartDate) ? `${_id}-start` : `${_id}-end`) : _id;

      slots.push({
        id,
        start: slotStart,
        end: slotEnd,
        isPartial,
      });

      slotStart = slotEnd;
      slotEnd = add(slotEnd, { hours: shift.workHours });
    }
  }

  return slots;
}

export function getSlotPosition(
  slot: Slot,
  calendarStartDate: Date,
  calendarEndDate: Date,
  pxPerMinute: number,
  containerWidth: number,
  bandHeight: number,
  bandIndex: number,
  bandCount: number,
  viewMode: ViewMode,
) {
  const slotStart = isBefore(slot.start, calendarStartDate) ? calendarStartDate : slot.start;
  const minutesFromCalendarStart = differenceInMinutes(slotStart, calendarStartDate);
  let x = minutesFromCalendarStart * pxPerMinute;

  let y = bandHeight * bandIndex;
  if (viewMode === "month") {
    const boxHeight = bandCount * bandHeight;
    const level = differenceInWeeks(slot.start, calendarStartDate);
    x -= containerWidth * level;
    y += level * boxHeight + level * topMargin;
  }

  let slotDurationInMinutes = differenceInHours(slot.end, slot.start) * 60;
  // differenceInHours(slot.end, slot.start) * 60 + slot.end.getMinutes() - slot.start.getMinutes();

  if (isBefore(slot.start, calendarStartDate)) {
    slotDurationInMinutes -= differenceInHours(calendarStartDate, slot.start) * 60;
  }
  if (isAfter(slot.end, calendarEndDate)) {
    slotDurationInMinutes -= differenceInHours(slot.end, calendarEndDate) * 60;
  }
  const width = slotDurationInMinutes * pxPerMinute;

  return { x, y, width };
}
