// Variables for 1A
var F = 0;
var FOld = 0;
var yFirst = 0;
var oldYFirst = 0;
var ySecond = 0;
var oldYSecond = 0;
var alfa = 0;
// Variabels for measuring the cadence
var seq = 0;
var NumberOfSamples = 0;
var date = new Date();
var timestamp = date.getTime();
var oldTimestamp = timestamp;

// Variables for 1B
var accRoll = 0;
var gyroRoll = 0;
var comRoll = 0;

function filter(accDataPoint, gyroDataPoint) {
  // Raw data
  let xAccNew = accDataPoint.data.x;
  let yAccNew = accDataPoint.data.y;
  let zAccNew = accDataPoint.data.z;
  let xGyroNew = gyroDataPoint.data.x;
  let yGyroNew = gyroDataPoint.data.y;
  let zGyroNew = gyroDataPoint.data.z;

  // The sampling time is set under the function findPeriodCharacteristic to 52Hz
  let dT = 1 / 52

  /* Tips: 
    * To print on the console use console.log() 
    * To plot a graph u can use the function bellow:    
      * plotOnRedLine(XAccOld);
      * plotOnGreenLine(XAccNew);
      * plotOnBlueLine([varible]);
    * The value of the variable should be inbetween -100 and 100 to fit the canvas
  */


  // Start writing your code below this line 
  // 1A Cadence

  // 1A.1 - Calculate the combined Acceleration 
  // The function to use is Math.sqrt() and Math.pow(g, 2) 
  
  F=Math.sqrt(Math.pow(xAccNew, 2) + Math.pow(yAccNew, 2) +Math.pow(zAccNew, 2)) - 9.81
  let Fdisplay=F*20+170 //Adjusted for graphing purposes
  //plotOnRedLine(Fdisplay)
  // console.log(F)

  // 1A.2  - EWMA Exponential Weighted Moving Average
  
  let alfa1 = 0.5; // try different alfa values and observe the result
   yFirst=alfa1*oldYFirst+(1-alfa1)*Fdisplay
   oldYFirst=yFirst
   //plotOnBlueLine(yFirst)
  
  // 1A.3 - Add an additional EWMA filter with both an alfa and beta value
  let alfa2 = 0.1
  let beta = 0.9

   if (Fdisplay > FOld) {ySecond = alfa2 * oldYSecond + (1 - alfa2) * Fdisplay;}
   else if (Fdisplay < FOld) {ySecond = beta * oldYSecond + (1 - beta) * Fdisplay;}
   else {ySecond = oldYSecond;}
   FOld = Fdisplay;
   //plotOnGreenLine(ySecond);

   
  // 1A.4 Calculate the cadence frequency
  // There is a variable cadence that you can use to make a EWMA filter of the cadence

  NumberOfSamples++

  // Detect when the first EWMA crosses above the second
  if (yFirst > ySecond && oldYFirst <= oldYSecond) {

    date = new Date();
    timestamp = date.getTime();

    if (seq > 0) {
        // Calculate elapsed time using the sampling frequency
        let seconds = NumberOfSamples / 52;

        // Calculate elapsed time using timestamps
        let timestampSeconds = (timestamp - oldTimestamp) / 1000;

        // Calculate cadence
        let cadence = 60 / seconds;

        //console.log(seconds + ' sec between cadence');
        //console.log(cadence + ' cycles/min');
        //console.log(timestampSeconds + ' sec according to timestamps');
        
        oldTimestamp = timestamp;    
    }

    seq++
    NumberOfSamples = 0
  
  }

  // Update previous values after checking for intersections
  oldYFirst = yFirst;
  oldYSecond = ySecond;

  //Load calculation
  //New global variables
  var xAccOld=0
  var yAccOld=0
  var zAccOld=0
  dx=xAccNew - xAccOld
  dy=yAccNew - yAccOld
  dz=zAccNew - zAccOld

  // 1A In depth assignment(optional)
  // Detect if Polar verity sensor is continually shaken for more than 1 second
  
  let L = Math.sqrt(Math.pow(dx,2) 
  +Math.pow(dy,2) 
  +Math.pow(dz,2))
  //console.log(L , "L")
  xAccOld = xAccNew
  yAccOld = yAccNew
  zAccOld = zAccNew

  let threshold = 20
  if (L > threshold) {
    NumberOfSamples++;
    //console.log("Samples:",NumberOfSamples)
  } 
  else {
    NumberOfSamples = 0;
    shakingDetected = false;
  }

  if (NumberOfSamples > 52 && !shakingDetected) {
    //console.log("Shaking detected for more than 1 second!");
    shakingDetected = true;
  }

  // 1B Rotation
  // 1B.1 Calculate the roll from the Accelerometer on the Polar verity and display the result
  
  dT=1/61 // Sample rate of phone recording.
  accRoll = Math.atan(xAccNew / Math.sqrt(Math.pow(yAccNew,2) + Math.pow(zAccNew,2))) * 180 / Math.PI;
  plotOnBlueLine(accRoll);

  // 1B.2 Calculate the roll from the Gyroscope on the Polar verity and display the result 

  gyroRoll=gyroRoll+dT*yGyroNew
  plotOnRedLine(gyroRoll);

  // 1B.3 Apply a Complimenter filter that fuses the Acceleromter and Gyro data, display and compare the result.
  let alfa3=0.5
  comRoll=alfa3*(comRoll+yGyroNew*dT)+(1-alfa3)*accRoll
  //plotOnGreenLine(comRoll);

  // 1B In depth assignment(optional)
  // Write a code that calculates pitch and yaw that also takes the magnetometer for the yaw into account 
  // Or change the complementary filter to a kalman filter
}
