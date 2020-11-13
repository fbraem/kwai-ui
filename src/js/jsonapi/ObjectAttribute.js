import Attribute from './Attribute';

/**
 * ObjectAttribute is used for objects that are returned as JSON object and
 * not as relationships.
 */
export default class ObjectAttribute extends Attribute {
  /**
   * @param {object} fields An object with attributes
   * @param {boolean} readonly Is this attribute readonly?
   */
  constructor(fields, readonly = false) {
    super(readonly);
    this.fields = fields;
  }

  /**
   * Returns an object
   */
  to(arg) {
    let obj = Object.create(null);
    Object.entries(this.fields).forEach((entry) => {
      const [key, attr] = entry;
      if (!attr.isReadonly()) {
        if (key in arg) {
          if (arg[key] && attr instanceof Attribute) {
            obj[key] = attr.to(arg[key]);
          } else {
            obj[key] = arg[key];
          }
        }
      }
    });
    return obj;
  }

  /**
   * Returns a simple object
   * @param {object} arg A JSON object
   * @return {object}
   */
  from(arg) {
    let obj = Object.create(null);
    Object.entries(this.fields).forEach((entry) => {
      const [key, attr] = entry;
      if (attr instanceof Attribute) {
        obj[key] = attr.from(arg[key]);
      } else {
        obj[key] = arg[key];
      }
    });
    return obj;
  }
}
