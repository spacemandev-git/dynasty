export function formatDate(date: Date): string {
  // +1 to account for zero index on month and date
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

export function formatStartTime(startTime: number): string {
  // const date = new Date(startTime * 1000);
  const date = new Date(startTime);
  return formatDate(date) + " " + date.toLocaleTimeString();
}
