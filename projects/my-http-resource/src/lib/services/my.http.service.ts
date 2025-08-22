import {DestroyRef, inject, Injectable} from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IGetOrDeleteData, IHttpResource, IPostOrPutOrPatchData, IRequest } from '../interfaces';
import { ReactiveHttpModel} from '../model/reactive.http.model';
import {
  Delete,
  Get, Patch, Post, Put,
  TFetchData,
  TMethod,
  TMethodFnGetOrDelete,
  TMethodFnPostOrPatchOrPut,
  TOptionsData,
  TResult,
  TUrlParams, TypeMethod
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

  public get<T = any>(data: IGetOrDeleteData<T>): IHttpResource<Get> {
    return this.createResource<T, IGetOrDeleteData<T>, Get>(data, 'get');
  }

  public post<T = any>(data: IPostOrPutOrPatchData<T>): IHttpResource<Post> {
    return this.createResource<T, IPostOrPutOrPatchData<T>, Post>(data, 'post');
  }

  public patch<T = any>(data: IPostOrPutOrPatchData<T>): IHttpResource<Patch> {
    return this.createResource<T, IPostOrPutOrPatchData<T>, Patch>(data, 'patch');
  }

  public put<T = any>(data: IPostOrPutOrPatchData<T>): IHttpResource<Put> {
    return this.createResource<T, IPostOrPutOrPatchData<T>, Put>(data, 'put');
  }

  public delete<T = any>(data: IGetOrDeleteData<T>): IHttpResource<Delete> {
    return this.createResource<T, IGetOrDeleteData<T>, Delete>(data, 'delete');
  }

  private createResource<T, Req extends IRequest<T>, Method extends TypeMethod>(
    data: Req,
    method: TMethod,
  ): IHttpResource<Method> {
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
      request$: (fetchData: Method) => {
        return this.getHttp(method, {...data, ...fetchData})
      } ,
      fetch: (fetchData: Method) => {
        reactiveData.loading.set(true);

        this.getHttp(method, {
          ...data,
          ...fetchData,
        }).subscribe(getAfterActions);
      }
    }
  }
}
