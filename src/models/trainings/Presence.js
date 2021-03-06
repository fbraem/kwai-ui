import Model from '@/js/jsonapi/Model';
import Attribute from '@/js/jsonapi/Attribute';
import DateAttribute from '@/js/jsonapi/DateAttribute';

import User from '@/models/users/User';
import Member from '../Member';
import Training from './Training';

/**
 * Presences model
 */
export default class Presence extends Model {
  static type() {
    return 'presences';
  }

  static fields() {
    return {
      ... Member.fields(),
      presence_remark: new Attribute(),
      created_at: new DateAttribute('YYYY-MM-DD HH:mm:ss', true),
      updated_at: new DateAttribute('YYYY-MM-DD HH:mm:ss', true),
    };
  }

  static relationships() {
    return {
      ... Member.relationships(),
      user: User,
      training: Training
    };
  }
}
