import { HospedesComponent } from './layout/aside-content/agendamentos/hospedes/hospedes.component';
import { SideBarComponent } from './layout/sidebar/sidebar.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservasComponent } from './layout/aside-content/agendamentos/reservas/reservas.component';
import { HospedagensComponent } from './layout/aside-content/agendamentos/hospedagens/hospedagens.component';
import { CadastroFuncionariosComponent } from './layout/aside-content/usuarios/cadastro-funcionarios/cadastro-funcionarios.component';
import { CadastroComponent } from './layout/aside-content/quartos/cadastro/cadastro.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'hospedes', component: HospedesComponent },
  { path: 'reservas', component: ReservasComponent },
  { path: 'hospedagens', component: HospedagensComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'cadastro-funcionarios', component: CadastroFuncionariosComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
