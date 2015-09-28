"use strict";

var BPromise = require('bluebird');
var superagentCache = require('superagent-cache');

function FetcherService(options) {
  this.baseURL = options.baseURL;
  this.ttl = options.ttl;
  this.request = superagentCache(null, options.cache); 
}

FetcherService.prototype.get = function(path) {
  return new BPromise(function(resolve, reject) {
    return this.request
      .get( this._getUrlFor(path) )
      .expiration(this.ttl)
      .end(function(err, res) {
        if (err) { return reject(err); }

        resolve(res.body);
      });
  }.bind(this));
};

FetcherService.prototype._getUrlFor = function(path) {
    return this.baseURL + '/' + path;
};

module.exports = FetcherService;

