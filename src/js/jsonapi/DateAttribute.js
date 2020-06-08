import Attribute from './Attribute';
import moment from 'moment';

/**
 * DateAttribute is used to declare a date attribute.
 */
export default class DateAttribute extends Attribute {
  /**
   * Constructor
   * @param {string} format The format used to store this date.
   * @param {boolean} readonly Is this attribute readonly?
   */
  constructor(format, readonly = false) {
    super(readonly);
    this.format = format;
  }

  /**
   * Returns a formatted date
   * @param {moment.Moment, null} arg A date
   * @return {string, null}
   */
  to(arg) {
    if (arg) {
      return arg.format(this.format);
    }
    return null;
  }

  /**
   * Creates a Moment object with the format
   * @param {string, null} arg A date as a string
   * @return {moment.Moment, null}
   */
  from(arg) {
    if (arg) {
      return moment(arg, this.format);
    }
    return null;
  }
}
