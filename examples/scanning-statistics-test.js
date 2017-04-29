var noble = require('../index');

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    process.argv.forEach(function (val, index, array) {
      console.log(index + ': ' + val);
    });
    //noble.startScanning();
    var serviceUUIDs = ["feaa"];// ["0000" + "FEAA" + "00001000800000805F9B34FB"]; // default: [] => all
    var allowDuplicates = true; // default: false
    var interval = process.argv[2];
    var window = process.argv[3];
    //var t = process.argv[4];
    console.log("Scanning for " + serviceUUIDs[0] + " using ScanInterval=" + interval + " ScaWindow=" + window + " (cycle=" + (window/interval) + ")");
	  N++;
    noble.overrideScanParameters(0x10, 0x10, 0x01);
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


noble.on('discover', function(peripheral) {
  if(count == 0){
	start = +new Date();
  }
  count++;
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

  var has = false;
  devices.forEach(function(value){ 
		if(value == peripheral.address){
			has = true;
		}	
	});

	if(!has)
		devices.push(peripheral.address);
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
  var end = +new Date();
  //console.log(count + "in time: " + (end-start) + " milliseconds. So far " + devices.length + " uniques");
  //console.log();
  if(devices.length >= 9){
	noble.stopScanning();
	avgTotal += (end - start);
	var avg = avgTotal / N;
	console.log("At " + N + " Avg=" + avg);
	//console.log("Scanning stopped");
	//console.log("Average interval = " + ((end-start)/count));
	/*
	devices.forEach(function(value){ 
		console.log(value);
	});
	*/
	//console.log("Restart scanning");    
	var serviceUUIDs = ["feaa"];// ["0000" + "FEAA" + "00001000800000805F9B34FB"]; // default: [] => all
    var allowDuplicates = true; // default: false
	N++;
    noble.startScanning(serviceUUIDs, allowDuplicates); // particular UUID's
    start = +new Date();
	devices = [];
  }
});

