import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-customer-form-placeholder',
  templateUrl: './customer-form-placeholder.component.html',
  styleUrls: ['../placeholder-page.scss']
})
export class CustomerFormPlaceholderComponent {
  private readonly route = inject(ActivatedRoute);

  readonly title = this.route.snapshot.data['mode'] === 'edit'
    ? 'Editar cliente'
    : 'Nuevo cliente';
}
