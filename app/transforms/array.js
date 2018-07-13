import DS from 'ember-data';
import { A } from '@ember/array';
import { isArray } from '@ember/array';

export default DS.Transform.extend({
  // deserialize(serialized) {
  //   return serialized;
  // },

  // serialize(deserialized) {
  //   return deserialized;
  // }
  deserialize: function(serialized) {
		if (isArray(serialized)) {
			return A(serialized);
		} else {
			return A();
		}
	},

	serialize: function(deserialized) {
		if (isArray(deserialized)) {
			return A(deserialized);
		} else {
			return A();
		}
	}
});
