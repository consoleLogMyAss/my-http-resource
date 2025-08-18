import { Signal, WritableSignal } from '@angular/core';
import { Observable, UnaryFunction } from 'rxjs';
import { TFetchData, TQueryParams, TUrlParams } from '../types';
import { HttpErrorResponse } from '@angular/common/http';

export interface IHttpResource<T = any> {
  loading: Signal<boolean>,
  value: WritableSignal<T>,
  error: WritableSignal<unknown>,
  fetch: (fetData?: TFetchData) => void,
  request$: () => Observable<T>,
}

export interface IBaseRequestData<T> {
  url: string;
  afterSuccess?: (data: T) => void;
  afterError?: (error: HttpErrorResponse) => void;
  manual?: boolean;
  pipe?: UnaryFunction<Observable<T>, Observable<T>>;
  urlParams?: TUrlParams;
  initialValue?: any
  headers?: Record<string, string | number>
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
