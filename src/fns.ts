import * as dateFns from 'date-fns';

interface DateBlock {
  start: Date,
  end: Date,
}

export function mergeIntervals(unmergedIntervals: DateBlock[]): DateBlock[] {
  if (unmergedIntervals.length <= 1) {
    return unmergedIntervals;
  }

  const mergedIntervals = [];

  let currentInterval = unmergedIntervals[0];

  for (let i = 1; i < unmergedIntervals.length; i++) {
    const newInterval = unmergedIntervals[i];

    let overlap = dateFns.areIntervalsOverlapping(
      currentInterval,
      newInterval,
    );

    if (!overlap) {
      overlap = (newInterval.start.getTime() - currentInterval.end.getTime()) === 0;
    }

    if (overlap) {
      currentInterval.start = dateFns.isBefore(currentInterval.start, newInterval.start)
        ? currentInterval.start
        : newInterval.start;
      currentInterval.end = dateFns.isAfter(currentInterval.end, newInterval.end)
        ? currentInterval.end
        : newInterval.end;
    } else {
      mergedIntervals.push(currentInterval);
      currentInterval = newInterval;
    }
  }

  mergedIntervals.push(currentInterval);
  return mergedIntervals;
}

/**
 * Assumed intervals is sorted, and merged
 */
export function oppositeIntervals(
  range: DateBlock,
  intervals: DateBlock[],
): DateBlock[] {
  if (intervals.length === 0) {
    return [range];
  }

  const newIntervals = [];

  let currentInterval = Object.assign({}, range);
  let startingIndex = 0;

  if (dateFns.isWithinInterval(currentInterval.start, intervals[0])) {
    currentInterval.start = intervals[0].end;
    if (dateFns.isWithinInterval(currentInterval.end, intervals[0])) {
      // The event is so large it takes the whole range
      return [];
    }
    if (intervals[1]) {
      currentInterval.end = intervals[1].start;
      startingIndex = 1;
    }
  } else {
    currentInterval.end = intervals[0].start;
    startingIndex = 0;
    newIntervals.push(currentInterval);
  }


  for (let i = startingIndex; i < intervals.length; i++) {
    const interval = intervals[i];
    const nextInterval = intervals[i + 1];
    const currentInterval = {
      start: interval.end,
      end: nextInterval ? nextInterval.start : range.end,
    }

    newIntervals.push(currentInterval);
  }

  return newIntervals;
}

export function intervalsTotal(
  intervals: DateBlock[]
): number {
  return intervals.reduce((accumulator, interval) => {
    return accumulator + interval.end.getTime() - interval.start.getTime();
  }, 0)
}