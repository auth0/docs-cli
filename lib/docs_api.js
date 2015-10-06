"use strict";

var FetcherService = require('./fetcher_service');
var DEFAULT_TTL = 36000; //10 horas
var BPromise = require('bluebird');

function DocAPI (options) {
  options = options || {};

  this._fetcher = new FetcherService({
    baseURL: this._getBaseURL(options.baseURL),
    ttl: options.ttl || DEFAULT_TTL, //Seconds
    cache: options.cache
  });
}

DocAPI.prototype.get = function(path, options) {
  options = options || {};

  if (options.content === true) {
    return this.getMetaWithContent(path);
  }

  return this._fetcher.get(path);
};

DocAPI.prototype.getContent = function(path) {
  return this._fetcher.getContent(path);
};

DocAPI.prototype.getMetaWithContent = function(path) {
  return BPromise.all([ this.get(path), this.getContent(path) ])
    .spread(function(meta, content) {
      meta.content = content;

      return meta;
    });
};

DocAPI.prototype._getBaseURL = function(url) {
  if (!url) {
    return 'https://auth0.com/docs';
  }

  // Just for it to be backwards compatible
  if (url.slice(-5) === "/meta") {
    return url.slice(0, url.length - 5);
  }

  return url;
};

module.exports = DocAPI;
