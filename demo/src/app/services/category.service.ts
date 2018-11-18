import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class CategoryService {
  url=environment.url;
  httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': "Bearer "+localStorage.getItem("token")
  })
};

  constructor(private http: HttpClient, public router:Router,private toastr: ToastrService) { }

    categories:Object=[];
    catList:any[]=[];
  getCategories(){
    return this.http.get(this.url+"api/categories",this.httpOptions)
    .subscribe(data => 
      {
        this.catList=[];
        for (var index in data){
          this.catList.push({
            id:data[index]._id,
            text:data[index].name
          })
        }
          
        this.categories=data;     
      },
      ()=>{
        
      }
    )
  }
  getCategory(id){
    return this.http.get(this.url+"api/categories/"+id,this.httpOptions)
    .subscribe(data => 
      {
          
        this.categories=data;    
      },
      ()=>{
        
      }
    )
  }
  createCategory(name){
    return this.http.post(this.url+"api/categories",{"name":name},this.httpOptions)
        .toPromise()
        .then(
            ()=>{
              this.toastr.success('Exito', 'Categoria agregada exitosamente');       
              this.getCategories();
            },
            ()=>{
              this.toastr.error('Error', 'Error al agregar la categoria');      
            }
        )
  }
  createCategoryPromise(name){
    return this.http.post(this.url+"api/categories",{"name":name},this.httpOptions)
        .toPromise()
  }
  deleteCategory(id){
    return this.http.delete(this.url+"api/categories/"+id,this.httpOptions)
        .toPromise()
        .then(
            ()=>{
                this.getCategories();
            },
            ()=>{
              this.toastr.error('Error', 'Error al eliminar la categoria');    
            }
        )
  }
}


