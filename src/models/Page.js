import Model from '@/js/jsonapi/Model';
import Attribute from '@/js/jsonapi/Attribute';
import DateAttribute from '@/js/jsonapi/DateAttribute';
import ObjectAttribute from '@/js/jsonapi/ObjectAttribute';
import ArrayAttribute from '@/js/jsonapi/ArrayAttribute';
import Application from '@/models/Application';

/**
 * Page model
 */
export default class Page extends Model {
  static type() {
    return 'pages';
  }

  static fields() {
    return {
      name: new Attribute(),
      enabled: new Attribute(),
      remark: new Attribute(),
      priority: new Attribute(),
      images: new Attribute(true),
      contents: new ArrayAttribute(
        new ObjectAttribute({
          locale: new Attribute(),
          format: new Attribute(),
          title: new Attribute(),
          content: new Attribute(),
          html_content: new Attribute(true),
          summary: new Attribute(),
          html_summary: new Attribute(true),
          created_at: new DateAttribute('YYYY-MM-DD HH:mm:ss', true),
          updated_at: new DateAttribute('YYYY-MM-DD HH:mm:ss', true)
        })
      ),
      created_at: new DateAttribute('YYYY-MM-DD HH:mm:ss', true),
      updated_at: new DateAttribute('YYYY-MM-DD HH:mm:ss', true)
    };
  }

  static computed() {
    return {
      content(page) {
        if (page.contents) {
          const content = page.contents.find((o) => {
            return o.locale === 'nl';
          });
          return content || page.contents[0];
        }
        return null;
      },
      authorName(page) {
        if (page.contents) {
          const content = page.contents.find((o) => {
            return o.locale === 'nl';
          });
          if (content?.user) {
            const author = content.user;
            return [
              author.first_name,
              author.last_name].filter(n => n != null).join(' ');
          }
        }
        return '';
      },
      localPublishDate(page) {
        let utc = page.created_at.clone();
        utc.utcOffset('+00:00', true);
        return utc.local().format('L');
      },
      picture(page) {
        if (page.images) {
          return page.images.crop;
        }
        return null;
      },
    };
  }

  static relationships() {
    return {
      application: Application
    };
  }
}
