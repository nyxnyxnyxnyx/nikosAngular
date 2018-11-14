import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FootwearService } from './services/footwear.service';
import { CategoryService } from './services/category.service';
import { AuthGuardService } from './services/auth-guard.service';
import { LoginService } from './services/login.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AgmCoreModule } from '@agm/core';
import { LoginComponent } from './login/login.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductsComponent } from './products/products.component';
import { SettingsComponent } from './settings/settings.component';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './services/user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { NgxBarcodeModule } from 'ngx-barcode'; 
import { ToastrModule } from 'ngx-toastr';
const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuardService] },
  { path: 'products', component: ProductsComponent, canActivate:[AuthGuardService] },
  { path: 'settings', component: SettingsComponent, canActivate:[AuthGuardService] },
  { path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }/* ,
  { path: '**', component: PageNotFoundComponent } */
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    ProductsComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSelectModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(), // ToastrModule added
    FormsModule,
    HttpModule,
    NgxBarcodeModule,
    RouterModule.forRoot(
      appRoutes,
      { onSameUrlNavigation : 'reload' } // <-- debugging purposes only
    ),
    MDBBootstrapModule.forRoot(),
    AgmCoreModule.forRoot({
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en#key
      apiKey: 'Your_api_key'
    })
  ],
  providers: [
    LoginService,
    AuthGuardService,
    CategoryService,
    FootwearService,
    UserService,
    DecimalPipe,
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
