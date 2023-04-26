import {Injectable} from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth'
import 'firebase/compat/storage'

import * as config from '../../src/firebaseconfig.js'
import {Router} from "@angular/router";
import FieldValue = firebase.firestore.FieldValue;

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  firebaseApplication;
  firestore: firebase.firestore.Firestore;
  auth: firebase.auth.Auth;
  storage: firebase.storage.Storage;
  LoginUserData: user;
  Rooms: Room[] = [];
  messages: MessageDTO[] = [];


  constructor(private router: Router) {
    this.firebaseApplication = firebase.initializeApp(config.firebaseconfig)
    this.firestore = firebase.firestore();
    this.auth = firebase.auth();
    this.storage = firebase.storage();
    this.LoginUserData = {
      Age: 0,
      AvatarURL: "",
      Email: "",
      ID: "",
      Name: ""

    }

    this.auth.onAuthStateChanged((user) => {
      if(user){
        this.getRooms(user.uid)
        this.getUserData(user.uid)
        this.router.navigate(["/Dashboard"])
      }
      //Remove the room form rooms list
      this.Rooms = []
    })
  }

  getUserData(userId) {
    this.firestore
      .collection('User').where('ID', '==', userId)
      .get().then( async resp => {
      this.LoginUserData = resp.docs[0].data() as user;
    })
  }

  async updateUserImage($event){
    const img = $event.target.files[0]
    await this.storage.ref().child("UserAvatar/" + this.auth.currentUser?.uid).put(img)
      .then(async imgURL => {
        if(this.LoginUserData){
          this.LoginUserData.AvatarURL = await imgURL.ref.getDownloadURL()
          await this.firestore.collection("User").doc(this.auth.currentUser?.uid).update({
            AvatarURL: this.LoginUserData.AvatarURL
          })
        }
      })
  }

  getRooms(userID: string){
    this.firestore
      .collection('Rooms').where("Users", "array-contains", userID)
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if(change.type == "added"){
            this.Rooms.push(change.doc.data() as Room)
          }
        })
      })

  }

  async getMessagesFromRoom(roomId) {
    const query = await this.firestore
      .collection('Rooms')
      .doc(roomId)
      .collection('Messages').orderBy('Timestamp')
      .get();
    this.messages = []
    this.messages = (query.docs.map(value => value.data() as MessageDTO));
    console.log(this.messages)
  }

  sendMessage(sendThisMessage: any, roomId) {
    let newMessage: MessageDTO = {
      Message: sendThisMessage,
      Timestamp: new Date(),
    }
    this.firestore.collection('Rooms')
      .doc(roomId)
      .collection('Messages').add(newMessage).then(value => {
    })

  }

  async createRoom(roomName: string){
    let newRoom: Room = {
      ID: "",
      Name: roomName,
      Timestamp: new Date(),
      Users: []
    }
    await this.firestore
      .collection('Rooms').add(newRoom).then(room => {
        this.firestore.collection('Rooms').doc(room.id).update({
          ID: room.id
        })
      })
  }

  async addUserToRoom(userId: string, room: Room){
    await this.firestore.collection('Rooms').doc(room.ID).update({
      Users: FieldValue.arrayUnion(userId)
    })
  }

  register(email: string, password: string){
    this.auth.createUserWithEmailAndPassword(email, password)
      .then(value => {
        this.firestore.collection("User").doc(value.user?.uid).set(
          {
            ID: value.user?.uid,
            AvatarURL: "UserAvatar/Default Avatar.jpg",
            Name: value.user?.email,
            Email: email,
            Age: 30,
          })
        this.router.navigate(['Dashboard'])
      });

  }

  signIn(email: string, password: string){
    this.auth.signInWithEmailAndPassword(email, password)
      .then(value => {

      });
  }

  signOut(){
    this.auth.signOut();
  }
}

export type MessageDTO = {
  Message: string;
  Timestamp: Date;

}

type user = {
  ID: string;
  AvatarURL?: string
  Name: string,
  Email:string,
  Age: number
}

type Room = {
  ID: string,
  Name: string,
  Timestamp: Date
  Users: []
}
