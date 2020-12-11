const express = require('express');
const network = require('network');
const path = require('path')
//const interface = require('./interface.js');


const app = express();
const router = express.Router();

app.set("view engine", "pug");

// serve files from the directory
process.env.PWD = process.cwd();
app.use(express.static(path.join(process.env.PWD, 'views')));
app.use("/",router);

// start the express web server listening
app.listen(process.env.PORT || 3000,function(){
    console.log("Live at Port 3000");
  });

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get('/', index);




/**************************************************************/

network.get_active_interface(function(err, res) {
    console.log('Active Network Interface --- ');
    console.log(err || res);
  });

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}
  
function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}
  
  /**
   * Retreive the IP addresses of the network interfaces on this device
   */
  function getNetworkInterfaces() {
    return new Promise(
        function (resolve, reject){
 /**
            network.get_interfaces_list(function(err, list) {
                let ipAddresses = [];
                for (var i = 0, len = list.length; i < len; i++) {
                    ipAddresses.push(list[i].ip_address);
                }
                resolve(ipAddresses);
            });
   */
            network.get_active_interface(function(err, list) {
                resolve(list);
            });
        }
    );
  }
  
  // Gets a list of Interfaces
  function index(req, res) {
    return getNetworkInterfaces()
      .then(respondWithResult(res))
      .catch(handleError(res));
  }
