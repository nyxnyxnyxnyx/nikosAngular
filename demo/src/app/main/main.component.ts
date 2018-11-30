import { CategoryService } from './../services/category.service';
import { FootwearService } from './../services/footwear.service';
import {  Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {
  url=environment.url;

  constructor(public footwearService:FootwearService,public categoryService:CategoryService
    ,private dp: DecimalPipe,private toastr: ToastrService) {
     }
    ngOnInit() {      
      this.footwearService.getFootwears();
      this.categoryService.getCategories();
      this.footwearService.getCount();
    }

}
        