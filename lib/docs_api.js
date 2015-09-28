"use strict";

var FetcherService = require('./fetcher_service');
var DEFAULT_TTL = 2000;

function DocAPI (options) {
  options = options || {};

  this._fetcher = new FetcherService({ 
    baseURL: options.baseURL || 'https://auth0.com/docs/meta',
    ttl: options.ttl || DEFAULT_TTL, //Seconds
    cache: options.cache
  });
}

DocAPI.prototype.get = function(path) {
  return this._fetcher.get(path);
};

module.exports = DocAPI;