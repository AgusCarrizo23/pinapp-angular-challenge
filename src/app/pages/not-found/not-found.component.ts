import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent {
  readonly isPublic: boolean;

  constructor(
    private readonly location: Location,
    route: ActivatedRoute
  ) {
    this.isPublic = route.snapshot.data['isPublic'] === true;
  }

  goBack(): void {
    this.location.back();
  }
}