import { Injectable } from '@angular/core';
import { IHttpResource, myHttpResource, Get, Post, Put, Patch, Delete} from 'my-http-resource';
import {delay, map, pipe} from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { IPost } from '../app';

export const testPost = {
  postId: 8,
  id: 17,
  name: "Иван Иванов",
  email: "IvanIvanov@gmail.com",
  body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis, similique.'
}

export interface IStatistic {
  "downloads": number;
  "start": Date;
  "end": Date;
  "package": string;
}

@Injectable({
  providedIn: 'root'
})
export class AppService {
  /**
   * last-day
   * last-week
   * last-month
   * yyyy-mm-dd
   */
  public statisticDownloads = myHttpResource().get<IStatistic>({
    url: 'https://api.npmjs.org/downloads/point/last-day/my-http-resource',
    initialValue: {}
  })

  public posts = myHttpResource().get<IPost[]>({
    url:'https://jsonplaceholder.typicode.com/posts/{{postId}}/comments',
    pipe: pipe(
      delay(1000),
      map((data: IPost[] ) => {
        return data.map((item: IPost) => ({...item, email: 'test@mail.com' }));
      })
    ),
    afterSuccess: (data: IPost[]) => this.afterSuccess(data),
    afterError: (error: HttpErrorResponse) => this.afterError(error),
    urlParams: { postId: 2 },
    headers: {
      testHeader: '12345'
    },
    queryParams: { currency: 'USD' },
    manual: true,
    mergeValues: true,
    initialValue: [],
  });

  private afterSuccess(data: IPost[]) {
    console.log(data);
  }

  private afterError(error: HttpErrorResponse) {
    console.log(error);
  }

  public sendPost: IHttpResource<Post, IPost> = myHttpResource().post({
    url:'https://jsonplaceholder.typicode.com/posts',
    manual: true,
    pipe: pipe(delay(1000)),
    body: testPost,
    afterSuccess: (data: IPost) => this.afterPostSuccess(data),
  })

  private afterPostSuccess(data: IPost) {
    this.posts.value.update((v: IPost[]) => [...v, data])
  }

  public updatePost: IHttpResource<Put> = myHttpResource().put({
    url:'https://jsonplaceholder.typicode.com/posts/{{postId}}',
    urlParams: { postId: 1 },
    manual: true,
    afterSuccess: (data: IPost) => this.afterPutPostHandler(data),
  })

  private afterPutPostHandler(data: IPost) {
    console.log(data)
  }

  public patchPost: IHttpResource<Patch> = myHttpResource().patch({
    url:'https://jsonplaceholder.typicode.com/posts/{{postId}}',
    urlParams: { postId: 1 },
    manual: true,
    afterSuccess: (data: IPost) => this.afterPatchPostHandler(data),
  })

  private afterPatchPostHandler(data: IPost) {
    console.log(data)
  }

  public deletePost: IHttpResource<Delete> = myHttpResource().delete({
    url:'https://jsonplaceholder.typicode.com/posts/{{postId}}',
    urlParams: { postId: 1 },
    manual: true,
    afterSuccess: (data: IPost) => this.afterDeletePostHandler(data),
  })

  private afterDeletePostHandler(data: IPost) {
    console.log(data)
  }
}
