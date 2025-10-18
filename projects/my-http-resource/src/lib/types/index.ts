import { HttpErrorResponse } from '@angular/common/http';
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
}

export type TFetchData = {
  urlParams?: TUrlParams,
  mergeValues?: boolean;
}

export type Get = {
  queryParams?: TQueryParams,
} & TFetchData;

export type Delete = {
  queryParams?: TQueryParams,
} & TFetchData;

export type Post = {
  body?: object;
} & TFetchData;

export type Patch = {
  body?: object;
} & TFetchData;

export type Put = {
  body?: object;
} & TFetchData;

export type TResult<U> = {
  next: (result: U) => void;
  error: (error: HttpErrorResponse) => void;
}

export type TMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';
export type TypeMethod = Get | Patch | Put | Post | Delete;
export type TMethodWithoutBody<T> = (u: string, o?: any) => Observable<T>
export type TMethodFnWithBody<T> = (u: string, o: object, h: object) => Observable<T>

