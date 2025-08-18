import { IRequest } from '../interfaces';
import { TOptionsData } from '../types';
import { HttpHeaders } from '@angular/common/http';

export class ParamsModel<T> {
  public body: TOptionsData['body'] = {}
  public params: TOptionsData['params'] = {}
  public headers: TOptionsData['headers'] = {}

  constructor(data?: IRequest<T>) {
    if ('queryParams' in data) this.params = data.queryParams;
    if ('body' in data) this.body = data.body;
    if ('headers' in data) this.headers = new HttpHeaders(data.headers);
  }
}
