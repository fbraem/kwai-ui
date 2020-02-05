import Model from '@/models/Model';
import { Attribute, DateAttribute } from '@/models/Attribute';

/**
 * Rule model
 */
export default class Rule extends Model {
  static type() {
    return 'rules';
  }

  static namespace() {
    return ['users'];
  }

  static fields() {
    return {
      name: new Attribute(),
      remark: new Attribute(),
      owner: new Attribute(),
      subject: new Attribute(),
      action: new Attribute(),
      created_at: new DateAttribute('YYYY-MM-DD HH:mm:ss', true),
      updated_at: new DateAttribute('YYYY-MM-DD HH:mm:ss', true)
    };
  }
}
