import { DestroyRef, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

import { IWithOutBody, IHttpResource, IWithBody, IRequest } from '../interfaces';
import { ReactiveHttpModel} from '../model/reactive.http.model';
import {
  Delete,
  Get,
  Patch,
  Post,
  Put,
  TMethod,
  TMethodWithoutBody,
  TMethodFnWithBody,
  TOptionsData,
  TResult,
  TUrlParams, TypeMethod
} from '../types';
import { ParamsModel } from '../model/params.model';

export class MyHttpService {
  private http: HttpClient = inject(HttpClient);
  private destroyRef: DestroyRef = inject(DestroyRef);

  private getAfterActions<T>(reactiveData: ReactiveHttpModel<T>, data: IRequest<T>): TResult<T> {
    return {
      next: (result: T): void => {
        const value: T = data.mergeValues
          ? this.mergeResult(result, reactiveData.value())
          : result

        reactiveData.value.set(value);

        if (data.afterSuccess) data.afterSuccess(value);

        reactiveData.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        reactiveData.error.set(error)

        if (data.afterError) data.afterError(error);

        reactiveData.loading.set(false);
      },
    }
  }

  private mergeResult<T>(result: T, currentValue: T): T {
    if (!result || !currentValue || typeof result !== typeof currentValue ) {
      return result;
    }

    if (Array.isArray(result) && Array.isArray(currentValue)) {
      return [...currentValue, ...result] as T;
    }

    if (
      typeof result === 'object' &&
      typeof currentValue === 'object' &&
      !Array.isArray(result) &&
      !Array.isArray(currentValue)
    ) {
      return {...currentValue, ...result};
    }

    return result;
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

  private createConfigForWithOutBody(method: TMethod, paramsModel: Partial<TOptionsData>): any {
    const config: Partial<TOptionsData> = {
      params: paramsModel.params,
      headers: paramsModel.headers
    }

    if (method === 'delete') {
      config.body = paramsModel.body;
    }

    return config;
  }

  private getHttp<T>(method: TMethod, data: IRequest<T>): Observable<T> {
    const url: string = this.createUrl(data.url, data.urlParams);
    const paramsModel: Partial<TOptionsData> = new ParamsModel(data);
    const { body, headers }: Partial<TOptionsData> = paramsModel;
    const isWithoutBody: boolean = ['get', 'delete'].includes(method);

    const request$: Observable<T> = isWithoutBody
      ? (this.http[method] as TMethodWithoutBody<T>)(url, this.createConfigForWithOutBody(method, paramsModel))
      : (this.http[method] as TMethodFnWithBody<T>)(url, body, { headers });

    const baseRequest: Observable<T> = request$.pipe(takeUntilDestroyed(this.destroyRef));

    return data.pipe ? baseRequest.pipe(data.pipe) : baseRequest;
  }

  public get<T = any>(data: IWithOutBody<T>): IHttpResource<Get, T> {
    return this.createResource<T, IWithOutBody<T>, Get>(data, 'get');
  }

  public delete<T = any>(data: IWithOutBody<T>): IHttpResource<Delete, T> {
    return this.createResource<T, IWithOutBody<T>, Delete>(data, 'delete');
  }

  public post<T = any>(data: IWithBody<T>): IHttpResource<Post, T> {
    return this.createResource<T, IWithBody<T>, Post>(data, 'post');
  }

  public patch<T = any>(data: IWithBody<T>): IHttpResource<Patch, T> {
    return this.createResource<T, IWithBody<T>, Patch>(data, 'patch');
  }

  public put<T = any>(data: IWithBody<T>): IHttpResource<Put, T> {
    return this.createResource<T, IWithBody<T>, Put>(data, 'put');
  }

  private createResource<T, Req extends IRequest<T>, Method extends TypeMethod>(
    data: Req,
    method: TMethod,
  ): IHttpResource<Method, T> {
    const reactiveData: ReactiveHttpModel<T> = new ReactiveHttpModel(data.initialValue);

    if (!data.manual) {
      reactiveData.loading.set(true);

      this.getHttp(method, data).subscribe(
        this.getAfterActions(reactiveData, data)
      );
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

        const mergedData: Req & Method = {  ...data, ...fetchData };

        this.getHttp(method, mergedData).subscribe(
          this.getAfterActions(reactiveData, mergedData)
        );
      }
    }
  }
}
