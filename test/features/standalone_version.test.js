var expect = require('chai').expect;
var _ = require('lodash');

describe('Loading the library', function() {

  describe('when AMD is not available', function() {

    beforeEach(function() {
      delete require.cache;

      require('../../standalone');
    });

    afterEach(function() {
      delete global.Auth0Docs;
    });

    it ('exposes global module', function() {
      expect(global.Auth0Docs).to.be.a.function;
    });

  });

});
