import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
    form: null,
    selectedSurvey: null,
    currentProject: null,

    
  classProperty:computed('selectedSurvey', 'currentProject.newLocaleSurveyId','form.status', function() {

    var form = this.get('form');
    var currentProject = this.get('currentProject');
    var classString = 'aFormTab';

    if (form === null || currentProject === null) return classString;

    // Return "aFormTab" "current" and/or "registrationForm"
    var isActive = form === this.get('selectedSurvey');
    var isRegistrationForm = currentProject.get('monitoringGroup') && form.get('keyId') === currentProject.get('newLocaleSurveyId');
    var isPublished = form.get('status') === 'PUBLISHED';

    if (isActive) classString += ' current';
    if (isRegistrationForm) classString += ' registrationForm';
    if (isPublished) classString += ' published'

    return classString;
  }),
//   .property('FLOW.selectedControl.selectedSurvey', 'FLOW.projectControl.currentProject.newLocaleSurveyId', 'content.status' ),

  actions: {
    selectForm: function(evt) {
        this.set('selectedSurvey', evt);
        // //  we don't allow copying or moving between forms
        // FLOW.selectedControl.set('selectedForMoveQuestionGroup',null);
        // FLOW.selectedControl.set('selectedForCopyQuestionGroup',null);
        // FLOW.selectedControl.set('selectedForMoveQuestion',null);
        // FLOW.selectedControl.set('selectedForCopyQuestion',null);
          },
  }

});
