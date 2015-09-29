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
  return new BPromise(_.bind(function(resolve, reject) {
    return this.request
      .get( this._getUrlFor(path) )
      .expiration(this.ttl)
      .end(function(err, res) {
        if (err) {
          return reject(err);
        }

        return resolve(res.body);
      });
  }, this));
};

FetcherService.prototype._getUrlFor = function(path) {
  return this.baseURL + '/' + path;
};

module.exports = FetcherService;

