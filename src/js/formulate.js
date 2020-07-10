import Vue from 'vue';
import VueFormulate from '@braid/vue-formulate';

import KwaiRange from '@/components/forms/KwaiRange';
Vue.component('KwaiRange', KwaiRange);
import KwaiLabel from '@/components/forms/KwaiLabel';
Vue.component('KwaiLabel', KwaiLabel);

import moment from 'moment';

function kwaiPlugin(instance) {
  instance.extend({
    rules: {
      kwaitime: ({ value }) => {
        return value.match(/^([01]\d|2[0-3]):([0-5]\d)$/);
      },
      kwaidate: ({ value }, ...args) => {
        const format = args[0] || 'L';
        return moment(value, format, true).isValid();
      }
    }
  });
}

export default function init() {
  Vue.use(VueFormulate, {
    errorHandler(err) {
      return {
        inputErrors: {},
        formErrors: [
          `${err.response.status}  - ${err.response.statusText}`,
        ]
      };
    },
    plugins: [
      kwaiPlugin,
    ],
    slotComponents: {
      label: 'KwaiLabel'
    },
    slotProps: {
      label: [ 'required' ]
    },
    library: {
      kwairange: {
        classification: 'slider',
        component: 'KwaiRange'
      },
    },
    classes: {
      wrapper(context) {
        if (context.classification === 'box') {
          return 'flex content-center';
        }
      },
      help(context) {
        let clazz = 'text-sm italic mt-2';
        if (!context.hasErrors) {
          clazz += ' mb-4';
        }
        return clazz;
      },
      error: 'mt-1',
      outer: 'mb-2',
      input(context) {
        switch (context.classification) {
        case 'box':
          return '';
        case 'slider':
          return '';
        case 'button':
        case 'submit':
          // eslint-disable-next-line max-len
          return 'py-3 px-4 rounded focus:outline-none hover:no-underline disabled:opacity-50 disabled:cursor-not-allowed';
        default:
          // eslint-disable-next-line max-len
          return 'appearance-once block w-full bg-gray-200 border rounded py-3 px-4 leading-thight focus:outline-none focus:shadow-outline';
        }
      },
      errors: 'text-red-600 text-sm italic mb-4'
    }
  });
};
