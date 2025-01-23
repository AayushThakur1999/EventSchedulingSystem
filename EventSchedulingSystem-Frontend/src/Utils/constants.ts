export const timeSlots = Array.from({ length: 96 }, (_, i) => {
  const hour = Math.floor(i / 4);
  const minute = (i % 4) * 15;
  return `${hour % 12 || 12}:${minute.toString().padStart(2, "0")}:00 ${hour < 12 ? "AM" : "PM"}`;
});
