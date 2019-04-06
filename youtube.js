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
}