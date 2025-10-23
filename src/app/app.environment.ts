import { InjectionToken } from '@angular/core';
import { environment } from '../environments/environment';

export const ENV = new InjectionToken('env', {
  providedIn: 'root',
  factory: () => environment
});