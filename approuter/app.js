const approuter = require('@sap/approuter');
const ar = approuter();

ar.beforeRequestHandler.use('/backend', function (req, res, next) {
  if (req.headers['x-sap-authorization']) {
    req.headers['authorization'] = req.headers['x-sap-authorization'];
  }
  next();
});

ar.start();
