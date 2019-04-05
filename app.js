async function Init(){
  const input = await $.ajax("text.xml")
  xml1(input)
}
function xml1(xml){
  var srt = ""
  const items = xml.getElementsByTagName("text")
  for(var i = 10;i<items.length;i++){
    const item = items[i]
    const dur = item.getAttribute("dur")
    if(typeof item.childNodes[0] == "undefined"){
      var text = null
    }
    else{
      var text = item.childNodes[0].nodeValue
    }
    const start = item.getAttribute("start")
    console.log(start)
    console.log(text)
    //const timeInicial = transforma_magicamente(start)
    console.log(start)
    
    break;
  }
}
Init()
/*
function Regra de tres(x1,x2,x3,x4){
  
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
  if(parseFloat(s) > 0){
  hora = duas_casas(Math.round(s/3600));
  minuto = duas_casas(Math.round((s%3600)/60));
  segundo = doisPonto(duas_casas((s%3600)%60))
  }
  else{
    var hora = "00"
    var segundo ="00"
    var minuto = "00"
    
  }
  formatado = hora+":"+minuto+":"+segundo
  return formatado;
}
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
