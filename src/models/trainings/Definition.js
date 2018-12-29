import Model from '../BaseModel';

import Season from '../Season';
import User from '../User';
import Team from '../Team';

import moment from 'moment';

export default class TrainingDefinition extends Model {
  resourceName() {
    return 'definitions';
  }

  namespace() {
    return 'trainings';
  }

  fields() {
    return [
      'name',
      'description',
      'weekday',
      'active',
      'location',
      'remark',
      'time_zone',
    ];
  }

  // Times are never stored in UTC. They are stored as localtime.
  dates() {
    return {
      created_at: 'YYYY-MM-DD HH:mm:ss',
      updated_at: 'YYYY-MM-DD HH:mm:ss',
      start_time: 'HH:mm',
      end_time: 'HH:mm'
    };
  }

  relationships() {
    return {
      season: new Season(),
      team: new Team(),
      user: new User(),
    };
  }

  computed() {
    return {
      weekdayText(definition) {
        return moment.weekdays(true)[definition.weekday - 1];
      }
    };
  }
}
