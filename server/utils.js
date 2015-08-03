module.exports.REGEX = {
  ISO_DATE: new RegExp(/^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)$/)
};

module.exports.ACTION = {
  'CLAIM': 'CLAIM',
  'CANCEL': 'CANCEL',
  'UNTROLL': 'UNTROLL',
  'TROLLTOLL': 'TROLLTOLL'
};

module.exports.makeIPLog = function(ip, reason) {
  var timestamp = new Date();
  var log = {
    timestamp: timestamp.toISOString(),
    ip: ip,
    reason: reason
  };
  return JSON.stringify(log);
};
