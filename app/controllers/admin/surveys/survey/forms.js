import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as controller } from '@ember/controller';

export default Controller.extend({
  showFormBasics: false,
  surveysController: controller('admin.surveys'),
  publishedContent: null,
  sortAscending: true,
  selectedSurvey: null,

  // computed properties
  hasForms: computed('formCount', function() {
    return this.get('formCount') > 0;
  }),
  
  formCount: computed('content.@each', function() {
    return this.get('content') && this.get('content.length') || 0;
  }),

  content: computed('surveysController.selectedSurveyGroup', function() {
    var id;
    if (this.get('surveysController.selectedSurveyGroup')) {
      id = this.get('surveysController.selectedSurveyGroup.keyId')
      return this.store.query('Survey',{surveyGroupId: id})
    } else {
      return null;
    }
  }),  
  
  showAddNewFormButton: computed(function () {
    // var survey = this.get('surveysController.currentProject');
    // return FLOW.permControl.canEditSurvey(survey);
    return true; // returning true for testing purposes
  }),

	showFormPublishButton: computed('selectedSurvey', function () {
    // var form = this.get('selectedSurvey');
    // return FLOW.permControl.canEditForm(form);
    return true; // returning true for testing purposes
		
  }),
  
	showFormDeleteButton: computed('selectedSurvey', function () {
    // var form = this.get('selectedSurvey');
    // return FLOW.permControl.canEditForm(form);
    return true; // returning true for testing purposes
		
  }),

  showFormTranslationsButton: computed('selectedSurvey', function() {
		// var form = this.get('selectedSurvey');
    // return FLOW.permControl.canEditForm(form); 
    return true; // returning true for testing purposes
	}),

  questionCount: computed(function () {
    // var questions = FLOW.questionControl.filterContent;
    // return questions && questions.get('length') || 0;
    //   .property('FLOW.questionControl.filterContent.@each')
  }),
  
  isPublished: computed('selectedSurvey.status', function() {
    var form;
    if (this.get('selectedSurvey')) {
      form = this.get('selectedSurvey');
      return form.get('status') === 'PUBLISHED';
    } else {
           return this.get('content').then((data)=> {
             form = data.get('firstObject');
             this.set('surveysController.selectedSurvey', form);
             this.set('selectedSurvey', form);
             return form.get('status') === 'PUBLISHED';
           })
    }
  }),

	isNewForm: computed('selectedSurvey', function() {
		var form = this.get('selectedSurvey');
		return form && form.get('code') == "New Form";
	}),

	visibleFormBasics: computed('isNewForm', 'showFormBasics', function() {
		return this.get('isNewForm') || this.get('showFormBasics');
  }),
  
	disableFormFields: computed('selectedSurvey', function () {
		// var form = this.get('selectedSurvey');
    //return !FLOW.permControl.canEditForm(form);
    return false;
  }),
  // actions
  actions: {
    selectForm: function(evt) {
      this.set('surveysController.selectedSurvey', evt);
      this.set('selectedSurvey', evt);
      // //  we don't allow copying or moving between forms
      // FLOW.selectedControl.set('selectedForMoveQuestionGroup',null);
      // FLOW.selectedControl.set('selectedForCopyQuestionGroup',null);
      // FLOW.selectedControl.set('selectedForMoveQuestion',null);
      // FLOW.selectedControl.set('selectedForCopyQuestion',null);
        },

    publishSurvey: function() {

    },

    toggleShowFormBasics: function () {
      this.set('showFormBasics', !this.get('showFormBasics'));
    },
  
    showPreview: function() {
      // FLOW.previewControl.set('showPreviewPopup', true);
    },

    saveProject: function(){
      let foo = this.get('surveysController.saveProject');
      return foo()
    }

  }
});
