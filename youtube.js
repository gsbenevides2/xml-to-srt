class YouTube{
  constructor(page){
    this.page = page;
  }
  Url(url){
    this.tabelaList = null;
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
    var url = "https://www.googleapis.com/youtube/v/"+type+"?";
    const listaParametros = Object.keys(parametros);
    const qtdParametros = listaParametros.length;
    for(var i =0;i<qtdParametros;i++){
      url += listaParametros[i]+"="+parametros[listaParametros[i]] +"&";
    }
    url += "key=AIzaSyBII7L44auzJSKZbYoJ3YwGFKMcjoIvaDI";
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
    return await $.get(url,(data)=>data).fail(async (error)=>{
      if(error.status == 404){
        this.page.error(404)
      }
      else{
        if(error.status == 0){
          this.page.error(0)
        }
        this.requestQtd = this.requestQtd+1
        return await this.request(url)
      }
    });
  }
  async traduzir(text){
    const url = "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20190308T222210Z.e5566cee85b5528e.2cf9c95b00b1f82525b9282bc22effd7f9144e53&text="+text+"&lang=en-pt";
    const result = await this.request(url);
    return result.text[0];
  }
  async tabela(text){
    if(this.tabelaList == null){
      this.tabelaList = await $.getJSON("https://raw.githubusercontent.com/gsbenevides2/xml-to-srt/development/languages.json");
    }
    if(this.tabelaList.targets.indexOf(text)>=0){
      return (this.tabelaList.targetsTranslate[this.tabelaList.targets.indexOf(text)]);
    }
    else{
      return await this.traduzir(text);
    }
  }
  async legendsData(){
    const parametros = {
      type:"list",
      v:this.id,
      tlangs:1
    };
    const data1 = await this.googleVideo(parametros);
    const legendas = [];
    const qtdLegendas = data1.getElementsByTagName("track").length;
    const traducoes = [];
    const qtdTraducoes = data1.getElementsByTagName("target").length;
    if(qtdLegendas == 0){
      this.legends = null;
      this.traducoes = null;
      return null;
    }
    else{
      for(let i = 0;i<qtdLegendas;i++){
        const legendaXml = data1.getElementsByTagName("track")[i];
        const legenda = {
          id:legendaXml.getAttribute("id"),
          name:legendaXml.getAttribute("name"),
          lang_code:legendaXml.getAttribute("lang_code"),
          lang_name: await this.tabela(legendaXml.getAttribute("lang_translated"))
        }
        legendas.push(legenda);
      }
      if(qtdTraducoes > 0){
        for(let i = 0;i<qtdTraducoes;i++){
          const traducaoXml = data1.getElementsByTagName("target")[i];
          const urlFrag = (traducaoXml.getAttribute("urlfrag")).slice(1).split("=")[1];
          const traducao = {
            id:traducaoXml.getAttribute("id"), 
            tlang:urlFrag,
            lang_name: await this.tabela(traducaoXml.getAttribute("lang_translated"))
          };
          traducoes.push(traducao);
        }
        this.traducoes = traducoes;
      }
      this.legends = legendas;
      return {
        traducoes,
        legendas
      };
    }
  }
  async processLegend(legendSelect){
    const legend = this.legends[legendSelect.option];
    const parametros = {
      v:this.id,
      type:"track",
      name:legend.name,
      lang:legend.lang_code
    };
    if(legendSelect.traduzir != "original"){
      parametros.tlang = (this.traducoes[legendSelect.traduzir]).tlang;
    }
    const xmlData = new xml(await this.googleVideo(parametros));
    this.legend = xmlData.toSrt();
  }
  async VideoData(){
    const parametros = {
      part:"snippet,contentDetails",
      id:this.id
    };
    const data = await this.youtubeApiV3("videos",parametros);
    if(data.items.length != 0){
      this.videoName = (data.items[0]).snippet.title;
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