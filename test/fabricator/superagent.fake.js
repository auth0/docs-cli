module.exports = function(err, response) {
  return {
    get: function() {
      return this;
    },
    expiration: function() {
      return this;
    },
    end: function(cb) {
      cb(err, response);
    },
    once: function() {
      return this;
    },
    set: function() {
      return this;
    }
  };
};
