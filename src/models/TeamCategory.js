import Model from '@/js/jsonapi/Model';
import Attribute from '@/js/jsonapi/Attribute';
import DateAttribute from '@/js/jsonapi/DateAttribute';

/**
 * TeamType model
 */
export default class TeamCategory extends Model {
  static type() {
    return 'team_categories';
  }

  static fields() {
    return {
      name: new Attribute(),
      start_age: new Attribute(),
      end_age: new Attribute(),
      competition: new Attribute,
      gender: new Attribute(),
      active: new Attribute(),
      remark: new Attribute(),
      created_at: new DateAttribute('YYYY-MM-DD HH:mm:ss', true),
      updated_at: new DateAttribute('YYYY-MM-DD HH:mm:ss', true),
    };
  }
}
