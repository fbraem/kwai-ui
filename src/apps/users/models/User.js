import Model from '@/js/JSONAPI/BaseModel';

import moment from 'moment-timezone';

export default class User extends Model {
    resourceName() {
        return 'users';
    }

    fields() {
        return [
            'first_name',
            'last_name',
            'password',
            'email',
            'remark'
        ];
    }

    dates() {
        return {
            'last_login' : 'YYYY-MM-DD HH:mm:ss',
            'created_at' : 'YYYY-MM-DD HH:mm:ss',
            'updated_at' : 'YYYY-MM-DD HH:mm:ss'
        }
    }

    computed() {
        return {
            name(user) {
                return "";
            }
        };
    }
}
