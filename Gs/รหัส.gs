
function doGet(e) {
  // var formData = e.parameter.data;
  
  // // Do something with the form data, for example, log it
  // console.log("Form Data: " + formData);

  return HtmlService.createTemplateFromFile('Admin/index').evaluate()
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setTitle('กกล.ยก.ทหาร บก.ทท.')
    .setFaviconUrl('https://img2.pic.in.th/pic/Untitled-designa64a7773ec4d81e9.png')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
}


/** @Get URL */
function getURL() {
  // return ScriptApp.getService().getUrl();
  return "https://j3-centerdivision.glitch.me/"
  

}









