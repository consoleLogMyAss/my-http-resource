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
  queryParams?: TQueryParams,
  urlParams?: TUrlParams,
}

export type TResult<U> = {
  next: (result: U) => void;
  error: (error: HttpErrorResponse) => void;
}

export type TMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';
export type TMethodFnGetOrDelete<T> = (u: string, o?: any) => Observable<T>
export type TMethodFnPostOrPatchOrPut<T> = (u: string, o: object, h: object) => Observable<T>

