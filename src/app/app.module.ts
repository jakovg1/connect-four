import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './shared/modules/material/material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BoardComponent } from './components/board/board.component';
import { MainMenuComponent } from './menu/main-menu/main-menu.component';
import { SettingsMenuComponent } from './menu/settings-menu/settings-menu.component';
import { appRoutingModule } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    MainMenuComponent,
    SettingsMenuComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    NoopAnimationsModule,
    appRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
