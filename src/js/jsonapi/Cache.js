/**
 * Simple Cache class for model instances.
 */
export default class Cache {
  /**
   * Constructor
   */
  constructor() {
    this.cache = Object.create(null);
  }

  /**
   * Get the model or creates a new empty model instance and stores it.
   * @param ctor
   * @param id
   * @returns {*}
   */
  getModel(ctor, id) {
    this[ctor.type()] = this[ctor.type()] || Object.create(null);
    this[ctor.type()][id] = this[ctor.type()][id] || new ctor(id);
    return this[ctor.type()][id];
  }
}
