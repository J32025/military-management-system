//ดึงข้อมูลสรุปสถานะมาแสดง
function getSummary() {
  const summary = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g").getSheetByName('สรุปสถานะ')
  const totalpreapproval = summary.getRange('A2').getDisplayValue()
  const totalpreapproval_1 = summary.getRange('A2').getDisplayValue()
  const totalpreapproval_2 = summary.getRange('A2').getDisplayValue()
  const total_approval = summary.getRange('B2').getDisplayValue()
  const total_unapproval = summary.getRange('C2').getDisplayValue()
  const total_cancelbook = summary.getRange('D2').getDisplayValue()


  // Logger.log([
  //   totalpreapproval,
  //   total_approval,
  //   total_unapproval,
  //   total_cancelbook

  // ])

  return [
    totalpreapproval,
    totalpreapproval_1,
    totalpreapproval_2,
    total_approval,
    total_unapproval,
    total_cancelbook


  ]

}
