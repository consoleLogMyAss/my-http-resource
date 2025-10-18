import { Signal, WritableSignal } from '@angular/core';
import { Observable, UnaryFunction } from 'rxjs';
import { TQueryParams, TUrlParams } from '../types';
import { HttpErrorResponse } from '@angular/common/http';

export interface IHttpResource<Method, T = any> {
  loading: Signal<boolean>,
  value: WritableSignal<T>,
  error: WritableSignal<unknown>,
  fetch: (fetData?: Method) => void,
  request$: (fetData?: Method) => Observable<any>,
}

export interface IBaseRequestData<T> {
  url: string;
  afterSuccess?: (data: T) => void;
  afterError?: (error: HttpErrorResponse) => void;
  headers?: Record<string, string | number>
  initialValue?: any
  manual?: boolean;
  mergeValues?: boolean;
  pipe?: UnaryFunction<Observable<T>, Observable<T>>;
  urlParams?: TUrlParams;
}

export interface IWithOutBody<T> extends IBaseRequestData<T> {
  queryParams?: TQueryParams;
}

export interface IWithOutBodyDelete<T> extends IWithOutBody<T> {
  queryParams?: TQueryParams;
  body?: object;
}

export interface IWithBody<T> extends IBaseRequestData<T> {
  body?: object;
}

export type IRequest<T> =
  | IWithOutBody<T>
  | IWithBody<T>
