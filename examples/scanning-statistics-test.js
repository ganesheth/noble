var noble = require('../index');

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    var serviceUUIDs = ["feaa"];// ["0000" + "FEAA" + "00001000800000805F9B34FB"]; // default: [] => all
    var allowDuplicates = false; // default: false
    var interval = process.argv[2];
    var window = process.argv[3];
    var type = process.argv[4];
    expectedTags = process.argv[5];
    console.log("Scanning for 0x" + serviceUUIDs[0] + " using ScanInterval=" + interval + " ScaWindow=" + window + " (cycle=" + (window/interval) + ") Expected tags=" + expectedTags);
	  N++;
    noble.overrideScanParameters(interval, window, type);
    noble.startScanning(serviceUUIDs, allowDuplicates); // particular UUID's
    start = +new Date();
  } else {
    noble.stopScanning();
  }
});

var count = 0;
var start;
var devices = [];
var N = 0;
var avgTotal = 0;
var expectedTags = 10;
var outlierCount = 0;
var avg = 0;


noble.on('discover', function(peripheral) {
  if(count == 0){
	start = +new Date();
  }
  count++;

  var has = false;
  devices.forEach(function(value){ 
		if(value == peripheral.address){
			has = true;
		}	
	});

	if(!has)
		devices.push(peripheral.address);

  var end = +new Date();
  if(devices.length >= expectedTags){
    noble.stopScanning();
    var dt = (end - start);
    var rejected = false;
    if(N > 4 && dt > (2 * avg)){
      rejected = true;
      outlierCount++;
    }
    else {
      avgTotal += dt;
      avg = avgTotal / N;
      N++;
    }
    console.log("At " + N + " t=" +  dt + "ms Avg=" + avg + "ms" + " outlier:" + rejected + "(" + outlierCount+ ")");   
    var serviceUUIDs = ["feaa"];// ["0000" + "FEAA" + "00001000800000805F9B34FB"]; // default: [] => all
    var allowDuplicates = true; // default: false
    noble.startScanning(serviceUUIDs, allowDuplicates); // particular UUID's
    start = +new Date();
    devices = [];
  }
});

//--------------------------------------------------------- OLD STUFF -----------------------------------------------------------------------------
    /*
    process.argv.forEach(function (val, index, array) {
      console.log(index + ': ' + val);
    });
    */

  /*
  console.log('peripheral discovered (' + peripheral.id +
              ' with address <' + peripheral.address +  ', ' + peripheral.addressType + '>,' +
              ' connectable ' + peripheral.connectable + ',' +
              ' RSSI ' + peripheral.rssi + ':');
*/
//  console.log('\thello my local name is:');
//  console.log('\t\t' + peripheral.advertisement.localName);
//  console.log('\tcan I interest you in any of the following advertised services:');
//  console.log('\t\t' + JSON.stringify(peripheral.advertisement.serviceUuids));


/*	
  var serviceData = peripheral.advertisement.serviceData;
  if (serviceData && serviceData.length) {
    console.log('\there is my service data:');
    for (var i in serviceData) {
      console.log('\t\t' + JSON.stringify(serviceData[i].uuid) + ': ' + JSON.stringify(serviceData[i].data.toString('hex')));
   }
  }
*/
//  if (peripheral.advertisement.manufacturerData) {
//    console.log('\there is my manufacturer data:');
//    console.log('\t\t' + JSON.stringify(peripheral.advertisement.manufacturerData.toString('hex')));
//  }
//  if (peripheral.advertisement.txPowerLevel !== undefined) {
//    console.log('\tmy TX power level is:');
//    console.log('\t\t' + peripheral.advertisement.txPowerLevel);
//  }

//  console.log('So far ' + count + ' discovered');

    //console.log("Scanning stopped");
    //console.log("Average interval = " + ((end-start)/count));
    /*
    devices.forEach(function(value){ 
    console.log(value);
    });
    */
    //console.log("Restart scanning"); 

