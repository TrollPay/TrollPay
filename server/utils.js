module.exports.makeIPLog = function(ip, reason) {
  var timestamp = new Date();
  var log = {
    timestamp: timestamp.toISOString(),
    ip: ip,
    reason: reason
  };
  return JSON.stringify(log);
};
