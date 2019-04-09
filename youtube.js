class YouTube{
  Url(url){
    this.url = url;
    return this.verificateUrl();
  }
  verificateUrl(){
    var url = this.url;
    var ID = '';
    url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if(url[2] !== undefined) {
      ID = url[2].split(/[^0-9a-z_\-]/i);
      this.id = ID[0];
      return true;
    }
    else {
      return false;
    }
  }
  async youtubeApiV3(type,parametros){
    var url = "https://www.googleapis.com/youtube/v3/"+type+"?";
    const listaParametros = Object.keys(parametros);
    const qtdParametros = listaParametros.length;
    for(var i =0;i<qtdParametros;i++){
      url += listaParametros[i]+"="+parametros[listaParametros[i]] +"&";
    }
    url += "key=AIzaSyB6_ew7FHttmvF6PKumFU48USX-e2DvrHA";
    return await this.request(url);
  }
  async googleVideo(parametros){
    var url = "https://video.google.com/timedtext?";
    const listaParametros = Object.keys(parametros);
    const qtdParametros = listaParametros.length;
    for(var i = 0;i<qtdParametros;i++){
      url+=listaParametros[i]+"="+parametros[listaParametros[i]]+"&";
    }
    return await this.request(url.slice(0,-1));
  }
  async request(url){
    return await $.get(url);
  }
  async traduzir(text){
    const url = "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20190308T222210Z.e5566cee85b5528e.2cf9c95b00b1f82525b9282bc22effd7f9144e53&text="+text+"&lang=en-pt";
    const result = await this.request(url);
    return result.text[0];
  }
  async legendsData(){
    const parametros = {
      type:"list",
      v:this.id
    };
    const data1 = await this.googleVideo(parametros);
    const qtdLegendas = data1.getElementsByTagName("track").length;
    
    if(qtdLegendas == 0){
      this.legends = null
      return null;
    }
    else{
      const legendas = [];
      for(let i = 0;i<qtdLegendas;i++){
        const legendaXml = data1.getElementsByTagName("track")[i]
        const legenda = {
          id:legendaXml.getAttribute("id"),
          name:legendaXml.getAttribute("name"),
          lang_code:legendaXml.getAttribute("lang_code"),
          lang_name: await this.traduzir(legendaXml.getAttribute("lang_translated"))
        }
        legendas.push(legenda)
      }
      
      this.legends = legendas
      return 
    }
  }
  async VideoData(){
    const parametros = {
      part:"snippet,contentDetails",
      id:this.id
    };
    const data = await this.youtubeApiV3("videos",parametros);
    if(data.items.length != 0){
    return {
      name:(data.items[0]).snippet.title,
      canal:(data.items[0]).snippet.channelTitle,
      time:{
        segundos:  ((data.items[0]).contentDetails.duration).slice(2,-1).split("M")[1],
        minutos:  ((data.items[0]).contentDetails.duration).slice(2,-1).split("M")[0]
      },
      image:(data.items[0]).snippet.thumbnails.maxres.url
    };
    }
    else{
      return null;
    }
  }
}