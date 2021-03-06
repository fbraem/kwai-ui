import Model from '@/js/jsonapi/Model';
import Attribute from '@/js/jsonapi/Attribute';
import DateAttribute from '@/js/jsonapi/DateAttribute';

import Season from '../Season';
import User from '@/models/users/User';
import Team from '../Team';

import moment from 'moment';

/**
 * TrainingDefinition model
 */
export default class TrainingDefinition extends Model {
  static type() {
    return 'definitions';
  }

  static namespace() {
    return ['trainings'];
  }

  static fields() {
    return {
      name: new Attribute(),
      description: new Attribute(),
      weekday: new Attribute(),
      active: new Attribute(),
      location: new Attribute(),
      remark: new Attribute(),
      start_time: new DateAttribute('HH:mm'),
      end_time: new DateAttribute('HH:mm'),
      time_zone: new Attribute(),
      created_at: new DateAttribute('YYYY-MM-DD HH:mm:ss', true),
      updated_at: new DateAttribute('YYYY-MM-DD HH:mm:ss', true),
    };
  }

  static relationships() {
    return {
      season: Season,
      team: Team,
      user: User,
    };
  }

  static computed() {
    return {
      ... Model.computed(),
      weekdayText(definition) {
        return moment.weekdays(true)[definition.weekday - 1];
      },
      formattedStartTime(definition) {
        return definition.start_time.format('HH:mm');
      },
      formattedEndTime(definition) {
        return definition.end_time.format('HH:mm');
      },
      formatted_created_at(definition) {
        if (definition.created_at) {
          return definition.created_at.format('L');
        }
        return '';
      },
      formatted_updated_at(definition) {
        if (definition.updated_at) {
          return definition.updated_at.format('L');
        }
        return '';
      },
    };
  }
}
