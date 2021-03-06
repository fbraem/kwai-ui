import Model from '@/js/jsonapi/Model';
import Attribute from '@/js/jsonapi/Attribute';
import DateAttribute from '@/js/jsonapi/DateAttribute';
import ObjectAttribute from '@/js/jsonapi/ObjectAttribute';
import ArrayAttribute from '@/js/jsonapi/ArrayAttribute';

import Season from '../Season';
import User from '@/models/users/User';
import Team from '../Team';
import Definition from './Definition';
import TrainingCoach from './TrainingCoach';
import Presence from './Presence';

/**
 * Training model
 */
export default class Training extends Model {
  /**
   * The JSONAPI type
   */
  static type() {
    return 'trainings';
  }

  /**
   * The JSONAPI attributes
   */
  static fields() {
    return {
      event: new ObjectAttribute({
        start_date: new DateAttribute('YYYY-MM-DD HH:mm:ss'),
        end_date: new DateAttribute('YYYY-MM-DD HH:mm:ss'),
        time_zone: new Attribute(),
        location: new Attribute(),
        cancelled: new Attribute(),
        active: new Attribute(),
        remark: new Attribute(),
        contents: new ArrayAttribute(
          new ObjectAttribute({
            locale: new Attribute(),
            title: new Attribute(),
            summary: new Attribute(),
            content: new Attribute(),
            created_at: new DateAttribute('YYYY-MM-DD HH:mm:ss', true)
          })
        )
      }),
      created_at: new DateAttribute('YYYY-MM-DD HH:mm:ss', true),
      updated_at: new DateAttribute('YYYY-MM-DD HH:mm:ss', true),
    };
  }

  /**
   * The JSONAPI relationships
   */
  static relationships() {
    return {
      season: Season,
      teams: Team,
      coaches: TrainingCoach,
      definition: Definition,
      presences: Presence,
      user: User,
    };
  }

  /**
   * Computed values
   */
  static computed() {
    return {
      /**
       * Returns a formatted start date of the event
       * @param {Training} training A training model
       */
      formattedStartDate(training) {
        if (training.event) {
          return training.event.start_date.format('L');
        }
        return null;
      },
      /**
       * Returns a formatted starttime of the event
       * @param {Training} training A training model
       */
      formattedStartTime(training) {
        if (training.event) {
          return training.event.start_date.format('HH:mm');
        }
        return null;
      },
      /**
       * Returns a formatted endtime of the event
       * @param {Training} training A training model
       */
      formattedEndTime(training) {
        if (training.event) {
          return training.event.end_date.format('HH:mm');
        }
        return null;
      },
      /**
       * Returns the content of the event. For now the first content is
       * returned.
       * @param {Training} training A training model
       * @todo Return the content belonging to the current locale
       */
      content(training) {
        if (training.event) {
          if (training.event.contents && training.event.contents.length > 0) {
            return training.event.contents[0];
          }
        }
        return null;
      }
    };
  }
}
