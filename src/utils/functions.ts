export function timeStringToDecimalMinutes(timeString: string): number {
    const [minutesStr, secondsStr] = timeString.split(':');

    const minutes = parseInt(minutesStr, 10);
    const seconds = parseInt(secondsStr, 10);
  
    const totalMinutes = minutes + seconds / 60;
  
    return totalMinutes;
  }