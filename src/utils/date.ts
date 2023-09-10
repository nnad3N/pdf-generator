export const formatDateAndTime = (
  date: Date,
  options: Intl.DateTimeFormatOptions,
) => new Intl.DateTimeFormat("en-GB", options).format(date);
