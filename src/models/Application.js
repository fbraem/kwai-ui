import Model from '@/js/jsonapi/Model';
import Attribute from '@/js/jsonapi/Attribute';
import DateAttribute from '@/js/jsonapi/DateAttribute';

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
      name: new Attribute(),
      created_at: new DateAttribute('YYYY-MM-DD HH:mm:ss', true),
      updated_at: new DateAttribute('YYYY-MM-DD HH:mm:ss', true),
    };
  }
}
