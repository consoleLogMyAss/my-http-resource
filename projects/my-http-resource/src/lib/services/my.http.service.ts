import {DestroyRef, inject, Injectable} from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IGetOrDeleteData, IHttpResource, IPostOrPutOrPatchData, IRequest } from '../interfaces';
import { ReactiveHttpModel} from '../model/reactive.http.model';
import {
  TFetchData,
  TMethod,
  TMethodFnGetOrDelete,
  TMethodFnPostOrPatchOrPut,
  TOptionsData,
  TResult,
  TUrlParams
} from '../types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ParamsModel } from '../model/params.model';

export class MyHttpService {
  private http: HttpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef)

  private getAfterActions<T>(reactiveData: ReactiveHttpModel<T>, data: IRequest<T>): TResult<T> {
    return {
      next: (result: T): void => {
        reactiveData.value.set(result)
        reactiveData.loading.set(false);

        if (data.afterSuccess) data.afterSuccess(result);
      },
      error: (error: HttpErrorResponse) => {
        reactiveData.error.set(error)
        reactiveData.loading.set(false);

        if (data.afterError) data.afterError(error);
      },
    }
  }

  private createUrl(url: string, urlParams: TUrlParams): string {
    return url.replace(/{{(.*?)}}/g, (_, key) => {
      const trimmedKey: string = key.trim();
      const value: string | number = urlParams?.[trimmedKey];

      if (value === undefined) {
        throw new Error(`Missing value for URL parameter: ${trimmedKey}`);
      }

      return encodeURIComponent(value);
    });
  }

  private getHttp<T>(method: TMethod, data: IRequest<T>): Observable<T> {
    const url: string = this.createUrl(data.url, data.urlParams);
    const { body, params, headers }: Partial<TOptionsData> = new ParamsModel(data);
    const isGetOrDelete: boolean = ['get', 'delete'].includes(method);

    const request$ = isGetOrDelete
      ? (this.http[method] as TMethodFnGetOrDelete<T>)(url, { params, headers })
      : (this.http[method] as TMethodFnPostOrPatchOrPut<T>)(url, body, { headers });

    const baseRequest: Observable<T> = request$.pipe(takeUntilDestroyed(this.destroyRef));

    return data.pipe ? baseRequest.pipe(data.pipe) : baseRequest;
  }

  public get<T>(data: IGetOrDeleteData<T>): IHttpResource<T> {
    return this.createResource<T, IGetOrDeleteData<T>>(data, 'get');
  }

  public post<T>(data: IPostOrPutOrPatchData<T>): IHttpResource<T> {
    return this.createResource<T, IPostOrPutOrPatchData<T>>(data, 'post');
  }

  public patch<T>(data: IPostOrPutOrPatchData<T>): IHttpResource<T> {
    return this.createResource<T, IPostOrPutOrPatchData<T>>(data, 'patch');
  }

  public put<T>(data: IPostOrPutOrPatchData<T>): IHttpResource<T> {
    return this.createResource<T, IPostOrPutOrPatchData<T>>(data, 'put');
  }

  public delete<T>(data: IGetOrDeleteData<T>): IHttpResource<T> {
    return this.createResource<T, IGetOrDeleteData<T>>(data, 'delete');
  }

  private createResource<T, Req extends IRequest<T>>(
    data: Req,
    method: TMethod,
  ): IHttpResource<T> {
    const reactiveData: ReactiveHttpModel<T> = new ReactiveHttpModel(data.initialValue);
    const getAfterActions: TResult<T> = this.getAfterActions(reactiveData, data);

    if (!data.manual) {
      reactiveData.loading.set(true);
      this.getHttp(method, data).subscribe(getAfterActions);
    }

    return {
      value: reactiveData.value,
      error: reactiveData.error,
      loading: reactiveData.loading.asReadonly(),
      request$: (fetchData: TFetchData = {}) => {
        return this.getHttp(method, {...data, ...fetchData})
      } ,
      fetch: (fetchData: TFetchData = {}) => {
        reactiveData.loading.set(true);

        this.getHttp(method, {
          ...data,
          ...fetchData,
        }).subscribe(getAfterActions);
      }
    }
  }
}
