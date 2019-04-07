
$(document).ready(()=>{
  pageElement = new page()
})
async function Init(){
  var xmlText = await $.ajax("https://video.google.com/timedtext?type=track&v=DXK62DVgNMo&name=CC (English)&lang=en&tlang=pt");
  var xmlElement = new xml(xmlText)
  console.log(xmlElement.toSrt())
}
function Dowload(text){
  var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
  saveAs(blob, "hello world.srt");
}