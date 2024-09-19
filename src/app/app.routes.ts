import { Routes, RouterModule } from '@angular/router';

import { MainMenuComponent } from './menu/main-menu/main-menu.component';
import { SettingsMenuComponent } from './menu/settings-menu/settings-menu.component';

const routes: Routes = [
    {path: '', component: MainMenuComponent},
    {path: 'settings', component: SettingsMenuComponent}
]