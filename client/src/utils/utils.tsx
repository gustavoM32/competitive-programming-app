export const formatDateTime = (timeString: string | undefined) => {
  if (timeString == null) return "No date";

  const utcStartTime = timeString + "Z"; // for some reason spring strips the z
  const date = new Date(Date.parse(utcStartTime));
  return date.toLocaleTimeString([], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getLink = (linkString: string) => {
  if (linkString.includes("://")) return linkString;
  return "//" + linkString;
};