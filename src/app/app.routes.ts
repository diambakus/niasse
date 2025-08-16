import { Routes } from '@angular/router';
import { canActivateAuthRole } from './auth/auth.guard';
import { ForbiddenComponent } from './commons/forbidden/forbidden.component';
import { PageNotFoundComponent } from './commons/page-not-found/page-not-found.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OrganDetailsComponent } from './components/organ/organ-details/organ-details.component';
import { OrganComponent } from './components/organ/organ.component';
import { ServisComponent } from './components/servis/servis.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { UnitDetailsComponent } from './components/units/unit-details/unit-details.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { UnitComponent } from './components/units/unit.component';
import { CreateOrganizationComponent } from './components/organ/create-organization/create-organization.component';


export const routes: Routes = [
    {
        path: 'welcome', component: WelcomeComponent, data: { public: true }
    },
    {
        path: 'dashboard', component: DashboardComponent, canActivate: [canActivateAuthRole]
    }, {
        path: 'shoppingcart', component: ShoppingCartComponent, canActivate: [canActivateAuthRole]
    }, {
        path: '', redirectTo: '/welcome', pathMatch: 'full'
    }, {
        path: 'organs', component: OrganComponent, canActivate: [canActivateAuthRole]
    }, {
        path: 'organs/create', component: CreateOrganizationComponent, canActivate: [canActivateAuthRole]
    },{
        path: 'organs/:id', component: OrganDetailsComponent, canActivate: [canActivateAuthRole]
    }, {
        path: 'units', component: UnitComponent, canActivate: [canActivateAuthRole]
    },{
        path: 'units/:id', component: UnitDetailsComponent, canActivate: [canActivateAuthRole]
    }, { 
        path: 'services', component: ServisComponent, canActivate: [canActivateAuthRole] 
    }, {
        path: '**', component: PageNotFoundComponent
    }, {
        path: 'forbidden', component: ForbiddenComponent
    }
];