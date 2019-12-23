"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dateFns = require("date-fns");
function mergeIntervals(unmergedIntervals) {
    if (unmergedIntervals.length <= 1) {
        return unmergedIntervals;
    }
    var mergedIntervals = [];
    var currentInterval = unmergedIntervals[0];
    for (var i = 1; i < unmergedIntervals.length; i++) {
        var newInterval = unmergedIntervals[i];
        var overlap = dateFns.areIntervalsOverlapping(currentInterval, newInterval);
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
        }
        else {
            mergedIntervals.push(currentInterval);
            currentInterval = newInterval;
        }
    }
    mergedIntervals.push(currentInterval);
    return mergedIntervals;
}
exports.mergeIntervals = mergeIntervals;
/**
 * Assumed intervals is sorted, and merged
 */
function oppositeIntervals(range, intervals) {
    if (intervals.length === 0) {
        return [range];
    }
    var newIntervals = [];
    var currentInterval = Object.assign({}, range);
    var startingIndex = 0;
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
    }
    else {
        currentInterval.end = intervals[0].start;
        startingIndex = 0;
        newIntervals.push(currentInterval);
    }
    for (var i = startingIndex; i < intervals.length; i++) {
        var interval = intervals[i];
        var nextInterval = intervals[i + 1];
        var currentInterval_1 = {
            start: interval.end,
            end: nextInterval ? nextInterval.start : range.end,
        };
        newIntervals.push(currentInterval_1);
    }
    return newIntervals;
}
exports.oppositeIntervals = oppositeIntervals;
function intervalsTotal(intervals) {
    return intervals.reduce(function (accumulator, interval) {
        return accumulator + interval.end.getTime() - interval.start.getTime();
    }, 0);
}
exports.intervalsTotal = intervalsTotal;
//# sourceMappingURL=fns.js.map