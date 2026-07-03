import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Observable, catchError, map, of, shareReplay, startWith } from 'rxjs';

import { AuthService } from '../../../auth/services/auth.service';
import { CustomersService } from '../../../customers/services/customers.service';
import {
  getAgeStandardDeviation,
  getAverageAge
} from '../../utils/dashboard-metrics';

interface DashboardMetrics {
  totalCustomers: number;
  averageAge: number;
  standardDeviation: number;
}

const EMPTY_METRICS: DashboardMetrics = {
  totalCustomers: 0,
  averageAge: 0,
  standardDeviation: 0
};

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent {
  private readonly authService = inject(AuthService);
  private readonly customersService = inject(CustomersService);

  readonly userName$: Observable<string> = this.authService.currentUser$.pipe(
    map((user) => user?.displayName?.trim() || 'Agustina')
  );

  readonly metrics$: Observable<DashboardMetrics> = this.customersService
    .getCustomers()
    .pipe(
      map((customers) => ({
        totalCustomers: customers.length,
        averageAge: getAverageAge(customers),
        standardDeviation: getAgeStandardDeviation(customers)
      })),
      catchError(() => of(EMPTY_METRICS)),
      startWith(EMPTY_METRICS),
      shareReplay({ bufferSize: 1, refCount: true })
    );
}