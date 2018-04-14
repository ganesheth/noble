var noble = require('../index');

noble.on('stateChange', function(state) {

  if(process.argv.length != 7){
    console.log("Usage scanning-statistics-test.js <interval> <window> <type 0=passive 1=active> <expectedTags> <toleranceFactor>");
    return;
  }

  if (state === 'poweredOn') {
    var serviceUUIDs = ["1801"];// ["0000" + "FEAA" + "00001000800000805F9B34FB"]; // default: [] => all
    var allowDuplicates = true; // default: false
    var interval = process.argv[2];
    var window = process.argv[3];
    var type = process.argv[4];    
    expectedTags = process.argv[5];
    toleranceFactor = process.argv[6];
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
var toleranceFactor = 5;


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
  var dt = (end - start);
  console.log("Received " + count + " advs from " + devices.length + " tags in " + dt + "ms. Avg adv per sec=" + (count*1000/dt)); 
});