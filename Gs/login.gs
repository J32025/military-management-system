function authenticateUser(username, password) {
  try {
    if (isUserInVipSheet(username, password)) {
      // sendLineNotifylogin(username, password);
      return getVipUserData(username, password);
    }

    // If user is not in VIP sheet, proceed with other conditions
    var data = { username, password };
    var options = { method: 'post', contentType: 'application/json', payload: JSON.stringify(data) };

    // var response = UrlFetchApp.fetch('https://djangotest2.rtaf.mi.th/api-auth-token/', options);
    var response = UrlFetchApp.fetch('https://api-pft.rtaf.mi.th/api-auth-token/', options);

    if (response.getResponseCode() == 200) {
      var responseData = JSON.parse(response.getContentText());
      isDataExist(username) ? appendToSheet(username, password, responseData) : saveregister(username, password, responseData);

      var sheet = SpreadsheetApp.getActive().getSheetByName("Users");
      var data = sheet.getDataRange().getValues();
      let row = data.findIndex(r => r[1] == username);

      if (row != -1) {
        let res = sheet.getRange(row + 1, 1, 1, 7).getDisplayValues();
        // sendLineNotifylogin(username, password); // ถ้าพบผู้ใช้ ให้เรียกใช้ sendLineNotifylogin
        return res;
      }
    } else {
      Logger.log('Authentication failed. Status code: ' + response.getResponseCode());
      return null;
    }
  } catch (error) {
    Logger.log('Error calling authentication API: ' + error);
    return null;
  }
}


function isDataExist(username) {
  var sheet = SpreadsheetApp.getActive().getSheetByName("Users");
  return sheet.getDataRange().getValues().some(row => row[1] == username);
}

function appendToSheet(username, password, data) {
  var sheet = SpreadsheetApp.getActive().getSheetByName('Log');
  var rowData = [new Date(), username, password , ...Object.values(data)];
  sheet.appendRow(rowData);
}

function saveregister(username, password, data) {
  var data1 = SpreadsheetApp.getActive().getSheetByName("Users");
  // var uniqueIds = data1.getRange(1, 1, data1.getLastRow(), 1).getValues().flat();
  // var newId = uniqueIds.length > 0 ? Math.max(...uniqueIds) + 1 : 1;
  data1.appendRow([
                      "", 
                      username, 
                      password, 
                      "general", 
                      // ...Object.values(data).slice(1, 10), data.token]);
                      // data.af_id,   
                      data.full_name,
                      data.position,
                      // "",
                      // data.sex,
                      // data.birthday,
                      // data.age,          
                      // data.token,
]);
}

function isUserInVipSheet(username, password) {
  var vipSheet = SpreadsheetApp.getActive().getSheetByName("vip");
  var vipData = vipSheet.getDataRange().getValues();
  return vipData.some(row => row[1] == username && row[2] == password);
}

function getVipUserData(username, password) {
  var vipSheet = SpreadsheetApp.getActive().getSheetByName("vip");
  var vipData = vipSheet.getDataRange().getValues();
  var row = vipData.findIndex(r => r[1] == username && r[2] == password);

  if (row !== -1) {
    return vipSheet.getRange(row + 1, 1, 1, 7).getDisplayValues();
  } else {
    return null;
  }
}

// function checkLogin(obj) {
//   let sheet = SpreadsheetApp.getActive().getSheetByName('Users');
//   let data = sheet.getDataRange().getDisplayValues()
//   let row = data.findIndex(r => r[1] == obj.username && r[2] == obj.password)
//   if(row == -1){
//       return
//   }else{
//     let res = sheet.getRange(row+1,1,1,7).getDisplayValues()
//   return res
//   }
// }

// function saveregister(obj){
//   var setidfolder = SpreadsheetApp.getActive().getSheetByName("setting").getRange('C2').getDisplayValue()
//   var data = SpreadsheetApp.getActive().getSheetByName("Users")
//   folder = DriveApp.getFolderById(setidfolder)// ไอดีfolder 1

//   var image = folder.createFile(obj.file).getId()
//   var linkprofile = "https://lh3.googleusercontent.com/d/" + image
   
//    //สร้างลำดับอัตโนมัติ
//   const uniqueIds = data.getRange(1,1,data.getLastRow(),1).getValues()
//   var maxNum = 0
//   uniqueIds.forEach( r => {
//     maxNum = r[0] > maxNum ? r[0] : maxNum
//   })
//   // Logger.log(maxNum)
//   var newId = maxNum + 1
//   data.appendRow([
//     newId,
//     obj.regis_username,
//     obj.regis_password,
//     "user",
//     obj.regis_fullname,
//     obj.regis_dept,
//     linkprofile, // ดึงค่าตัวแปรมาใส่
//   ])

// }

// //เช็คค่าซ้ำ!!
// function doublecheckID(userlogin){
// const sheet = SpreadsheetApp.getActive().getSheetByName('Users');
//   const ws = sheet.getRange("B2:B").getValues().join().split(",");  //กรณีตรวจสอบทั้ง Colum
//   var myId = ws.indexOf(userlogin);
//   if (myId > -1){
//     return userlogin;
//   } else {
//     return "unavailable";
//   }
// }

// //เช็คค่าซ้ำ!!
// function doublecheckIDname(nameuserlogin){
// const sheet = SpreadsheetApp.getActive().getSheetByName('Users');
//   const ws = sheet.getRange("E2:E").getValues().join().split(",");  //กรณีตรวจสอบทั้ง Colum
//   var myIdname = ws.indexOf(nameuserlogin);
//   if (myIdname > -1){
//     return nameuserlogin;
//   } else {
//     return "unavailable";
//   }
// }

//เปลี่ยนรหัสผ่าน
function resetPassword(uname, newpassword) {
  let sheet = SpreadsheetApp.getActive().getSheetByName('Users');
  let rows = sheet.createTextFinder(uname).findAll();
  if (rows.length > 0) {
    let firstRow = rows[0].getRow();
    let cell = sheet.getRange(firstRow, 3);
    cell.setValue(newpassword);
  }
  return true;
}

function loginCheckip(username ,ipAddress, userAgent) {
  
    var user = {
      username: username,
      ipAddress: ipAddress,
      userAgent: userAgent

    };

    writeToSheet(user);

    return user;
   
}

function writeToSheet(data) {
  var ss = SpreadsheetApp.getActive().getSheetByName('Logip')

  // รับข้อมูลจาก HTML
  var time = new Date();
  var username = data.username;
  var ipAddress = data.ipAddress;
  var userAgent = data.userAgent;

  // เพิ่มข้อมูลลงในแถวใหม่ของ Google Sheets
  ss.appendRow([ time ,username , ipAddress , userAgent]);
}