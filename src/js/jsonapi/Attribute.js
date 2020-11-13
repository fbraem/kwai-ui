export default class Attribute {
  constructor(readonly = false) {
    this.readonly = readonly;
  }

  /**
   * Called to store the attribute to a JSONAPI object. This implementation
   * just returns the argument as is.
   * @param {*} arg The value to convert
   * @returns {*} The converted argument
   */
  to(arg) {
    return arg;
  }

  /**
   * Called to retrieve the attribute from a JSONAPI object. This implementation
   * just returns the argument as is.
   * @param {*} arg The value to convert
   * @returns {*} The converted argument.
   */
  from(arg) {
    return arg;
  }

  /**
   * Returns true when this is a readonly attribute. A readonly attribute will
   * never be stored in a JSONAPI structure
   * @return {boolean}
   */
  isReadonly() {
    return this.readonly;
  }
}
