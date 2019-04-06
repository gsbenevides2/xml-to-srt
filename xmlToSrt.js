function xmlLegendsToString(xml){
  var srt = ""
  var atualPosition = 0
  const items = xml.getElementsByTagName("text")
  for(var i = 0;i<items.length;i++){
    const item = items[i]
    const dur = item.getAttribute("dur")
    if(typeof item.childNodes[0] == "undefined"){
      var text = null
    }
    else{
      var text = item.childNodes[0].nodeValue
    }
    const start = item.getAttribute("start")
    const timeInicial = transforma_magicamente(start)

    const timeFinal = transforma_magicamente(parseFloat(start)+parseFloat(dur))
    if(text == null){
      atualPosition = atualPosition+1
      continue
    }
    const srtTemplante = atualPosition+"\n"+timeInicial+" --> "+timeFinal+"\n"+decodeXml(text)+"\n\n"
    srt += srtTemplante
    atualPosition = atualPosition +1
  }
  srt = srt.slice(0,-1)
  console.log(srt)
}


var escaped_one_to_xml_special_map = {
  '&amp;': '&',
  '&quot;': '"',
  '&lt;': '<',
  '&gt;': '>'
};

function decodeXml(string) {
  return string.replace(/(&quot;|&lt;|&gt;|&amp;)/g,
    function(str, item) {
      return escaped_one_to_xml_special_map[item];
    });
}


function transforma_magicamente(s){
  function doisPonto(numero){
    var numero = numero+""
    var segumdos = (numero.split(".")[0])
    var milesegundos = ((numero.split("."))[1]).slice(0,2)
    return segumdos + ":" + milesegundos
  }
  function duas_casas(numero){
    if (numero <= 9){
      numero = "0"+numero;
    }
    return numero;
  }
  hora = duas_casas(Math.round(s/3600));
  minuto = duas_casas(Math.round((s%3600)/60));
  segundo = duas_casas((s%3600)%60)
  segundo= segundo+"";
  if(segundo == "00"){
    segundo = "00.000"
  }
  else if(segundo.length > 6){
    segundo = segundo.slice(0,6)
    
  }
  else if(segundo.length < 6){
    var b = 6 - segundo.length
    for(var i = 0 ;i < b;i++){
      segundo += "0"
    }
  }
  segundo = (segundo.slice(0,segundo.indexOf("."))+","+segundo.slice(segundo.indexOf(".")+1,segundo.length))
  formatado = hora+":"+minuto+":"+segundo
  return formatado;
}
/*
function transformTime(time){
  
  var segundos = parseFloat(time);
  var loop = true
  var minutos = 0
  var hora
  while(loop){
    if(minutos<60){
      
    }
    if(segundos<0.60){
      loop = false;
    }
    else{
      segundos = segundos-0.60;
      minutos++
    }
  }
  console.log(minutos)
  console.log(segundos)
  console.log(time)
  return null;
}
*/