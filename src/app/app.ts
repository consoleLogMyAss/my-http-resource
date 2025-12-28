import { Component, inject } from '@angular/core';
import { AppService, testPost } from './services/app.service';
import { forkJoin } from 'rxjs';
import {HttpClient} from '@angular/common/http';

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
  protected postId: number = 3;
  protected appService: AppService = inject(AppService);

  protected fetchPost(): void {
    this.appService.posts.fetch({
      mergeValues: this.postId % 2 === 0,
      urlParams: {
        postId: this.postId,
      },
      options: {
        headers: {
          'lololol': 'SOCCER'
        }
      }
    });

    this.postId += 1;
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
    this.appService.updatePost.fetch({
      body: testPost,
    });
  }

  protected patchPostHandler(): void {
    this.appService.patchPost.fetch({
      body: testPost,
    })
  }

  protected deletePostHandler() {
    this.appService.deletePost.fetch({});
  }

  protected requestObservable(): void {
    forkJoin({
      one: this.appService.posts.request$({
        urlParams: { postId: 5 }
      }),
      two: this.appService.sendPost.request$()
    }).subscribe((res: { one: IPost[], two: IPost }) => {
      this.appService.posts.value.set(res.one)
    })
  }
}
