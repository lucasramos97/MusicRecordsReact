
export default class StringUtils {

  capitalizeField(field) {
    let capitalizeField = '';
    for (let i = 0; i < field.length; i++) {
      if (i === 0) {
        capitalizeField += field[i].toUpperCase();
        continue;
      }
      if (field[i].toUpperCase() === field[i]) {
        capitalizeField += ` ${field[i]}`;
      } else {
        capitalizeField += field[i];
      }
    }
    return capitalizeField;
  }

}