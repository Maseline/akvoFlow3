import DS from 'ember-data';

export default DS.Model.extend({ 
    defaultLanguageCode: DS.attr('string'),
    status: DS.attr('string'),
    sector: DS.attr('string'),
    code: DS.attr('string'),
    requireApproval: DS.attr('string'),
    version: DS.attr('string'),
    description: DS.attr('string'),
    name: DS.attr('string'),
    path: DS.attr('string'),
    ancestorIds: DS.attr('array'),
    pointType: DS.attr('string'),
    surveyGroupId: DS.attr('number'),
    createdDateTime: DS.attr('number'),
    lastUpdateDateTime: DS.attr('number'),
    instanceCount: DS.attr('number'),
    keyId: DS.attr('number'),
    // This attribute is used for the 'Copy Survey' functionality
    // Most of the times is `null`
    sourceId: DS.attr('number', {defaultValue: null}),
    // used in the assignment edit page, not saved to backend
    surveyGroupName: null,

    // didLoad: function () {
    //     // set the survey group name
    //     var sg = FLOW.store.find(FLOW.SurveyGroup, this.get('surveyGroupId'));
    //     if (!Ember.empty(sg)) {
    //       this.set('surveyGroupName', sg.get('code'));
    //     }
    //   },
});
