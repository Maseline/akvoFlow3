import DS from 'ember-data';

export default DS.RESTSerializer.extend({
    primaryKey: 'keyId', 
    
});

// keyForAttribute: function(key) {
    //     return key;
    //   }