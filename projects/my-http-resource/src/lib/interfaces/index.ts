import { Signal, WritableSignal } from '@angular/core';
import { Observable, UnaryFunction } from 'rxjs';
import { TQueryParams, TUrlParams } from '../types';
import { HttpErrorResponse } from '@angular/common/http';

export interface IHttpResource<Method> {
  loading: Signal<boolean>,
  value: WritableSignal<any>,
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

export interface IGetOrDeleteData<T> extends IBaseRequestData<T> {
  queryParams?: TQueryParams;
}

export interface IPostOrPutOrPatchData<T> extends IBaseRequestData<T> {
  body?: object;
}

export type IRequest<T> =
  | IGetOrDeleteData<T>
  | IPostOrPutOrPatchData<T>
