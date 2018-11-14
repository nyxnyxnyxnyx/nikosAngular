import { CategoryService } from './../services/category.service';
import { FootwearService } from './../services/footwear.service';
import {  Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})




export class ProductsComponent implements OnInit {
  
  filesToUpload: Array<File> = [];
  constructor(public footwearService:FootwearService,public categoryService:CategoryService
  ,private dp: DecimalPipe,private toastr: ToastrService) {
   }

   @ViewChild('input1') input1:ElementRef;
   @ViewChild('input2') input2:ElementRef;
   @ViewChild('input3') input3:ElementRef;
   @ViewChild('input4') input4:ElementRef;
   @ViewChild('fileInput') fileInputVar:ElementRef;



  url = '';
  flag=false;
  noImage:any = "../assets/images/no-image.png";
  public currentFootwear: any;
  public currentFootwearAux: any;
  public currentCategory: String[];
  public price: any ;
  public cost: any ;
  public bill: any ;
  public stock: any; 
  public webStock: any; 
  public stockTotal: any[]; 
  public webStockTotal: any[]; 
  public name: any; 
  public description: any; 
  public model: String = "";
  public typed="";
  public typed2="";
  public newColor="";
  public methodType:Boolean;
  public sizeCat:Boolean[]=[false,false,false,false]
  public stockColors:string="";
  public stockSizes:string="";
  public stockColorsSelected:string[]=[];
  public stockSizesSelected:Number[]=[];
  public showModal=false;
  
  ngOnInit() {   
    
    this.footwearService.getFootwears();
    this.categoryService.getCategories();
    this.footwearService.getBarcode();
  }

  upload() {
    if(this.url!==''){
      const formData: any = new FormData();
      const files: Array<File> = this.filesToUpload;
      for (let index = 0; index < files.length; index++) {
        formData.append("uploads[]", files[index], files[index]['name']);
      }
      if(files.length>0){
        this.footwearService.uploadImages(formData)
          .then((response:any)=>{
            var images=[];
            response.forEach(element => {
              images.push(element["filename"])
            });
          })      
        
      }  
    }
  }

