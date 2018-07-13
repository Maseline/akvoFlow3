import DS from 'ember-data';

export default DS.Model.extend({
    description: DS.attr('string', {
        defaultValue: ''
      }),
      name: DS.attr('string', {
        defaultValue: ''
      }),
      path: DS.attr('string', {
        defaultValue: null
      }),
      //array type
      ancestorIds: DS.attr('array'),
      createdDateTime: DS.attr('string', {
        defaultValue: ''
      }),
      monitoringGroup: DS.attr('boolean', {
        defaultValue: false
      }),
      newLocaleSurveyId: DS.attr('number'),
      lastUpdateDateTime: DS.attr('string', {
        defaultValue: ''
      }),
      // the code field is used as name
      code: DS.attr('string', {
        defaultValue: ''
      }),

      keyId: DS.attr('number'),
      
      parentId: DS.attr('number', {
        defaultValue: null
      }),
    
      projectType: DS.attr('string', {
        defaultValue: "PROJECT"
      }),
    
      privacyLevel: DS.attr('string', {
        defaultValue: "PRIVATE"
      }),
    
      defaultLanguageCode: DS.attr('string', {
        defaultValue: "en"
      }),
    
      published: DS.attr('boolean', {
        defaultValue: false
      }),
    
      requireDataApproval: DS.attr('boolean', {
          defaultValue: false
      }),
    
      dataApprovalGroupId: DS.attr('number', {
          defaultValue: null
      }),
    //array type
      surveyList: DS.attr('array', {
        defaultValue: null
      }),

      
    

});
