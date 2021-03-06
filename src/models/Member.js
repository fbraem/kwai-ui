import Model from '@/js/jsonapi/Model';
import Attribute from '@/js/jsonapi/Attribute';
import DateAttribute from '@/js/jsonapi/DateAttribute';

import moment from 'moment';

import Person from './Person';
import Team from './Team';

/**
 * Member model
 */
export default class Member extends Model {
  static type() {
    // TODO: sport undependent
    return 'members';
  }

  static namespace() {
    return ['sport', 'judo'];
  }

  static fields() {
    return {
      competition: new Attribute(),
      remark: new Attribute(),
      license: new Attribute(),
      active: new Attribute(),
      license_end_date: new DateAttribute('YYYY-MM-DD'),
      created_at: new DateAttribute('YYYY-MM-DD HH:mm:ss', true),
      updated_at: new DateAttribute('YYYY-MM-DD HH:mm:ss', true)
    };
  }

  static relationships() {
    return {
      person: Person,
      teams: Team
    };
  }

  static computed() {
    return {
      name(member) {
        if (member.person) {
          return member.person.name;
        }
        return '';
      },
      formatted_license_end_date(member) {
        return member.license_end_date.format('L');
      },
      license_ended(member) {
        return member.license_end_date.isBefore(moment());
      }
    };
  }
}
