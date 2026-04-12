function getPersonData() {
  try {
    // 1. เชื่อมต่อกับ Google Sheets ที่เก็บข้อมูลperson
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetPersonnel = ss.getSheetByName("All_Data_M"); // เปลี่ยนชื่อตามชีทข้อมูลของคุณ

    if (!sheetPersonnel) {
      throw new Error("ไม่พบข้อมูล");
    }

    // 2. ดึงข้อมูลทั้งหมดจากชีท
    const dataRange = sheetPersonnel.getDataRange();
    const values = dataRange.getValues();

    // ข้ามแถวหัวตาราง
    const headers = values[0];
    const data = values.slice(1);

    // 3. นับจำนวนpersonทั้งหมด
    const totalEmployees = data.length;

    // 4. นับตำแหน่งที่ว่าง (สมมติว่ามีคอลัมน์ "สถานะ" ที่มีค่า "ว่าง")
    // หาดัชนีคอลัมน์สถานะ
    const statusIndex = headers.indexOf("สถานภาพ");
    let statusCounts = {
      "ว่าง": 0,
      "ทำหน้าที่โดย ต.": 0,
      "บรรจุจริง": 0,
      "ประจำ": 0,
      "รรก.": 0,
      "ปิด": 0
    };

    if (statusIndex !== -1) {
      data.forEach(row => {
        const status = row[statusIndex];
        if (statusCounts.hasOwnProperty(status)) {
          statusCounts[status]++;
        }
      });
    }

    // 5. ส่งคืนผลลัพธ์
    return {
      totalEmployees: totalEmployees,
      vacancies: statusCounts["ว่าง"],
      acting: statusCounts["ทำหน้าที่โดย ต."],
      permanent: statusCounts["บรรจุจริง"],
      regular: statusCounts["ประจำ"],
      retiring: statusCounts["รรก."],
      closed: statusCounts["ปิด"]
    };

  } catch (error) {
    // จัดการข้อผิดพลาด
    Logger.log("เกิดข้อผิดพลาด: " + error.message);
    return {
      totalEmployees: 0,
      vacancies: 0,
      acting: 0,
      permanent: 0,
      regular: 0,
      retiring: 0,
      closed: 0,
      error: error.message
    };
  }
}

function getPersonData_2() {
  try {
    // 1. เชื่อมต่อกับ Google Sheets ที่เก็บข้อมูลperson
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetPersonnel = ss.getSheetByName("All_Data_B_Requir"); // เปลี่ยนชื่อตามชีทข้อมูลของคุณ

    if (!sheetPersonnel) {
      throw new Error("ไม่พบข้อมูล");
    }

    // 2. ดึงข้อมูลทั้งหมดจากชีท
    const dataRange = sheetPersonnel.getDataRange();
    const values = dataRange.getValues();

    // ข้ามแถวหัวตาราง
    const headers = values[0];
    const data = values.slice(1);

    // 3. นับจำนวนpersonทั้งหมด
    const totalEmployees = data.length;

    // 4. นับตำแหน่งที่ว่าง (สมมติว่ามีคอลัมน์ "สถานะ" ที่มีค่า "ว่าง")
    // หาดัชนีคอลัมน์สถานะ
    const statusIndex = headers.indexOf("สถานะ");
    let statusCounts = {
      "สัญญาบัตร": 0,
      "ประทวน": 0,
      "พนักงานราชการ": 0
    };

    if (statusIndex !== -1) {
      data.forEach(row => {
        const status = row[statusIndex];
        if (statusCounts.hasOwnProperty(status)) {
          statusCounts[status]++;
        }
      });
    }

    // 5. ส่งคืนผลลัพธ์
    return {
      totalEmployees: totalEmployees,
      contract: statusCounts["สัญญาบัตร"],
      intern: statusCounts["ประทวน"],
      civilServant: statusCounts["พนักงานราชการ"]
    };

  } catch (error) {
    // จัดการข้อผิดพลาด
    Logger.log("เกิดข้อผิดพลาด: " + error.message);
    return {
      totalEmployees: 0,
      contract: 0,
      intern: 0,
      civilServant: 0,
      error: error.message
    };
  }
}

