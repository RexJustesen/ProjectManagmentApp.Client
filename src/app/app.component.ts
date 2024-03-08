import { Component, OnInit } from '@angular/core';
import { SignalRService } from './services/signalR.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'client';

  constructor(private signalRService: SignalRService) {
    this.signalRService.startProjectConnection(); // Start SignalR connection
   }

  ngOnInit(): void {
    
  }
}
