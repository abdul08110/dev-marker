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