  fileChangeEvent(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.filesToUpload = <Array<File>>event.target.files;

      var reader = new FileReader();
      if(event.target.files[0].type=="image/png" || event.target.files[0].type=="image/jpeg"){
      reader.readAsDataURL(event.target.files[0]); // read file as data url    
      reader.onload = (event:any) => {  
        this.url = event.target.result;              
      }    
      }else{
        this.toastr.warning('Error', 'Solo se permiten archivos png o jpg');    
        this.url='';
        this.fileInputVar.nativeElement.value = "";
      } 
    }

    
  }

  next(key){
    switch (key) {
      case 1:
      this.input1.nativeElement.focus();
        break;
      case 2:
      this.input2.nativeElement.focus();
        break;
      case 3:
      this.input3.nativeElement.focus();
        break;
      case 4:
      this.input4.nativeElement.focus();
        break;
    
      default:
        break;
    }
    
  }


  format(key){
    switch (key) {
      case 1:
      if(this.cost!=null){
        this.cost=parseFloat((this.cost)).toFixed(2);    
      }    
        break;
      case 2:
      if(this.price!=null){
        this.price=parseFloat((this.price)).toFixed(2);    
        this.bill=this.price;    
      }
        break;
      case 3:
      if(this.bill!=null){
        this.bill=parseFloat((this.bill)).toFixed(2); 
      }       
        break;
      case 4:
      if(this.stock!=null){
        this.stock=parseFloat((this.stock)).toFixed(0);    
        this.webStock=this.stock;    
      }       
        break;
      case 4:
      if(this.webStock!=null){
        this.webStock=parseFloat((this.webStock)).toFixed(0);    
      }          
        break;
    
      default:
        break;
    }
  }
  formatTotal(index1,index2){

      if(this.stockTotal[index1][index2]!=null){
        this.stockTotal[index1][index2]=parseFloat((this.stockTotal[index1][index2])).toFixed(0);    
        this.webStockTotal[index1][index2]=this.stockTotal[index1][index2];    
      }   
  }
  add(){
    this.methodType=true;
    this.price=0 ;
    this.cost=0 ;
    this.bill=0 ;
    this.name=""; 
    this.description=""; 
    this.currentCategory=[];
    this.footwearService.sizes.fill(false);
    this.sizeCat.fill(false);
    if(this.typed.trim()!=""){
      this.model=this.typed.trim();
      this.typed="";
    }else{
      this.toastr.warning('Alerta', 'Por favor ingrese un modelo');   
    }

    /* this.items2.push(this.typed);
    this.currentCategory=this.typed; */
  }

  editFootwear(form){
    this.methodType=false;    
    form.show();
    var current=this.footwearService.footwear;
    this.price= this.dp.transform(current["price"],'1.2-2');
    this.cost=this.dp.transform(current["cost"],'1.2-2') ;
    this.bill=this.dp.transform(current["billPrice"],'1.2-2') ;
    this.name=current["name"]; 
    this.description=current["description"]; 
    this.model=current["code"];
    this.currentCategory=[];
    current["categories"].forEach(element => {
      this.currentCategory=[...this.currentCategory,element._id];               
    });

  }
  register(form,form2){
    if((this.name!="" && this.name!=null)){
      var data={
        "code":this.model,
        "name":this.name,
        "description":this.description,
        "cost":this.cost,
        "price":this.price,
        "billPrice":this.bill,
        "categories":this.currentCategory
      }
      if(this.methodType){
        this.footwearService.createFootwear(data)
        .then((response)=>{
            console.log(response);
            this.toastr.success('Exito', 'Modelo creado exitosamente');              
            var newFootwear = [];
            newFootwear.push(this.footwearService.getFootwears())
            newFootwear.push(this.footwearService.getFootwear(response["_id"]))
            Promise.all(newFootwear).then(()=>{
              this.currentFootwear=response["_id"];
              form.hide();
              form2.show();
            })

          },
          ()=>{
            this.toastr.error('Error', 'Error al crear el modelo');   
          }
        );
          
        }else{
          this.footwearService.editFootwear(this.footwearService.footwear["_id"],data);  
          form.hide();        
        }
      }else{
        this.toastr.warning('Alerta', 'Por favor complete todos los campos');   
      }


  }

  addCategory(name){
    this.categoryService.createCategoryPromise(name)
    .then(
      (response)=>{
        this.toastr.success('Exito', 'ategoria agregada exitosamente');   
          this.currentCategory=[...this.currentCategory,response["_id"]];               
          this.categoryService.getCategories();
      },
      ()=>{
        this.toastr.error('Error', 'Error al agregar la categoria');   
      }
  )
    
  }
  getFootwear(){
    this.footwearService.getFootwear(this.currentFootwear);
  }

  saveSizes(form,form2){
    var sizeArray=[];
    this.footwearService.sizes.forEach((element,index) => {
      if(element){
        sizeArray.push(index+21);
      }
    });

    if(this.currentFootwear){
      this.footwearService.editFootwear(this.currentFootwear,{"sizes":sizeArray})
      form.hide();
      form2.show();
    }else{
      this.toastr.error('Error', 'Hubo un error al procesar la solicitud intente nuevamente');   
    }

  }

  Create2DArray(rows) {
    var arr = [];
  
    for (var i=0;i<rows;i++) {
       arr[i] = [];
    }
  
    return arr;
  }

  deleteFootwear(){
    var deleted = confirm("¿Estas seguro?");
    if(deleted){
      this.footwearService.deleteFootwear(this.currentFootwear);      
      this.currentFootwear="";
    }
  }
  addColor(){
    if(this.newColor.trim()!=""){
      this.footwearService.tempColors.push(this.newColor.trim())
      this.newColor="";
    }else{
      this.toastr.warning('Alerta', 'Por favor llene el campo');
    }

  }
  deleteColor(color){
    this.footwearService.tempColors.splice(this.footwearService.tempColors.indexOf(color))
  }

  addColors(form){

    this.footwearService.editFootwear(this.currentFootwear,{"colors":this.footwearService.tempColors})
    form.hide()
  }

  updateStockModal(form,colors,sizes){
    form.show();
    this.stockColorsSelected=colors;
    this.stockSizesSelected=sizes;
    this.stockColors=colors.toString();
    this.stockSizes=sizes.toString();
    this.stock=null;
    this.webStock=null;
    if(this.footwearService.footwear["stock"][0]!=null&&this.footwearService.footwear["stock"][0][this.stockColorsSelected[0]]!=null&&
    this.footwearService.footwear["stock"][0][this.stockColorsSelected[0]][this.stockSizesSelected[0].toString()]!=null&&
    this.footwearService.footwear["stock"][0][this.stockColorsSelected[0]][this.stockSizesSelected[0].toString()]["barcode"]!=null){
      this.flag=true;
    }else{
      this.flag=false;
      
    }
                        
  }
  updateTotalStockModal(form){
    
    form.show();
    this.stockColorsSelected=this.footwearService.footwear["colors"];
    this.stockSizesSelected=this.footwearService.footwear["sizes"];
/*     this.stockColors=colors.toString();
    this.stockSizes=sizes.toString(); */
    this.stockTotal=this.Create2DArray(this.stockColorsSelected.length);
    this.webStockTotal=this.Create2DArray(this.stockColorsSelected.length);
    this.showModal=true;
    if(this.footwearService.footwear["stock"][0]!=null&&this.footwearService.footwear["stock"][0][this.stockColorsSelected[0]]!=null&&
    this.footwearService.footwear["stock"][0][this.stockColorsSelected[0]][this.stockSizesSelected[0].toString()]!=null&&
    this.footwearService.footwear["stock"][0][this.stockColorsSelected[0]][this.stockSizesSelected[0].toString()]["barcode"]!=null){
      this.flag=true;
    }else{
      this.flag=false;
      
    }
                        
  }

  updateStock(form){



    if(this.stock<0 || this.stock!=null || this.webStock<0 || this.webStock!=null){
      if(this.stock>=this.webStock){

        if(this.url!==''){
          const formData: any = new FormData();
          const files: Array<File> = this.filesToUpload;
          for (let index = 0; index < files.length; index++) {
            formData.append("uploads[]", files[index], files[index]['name']);
          }
          if(files.length>0){
            this.footwearService.uploadImages(formData)
              .then((response:any)=>{
                var uploadedImages=[];
                response.forEach(element => {
                  uploadedImages.push(element["filename"])
                });
                this.url='';
                this.fileInputVar.nativeElement.value = "";                
                var stock=[];
                var images=[];

                var item1={}
                var item2={}
                var image={}
                if(this.footwearService.footwear["images"][0]){
                 image=this.footwearService.footwear["images"][0];                  
                }
                this.stockColorsSelected.forEach((element1,index1) => {
                  item2={}
                  this.stockSizesSelected.forEach((element2,index2) => {
                    this.footwearService.getBarcode();
                    
                    var stockValue={
                      
                      "stock":((this.footwearService.footwear["stock"][0]!=null&&
                      this.footwearService.footwear["stock"][0][element1]!=null)&&
                      (this.footwearService.footwear["stock"][0][element1][element2.toString()]&&
                      parseInt(this.footwearService.footwear["stock"][0][element1][element2.toString()]["stock"])+parseInt(this.stock)
                      ||this.stock)||parseInt(this.stock) ),
                      "webStock":((this.footwearService.footwear["stock"][0]!=null&&
                      this.footwearService.footwear["stock"][0][element1]!=null)&&
                      (this.footwearService.footwear["stock"][0][element1][element2.toString()]&&
                      parseInt(this.footwearService.footwear["stock"][0][element1][element2.toString()]["webStock"])+parseInt(this.webStock)
                      ||parseInt(this.webStock))||parseInt(this.webStock) ),
                      "barcode":((this.footwearService.footwear["stock"][0]!=null&&
                      this.footwearService.footwear["stock"][0][element1]!=null)&&
                      (this.footwearService.footwear["stock"][0][element1][element2.toString()]&&
                      parseInt(this.footwearService.footwear["stock"][0][element1][element2.toString()]["barcode"])
                      ||775000000+this.footwearService.barcode+index1+index2)||775000000+this.footwearService.barcode+index1+index2 ),
                    }
                  
                    item2[element2.toString()]=stockValue;
                    
                  });
                  item1[element1]=item2;
                  image[element1]=uploadedImages;
                });
                stock.push(item1);
                images.push(image);               
                this.footwearService.editFootwear(this.currentFootwear,{"stock":stock,"images":images})
                form.hide()
              })      
            
          }  }else{          
                this.url='';
                this.fileInputVar.nativeElement.value = "";                
                var stock=[];
                var item1={}
                var item2={}
                this.stockColorsSelected.forEach((element1,index1) => {
                  item2={}
                  this.stockSizesSelected.forEach((element2,index2) => {
                    this.footwearService.getBarcode();
                    var stockValue={
                      
                      "stock":((this.footwearService.footwear["stock"][0]!=null&&
                      this.footwearService.footwear["stock"][0][element1]!=null)&&
                      (this.footwearService.footwear["stock"][0][element1][element2.toString()]&&
                      parseInt(this.footwearService.footwear["stock"][0][element1][element2.toString()]["stock"])+parseInt(this.stock)
                      ||this.stock)||parseInt(this.stock) ),
                      "webStock":((this.footwearService.footwear["stock"][0]!=null&&
                      this.footwearService.footwear["stock"][0][element1]!=null)&&
                      (this.footwearService.footwear["stock"][0][element1][element2.toString()]&&
                      parseInt(this.footwearService.footwear["stock"][0][element1][element2.toString()]["webStock"])+parseInt(this.webStock)
                      ||this.webStock)||parseInt(this.webStock) ),
                      "barcode":((this.footwearService.footwear["stock"][0]!=null&&
                      this.footwearService.footwear["stock"][0][element1]!=null)&&
                      (this.footwearService.footwear["stock"][0][element1][element2.toString()]&&
                      parseInt(this.footwearService.footwear["stock"][0][element1][element2.toString()]["barcode"])
                      ||775000000+this.footwearService.barcode+index1+index2)||775000000+this.footwearService.barcode+index1+index2 ),
                    }
                  
                    item2[element2.toString()]=stockValue;
                    
                  });
                  item1[element1]=item2;
                });
                stock.push(item1);
                this.footwearService.editFootwear(this.currentFootwear,{"stock":stock})
                form.hide()
               
          }
      


      }else{
        this.toastr.warning('Alerta', 'El stock web no puede ser mayor que el stock total');
      }
    }else{
      this.toastr.warning('Alerta', 'Por favor, inserte un valor valido');
    }


  }
  updateStockTotal(form){

    console.log(form);

    var isStockGood=true;
    var errors="";
    for (let index1 = 0; index1 < this.footwearService.footwear["colors"].length; index1++) {
      for (let index2 = 0; index2 < this.footwearService.footwear["sizes"].length; index2++) {
        if(!this.stockTotal[index1][index2]){
          this.stockTotal[index1][index2]=0;
        }
        if(!this.webStockTotal[index1][index2]){
          this.webStockTotal[index1][index2]=0;
        }
        if(this.stockTotal[index1][index2]<this.webStockTotal[index1][index2]){
          errors+=this.footwearService.footwear["colors"][index1]
          errors+=this.footwearService.footwear["sizes"][index2]
          errors+=" "
          isStockGood=false;
        }        
      }
      
    }
    if(!isStockGood){
      this.toastr.error('Error', '"El stock web no puede ser mayor al total( "+errors+")"');   
    }else{
      var stock=[];
      var item1={}
      var item2={}
      this.stockColorsSelected.forEach((element1,index1) => {
        item2={}
        this.stockSizesSelected.forEach((element2,index2) => {
          this.footwearService.getBarcode();
          var stockValue={
            
            "stock":((this.footwearService.footwear["stock"][0]!=null&&
            this.footwearService.footwear["stock"][0][element1]!=null)&&
            (this.footwearService.footwear["stock"][0][element1][element2.toString()]&&
            parseInt(this.footwearService.footwear["stock"][0][element1][element2.toString()]["stock"])+parseInt(this.stockTotal[index1][index2])
            ||this.stockTotal[index1][index2])||parseInt(this.stockTotal[index1][index2]) ),
            "webStock":((this.footwearService.footwear["stock"][0]!=null&&
            this.footwearService.footwear["stock"][0][element1]!=null)&&
            (this.footwearService.footwear["stock"][0][element1][element2.toString()]&&
            parseInt(this.footwearService.footwear["stock"][0][element1][element2.toString()]["webStock"])+parseInt(this.webStockTotal[index1][index2])
            ||this.webStockTotal[index1][index2])||parseInt(this.webStockTotal[index1][index2]) ),
            "barcode":((this.footwearService.footwear["stock"][0]!=null&&
            this.footwearService.footwear["stock"][0][element1]!=null)&&
            (this.footwearService.footwear["stock"][0][element1][element2.toString()]&&
            parseInt(this.footwearService.footwear["stock"][0][element1][element2.toString()]["barcode"])
            ||775000000+this.footwearService.barcode+index1+index2)||775000000+this.footwearService.barcode+index1+index2 ),
          }
        
          item2[element2.toString()]=stockValue;
          
        });
        item1[element1]=item2;
      });
      stock.push(item1);
      this.footwearService.editFootwear(this.currentFootwear,{"stock":stock})
      form.hide()

    }
                
               
               
          
      





  }
  

}
