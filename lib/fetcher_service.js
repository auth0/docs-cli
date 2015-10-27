"use strict";

var BPromise = require('bluebird');
var superagentCache = require('superagent-cache');
var superagent = require('superagent');
var _ = require('lodash');
var url = require('url');
var uPath = require('path');

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

FetcherService.prototype.clearCache = function() {
  return new Promise(_.bind(function(resolve, reject) {
    this.request.cache.flush(_.bind(function(err, data) {
      if (err) { return reject(err); }

      resolve(data);
    }, this));
  }, this));
};

FetcherService.prototype._doRequest = function(url) {
  return new BPromise(_.bind(function(resolve, reject) {
    var that = this;

    var req = this.request
      .get( url );

    // WORKAROUND: https://github.com/visionmedia/superagent/issues/741
    req._callback = function() {};

    req.expiration(this.ttl)
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
  path = this._preparePath(path);

  return this.baseURL + '/meta/' + path;
};

FetcherService.prototype._getUrlForContent = function(path) {
  path = this._preparePath(path);

  if (path.slice(0, 8) === 'articles') {
    path = path.slice(9);
  }

  return this.baseURL + '/' + path;
};

FetcherService.prototype._preparePath = function(path) {
  var pathObj = url.parse(path);

  // If path is not a full URL
  if (!pathObj.hostname) { return path; }

  var basePathObj = url.parse(this.baseURL);

  // SECURITY CHECKING: If the url does not belong to the same host
  if (pathObj.hostname !== basePathObj.hostname) {
    throw { code: 'invalid_host', message: 'base hostname does not match path hostname' };
  }

  var basePath;

  path = pathObj.pathname;

  if (basePathObj.pathname !== '/' && basePathObj.pathname !== '') {
    var basePath = basePathObj.pathname;

    path = path.split('/').slice(basePath.split('/').length).join('/')
  }

  return path;
};

module.exports = FetcherService;
