class page{
  constructor(){
    this.YouTube = new YouTube();
    $("#urlLabel").change(()=>{
      pageElement.labelAltered();
    });
    $("#form").submit(()=>{
      pageElement.submit();
      return false;
    });
    $("#formModal").submit(()=>{
      pageElement.modalSubmit();
      return false;
    });
  }
  labelAltered(label){
    const value = $("#urlLabel").val();
    const result = this.YouTube.Url(value);
    if(result === true){
      $("#button1").prop("disabled",false);
      $("#urlHelper").addClass("d-none");
    }
    else{
      $("#button1").prop("disabled",true);
      $("#urlHelper").removeClass("d-none");
    }
  }
  async modalSubmit(){
    var data = {
      "traduzir":$("#translations").val(),
      "option":$("#legendSelect").val()
    };
    await this.YouTube.processLegend(data);
    $(".modal").modal("hide");
    this.dowload();
  }
  dowload(){
    var blob = new Blob([this.YouTube.legend], {type: "text/plain;charset=utf-8"});
    saveAs(blob, this.YouTube.videoName+".srt");
  }
  async submit(){
    const data = await this.YouTube.VideoData();
    if(data == null){
      $(".noVideo").removeClass("d-none");
      $(".yesVideo").addClass("d-none");
      $("#formModal button[type=submit]").prop("disabled",true);
    }
    else{
      $(".noVideo").addClass("d-none");
      $(".yesVideo").removeClass("d-none");
      $("#formModal button[type=submit]").prop("disabled",false);
      $("#videoName").html(data.name);
      $("#videoChannel").html(data.canal);
      $("#videoDuration").html(data.time.minutos +":"+ data.time.segundos);
      $("#videoImage").prop("src",data.image);
      const legendsData = await this.YouTube.legendsData();
      if(legendsData.legendas != null){
        $(".noLegends").addClass("d-none");
        $(".yesLegends").removeClass("d-none");
        for(let i =0;i<legendsData.legendas.length;i++){
          const legend = legendsData.legendas[i];
          const name = legend.name;
          const language = legend.lang_name;
          var text = language;
          if(name != ""){
            text += " - "+ name;
          }
          var element = document.createElement("option");
          element.setAttribute("value",i);
          element.innerHTML = text;
          document.getElementById("legendSelect").appendChild(element);
        }
        var element = document.createElement("option");
        element.setAttribute("value","original");
        element.innerHTML = "Original";
        document.getElementById("translations").appendChild(element);
        for(let i = 0;i<legendsData.traducoes.length;i++){
          const traducao = legendsData.traducoes[i];
          const name = "Traduzido para "+traducao.lang_name;
          var element = document.createElement("option");
          element.setAttribute("value",i);
          element.innerHTML = name;
          document.getElementById("translations").appendChild(element);
        }
      }
      else{
        $(".noLegends").removeClass("d-none");
        $("#formModal button[type=submit]").prop("disabled",true);
        $(".yesLegends").addClass("d-none");
      }
    }
    $(".modal").modal("show");
  }
}