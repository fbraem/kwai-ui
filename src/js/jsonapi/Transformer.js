import Cache from './Cache';
import Model from './Model';
import Attribute from './Attribute';

export default class Transformer {
  constructor() {
    this.cache = new Cache();
  }

  deserialize(model, { data, included = [] }) {
    // When data is an array, deserialize all elements.
    if (Array.isArray(data)) {
      let models = [];
      data.map(element => {
        models.push(this.deserialize(model, { data: element, included }));
      });
      return models;
    }

    // Set all fields
    let current = this.cache.getModel(model, data.id);
    let fields = model.fields();
    if (Array.isArray(fields)) {
      fields.forEach(field => {
        if (field in data.attributes) {
          current[field] = data.attributes[field];
        }
      });
    } else {
      Object.entries(fields).forEach(entry => {
        const [key, attr] = entry;
        if (key in data.attributes) {
          if (attr instanceof Attribute) {
            current[key] = attr.from(data.attributes[key]);
          } else {
            current[key] = data.attributes[key];
          }
        }
      });
    }

    // Set all relationships
    let createRelated = (relation, relationModel) => {
      let relatedData = included.find(o =>
        o.type === relationModel.type() && o.id === relation.id
      );
      if (relatedData) {
        return this.deserialize(
          relationModel,
          { data: relatedData, included }
        );
      }
      return null;
    };
    if (data.relationships) {
      Object.entries(model.relationships()).forEach(entry => {
        const [relationName, relationModel] = entry;
        if (relationName in data.relationships) {
          if (Array.isArray(data.relationships[relationName].data)) {
            current[relationName] = [];
            data.relationships[relationName].data.forEach(relation => {
              const relatedModel = createRelated(relation, relationModel);
              if (relatedModel) {
                current[relationName].push(relatedModel);
              }
            });
          } else {
            const relatedModel = createRelated(
              data.relationships[relationName].data, relationModel
            );
            if (relatedModel) {
              current[relationName] = relatedModel;
            }
          }
        } else {
          current[relationName] = null;
        }
      });
    }

    // Handle all computed values
    // TODO: Reactivity?
    const computed = model.computed();
    Object.entries(computed).forEach((entry) => {
      const [key, fn] = entry;
      current[key] = fn(current);
    });

    return current;
  }

  serialize(modelInstance) {
    if (!modelInstance instanceof Model) return null;

    const modelClass = modelInstance.constructor;
    let json = {
      data: {
        type: modelClass.type()
      }
    };
    if (modelInstance.id) json.data.id = modelInstance.id;

    // Handle all fields
    json.data.attributes = Object.create(null);
    let fields = modelClass.fields();
    if (Array.isArray(fields)) {
      fields.forEach(field => {
        if (field in modelInstance) {
          json.data.attributes[field] = modelInstance[field];
        }
      });
    } else {
      Object.entries(fields).forEach(entry => {
        const [key, attr] = entry;
        if (!attr.isReadonly()) {
          if (key in modelInstance) {
            json.data.attributes[key] = attr.to(modelInstance[key]);
          }
        }
      });
    }

    // Handle all relations
    let relationships = Object.create(null);
    Object.keys(modelClass.relationships()).forEach(relation => {
      relationships[relation] = Object.create(null);
      if (Array.isArray(modelInstance[relation])) {
        relationships[relation].data = modelInstance[relation].map(
          element => ({
            type: element.constructor.type(),
            id: element.id
          })
        );
      } else {
        if (modelInstance[relation]) {
          relationships[relation] = {
            data: {
              type: modelInstance[relation].constructor.type(),
              id: modelInstance[relation].id
            }
          };
        }
      }
      json.data.relationships = relationships;
    });

    return json;
  }
};
