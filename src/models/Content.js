import Model from '@/js/jsonapi/Model';
import Attribute from '@/js/jsonapi/Attribute';
import DateAttribute from '@/js/jsonapi/DateAttribute';

/**
 * Content model
 */
export default class Content extends Model {
  static type() {
    return 'contents';
  }

  static fields() {
    return {
      locale: new Attribute(),
      format: new Attribute(),
      title: new Attribute(),
      content: new Attribute(),
      html_content: new Attribute(true),
      summary: new Attribute(),
      html_summary: new Attribute(true),
      created_at: new DateAttribute('YYYY-MM-DD HH:mm:ss', true),
      updated_at: new DateAttribute('YYYY-MM-DD HH:mm:ss', true)
    };
  }

  static relationships() {
    return {
      // TODO:
      // 'user' : new User()
    };
  }
}
