import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: [
  ]
})
export class ChatComponent {

  message = '';

  constructor(
    public chatService: ChatService
  ) {
    this.chatService.loadChats().subscribe();
  }

  sendMessage() {
    console.log('mensaje enviado');

    if (this.message.length === 0) { return; }
    this.chatService.sendMessage(this.message).then(() => this.message = '');


  }

}
