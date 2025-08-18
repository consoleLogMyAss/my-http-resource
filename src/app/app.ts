import { Component, inject } from '@angular/core';
import {AppService, testPost} from './services/app.service';
import {JsonPipe} from '@angular/common';

export interface IPost {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [],
  styleUrl: './app.scss'
})
export class App {
  protected appService: AppService = inject(AppService);

  protected fetchPost(): void {
    this.appService.posts.fetch();
  }

  protected sendPostHandler(): void {
    this.appService.sendPost.fetch();
  }

  protected setLocalPost(): void {
    this.appService.posts.value.update((v: IPost[]) => {
      return [...v, testPost]
    })
  }

  protected putPostHandler(): void {
    this.appService.putPostHandler.fetch();
  }
}
