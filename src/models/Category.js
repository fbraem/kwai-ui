import Model from '@/js/jsonapi/Model';
import Attribute from '@/js/jsonapi/Attribute';
import DateAttribute from '@/js/jsonapi/DateAttribute';

/**
 * Category model
 */
export default class Category extends Model {
  static type() {
    return 'categories';
  }

  static fields() {
    return {
      name: new Attribute(),
      description: new Attribute(),
      remark: new Attribute(),
      images: new Attribute(true),
      short_description: new Attribute(),
      app: new Attribute(),
      created_at: new DateAttribute('YYYY-MM-DD HH:mm:ss', true),
      updated_at: new DateAttribute('YYYY-MM-DD HH:mm:ss', true),
    };
  }

  static computed() {
    return {
      header_picture(category) {
        if (category.images) {
          return category.images.header;
        }
      },
      icon_picture(category) {
        if (category.images) {
          return category.images.icon;
        }
      },
      /**
       * Returns an object with all images which filename ends on _sm, _md or
       * _lg. sm, md and lg are the properties of the object.
       */
      header_images(category) {
        if (category.images) {
          let images = {};
          let re = /^.*_(sm|md|lg)$/;
          Object.keys(category.images).forEach((imageName) => {
            let matches = imageName.match(re);
            if (matches) {
              images[matches[1]] = category.images[imageName];
            }
          });
          return images;
        }
        return {};
      }
    };
  }
}
