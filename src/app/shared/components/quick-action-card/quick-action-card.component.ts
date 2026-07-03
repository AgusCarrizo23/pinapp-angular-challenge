import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

type QuickActionTone = 'blue' | 'green';

@Component({
  selector: 'app-quick-action-card',
  templateUrl: './quick-action-card.component.html',
  styleUrls: ['./quick-action-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuickActionCardComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() icon = '';
  @Input() route = '/';
  @Input() tone: QuickActionTone = 'blue';
}