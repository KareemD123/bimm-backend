/**
 * 
 * The XML Router matches the HTTP method and path to its
 * respective controller function
 * 
 */


var express = require('express');
var router = express.Router();
const XMLController = require('../controller/XMLController') // importing controller functions

/* routes */
router.get('/api/v1/xml-to-json', XMLController.convertXMLtoJSON);


module.exports = router; // exporting router object
