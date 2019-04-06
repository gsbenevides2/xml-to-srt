class page{
  constructor(){
    this.YouTube = new YouTube();
    
    //InputChange
    $("#urlLabel").change(()=>{
      pageElement.labelAltered()
    });
    $("#form").submit(()=>{
      page.submit()
      return false;
    })
    
  }
  labelAltered(label){
    const value = $("#urlLabel").val();
    const result = this.YouTube.Url(value)
    if(result === true){
      $("#button1").prop("disabled",false)
      $("#urlHelper").addClass("d-none")
    }
    else{
      $("#button1").prop("disabled",true)
      $("#urlHelper").removeClass("d-none")
    }
  }
  submit(){
    
  }
}