import { LoginService } from './../services/login.service';
import { UserService } from './../services/user.service';
import { CategoryService } from './../services/category.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(public categoryService:CategoryService,public userService:UserService,
    public fb: FormBuilder,public loginService:LoginService,private toastr: ToastrService) {
    this.validatingForm = fb.group({
      'required': [null, Validators.required],
  });
   }

  public items: string[] = ['Administrador','Colaborador'];

  public role: any = [];

  public newCat="";
  public password1="";
  public password2="";
  public username="";
  validatingForm: FormGroup;
  ngOnInit() {
    this.categoryService.getCategories();
    this.userService.getUsers();
  }

  createCategory(){
    console.log(this.newCat);
    this.categoryService.createCategory(this.newCat);
    this.newCat="";
  }
  deleteCategory(id){
    this.categoryService.deleteCategory(id);
  }

  register(form){
    if(this.username=="" || this.password1=="" || this.password2=="" || this.role==""){
      this.toastr.warning('Alerta', 'Por favor llene todos los campos');
      
    }else if(this.password1!=this.password2){
      this.toastr.warning('Alerta', 'erifique que las contraseñas coincidan');
    }else{
      form.hide();
      this.userService.createUser(this.username,this.password1,this.role);
    }
    
  }

  deleteUser(id){
    this.loginService.getUserData()
    .toPromise()
    .then((res)=>{
      console.log(res)
      console.log(id)
      if(res["_id"]!=id && res["role"]=="administrador"){
        this.userService.deleteUser(id);        
      }else{
        this.toastr.error('Error', 'No puedes eliminar tu propio usuario o no tienes los permisos suficientes');
      }
    })
    
  }

}
