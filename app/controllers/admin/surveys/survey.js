import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as controller } from '@ember/controller';

export default Controller.extend({
    showProjectDetails: false,
    showAdvancedSettings: false,
    selectedLanguage: null,
    monitoringGroupEnabled: false,
    currentRegistrationForm: null,
    showDataApprovalDetails: false,
    surveysController: controller('admin.surveys'),
    formsController: controller('admin.surveys.survey.forms'),
    
    //computed properties
    privacyContent: computed(function() {
        return ["PRIVATE", "PUBLIC"];
    }),
    
    languageContent: computed(function() {
        return [{ label: "English", value: "en"},
                { label: "Español", value: "es" },
                { label: "Français", value: "fr" }]
    }),

    isNewProject: computed(function() {
        var currentProject = this.get('model');
        return currentProject && currentProject.get('code') == "New survey";
    }),
      
    visibleProjectBasics: computed('showProjectDetails', function() {
        return this.get('isNewProject') || this.get('showProjectDetails');
    }),

    disableFolderSurveyInputField: computed('surveysController.currentProjectPath', function() {
        // var permissions = this.get('surveysController.currentFolderPermissions');
        // return permissions.indexOf("PROJECT_FOLDER_UPDATE") < 0;
        return false;
      }),
    
    //actions
    actions: {
        toggleShowProjectDetails() {
            this.set('showProjectDetails', !this.get('showProjectDetails'));
        },

        changePrivacyType(level) {
            this.set('model.privacyLevel', level);
        },

        changeLanguage(language) {
            this.set('selectedLanguage', language);
            //this.set('model.defaultLanguageCode', label.value);
        },

        saveProject() {
        }
    }

});
