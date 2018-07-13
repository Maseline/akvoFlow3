import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Ember from "ember";

export default Component.extend({
    store: service(),
    tagName: 'li',
    classNameBindings: ['classProperty'],
    folderEdit: false,
    moveTarget: null,
    copyTarget: null,
    currentProjectPath: null,
    content: null,
    pk: null,
    currentFolderPermissions: null,
    newlyCreated: null,

    isProjectFolder(x) {
        let foo = this.get('isProjectFolder');
        return foo(x)
    },

    isProjectFolderEmpty(x) {
        let boo = this.get('isProjectFolderEmpty');
        return boo(x)
    },

    formatDate: function(datetime) {
        if (datetime === "") return "";
        var date = new Date(parseInt(datetime, 10));
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    },

    //computed properties
    classProperty: computed('moveTarget', 'copyTarget', function() {
        var isFolder = this.get('isProjectFolder')(this.get('pk'));
        var isFolderEmpty = this.get('isProjectFolderEmpty')(this.get('pk.keyId'));
        var isMoving = this.get('pk') === this.get('moveTarget');
        var isCopying = this.get('pk') === this.get('copyTarget');

        var classes = "aSurvey";
        if (isFolder) classes += " aFolder";
        if (isFolderEmpty) classes += " folderEmpty";
        if (isMoving || isCopying) classes += " highLighted";
        if (this.get('newlyCreated') === this.get('pk')) classes += " newlyCreated";

        return classes;
    }),

    isFolder: computed(function() {
        let boo = this.get('isProjectFolder')(this.get('pk'));
        return boo;
    }),

    showSurveyEditButton: computed(function() {
        //var survey = this.get('model');
        //return FLOW.permControl.canEditSurvey(survey); implement this later
        return true;
    }),

    showSurveyCopyButton: computed(function () {
        //var survey = this.get('model');
        //return FLOW.permControl.canEditSurvey(survey); implement this later
        // return true;
    }),

    hideFolderSurveyDeleteButton: computed(function() {
        // var permissions = this.get('currentFolderPermissions');
        // return permissions.indexOf("PROJECT_FOLDER_DELETE") < 0 || !Ember.empty(c.get('surveyList'));
    }),

    showSurveyMoveButton: computed(function() {
        //var survey = this.get('model');
        //return FLOW.permControl.canEditSurvey(survey); implement this later
        return true;
      }),

    created: computed( function() {
        return this.formatDate(this.get('pk.createdDateTime'));
    }),

    modified: computed(function() {
        return this.formatDate(this.get('pk.lastUpdateDateTime'));
    }),

    language: computed(function() {
        var langs = {en: "English", es: "Español", fr: "Français"};
        return langs[this.get('pk.defaultLanguageCode')];
      }),

    
    isPrivate: computed( function() {
        return this.get('pk.privacyLevel') === "PRIVATE";
    }),
    //actions
    actions: {
        selectProject(evt) {
            this.selectproject(evt);
        },

        selectSurvey(evt) {
            this.transitionToRoute('admin.surveys.survey', evt.get('keyId'));
        },

        deleteProject(evt) {
            this.deleteproject(evt);
        },

        toggleEditFolderName() {
            this.set('folderEdit', !this.get('folderEdit'));
        },

        beginMoveProject(evt){
            this.beginmoveproject(evt);
        },

        beginCopyProject(evt){
            this.begincopyproject(evt);
        },

        saveFolderName: function(evt) {
            var name = evt.get('code').trim();
            evt.set('name', name);
            evt.set('code', name);
            var path = this.get('currentProjectPath') + "/" + name;
            evt.set('path', path);
            this.set('folderEdit', !this.get('folderEdit'));
            evt.save()
          },

    },

});
