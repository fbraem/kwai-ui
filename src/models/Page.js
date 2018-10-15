import Model from './BaseModel';

import Category from './Category';
import Content from './Content';

export default class Page extends Model {
    resourceName() {
        return 'pages';
    }

    fields() {
        return [
            'name',
            'enabled',
            'remark',
            'priority',
            'images'
        ];
    }

    dates() {
        return {
            'created_at' : 'YYYY-MM-DD HH:mm:ss',
            'updated_at' : 'YYYY-MM-DD HH:mm:ss'
        }
    }

    computed() {
        return {
            summary(page) {
                if (page.contents) {
                    var content = page.contents.find((o) => {
                        return o.locale == 'nl';
                    });
                    if (content) {
                        return content.html_summary;
                    }
                }
                return "";
            },
            content(page) {
                if (page.contents) {
                    var content = page.contents.find((o) => {
                        return o.locale == 'nl';
                    });
                    if (content) {
                        return content.html_content;
                    }
                }
                return "";
            },
            title(page) {
                if (page.contents) {
                    var content = page.contents.find((o) => {
                        return o.locale == 'nl';
                    });
                    if (content) {
                        return content.title;
                    }
                }
                return "";
            },
            authorName(page) {
                if (page.contents) {
                    var content = page.contents.find((o) => {
                        return o.locale == 'nl';
                    });
                    if (content) {
                        var author = content.user;
                        if (author) {
                            return [author.first_name, author.last_name].filter(n => n != null).join(' ');
                        }
                    }
                }
                return "";
            },
            picture(page) {
                if (page.images) {
                    return page.images.crop;
                }
                return null;
            }
        };
    }

    relationships() {
        return {
            'category' : new Category(),
            'contents' : new Content()
        };
    }
}
