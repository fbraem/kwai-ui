import Model from '@/js/jsonapi/Model';
import Attribute from '@/js/jsonapi/Attribute';
import DateAttribute from '@/js/jsonapi/DateAttribute';

import TeamCategory from './TeamCategory';
import Member from './Member';
import Season from './Season';

/**
 * Team model
 */
export default class Team extends Model {
  static type() {
    return 'teams';
  }

  static fields() {
    return {
      name: new Attribute(),
      active: new Attribute(),
      remark: new Attribute(),
      members_count: new Attribute(true),
      created_at: new DateAttribute('YYYY-MM-DD HH:mm:ss', true),
      updated_at: new DateAttribute('YYYY-MM-DD HH:mm:ss', true),
    };
  }

  static relationships() {
    return {
      team_category: TeamCategory,
      season: Season,
      members: Member,
    };
  }

  static computed() {
    return {
      formatted_created_at(team) {
        if (team.created_at) {
          return team.created_at.format('L');
        }
        return '';
      },
      formatted_updated_at(team) {
        if (team.updated_at) {
          return team.updated_at.format('L');
        }
        return '';
      },
    };
  }
}
