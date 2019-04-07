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
    return await this.jsonRequest(url);
  }
  async jsonRequest(url){
    return await $.getJSON(url);
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