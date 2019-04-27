class page{
  constructor(){
    this.YouTube = new YouTube(this);
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
    $(".close").click(()=>{
      $("dialog")[0].close();
    });
  }
  async delay(ms) {
    return await new Promise(resolve => setTimeout(resolve, ms));
  }
  async toogleProgressBar(option){
    
    if(option){
      var opacidade = parseFloat($(".mdl-progress").css("opacity"));
      for(opacidade;opacidade<=1;opacidade = opacidade +0.1){
        $(".mdl-progress").css("opacity",(opacidade+"").slice(0,3));
        await this.delay(350);
      }
    }
    else{
      var opacidade = parseFloat($(".mdl-progress").css("opacity"));
      for(opacidade;opacidade>=0;opacidade = ((opacidade -0.1)+"").slice(0,3)){
        $(".mdl-progress").css("opacity",(opacidade+"").slice(0,3));
        await this.delay(350);
        if(opacidade == 0){
          break;
        }
      }
    }
  }
  labelAltered(label){
    const value = $("#urlLabel").val();
    const result = this.YouTube.Url(value);
    if(result === true){
      $("#button1").prop("disabled",false);
      $(".mdl-textfield").removeClass("is-invalid");
    }
    else if(result === false){
      if(value != ""){
        $("#button1").prop("disabled",true);
        $(".mdl-textfield").addClass("is-invalid");
      }
      else{
        $("#button1").prop("disabled",true);
        $(".mdl-textfield").removeClass("is-invalid");
      }
    }
  }
  async modalSubmit(){
    await $(".yesVideo").hide(1000);
    await this.delay(1000);
    $(".mdl-dialog .mdl-dialog__actions").addClass("d-none");
    $(".loading").removeClass("d-none");
    var data = {
      "traduzir":$("#translations").val(),
      "option":$("#legendSelect").val()
    };
    await this.delay(500);
    await this.YouTube.processLegend(data);
    $("dialog")[0].close();
    $(".yesVideo").show();
    this.dowload();
  }
  dowload(){
    var blob = new Blob([this.YouTube.legend], {type: "text/plain;charset=utf-8"});
    saveAs(blob, this.YouTube.videoName+".srt");
  }
  error(error,more){
    var msg
    if(error == 404){
      msg = "Ops! Não foi possivel encontrar informações.";
      this.toogleProgressBar(false);
      $(".mdl-dialog")[0].close();
    }
    else if(error == 0){
      msg =  `Erro de conexão. Tentando pela ${more}° vez.`
    }
    else if(error == "fail"){
      msg = "Erro não foi possivel se comunicar com servidor. Verifique sua rede."
      this.toogleProgressBar(false);
      $(".mdl-dialog")[0].close();
    }
    $(".mdl-snackbar")[0].MaterialSnackbar.showSnackbar({
      message:msg
    })
  }
  async submit(){
    $(".loading").addClass("d-none");
    $(".mdl-dialog .mdl-dialog__actions").removeClass("d-none");
    await this.toogleProgressBar(true);
    const data = await this.YouTube.VideoData();
    if(data == null){
      $(".noVideo").removeClass("d-none");
      $(".yesVideo").addClass("d-none");
      $("#formModal button[type=submit]").prop("disabled",true);
    }
    else{
      $(".noVideo").addClass("d-none");
      $(".yesVideo").show();
      $(".yesVideo").removeClass("d-none");
      $("#formModal button[type=submit]").prop("disabled",false);
      $("#videoName").html(data.name);
      $("#videoChannel").html(data.canal);
      $("#videoDuration").html(data.time.minutos +":"+ data.time.segundos);
      $("#videoImage").prop("src",data.image);
      const legendsData = await this.YouTube.legendsData();
      if(legendsData != null && legendsData.legendas != null){
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
          if(i != 0){
            var element = document.createElement("option");
            element.setAttribute("value",i);
            element.innerHTML = text;
            document.getElementById("legendSelect").appendChild(element);
          }
          else{
            var element = document.getElementById("op1");
            element.setAttribute("value",i);
            element.innerHTML = text;
          }
        }
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
   this.toogleProgressBar(false);
   $("dialog")[0].showModal();
   
  }
}