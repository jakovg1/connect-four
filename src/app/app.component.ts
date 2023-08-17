import { Component, ViewChild } from '@angular/core';
import { BoardComponent } from './components/board/board.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild(BoardComponent) private board!: BoardComponent;

  constructor() {}

  public menuActive: boolean = true;

  public newGame(): void {
    this.menuActive = false;
    this.board.resetGame();
  }
}
