import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{ path: '**', redirectTo: '' }];

export const appRoutingModule = RouterModule.forRoot(routes);
