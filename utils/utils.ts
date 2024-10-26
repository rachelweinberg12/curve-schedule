import { Day } from "@/db/days";

export const getPercentThroughDay = (now: Date, start: Date, end: Date) =>
  ((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100;

export const getNumHalfHours = (start: Date, end: Date) => {
  const lengthOfDay = end.getTime() - start.getTime();
  return lengthOfDay / 1000 / 60 / 30;
};

export const arraysEqual = (a: any[], b: any[]) =>
  a.length === b.length && a.every((value) => b.includes(value));

export const convertParamDateTime = (date: string, time: string) => {
  return new Date(`2024-${date}T${time}:00-08:00`);
};

export const dateOnDay = (date: Date, day: Day) => {
  return (
    date.getTime() >= new Date(day.Start).getTime() &&
    date.getTime() <= new Date(day.End).getTime()
  );
};

export function checkStringForSearch(search: string, string: string) {
  return string.toLowerCase().includes(search.toLowerCase());
}

export function convertCamelToRegular(name: string) {
  return (
    name
      // Add a space before each uppercase letter, unless it follows a character that's not a letter (like in Bar-On).
      .replace(/([a-z])([A-Z])/g, "$1 $2")
  );
}

export function generateSlug(name: string): string {
  // Remove all spaces
  return name.replaceAll(" ", "");
}
