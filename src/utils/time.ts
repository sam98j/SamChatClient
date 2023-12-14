export enum TimeUnits {
  'time' = 'time',
  'date' = 'date',
  'fullTime' = 'fullTime',
}

export function getTime(stringDate: string, timeUnit: TimeUnits, local: never = 'en' as never) {
  if (!stringDate) return '';
  // week's days
  const weekDays = {
    ar: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  };
  // months
  const months = {
    ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  };
  //create new date object from string
  const dateObj = new Date(stringDate);
  // if time unit is time
  if (timeUnit === TimeUnits.time) {
    // time hour
    const timeHoure = dateObj.getHours().toString();
    // time minutes
    const timeMinutes = dateObj.getMinutes().toString();
    return `${timeHoure.length !== 1 ? timeHoure : `0${timeHoure}`}:${
      timeMinutes.length !== 1 ? timeMinutes : `0${timeMinutes}`
    }`;
  }
  // if time unit is date
  if (timeUnit === TimeUnits.date) {
    return `${weekDays[local][dateObj.getUTCDay()]} ${dateObj.getUTCDate()} ${months[local][dateObj.getUTCMonth()]}`;
  }
  // in case of full time
  if (timeUnit === TimeUnits.fullTime) {
    return `${weekDays[local][dateObj.getUTCDay()]} ${dateObj.getUTCDate()} ${
      months[local][dateObj.getUTCMonth()]
    } ${dateObj.getHours()}:${dateObj.getUTCMinutes()}`;
  }
}
