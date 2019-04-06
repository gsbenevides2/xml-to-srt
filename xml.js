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
      const hora = duas_casas(Math.round(s/3600));
      const minuto = duas_casas(Math.round((s%3600)/60));
      var segundo = duas_casas((s%3600)%60);
      segundo= segundo+"";
      if(segundo == "00"){
        segundo = "00.000";
      }
      else if(segundo.length > 6){
        segundo = segundo.slice(0,6);
        
      }
      else if(segundo.length < 6){
        var b = 6 - segundo.length;
        for(var i = 0 ;i < b;i++){
          segundo += "0";
        }
      }
      segundo = (segundo.slice(0,segundo.indexOf(".")) + "," + segundo.slice(segundo.indexOf(".") + 1,segundo.length));
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
    var atualPosition = 0;
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