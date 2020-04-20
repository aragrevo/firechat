import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Message } from '../interfaces/message.interface';

import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private chatsCollection: AngularFirestoreCollection<Message>;

  public chats: Message[] = [];
  public user: any = {};

  constructor(
    private afs: AngularFirestore,
    public afAuth: AngularFireAuth
  ) {
    this.afAuth.authState.subscribe(user => {
      console.log(user);

      if (!user) { return; }
      this.user.name = user.displayName;
      this.user.uid = user.uid;
      this.user.photo = user.photoURL;
    });
  }

  login() {
    this.afAuth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout() {
    this.user = {};
    this.afAuth.signOut();
  }

  loadChats() {
    this.chatsCollection = this.afs.collection<Message>('chats', ref =>
      ref.orderBy('date', 'desc').limit(5));
    return this.chatsCollection.valueChanges().pipe(
      map((messages: Message[]) => {
        this.chats = [];

        for (const message of messages) {
          this.chats.unshift(message);
        }
      })
    );
  }

  sendMessage(text: string) {
    const message: Message = {
      name: this.user.name,
      message: text,
      date: new Date().getTime(),
      uid: this.user.uid
    };

    return this.chatsCollection.add(message);
  }
}
