var noble = require('../index');

noble.on('stateChange', function(state) {

  if (state === 'poweredOn') {
    var serviceUUIDs = ["1801"];// ["0000" + "FEAA" + "00001000800000805F9B34FB"]; // default: [] => all
    var allowDuplicates = true; // default: false
    noble.startScanning(serviceUUIDs, allowDuplicates); // particular UUID's
  } else {
    noble.stopScanning();
  }
});


noble.on('discover', function(peripheral) {
  var now = +new Date();
  console.log(peripheral.address + "," + now + "," + peripheral.rssi);
});