import { Routes } from '@angular/router';
import { canActivateAuthRole } from './auth/auth.guard';
import { ForbiddenComponent } from './commons/forbidden/forbidden.component';
import { PageNotFoundComponent } from './commons/page-not-found/page-not-found.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateOrganizationComponent } from './components/organ/create-organization/create-organization.component';
import { OrganDetailsComponent } from './components/organ/organ-details/organ-details.component';
import { OrganComponent } from './components/organ/organ.component';
import { ServisComponent } from './components/servis/servis.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { UnitComponent } from './components/units/unit.component';
import { ViewUnitComponent } from './components/units/view-unit/view-unit.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { CreateUnitComponent } from './components/units/create-unit/create-unit.component';
import { CreateServisComponent } from './components/servis/create-servis/create-servis.component';
import { ViewServisComponent } from './components/servis/view-servis/view-servis.component';
import { DependencyComponent } from './components/servis/dependency/dependency.component';


export const routes: Routes = [
    {
        path: 'welcome', component: WelcomeComponent, data: { public: true }
    }, {
        path: 'dashboard', component: DashboardComponent, canActivate: [canActivateAuthRole]
    }, {
        path: 'shoppingcart', component: ShoppingCartComponent, canActivate: [canActivateAuthRole]
    }, {
        path: '', redirectTo: '/welcome', pathMatch: 'full'
    }, {
        path: 'organs', component: OrganComponent, canActivate: [canActivateAuthRole]
    }, {
        path: 'organs/create', component: CreateOrganizationComponent, canActivate: [canActivateAuthRole]
    }, {
        path: 'organs/:id', component: OrganDetailsComponent, canActivate: [canActivateAuthRole]
    }, {
        path: 'units', component: UnitComponent, canActivate: [canActivateAuthRole]
    }, {
        path: 'units/create', component: CreateUnitComponent, canActivate: [canActivateAuthRole]
    }, {
        path: 'units/:id', component: ViewUnitComponent, canActivate: [canActivateAuthRole]
    }, { 
        path: 'services', component: ServisComponent, canActivate: [canActivateAuthRole] 
    }, { 
        path: 'services/create', component: CreateServisComponent, canActivate: [canActivateAuthRole] 
    }, { 
        path: 'services/dependencies', component: DependencyComponent, canActivate: [canActivateAuthRole] 
    }, { 
        path: 'services/:id', component: ViewServisComponent, canActivate: [canActivateAuthRole] 
    }, {
        path: '**', component: PageNotFoundComponent
    }, {
        path: 'forbidden', component: ForbiddenComponent
    }
];