import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class FootwearService {
  url=environment.url;
  httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': "Bearer "+localStorage.getItem("token")
  })
};

  constructor(private http: HttpClient, public router:Router,private toastr: ToastrService) { }

    footwears:any[]=[];
    footwear:Object={};
    public sizes:Boolean[]=new Array(23);
    public tempColors:String[]=[];
    public tempImages:any[]=[];
    public barcode:number=0;
    public categoryCount:any={length:0};
  getFootwears(){
    return this.http.get(this.url+"api/footwears",this.httpOptions)
    .subscribe((data) => 
      {
        console.log(data);
        this.footwears=[];
        for (var index in data){
          this.footwears.push({
            id:data[index]._id,
            text:data[index].code+" - "+data[index].name
          })
        }
            
      },
      ()=>{
        
      }
    )
  }
  getFootwear(id){
    return this.http.get(this.url+"api/footwears/"+id,this.httpOptions)
    .subscribe(data => 
      {
        this.tempColors=[];
        if(data["sizes"].length>0){
          this.sizes.fill(false);
          data["sizes"].forEach(element => {
            this.sizes[element-21]=true;
          });
        }else{          
        this.sizes.fill(false);           
        }
        if(data["colors"].length>0){
          data["colors"].forEach(element => {
            this.tempColors.push(element);
          });
        }
        this.tempImages=[];
        if(data["images"].length>0){
/*           data["images"][0].forEach(element => {
            this.tempImages.push(element);
          }); */
          var result = Object.keys(data["images"][0]).map((key) =>{
            return {color:key, images:this.url + data["images"][0][key]};
          });
          this.tempImages=result;
        }

        this.footwear=data;  
        console.log(data);
      },
      ()=>{
        
      }
    )
  }
  createFootwear(data){
    return this.http.post(this.url+"api/footwears",data,this.httpOptions)
        .toPromise()
  }
  editFootwear(id,data){
    return this.http.put(this.url+"api/footwears/"+id,data,this.httpOptions)
        .toPromise()
        .then(
            ()=>{
              this.toastr.success('Exito', 'Modelo actualizado exitosamente');
                this.getFootwear(id);
                this.getFootwears();
            },
            ()=>{
              this.toastr.warning('Error', 'Error al actualizar el modelo');              
            }
        )
  }
  deleteFootwear(id){
    return this.http.delete(this.url+"api/footwears/"+id,this.httpOptions)
        .toPromise()
        .then(
            ()=>{
              this.toastr.success('Exito', 'Modelo eliminado exitosamente');
              this.getFootwears();
            },
            ()=>{
              this.toastr.warning('Error', 'Error al eliminar el modelo');       
              
            }
        )
  }
  uploadImages(formData){
    return this.http.post(this.url+"api/footwears/uploads",formData)
        .toPromise()
  }
  getBarcode(){
    return this.http.get(this.url+"barcode")
        .toPromise()
        .then(
          (data:number)=>{
            this.barcode=data;
          },
          ()=>{
            
          }
      )
  }

  getCount(){
    return this.http.get(this.url+"api/footwears/group",{params:{parameter:"categories"}})
        .toPromise()
        .then(
          (data:any)=>{
            data.forEach(element => {
              this.categoryCount[element._id]=element.count;
              this.categoryCount.length++;
            });
            console.log(this.categoryCount)
          },
          ()=>{
            
          }
      )
  }

}


