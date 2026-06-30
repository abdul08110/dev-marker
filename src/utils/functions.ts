export function timeStringToDecimalMinutes(timeString: string): number {
  const parts = timeString.split(':').map((p) => parseInt(p, 10));
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 60 + minutes + seconds / 60;
  }
  const [minutes, seconds] = parts;
  return minutes + seconds / 60;
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

export const formatTimeMatchTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const paddedHours = hours.toString().padStart(2, '0');
  const paddedMinutes = minutes.toString().padStart(2, '0');
  const paddedSeconds = seconds.toString().padStart(2, '0');

  // Notice the space after the first colon to match "00: 12:16"
  return `${paddedHours}: ${paddedMinutes}:${paddedSeconds}`;
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
};

export const generatePlayerName = (playerOneName: string, playerTwoName?: string) => {
  if (playerTwoName) {
    return `${playerOneName.trim().split(' ')[0]} & ${playerTwoName.trim().split(' ')[0]}`;
  } else {
    return `${playerOneName.trim().split(' ')[0]} ${playerOneName.trim().split(' ').length > 1 ? playerOneName.trim().split(' ').at(-1) : ''}`;
  }
};

export function truncateText(text: string, limit = 20) {
  if (text.length > limit) {
    return text.slice(0, limit) + '...';
  }
  return text;
}

export function convertHandicapToString(handicap?: number | null) {
  if (!handicap) {
    return '';
  }

  if (handicap > 0) {
    return `+${handicap}`;
  } else if (handicap < 0) {
    return `${handicap}`;
  } else {
    return '';
  }
}
