import Model from '@/js/jsonapi/Model';
import Attribute from '@/js/jsonapi/Attribute';
import DateAttribute from '@/js/jsonapi/DateAttribute';

/**
 * Invitation model
 */
export default class UserInvitation extends Model {
  static type() {
    return 'invitations';
  }

  static namespace() {
    return ['users'];
  }

  static fields() {
    return {
      name: new Attribute(),
      expired_at: new DateAttribute('YYYY-MM-DD HH:mm:ss'),
      expired_at_timezone: new Attribute(),
      email: new Attribute(),
      remark: new Attribute(),
      token: new Attribute(true),
      created_at: new DateAttribute('YYYY-MM-DD HH:mm:ss', true),
      updated_at: new DateAttribute('YYYY-MM-DD HH:mm:ss', true)
    };
  }

  static computed() {
    return {
      isExpired(invitation) {
        var utc = invitation.expired_at.clone();
        utc.utcOffset('+00:00', true);
        return utc.local().isBefore();
      },
    };
  }
}
