function user_getdata() {
  var getdatass = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g")
  var getdatasheet = getdatass.getSheetByName("Users")
  var getdatarange = getdatasheet.getDataRange()
  var getdatavalues = getdatarange.getDisplayValues()

  Logger.log(getdatavalues)
  return getdatavalues
}

function car_getdata() {
  var cargetdatass = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g")
  var cargetdatasheet = cargetdatass.getSheetByName("ประเภท")
  var cargetdatarange = cargetdatasheet.getDataRange()
  var cargetdatavalues = cargetdatarange.getDisplayValues()

  Logger.log(cargetdatavalues)
  return cargetdatavalues
}

function drivecar_getdata() {
  var drivecargetdatass = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g")
  var drivecargetdatasheet = drivecargetdatass.getSheetByName("ชื่อคนขับรถ")
  var drivecargetdatarange = drivecargetdatasheet.getDataRange()
  var drivecargetdatavalues = drivecargetdatarange.getDisplayValues()

  Logger.log(drivecargetdatavalues)
  return drivecargetdatavalues
}



function user_Save(user_numiduser,user_nameuser,user_passuser,user_possibilityuser,user_fullnameuser,user_depuser,user_picuser){
  let savess = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g").getSheetByName("Users")
  var savedata = savess.getDataRange().getDisplayValues(); 
  var savedata1 = savess.getDataRange().getValues();
let id = savedata.map(r=>r[0])

if(user_numiduser == ""){

 var maxNum = 0
  savedata1.forEach( r => {
  maxNum = r[0] > maxNum ? r[0] : maxNum
  })
  var user_newIduser = maxNum + 1


 savess.appendRow([user_newIduser,user_nameuser,user_passuser,user_possibilityuser,user_fullnameuser,user_depuser]);
 return true;

}else{

var index = id.indexOf(user_numiduser)

 savess.getRange(index+1,1).setValue(user_numiduser)
savess.getRange(index+1,2).setValue(user_nameuser)
savess.getRange(index+1,3).setValue(user_passuser)
savess.getRange(index+1,4).setValue(user_possibilityuser)
savess.getRange(index+1,5).setValue(user_fullnameuser)
savess.getRange(index+1,6).setValue(user_depuser)




 return true;

}
  } 


function car_Save(car_numid,car_name){
  let carsavess = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g").getSheetByName("ประเภท")
  var carsavedata = carsavess.getDataRange().getDisplayValues(); 
  var carsavedata1 = carsavess.getDataRange().getValues();
let id = carsavedata.map(r=>r[0])

if(car_numid == ""){

 var maxNum = 0
  carsavedata1.forEach( r => {
  maxNum = r[0] > maxNum ? r[0] : maxNum
  })
  var car_newId = maxNum + 1


 carsavess.appendRow([car_newId,car_name]);
 return true;

}else{

var index = id.indexOf(car_numid)

 carsavess.getRange(index+1,1).setValue(car_numid)
carsavess.getRange(index+1,2).setValue(car_name)


 return true;

}
  } 

function drivecar_Save(drivecar_numid,drivecar_name){
  let drivecarsavess = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g").getSheetByName("ชื่อคนขับรถ")
  var drivecarsavedata = drivecarsavess.getDataRange().getDisplayValues(); 
  var drivecarsavedata1 = drivecarsavess.getDataRange().getValues();
let id = drivecarsavedata.map(r=>r[0])

if(drivecar_numid == ""){

 var maxNum = 0
  drivecarsavedata1.forEach( r => {
  maxNum = r[0] > maxNum ? r[0] : maxNum
  })
  var drivecar_newId = maxNum + 1


 drivecarsavess.appendRow([drivecar_newId,drivecar_name]);
 return true;

}else{

var index = id.indexOf(drivecar_numid)

 drivecarsavess.getRange(index+1,1).setValue(drivecar_numid)
drivecarsavess.getRange(index+1,2).setValue(drivecar_name)


 return true;

}
  } 


 



function user_delData(record){
   let delss = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g").getSheetByName("Users")
   var deldata = delss.getDataRange().getDisplayValues(); 
   let id = deldata.map(r=>r[0])
   var index = id.indexOf(record)
   delss.deleteRow(index+1)  
  }

  function car_delData(record){
   let carss = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g").getSheetByName("ประเภท")
   var cardata = carss.getDataRange().getDisplayValues(); 
   let id = cardata.map(r=>r[0])
   var index = id.indexOf(record)
   carss.deleteRow(index+1)  
  }

  function drivecar_delData(record){
   let drivecardelss = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g").getSheetByName("ชื่อคนขับรถ")
   var drivecardeldata = drivecardelss.getDataRange().getDisplayValues(); 
   let id = drivecardeldata.map(r=>r[0])
   var index = id.indexOf(record)
   drivecardelss.deleteRow(index+1)  
  }

