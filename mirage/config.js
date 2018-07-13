export default function() {

  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  this.namespace = '/api';    // make this `/api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  /*
    Shorthand cheatsheet:

    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');

    http://www.ember-cli-mirage.com/docs/v0.3.x/shorthands/
    

  */
  this.get('/survey-groups', function({surveyGroups}){
    return surveyGroups.all();
  });


  this.get('/survey-groups/:id', function({ surveyGroups }, request) {
    let id = request.params.id;
    return surveyGroups.findBy({ keyId: id });
  });

  this.patch('/survey-groups/:id', function({ surveyGroups }, request) {
    let id = request.params.id;
    let attrs = this.normalizedRequestAttrs();
    return surveyGroups.findBy({keyId: id}).update(attrs);
  });

  this.post('/survey-groups', function({ surveyGroups }, request) {
    let attrs = this.normalizedRequestAttrs();
    return surveyGroups.create(attrs);
  });

  this.del('/survey-groups/:id', ({ surveyGroups }, request) => {
    let id = request.params.id;
    surveyGroups.findBy({keyId: id}).destroy();
  });

  this.get('/surveys', function({ surveys }, request) {
    let id = request.queryParams.surveyGroupId
    return surveys.where({surveyGroupId: id});
  });


 
}
