export const minutesPassed = (date: number) => {
  const now = Date.now();
  const timeDifference = now - date;
  return Math.floor(timeDifference / (1000 * 60));
};
