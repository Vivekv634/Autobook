import z from "zod";

const TrashIntervals = {
  "7": "7 days",
  "15": "15 days",
  "30": "30 days",
};

export const TrashIntervalEnum = z.enum(
  Object.keys(TrashIntervals) as [keyof typeof TrashIntervals],
);

export type TrashIntervalType = z.infer<typeof TrashIntervalEnum>;
