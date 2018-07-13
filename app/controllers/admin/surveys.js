import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { loc } from '@ember/string';
import { typeOf } from '@ember/utils';

export default Controller.extend({
    store: service(),
    content: null,
    currentProject: null,
    moveTarget: null,
    copyTarget: null,
    isLoading: true,
    //properties from selectedControl
    selectedSurveyGroup: null,
    selectedSurvey: null,
    selectedFolders: [],

    actions: {
        selectRootProject() {
            this.setCurrentProject(null);
        },
    
        selectProject(evt) {
            var project = evt;
            // the target should not be openable while being moved. Prevents moving it into itself.
            if (this.moveTarget == project) {
                return;
            }
            this.setCurrentProject(evt);
            // User is using the breadcrumb to navigate, we could have unsaved changes
            //evt.save();
           // console.log(this.get('target.currentRouteName'));
           this.set('newlyCreated', null);
            if (this.isProject(project)) {
                // load caddisfly resources if they are not loaded
                // and only when surveys are selected
                this.loadCaddisflyResources(); //bew controller/service alert
        
                // applies to project where data approval has
                // been previously set
                if (project.get('requireDataApproval')) {
                    this.loadDataApprovalGroups();
                }
        
                //FLOW.selectedControl.set('selectedSurveyGroup', project); //new controller/service alert
                this.set('selectedSurveyGroup', project);
                this.transitionToRoute('admin.surveys.survey.forms', evt.get('keyId'));
                
            }else {
                //this caters for backwards navigation from survey to folder in breadcrumbs
                this.transitionToRoute('admin.surveys'); 
            }
        },
        
        saveProject() {
            var currentProject = this.get('currentProject');
            //var currentForm = FLOW.selectedControl.get('selectedSurvey');
            var currentForm = this.get('selectedSurvey');

            if (currentProject && currentProject.get('isDirty')) {
                var name = currentProject.get('name').trim();
                currentProject.set('name', name);
                currentProject.set('code', name);
                currentProject.set('path', this.get('currentProjectPath'));
            }

            if (currentForm && currentForm.get('isDirty')) {
                var name = currentForm.get('name').trim();
                currentForm.set('name', name);
                currentForm.set('code', name);
                var path = this.get('currentProjectPath') + "/" + name;
                currentForm.set('path', path);
                currentForm.set('status', 'NOT_PUBLISHED');
            }

            //FLOW.store.commit();
            this.get('store').save();
        },

    /* start moving a folder. Confusingly, the target is what will move */
        endMoveProject(evt) {
            var newFolderId = this.get('currentProject') ? this.get('currentProject').get('keyId') : 0;
            var project = this.get('moveTarget');
            var path = this.get('currentProjectPath') + "/" + project.get('name');
            project.set('parentId', newFolderId);
            project.set('path', path);
            // FLOW.store.commit();
            //this.get('store').save();
            project.save();
            this.set('moveTarget', null);
        },

        cancelMoveProject(evt) {
            this.set('moveTarget', null);
          },

        cancelCopyProject(evt) {
            this.set('copyTarget', null);
        },
    
        endCopyProject: function(evt) {
            var currentFolder = this.get('currentProject');
    
            // FLOW.store.findQuery(FLOW.Action, {
            // action: 'copyProject',
            // targetId: this.get('copyTarget').get('keyId'),
            // folderId: currentFolder ? currentFolder.get('keyId') : 0,
            // });
            this.get('store').query('action', {
                action: 'copyProject',
                targetId: this.get('copyTarget').get('keyId'),
                folderId: currentFolder ? currentFolder.get('keyId') : 0,    
            }) 
            //FLOW.store.commit();
            this.get('store').save();
            
            //set up the controller later
            // FLOW.dialogControl.set('activeAction', "ignore");
            // FLOW.dialogControl.set('header', loc('_copying_survey'));
            // FLOW.dialogControl.set('message', loc('_copying_published_text_'));
            // FLOW.dialogControl.set('showCANCEL', false);
            // FLOW.dialogControl.set('showDialog', true);
    
            this.set('copyTarget', null);
        },

        /* Create a new project folder. The current project must be root or a project folder */
        createProjectFolder() {
            this.createNewProject(true);
        },

        createProject() {
            this.createNewProject(false);
        },

        deleteProject(evt) {
            let id = evt.id;
            this.get('store').findRecord('survey-group', id, { backgroundReload: true }).then(function(survey) {
                survey.destroyRecord();
              });
        },

        beginMoveProject: function(evt) {
            this.set('newlyCreated', null);
            this.set('moveTarget', evt);
            this.set('moveTargetType', this.isProjectFolder(evt) ? 'folder' : 'survey');
        },

        beginCopyProject: function(evt) {
            this.set('newlyCreated', null);
            this.set('copyTarget', evt);
        },

    },
    //end of actions

    // computed properties
    folderListClass: computed('moveTarget','result', 'copyTarget', function() {
        return this.get('moveTarget') || this.get('copyTarget') ? 'actionProcess' : '';
      }),

    breadCrumbs: computed('@each', 'currentProject', 'selectedFolders', function() {
        var currentProject = this.get('currentProject');
        if (currentProject === null) {
          // current project is root
          this.set('selectedFolders', []);
          return this.get('selectedFolders');
        }
        var id = currentProject.get('keyId');
        if (this.get('selectedFolders').includes(currentProject)) {
            var currentIndex = this.get('selectedFolders').indexOf(currentProject);
            this.get('selectedFolders').splice(currentIndex + 1);    
        } else {
            this.get('selectedFolders').push(currentProject);        
        }
        
        return this.get('selectedFolders');
    }),
    
    currentFolders: computed('moveTarget','currentProject','model.[]', function() {
        var self = this;
        var currentProject = this.get('currentProject');
        var parentId = currentProject ? currentProject.get('keyId') : 0;
        return this.get('model').filter(function(project) {
            return project.get("parentId") === parentId;
        }).sort(function(a, b) {
        if (self.isProjectFolder(a) && self.isProject(b)) {
            return -1;
        } else if (self.isProject(a) && self.isProjectFolder(b)) {
            return 1;
        } else {
            var aCode = a.get('code') || a.get('name');
            var bCode = b.get('code') || b.get('name');
            if (aCode === bCode) return 0;
            if (aCode === 'New survey' || aCode === 'New folder') return -1;
            if (bCode === 'New survey' || bCode === 'New folder') return 1;
            return aCode.localeCompare(bCode);
        }
        });
    }),

    currentProjectPath: computed('breadCrumbs', function() {
        var projectList = this.get('breadCrumbs');
        if(projectList.length === 0) {
            return ""; // root project folder
        } else {
            var path = "";
            var i;
            for(i = 0; i < projectList.length; i++){
                path += "/" + projectList[i].get('name');
            }
            return path;
        }

    }),

    currentFolderPermissions: computed('currentProject', function() {
        // var currentFolder = this.get('currentProject');
        // //var currentUserPermissions = FLOW.currentUser.get('pathPermissions'); set thus current user up
        // var folderPermissions = [];
  
        // if (!currentUserPermissions) {
        //   return [];
        // }
        // // root folder
        // if (!currentFolder) {
        //   if (currentUserPermissions[0]) {
        //     currentUserPermissions[0].forEach(function(item){
        //       folderPermissions.push(item);
        //     });
        //   }
        //   return folderPermissions;
        // }
        // // first check current object id
        // if (currentFolder.get('keyId') in currentUserPermissions) {
        //   currentUserPermissions[currentFolder.get('keyId')].forEach(function(item){
        //     folderPermissions.push(item);
        //   });
        // }
  
        // var ancestorIds = currentFolder.get('ancestorIds');
        // if (!ancestorIds) {
        //   return folderPermissions;
        // }
  
        // var i;
        // for(i = 0; i < ancestorIds.length; i++){
        //   if (ancestorIds[i] in currentUserPermissions) {
        //     currentUserPermissions[ancestorIds[i]].forEach(function(item){
        //       folderPermissions.push(item);
        //     });
        //   }
        // }
  
        // return folderPermissions;
    }),
    //properties from view 
    //this property has unresolved dependent properties
   // hasUnsavedChanges: computed('currentProject.isDirty','FLOW.selectedControl.selectedSurvey.isDirty',
    //'FLOW.router.approvalStepsController.content.@each.approverUserList', function() {
    //incomplete list of dependent properties, see comments above
    hasUnsavedChanges: computed('currentProject','selectedSurvey', function() {
            var selectedProject = this.get('currentProject');
            var isProjectDirty = selectedProject ? selectedProject.get('isDirty') : false;
        
            // var selectedForm = FLOW.selectedControl.get('selectedSurvey');
            var selectedForm = this.get('selectedSurvey'); //this value should come from forms.js
            var isFormDirty = selectedForm ? selectedForm.get('isDirty') : false;
        
            //var approvalSteps = FLOW.router.approvalStepsController.get('content');
            var isApprovalStepDirty = false;
        
            // if (approvalSteps) {
            //     approvalSteps.forEach(function (step) {
            //         if (!isApprovalStepDirty && step.get('isDirty')) {
            //             isApprovalStepDirty = true;
            //         }
            //     });
            // }
        
            return isProjectDirty || isFormDirty || isApprovalStepDirty;
    
      }),

    projectListView: computed('currentProject', function(){
        return this.isProjectFolder(this.get('currentProject'));
    }),

    projectView: computed('currentProject', function() {
        return this.isProject(this.get('currentProject'));
    }),    

    disableAddFolderButton: computed('currentProjectPath',  function() {
        // var permissions = this.get('currentFolderPermissions'); //need to define currentFolderPermissions
        // return permissions.indexOf("PROJECT_FOLDER_CREATE") < 0;
        return false;
      }),

    disableAddSurveyButton: computed('currentProjectPath', function() {
        // var permissions = this.get('currentFolderPermissions');
        // return permissions.indexOf("PROJECT_FOLDER_CREATE") < 0;
    }),

    disableAddSurveyButtonInRoot: computed('currentProjectPath', function() {
        return this.get('currentProjectPath').length == 0;
    }),
        
     //end of computed properties

    //other functions
    setCurrentProject(project) {
        this.set('currentProject', project);
        //window.scrollTo(0,0);
    },
    
  /* Load caddisfly resources if they are not already loaded */
    loadCaddisflyResources() {
        // var caddisflyResourceController = FLOW.router.get('caddisflyResourceController');
        // if (Ember.empty(caddisflyResourceController.get('content'))) {
        //     caddisflyResourceController.load();
        // }
    },

    /* Load the data approval resources for this survey */
    loadDataApprovalGroups(survey) {
        // var approvalGroups = FLOW.router.approvalGroupListController.get('content');
        // if (Ember.empty(approvalGroups)) {
        //     FLOW.router.approvalGroupListController.load();
        // }
    },

    /* Helper methods */
    isProjectFolder(project) {
     return project === null || project.get('projectType') === 'PROJECT_FOLDER';
    },

    isProjectFolderEmpty: function(folder) {
        // var id = folder.get('keyId');
        // var children = this.get('model').filter(function(project) {
        //   return project.get('parentId') === id;
        // });
        // return children.get('length') === 0;
    },

    isProject(project) {
        return !this.isProjectFolder(project);
    },

    /* Create a new project folder. The current project must be root or a project folder */
    
    createNewProject: function(folder) {
        var currentFolder = this.get('currentProject');
        var currentFolderId = currentFolder ? currentFolder.get('keyId') : 0;
        var name = folder ? loc('_new_folder').trim() : loc('_new_survey').trim();
        var projectType = folder ? "PROJECT_FOLDER" : "PROJECT";
        var path = this.get('currentProjectPath') + "/" + name;
        var keyId = Math.floor(Math.random() * 10000); // keyId here for testing only, to be removed in final
        
        var newRecord = this.get('store').createRecord('survey-group', {
          "code": name,
          "name": name,
          "path": path,
          "parentId": currentFolderId,
          "projectType": projectType,
          "keyId": keyId
        });
        newRecord.save();
        this.set('newlyCreated', newRecord);
      },

      
});

    