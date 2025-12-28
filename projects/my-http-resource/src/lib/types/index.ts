import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs';

export type TQueryParams = {
  [key: string]: string | number | boolean;
}

export type TUrlParams = {
  [key: string]: string | number;
}

export type TOptionsData = {
  params: TQueryParams;
  body: object;
  headers: object;
  options: object
}

export type TFetchData<M extends TMethod> = {
  urlParams?: TUrlParams,
  mergeValues?: boolean;
  options?: HttpOptions<M>;
}

export type Get = {
  queryParams?: TQueryParams,
} & TFetchData<'get'>;

export type Delete = {
  queryParams?: TQueryParams,
  body?: object;
} & TFetchData<'delete'>;

export type Post = {
  body?: object;
} & TFetchData<'post'>;

export type Patch = {
  body?: object;
} & TFetchData<'patch'>;

export type Put = {
  body?: object;
} & TFetchData<'put'>;

export type TResult<U> = {
  next: (result: U) => void;
  error: (error: HttpErrorResponse) => void;
}

export type TMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';
export type TypeMethod = Get | Patch | Put | Post | Delete;
export type HttpOptions<M extends TMethod> = Parameters<HttpClient[M]>[1];

export type TMethodWithoutBody<T> = (u: string, o?: any) => Observable<T>
export type TMethodFnWithBody<T> = (u: string, o: object, h: object) => Observable<T>

