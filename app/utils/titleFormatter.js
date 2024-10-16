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
            return `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`;
          }
          case 'TIME':
            return new Date().toString().split(' ')[4];
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
