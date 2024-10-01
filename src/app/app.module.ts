import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BoardComponent } from './components/board/board.component';
import { MainMenuComponent } from './menu/main-menu/main-menu.component';
import { SettingsMenuComponent } from './menu/settings-menu/settings-menu.component';
import { ToastModule } from 'primeng/toast';
import { appRoutingModule } from './app.routes';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    MainMenuComponent,
    SettingsMenuComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ToastModule,
    appRoutingModule,
  ],
  providers: [MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
