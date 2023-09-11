export const formatDateAndTime = (
  date: Date,
  style: Intl.DateTimeFormatOptions["dateStyle"],
) =>
  new Intl.DateTimeFormat("en-GB", {
    dateStyle: style,
    timeStyle: style,
  }).format(date);
