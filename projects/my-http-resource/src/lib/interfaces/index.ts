import { Signal, WritableSignal } from '@angular/core';
import { Observable, UnaryFunction } from 'rxjs';
import { HttpOptions, TMethod, TQueryParams, TUrlParams } from '../types';
import { HttpErrorResponse } from '@angular/common/http';

export interface IHttpResource<Method, T = any> {
  loading: Signal<boolean>,
  value: WritableSignal<T>,
  error: WritableSignal<unknown>,
  fetch: (fetData?: Method) => void,
  request$: (fetData?: Method) => Observable<any>,
}

export interface IBaseRequestData<T, M extends TMethod> {
  url: string;
  afterSuccess?: (data: T) => void;
  afterError?: (error: HttpErrorResponse) => void;
  headers?: Record<string, string | number>
  initialValue?: any
  manual?: boolean;
  mergeValues?: boolean;
  pipe?: UnaryFunction<Observable<T>, Observable<T>>;
  urlParams?: TUrlParams;
  options?: HttpOptions<M>;
}

export interface IGetRequest<T> extends IBaseRequestData<T, 'get'> {
  queryParams?: TQueryParams;
}

export interface IPostRequest<T> extends IBaseRequestData<T, 'post'> {
  body?: object;
}

export interface IPatchRequest<T> extends IBaseRequestData<T, 'patch'> {
  body?: object;
}

export interface IPutRequest<T> extends IBaseRequestData<T, 'put'> {
  body?: object;
}

export interface IDeleteRequest<T> extends IBaseRequestData<T, 'delete'> {
  body?: object;
  queryParams?: TQueryParams;
}

export type IRequest<T> =
  | IGetRequest<T>
  | IPostRequest<T>
  | IPatchRequest<T>
  | IPutRequest<T>
  | IDeleteRequest<T>
