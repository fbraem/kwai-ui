import Attribute from './Attribute';

/**
 * ArrayAttribute is used for arrays that are returned in JSON
 */
export default class ArrayAttribute extends Attribute {
  /**
   * @param {Attribute} elementAttribute The atribute to use for the elements
   * of the array.
   * @param {boolean} readonly Is this attribute readonly?
   */
  constructor(elementAttribute, readonly = false) {
    super(readonly);
    this.elementAttribute = elementAttribute;
  }

  /**
   * Returns an array with values for a JSONAPI structure
   * @param {array} arg An array
   * @return {array}
   */
  to(arg) {
    if (Array.isArray(arg)) {
      return arg.map((e) => this.elementAttribute.to(e));
    }
    return arg;
  }

  /**
   * Returns an  array from the JSONAP structure
   * @param {array} arg An array
   * @return {array}
   */
  from(arg) {
    if (Array.isArray(arg)) {
      return arg.map((e) => this.elementAttribute.from(e));
    }
    return arg;
  }
}
