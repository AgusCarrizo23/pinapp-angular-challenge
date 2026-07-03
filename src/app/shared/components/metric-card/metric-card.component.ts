import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

type MetricCardTone = 'blue' | 'green' | 'purple';

@Component({
  selector: 'app-metric-card',
  templateUrl: './metric-card.component.html',
  styleUrls: ['./metric-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetricCardComponent {
  @Input() title = '';
  @Input() value: number | string | null = 0;
  @Input() subtitle = '';
  @Input() icon = '';
  @Input() tone: MetricCardTone = 'blue';
}