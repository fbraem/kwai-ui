const TYPE = Symbol('TYPE');

export default class Model {
  /**
   * Constructor
   * @param {string} [id] - The id of the model
   */
  constructor(id = null) {
    this[TYPE] = this.constructor.type();
    this.id = id;
  }

  /**
   * Default implementation. Returns an empty object.
   * @returns Object
   */
  static fields() {
    return Object.create(null);
  }

  /**
   * Default implementation. Returns an empty object.
   * @returns Object
   */
  static relationships() {
    return Object.create(null);
  }

  /**
   * Default implementation. Returns an empty object.
   * @returns Object
   */
  static computed() {
    return Object.create(null);
  }
};
