export function timeStringToDecimalMinutes(timeString: string): number {
  const [minutesStr, secondsStr] = timeString.split(':');

  const minutes = parseInt(minutesStr, 10);
  const seconds = parseInt(secondsStr, 10);

  const totalMinutes = minutes + seconds / 60;

  return totalMinutes;
}

export function getTimeInMinutes(actualStart: string, expectedEnd: string): number {
  const startTime = new Date(actualStart).getTime();
  const endTime = new Date(expectedEnd).getTime();

  const differenceInMs = endTime - startTime;

  const timeInMinutes = differenceInMs / (1000 * 60);

  return timeInMinutes;
}

export function getTimeLeftInMinutes(expectedEnd: string): number {
  const currentTime = new Date().getTime();
  const endTime = new Date(expectedEnd).getTime();

  const differenceInMs = endTime - currentTime;

  const timeLeftInMinutes = differenceInMs / (1000 * 60);

  return Math.max(timeLeftInMinutes, 0);
}

export function addMillisecondsToUTC(currentISODate: string, millisecondsToAdd: number): string {
  const date = new Date(currentISODate);
  date.setTime(date.getTime() + millisecondsToAdd);
  return date.toISOString();
}

export const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const getTimeDifferenceInMinutes = (isoTime1: string, isoTime2: string): number =>
  Math.abs(new Date(isoTime2).getTime() - new Date(isoTime1).getTime()) / 60000;

export const addTimeLeftToStart = (timeStart: string, timeLeftMinutes: number) => {
  const startTime = new Date(timeStart);
  const timeLeftMilliseconds = timeLeftMinutes * 60 * 1000;
  const newTime = new Date(startTime.getTime() + timeLeftMilliseconds);

  return newTime.toISOString();
};

export const subtractTimeLeftFromEnd = (endTime: string, timeLeftMinutes: number) => {
  const endTimeDate = new Date(endTime);
  const timeLeftMilliseconds = timeLeftMinutes * 60 * 1000;

  const newTime = new Date(endTimeDate.getTime() - timeLeftMilliseconds);

  return newTime.toISOString();
};

export const getTimeDifferenceInMilliseconds = (start: string, end: string): number => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return endDate.getTime() - startDate.getTime();
};

export const isWithinFiveSecondsRange = (
  actualStartTimeISO: string,
  stopWatchTimeMs: number,
  currentTimeStamp: number,
): boolean => {
  const actualStartTimeDate = new Date(actualStartTimeISO);
  const targetTime = actualStartTimeDate.getTime() + stopWatchTimeMs;
  return Math.abs(currentTimeStamp - targetTime) <= 5000;
};

export const getDurationInMilliseconds = (startTimeUtc: string) => {
  const startTime = new Date(startTimeUtc).getTime();
  const currentTime = Date.now();

  const durationInMs = currentTime - startTime;

  return durationInMs;
};

export const addMinutesToDate = (minutes: number) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
}
