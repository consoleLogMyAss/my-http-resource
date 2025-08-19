import { MyHttpService } from '../services/my.http.service';

export function myHttpResource(): MyHttpService {
  return new MyHttpService();
}
