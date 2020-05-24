import Model from './Model';
import { Attribute, DateAttribute } from './Attribute';

/**
 * Application model
 */
export default class Application extends Model {
  static type() {
    return 'applications';
  }

  static fields() {
    return {
      title: new Attribute(),
      description: new Attribute(),
      remark: new Attribute(),
      images: new Attribute(true),
      short_description: new Attribute(),
      application: new Attribute(),
      created_at: new DateAttribute('YYYY-MM-DD HH:mm:ss', true),
      updated_at: new DateAttribute('YYYY-MM-DD HH:mm:ss', true),
    };
  }
}
