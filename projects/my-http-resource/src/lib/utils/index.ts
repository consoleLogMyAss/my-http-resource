import { MyHttpService } from '../services/my.http.service';

export function myHttpResource() {
  return new MyHttpService();
}
