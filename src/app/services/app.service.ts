import { Injectable } from '@angular/core';
import {IHttpResource, myHttpResource, Get, Post, Put} from 'my-http-resource';
import { delay, pipe } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { IPost } from '../app';

export const testPost = {
  postId: 8,
  id: 17,
  name: "Иван Иванов",
  email: "IvanIvanov@gmail.com",
  body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis, similique.'
}

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public posts: IHttpResource<Get> = myHttpResource().get<IPost[]>({
    url:'https://jsonplaceholder.typicode.com/posts/{{postId}}/comments',
    pipe: pipe(delay(1000)),
    afterSuccess: (data: IPost[]) => this.afterSuccess(data),
    afterError: (error: HttpErrorResponse) => this.afterError(error),
    urlParams: { postId: 2 },
    headers: {
      testHeader: '12345'
    },
    queryParams: { currency: 'USD' },
    manual: true,
    initialValue: []
  });

  private afterSuccess(data: IPost[]) {
    console.log('%cЭтот запрос закончился благополучно', 'font-size: 25px; color: green')
    console.log(data);
  }

  private afterError(error: HttpErrorResponse) {
    console.log('%cЭтот запрос закончился с ошибкой', 'font-size: 25px; color: red')
    console.log(error);
  }

  public sendPost: IHttpResource<Post> = myHttpResource().post({
    url:'https://jsonplaceholder.typicode.com/posts',
    manual: true,
    pipe: pipe(delay(1000)),
    body: testPost,
    afterSuccess: (data: IPost) => this.afterPostSuccess(data),
  })

  private afterPostSuccess(data: IPost) {
    this.posts.value.update((v: IPost[]) => [...v, data])
  }

  public putPostHandler: IHttpResource<Put> = myHttpResource().put({
    url:'https://jsonplaceholder.typicode.com/posts/{{postId}}',
    urlParams: { postId: 1 },
    manual: true,
    afterSuccess: (data: IPost) => this.afterPutPostHandler(data),
  })

  private afterPutPostHandler(data: IPost) {
    console.log(data)
  }
}
