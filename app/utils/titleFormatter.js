export function titleFormatter(titleFormat, count = 0) {
  let title = titleFormat
    ?.split(' ')
    .map((word) => {
      if (word.includes('#')) {
        let temp = word.split('#')[word.split('#').length - 1];
        switch (temp) {
          case 'COUNT':
            return count + 1;
          case 'FULLDATE':
            return new Date().toString();
          case 'DATE': {
            let date = getCityDateTime(6.5).split(' ')[0];
            return date.slice(0, date.length - 1);
          }
          case 'TIME':
            return getCityDateTime(6.5).split(' ')[1];
          case 'DATEONLY':
            return new Date().getDate();
          default:
            return '';
        }
      } else {
        return word;
      }
    })
    .join(' ');
  return title;
}

function getCityDateTime(offsetHours) {
  const utcDate = new Date();
  const cityUtcDate = new Date(
    utcDate.getTime() -
      utcDate.getTimezoneOffset() * 60000 +
      offsetHours * 3600000,
  );
  const cityDateTime = cityUtcDate.toLocaleString();

  return cityDateTime;
}
