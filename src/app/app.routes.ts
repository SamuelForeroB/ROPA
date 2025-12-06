import { Routes } from '@angular/router';
import { Contact } from './page/contact/contact';
import { Products } from './page/products/products';
import { About } from './page/about/about';
import { Home } from './page/home/home';

export const routes: Routes = [

    {path: '' ,component:Home},
    {path: 'about',component:About},
    {path:'products',component:Products},
    {path:'contact',component:Contact},
    {path:'**',redirectTo:''}


];
