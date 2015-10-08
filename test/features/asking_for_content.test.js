var expect = require('chai').expect;
var _ = require('lodash');
var Auth0Docs = require('../../index')
var superagentFake = require('../fabricator/superagent.fake');

describe('Asking for content', function() {

  describe('when path belongs to articles/*', function() {

    describe('and when asking for an existing article', function() {
      beforeEach(function() {
        this.docs = new Auth0Docs({
          baseURL: 'http://localhost:9999'
        });

        this.docs._fetcher.request = superagentFake(null,
          { body: { html: 'content' } });

        var results = this.results = [];
        return this.docs.getContent("articles/a-valid-article")
        .then(function(result) {
          results.push(result);
        });
      });

      it('resolves the promise with content', function() {
        expect(this.results[0]).to.equal('content');
      });
    });

    describe('and when asking for a non-existing article', function() {
      beforeEach(function() {
        this.docs = new Auth0Docs({
          baseURL: 'http://localhost:9999'
        });

        this.docs._fetcher.request = superagentFake({ statusCode: 404 });

        var errors = this.errors = [];
        return this.docs.getContent("articles/a-non-valid-article")
          .catch(function(error) {
            errors.push(error);
          });
      });

      it('rejects the promise with correct error', function() {
        expect(this.errors[0]).to.have.property('code', 'not-found');
      });
    });
  });

  describe('when path does not belong to articles/*', function() {
    beforeEach(function() {
      this.docs = new Auth0Docs({
        baseURL: 'http://localhost:9999'
      });

      this.docs._fetcher.request = superagentFake(null,
        { body: { html: 'content' } });
    });

    it('throws an exception', function() {
      expect(function () {
        this.docs.getContent("other/not-and-article");
      }).to.throw();
    });
  });

});
