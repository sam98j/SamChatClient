export enum TimeUnits {
  'time' = 'time',
  'date' = 'date',
  'fullTime' = 'fullTime',
}

export function getTime(stringDate: string, timeUnit: TimeUnits, local: never = 'en' as never) {
  // terminate if there is no date provided
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
  // day of the week
  const dayOfWeek = weekDays[local][dateObj.getUTCDay()];
  // day of month
  const dayOfMonth = dateObj.getUTCDate();
  // month it self
  const month = months[local][dateObj.getUTCMonth()];
  // hourse
  const hours = dateObj.getHours().toString();
  // minites
  const minites = dateObj.getUTCMinutes().toString();
  // if time unit is time
  if (timeUnit === TimeUnits.time) return timeFormater({ hours, minites });
  // if time unit is date
  if (timeUnit === TimeUnits.date) return `${dayOfWeek} ${dayOfMonth} ${month}`;
  // in case of full time
  if (timeUnit === TimeUnits.fullTime) return `${dayOfWeek} ${dayOfMonth} ${month} ${timeFormater({ hours, minites })}`;
}

// time formater
function timeFormater(data: { hours: string; minites: string }) {
  // destruct time data
  const { hours, minites } = data;
  // check if data is falsy
  if (!data) return '';
  return `${hours.length !== 1 ? hours : `0${hours}`}:${minites.length !== 1 ? minites : `0${minites}`}`;
}

// convert seconds to duration
export const secondsToDurationConverter = (sec: number) => {
  const minites = sec >= 60 ? String(Math.round(sec / 60)) : '00';
  let seconds = sec >= 60 ? String(Math.round(sec % 60)) : Math.round(sec);
  Number(seconds) < 10 ? (seconds = `0${seconds}`) : '';
  return `${minites}:${seconds}`;
};
