interface DateBlock {
    start: Date;
    end: Date;
}
export declare function mergeIntervals(unmergedIntervals: DateBlock[]): DateBlock[];
/**
 * Assumed intervals is sorted, and merged
 */
export declare function oppositeIntervals(range: DateBlock, intervals: DateBlock[]): DateBlock[];
export declare function intervalsTotal(intervals: DateBlock[]): number;
export {};
//# sourceMappingURL=fns.d.ts.map