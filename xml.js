class xml{
  constructor(xml){
    this._xml=xml;
  }
  toSrt(){
    function transforma_magicamente(s){
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
    for(var i = 0;i<items.length;i++){
      const item = items[i];
      const dur = item.getAttribute("dur");
      if(typeof item.childNodes[0] == "undefined"){
        var text = null;
      }
      else{
        var text = item.childNodes[0].nodeValue;
      }
      const start = item.getAttribute("start");
      const timeInicial = transforma_magicamente(start);
      const timeFinal = transforma_magicamente(parseFloat(start)+parseFloat(dur));
      if(text == null){
        atualPosition = atualPosition + 1;
        continue;
      }
      const srtTemplante = atualPosition + "\n" + timeInicial + " --> " + timeFinal + "\n" + decodeXml(text) + "\n\n";
      srt += srtTemplante;
      atualPosition = atualPosition + 1;
    }
    srt = srt.slice(0,-1);
    return srt;
  }
}