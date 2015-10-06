"use strict";

var BPromise = require('bluebird');
var superagentCache = require('superagent-cache');
var superagent = require('superagent');
var _ = require('lodash');

function FetcherService(options) {
  this.baseURL = options.baseURL;
  this.ttl = options.ttl;
  superagentCache(superagent, options.cache);
  this.request = superagent;
}

FetcherService.prototype.get = function(path) {
  return this._doRequest(this._getUrlForMeta(path));
};

FetcherService.prototype.getContent = function(path) {
  return this._doRequest(this._getUrlForContent(path))
    .then(function(result) { return result.html; });
};

FetcherService.prototype._doRequest = function(url) {
  return new BPromise(_.bind(function(resolve, reject) {
    var that = this;

    this.request
      .get( url )
      .expiration(this.ttl)
      .once('error', reject)
      .set('Accept', 'application/json')
      .set('Content-type', 'application/json')
      .end(function(err, res) {
        that._handle(resolve, reject, err, res)
      });
  }, this));
};

FetcherService.prototype._handle = function(resolve, reject, err, res) {
  if (err) {
    if (err.statusCode === 404) {
      return reject({ code: 'not-found' });
    }

    return reject(err);
  }

  return resolve(_.cloneDeep(res.body));
};

FetcherService.prototype._getUrlForMeta = function(path) {
  return this.baseURL + '/meta/' + path;
};

FetcherService.prototype._getUrlForContent = function(path) {
  if (path.slice(0, 8) !== 'articles') {
    throw new { code: 'not_valid', message: 'Content request not valid for ' + path };
  }

  return this.baseURL + '/' + path.slice(9);
};

module.exports = FetcherService;

