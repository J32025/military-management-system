
//สำหรับผู้อนุมัติ
function tokenId()  { return SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g").getSheetByName("setting").getRange('A2').getDisplayValue(); }
function tokenId2() { return SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g").getSheetByName("setting").getRange('B2').getDisplayValue(); }

//แจ้งเตือนการจองรถผู้ใช้แจ้งหาผู้อนุมัติ
function sendLineNotifybookingapprove(rank,name_name,car,loca,startDate,endDate,startTime,endTime,drivebook,other,preapporved) {
  // ส่ง line Notify
  var url = "https://notify-api.line.me/api/notify";
  var token = tokenId();
  // var imageUrl = filedata
  var imageUrl = "https://img.freepik.com/free-vector/appointment-booking-with-smartphone_23-2148554313.jpg"

  var message = 'มีการบันทึกข้อมูล'
  +'\nชื่อผู้จอง: '+ rank
  +'\nแผนก: '+ name_name
  +'\nรถที่จอง: '+ car
  +'\nสถานที่ๆไปติดต่อ: '+ loca
  +'\nวันที่เริ่มใช้รถ: '+ startDate
  +'\nเวลาที่เรื่มใช้รถ:' + startTime +'น.'
  +'\nวันที่คืนรถ: '+ endDate
  +'\nเวลาคืนรถ:'+ endTime +'น.'
  +'\nสถานะ: '+ preapporved
  +'\nคนขับ: '+ drivebook
  +'\nอื่นๆ: '+ other
  var headers = {
    "Authorization": "Bearer " + token
  };
  var payload = {
    "message": message,
    "imageThumbnail": imageUrl,
    "imageFullsize": imageUrl
  };
  var options = {
    "method": "post",
    "headers": headers,
    "payload": payload
  };
  UrlFetchApp.fetch(url, options);
    return true;
}

//แจ้งเตือนการจองรถผู้ผู้อนุมัติแจ้งหาผู้ใช้
function sendLineNotifybookinguser(rank,name_name) {
  // ส่ง line Notify
  var url = "https://notify-api.line.me/api/notify";
  var token = tokenId2();
  // var imageUrl = filedata
  var imageUrl = "https://img.freepik.com/free-vector/appointment-booking-with-smartphone_23-2148554313.jpg"

  var message = 'เราได้รับการบันทึกข้อมูล'
  +'\nของคุณ: '+ rank
  +'\nแผนก: '+ name_name + 'เรียบร้อยแล้วเราจะแจ้งให้ท่านทราบเมื่อคำขอของท่านได้รับการอนุมัติ'
 
  var headers = {
    "Authorization": "Bearer " + token
  };
  var payload = {
    "message": message,
    "imageThumbnail": imageUrl,
    "imageFullsize": imageUrl
  };
  var options = {
    "method": "post",
    "headers": headers,
    "payload": payload
  };
  UrlFetchApp.fetch(url, options);
    return true;
}

//แจ้งเตือนผลอนุมัติการจองรถ
function sendLineNotifyapprove(obj) {
  // ส่ง line Notify
  var url = "https://notify-api.line.me/api/notify";
  var token = tokenId2();
  // var imageUrl = filedata
  var imageUrl = "https://cdn-icons-png.flaticon.com/512/4157/4157080.png"

  var message = 'อนุมัติการจองรถ' 
  +'\nชื่อผู้จอง: '+ obj.name_approve
  +'\nแผนก: '+ obj.dep_approve
  +'\nรถที่จอง: '+ obj.car_approve
  +'\nสถานที่ๆไปติดต่อ: '+ obj.loca_approve
  +'\nวันที่เริ่มใช้รถ: '+ obj.startDate_approve
  +'\nเวลาที่เรื่มใช้รถ: '+ obj.startTime_approve  +'น.' 
  +'\nวันที่คืนรถ:' + obj.endDate_approve
  +'\nเวลาคืนรถ:'+ obj.endTime_approve +'น.'
  +'\nคนขับ: '+ obj.drive_approve
  +'\nชื่อผู้อนุมัติ: '+ obj.apporve_approve
  +'\nอื่นๆ: '+ obj.other_approve
  var headers = {
    "Authorization": "Bearer " + token
  };
  var payload = {
    "message": message,
    "imageThumbnail": imageUrl,
    "imageFullsize": imageUrl
  };
  var options = {
    "method": "post",
    "headers": headers,
    "payload": payload
  };
  UrlFetchApp.fetch(url, options);
    return true;
}

//แจ้งรถกำลังถูกใช้งาน
function sendLinemileout(obj) {
  // ส่ง line Notify
var url = "https://notify-api.line.me/api/notify";
  var token = tokenId();


  var message = 'รถกำลังถูกใช้งานโดย' 
  +'\nชื่อผู้จอง: '+ obj.name_mileout
  +'\nแผนก: '+ obj.dep_mileout
  +'\nรถที่กำลังใช้งาน: '+ obj.car_mileout
  +'\nสถานที่ๆไปติดต่อ: '+ obj.loca_mileout
  +'\nวันที่เริ่มใช้รถ: '+ obj.dateout_mileout
  +'\nเวลาที่เรื่มใช้รถ: '+ obj.timeout_mileout  +'น.' 
  +'\nเลขไมล์ออก: '+ obj.mileout_mileout
  +'\nวันที่คืนรถ:' + obj.endDate_mileout
  +'\nเวลาคืนรถ:'+ obj.endTime_mileout +'น.'
  +'\nคนขับ: '+ obj.drive_mileout
  +'\nชื่อผู้อนุมัติ: '+ obj.apporve_mileout
  +'\nอื่นๆ: '+ obj.other_mileout
  var headers = {
    "Authorization": "Bearer " + token
  };
  var payload = {
    "message": message

  };
  var options = {
    "method": "post",
    "headers": headers,
    "payload": payload
  };
  UrlFetchApp.fetch(url, options);
    return true;
}

//แจ้งรถกลับเข้ามา
function sendLinemilein(obj,thaidatemilein) {
  // ส่ง line Notify
var url = "https://notify-api.line.me/api/notify";
  var token = tokenId();


  var message = 'รถกลับเข้ามาแล้วโดย' 
  +'\nชื่อผู้จอง: '+ obj.name_milein
  +'\nแผนก: '+ obj.dep_milein
  +'\nรถที่กลับเข้ามา: '+ obj.car_milein
  +'\nสถานที่ๆไปติดต่อ: '+ obj.loca_milein
  +'\nวันที่เริ่มใช้รถ: '+ obj.dateout_milein
  +'\nเวลาที่เรื่มใช้รถ: '+ obj.timeout_milein  +'น.' 
  +'\nเลขไมล์ออก: '+ obj.mileout_milein
  +'\nวันที่รถเข้ามา:' + thaidatemilein
  +'\nเวลารถเข้ามา:'+ obj.timein_milein +'น.'
  +'\nเลขไมล์เข้า: '+ obj.milein_milein
  +'\nคนขับ: '+ obj.drive_milein
  +'\nชื่อผู้อนุมัติ: '+ obj.apporve_milein
  +'\nอื่นๆ: '+ obj.other_milein
  var headers = {
    "Authorization": "Bearer " + token
  };
  var payload = {
    "message": message

  };
  var options = {
    "method": "post",
    "headers": headers,
    "payload": payload
  };
  UrlFetchApp.fetch(url, options);
    return true;
}

//แจ้งเตือนการยกเลิกจองรถ
function sendLineNotifycancel(obj) {
  // ส่ง line Notify
  var url = "https://notify-api.line.me/api/notify";
  var token = tokenId2();
  // var imageUrl = filedata
  var imageUrl = "https://www.irctcstationcode.com/wp-content/uploads/2014/11/Cancellation-Stamp.jpg"
  var message = 'ยกเลิกการจองรถ' 
  +'\nชื่อผู้จอง: '+ obj.name_cancel
  +'\nแผนก: '+ obj.dep_cancel
  +'\nรถที่จอง: '+ obj.car_cancel
  +'\nสถานที่ๆไปติดต่อ: '+ obj.loca_cancel
  +'\nยกเลิกใช้รถของวันที่: '+ obj.startDate_cancel
  +'\nถึงวันที่:' + obj.endDate_cancel
  +'\nชื่อผู้ยกเลิก: '+ obj.namecancel_car
  +'\nอื่นๆ: '+ obj.other_cancel
  var headers = {
    "Authorization": "Bearer " + token
  };
  var payload = {
    "message": message,
    "imageThumbnail": imageUrl,
    "imageFullsize": imageUrl
  };
  var options = {
    "method": "post",
    "headers": headers,
    "payload": payload
  };
  UrlFetchApp.fetch(url, options);
    return true;
}

//แจ้งเตือนการยกเลิกจองรถ
function sendLineNotifycanceluser(obj) {
  // ส่ง line Notify
  var url = "https://notify-api.line.me/api/notify";
  var token = tokenId2();
  // var imageUrl = filedata
  var imageUrl = "https://www.irctcstationcode.com/wp-content/uploads/2014/11/Cancellation-Stamp.jpg"
  var message = 'ยกเลิกการจองรถ' 
  +'\nชื่อผู้จอง: '+ obj.name_canceluser
  +'\nแผนก: '+ obj.dep_canceluser
  +'\nรถที่จอง: '+ obj.car_canceluser
  +'\nสถานที่ๆไปติดต่อ: '+ obj.loca_canceluser
  +'\nยกเลิกใช้รถของวันที่: '+ obj.startDate_canceluser
  +'\nถึงวันที่:' + obj.endDate_canceluser
  +'\nชื่อผู้ยกเลิก: '+ obj.driver_canceluser
  +'\nอื่นๆ: '+ obj.other_canceluser
  var headers = {
    "Authorization": "Bearer " + token
  };
  var payload = {
    "message": message,
    "imageThumbnail": imageUrl,
    "imageFullsize": imageUrl
  };
  var options = {
    "method": "post",
    "headers": headers,
    "payload": payload
  };
  UrlFetchApp.fetch(url, options);
    return true;
}

//แจ้งเตือนเข้าสู่ระบบ
function sendLineNotifylogin(username , password) {
  // ส่ง line Notify
  var url = "https://notify-api.line.me/api/notify";
  var token = tokenId2();
  // var imageUrl = filedata
  var imageUrl = "https://img.freepik.com/free-vector/appointment-booking-with-smartphone_23-2148554313.jpg"
  
  var message = 'มีการเข้าสู่ระบบ' 

  +'\nusername : '+ username
  +'\npassword : '+ password
  var headers = {
    "Authorization": "Bearer " + token
  };
  var payload = {
    "message": message,
    "imageThumbnail": imageUrl,
    "imageFullsize": imageUrl
  };
  var options = {
    "method": "post",
    "headers": headers,
    "payload": payload
  };
  UrlFetchApp.fetch(url, options);
    return true;
}