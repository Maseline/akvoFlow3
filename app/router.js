import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('login', {path: '/'});
  this.route('admin', {path: '/admin'}, function() {
    this.route('surveys', function() {
      this.route('survey', { path: '/:survey_id' }, function() {
        this.route('forms');
      });
    });
  });
});

export default Router;