function getPersonData_3() {
  try {
    // 1. เปิด Spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("All_Data_B_Requir"); // เปลี่ยนชื่อตามชีทข้อมูลของคุณ
    
    // 2. ดึงข้อมูลจากชีต
    const dataRange = sheet.getDataRange();
    const dataValues = dataRange.getValues();
    const headers = dataValues[0];
    
    // 3. แปลงข้อมูลเป็นออบเจ็กต์บุคคล
    const persons = [];
    for (let i = 1; i < dataValues.length; i++) {
      const row = dataValues[i];
      const person = {};
      
      // แปลงแต่ละคอลัมน์ตามหัวข้อ
      headers.forEach((header, index) => {
        // แปลงชื่อหัวข้อให้เป็น camelCase หรือตามที่คุณต้องการ
        const key = header
          .toLowerCase()
          .replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
          .replace(/\s/g, '')
          .replace(/^(.)/, function($1) { return $1.toLowerCase(); });
        
        person[key] = row[index];
      });
      
      persons.push(person);
    }
    
    // 4. คืนค่าข้อมูล
    return persons;
    
  } catch (error) {
    console.error('Error in getPersonData_3:', error);
    throw error; // ส่งข้อผิดพลาดไปยังฝั่งคลายเอนต์
  }
}

// function getChartDatapersonAll() {
  
//   const ss = SpreadsheetApp.getActiveSpreadsheet();
//   const sheet = ss.getSheetByName("All_Data_M"); // ชื่อ sheet ที่เก็บข้อมูล
//   const data = sheet.getDataRange().getValues();

//   const labels = [];
//   const actual = [];
//   const vacant = [];

//   // ข้ามแถวหัวข้อ (index 0)
//   data.slice(1).forEach(row => {
//     labels.push(row[15]);     // ระดับ
//     actual.push(row[16]);     // บรรจุจริง
//     vacant.push(row[17]);     // อัตราว่าง
//   });

//   return { labels, datasets: [
//     {
//       label: 'บรรจุจริง',
//       data: actual,
//       backgroundColor: 'rgba(0, 51, 102, 0.7)',
//       borderColor: 'rgba(0, 51, 102, 1)',
//       borderWidth: 1,
//       borderRadius: 5
//     },
//     {
//       label: 'อัตราว่าง',
//       data: vacant,
//       backgroundColor: 'rgba(76, 175, 80, 0.7)',
//       borderColor: 'rgba(76, 175, 80, 1)',
//       borderWidth: 1,
//       borderRadius: 5
//     }
//   ]};
// }

function getChartDataPersonnel() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  console.log("Spreadsheet:", ss.getName());
  
  const sheet = ss.getSheetByName("All_Data_M_Report");
  console.log("Sheet found:", sheet ? "Yes" : "No");
  
  const data = sheet.getDataRange().getValues();
  console.log("Total rows:", data.length);
  console.log("Total columns:", data[0] ? data[0].length : 0);
  console.log("Raw data sample (first 3 rows):", data.slice(0, 3));

  const labels = [];
  const actual = [];
  const vacant = [];

  // ข้ามแถวหัวข้อ
  data.slice(1).forEach((row, index) => {
    console.log(`Row ${index + 1}:`, row);
    console.log(`  - Label (column 1):`, row[1]);
    console.log(`  - Actual (column 2):`, row[2]);
    console.log(`  - Vacant (column 3):`, row[3]);
    
    labels.push(row[1]);     // ระดับ
    actual.push(row[2]);     // บรรจุจริง
    vacant.push(row[3]);     // อัตราว่าง
  });

  console.log("Processed labels:", labels);
  console.log("Processed actual values:", actual);
  console.log("Processed vacant values:", vacant);

  const result = {
    labels,
    datasets: [
      {
        label: 'บรรจุจริง',
        data: actual,
        backgroundColor: 'rgba(0, 51, 102, 0.7)',
        borderColor: 'rgba(0, 51, 102, 1)',
        borderWidth: 1,
        borderRadius: 5
      },
      {
        label: 'อัตราว่าง',
        data: vacant,
        backgroundColor: 'rgba(76, 175, 80, 0.7)',
        borderColor: 'rgba(76, 175, 80, 1)',
        borderWidth: 1,
        borderRadius: 5
      }
    ]
  };

  console.log("Final result:", result);
  return result;
}