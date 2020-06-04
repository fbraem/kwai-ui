const form = {
  props: {
    form: {
      type: Object,
      required: true
    },
    validations: {
      type: Array,
      default: () => []
    }
  },
  render() {
    return this.$scopedSlots.default({
      fields: this.form.fields,
      valid: this.valid,
    })
  },
  created() {
    for (let f in this.form.fields) {
      this.$watch('form.fields.' + f + '.value', (nv, ov) => {
        this.form.validateField(f, true);
      });
    }
  },
  computed: {
    valid() {
      let valid = this.form.state.valid;

      if (valid) {
        this.form.validators.forEach((validator) => {
          if (!validator(this.form.fields)) {
            valid = false;
          }
        });
      }
      if (valid) {
        this.form.clearErrors();
      }
      return valid;
    }
  },
  methods: {
    validate() {
      let result = Object.entries(this.form.fields).every((entry) => {
        const [, field] = entry;
        return field.valid;
      });
      if (result) {
        if (this.validations) {
          this.validations.forEach((validator) => {
            validator.bind(this);
            if (!validator()) {
              result = false;
            }
          });
        }
      }
      if (result) {
        this.form.clearErrors();
      }
      return result;
    },
  },
  mounted() {
    // Run all validations now to initialize
    this.form.validate(false);
  },
};

export default form;
