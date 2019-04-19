class xml{
  constructor(xml){
    this._xml=xml;
  }
  /*
  XMLToString(){
    const oXML = this._xml;
    if (window.ActiveXObject) {
      var oString = oXML.xml; return oString;
    }
    else {
      return (new XMLSerializer()).serializeToString(oXML);
    }
  }
  
  toSrtAdvanced(){
    function striptags(html){
      var div = document.createElement("div");
      div.innerHTML = html;
      return  div.textContent || div.innerText || "";
    }
    const transcript = thisXMLToString();
    const lines = transcript
      .replace('<?xml version="1.0" encoding="utf-8" ?><transcript>', '')
      .replace('</transcript>', '')
      .split('</text>')
      .filter(line => line && line.trim())
      .map(line => {
        const startRegex = /start="([\d.]+)"/;
        const durRegex = /dur="([\d.]+)"/;
        
        const [, start] = startRegex.exec(line);
        const [, dur] = durRegex.exec(line);
        
        const htmlText = line
          .replace(/<text.+>/, '')
          .replace(/&/gi, '&')
          .replace(/<\/?[^>]+(>|$)/g, '');
        
        const decodedText = he.decode(htmlText);
        const text = striptags(decodedText);
        
        console.log( {
          start,
          dur,
          text,
        });
      });
  }
  */
  transforma_magicamente(s){
    function duas_casas(numero){
      if (numero <= 9){
        numero = "0" + numero;
      }
      return numero;
    }
    const minutos = parseInt(s/60);
    const hora = duas_casas(parseInt(s/3600));
    const minuto = duas_casas(minutos - (60*hora));
    var segundo = (s - (60*minutos))+"";
    if(segundo== "0"){
      segundo = "00.000";
    }
    
    var segundoArray = segundo.split(".");
    segundoArray[0]= duas_casas(segundoArray[0]);
    if(segundoArray.length == 1){
      segundoArray.push("000");
    }
    else if(segundoArray[1].length > 3){
      segundoArray[1] = segundoArray[1].slice(0,3);
      
    }
    else if(segundoArray[1].length < 6){
      var b = 3 - segundoArray[1].length;
      for(var i = 0 ;i < b;i++){
        segundoArray[1] += "0";
      }
    }
    //
    segundo = segundoArray.join(",");
    const formatado = hora + ":" + minuto + ":" + segundo;
    return formatado;
  }
  toSrt(){
    function decodeXml(string) {
      const escaped_one_to_xml_special_map = {
        '&amp;': '&',
        '&quot;': '"',
        '&lt;': '<',
        '&gt;': '>'
      };
      return string.replace(/(&quot;|&lt;|&gt;|&amp;)/g,
        function(str, item) {
          return escaped_one_to_xml_special_map[item];
        });
    }
    var srt = "";
    var atualPosition = 1;
    const items = this._xml.getElementsByTagName("text");
    for(var i = 10;i<items.length;i++){
      const item = items[i];
      const dur = item.getAttribute("dur");
      if(typeof item.childNodes[0] == "undefined"){
        var text = null;
      }
      else{
        var text = item.childNodes[0].nodeValue;
      }
      const start = item.getAttribute("start");
      const timeInicial = this.transforma_magicamente(start);
      const timeFinal = this.transforma_magicamente(parseFloat(start)+parseFloat(dur));
      if(text == null){
        atualPosition = atualPosition + 1;
        continue;
      }
      const srtTemplante = atualPosition + "\n" + timeInicial + " --> " + timeFinal + "\n" + decodeXml(text) + "\n\n";
      srt += srtTemplante;
      break;
      atualPosition = atualPosition + 1;
    }
    srt = srt.slice(0,-1);
    return srt;
  }
}