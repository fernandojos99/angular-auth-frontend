import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@guards/auth.guard'; //xfgd
import { RedirectGuard } from '@guards/redirect.guard';


const routes: Routes = [
  {
    path: '',
    // Se le pone este guardian para redirigir a la pagina principal si 
    // se tiene  la cookie , esto es para no iniciar seccion cada rato
    canActivate:[RedirectGuard],
    loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'app',
    canActivate : [AuthGuard],
    loadChildren: () => import('./modules/layout/layout.module').then((m) => m.LayoutModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
