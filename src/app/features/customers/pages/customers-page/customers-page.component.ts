import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Customer } from '../../interfaces/customer';
import { CustomerDetailDialogComponent } from '../../dialogs/customer-detail-dialog/customer-detail-dialog.component';
import { CustomersService } from '../../services/customers.service';
import {
  CustomerSortOption,
  filterAndSortCustomers,
  paginateCustomers
} from '../../utils/customer-list';

interface SortOption {
  value: CustomerSortOption;
  label: string;
}

@Component({
  selector: 'app-customers-page',
  templateUrl: './customers-page.component.html',
  styleUrls: ['./customers-page.component.scss']
})
export class CustomersPageComponent implements OnInit, OnDestroy {
  private readonly customersService = inject(CustomersService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private customersSubscription?: Subscription;

  readonly displayedColumns = ['name', 'lastName', 'age', 'birthDate', 'actions'];
  readonly pageSizeOptions = [5, 10, 25, 50];
  readonly sortOptions: SortOption[] = [
    { value: 'name-asc', label: 'Nombre (A-Z)' },
    { value: 'name-desc', label: 'Nombre (Z-A)' },
    { value: 'age-asc', label: 'Edad ascendente' },
    { value: 'age-desc', label: 'Edad descendente' },
    { value: 'birth-date-asc', label: 'Fecha de nacimiento ascendente' },
    { value: 'birth-date-desc', label: 'Fecha de nacimiento descendente' },
    { value: 'created-desc', label: 'Mas recientes' },
    { value: 'created-asc', label: 'Mas antiguos' }
  ];

  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  visibleCustomers: Customer[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  sortOption: CustomerSortOption = 'name-asc';
  pageIndex = 0;
  pageSize = 10;

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customersSubscription?.unsubscribe();
    this.isLoading = true;
    this.errorMessage = '';

    this.customersSubscription = this.customersService.getCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
        this.isLoading = false;
        this.applyFilters();
      },
      error: () => {
        this.customers = [];
        this.filteredCustomers = [];
        this.visibleCustomers = [];
        this.isLoading = false;
        this.errorMessage = 'No pudimos cargar los clientes.';
      }
    });
  }

  onSearchChange(value: string): void {
    this.searchTerm = value;
    this.applyFilters();
  }

  onSortChange(value: CustomerSortOption): void {
    this.sortOption = value;
    this.applyFilters();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateVisibleCustomers();
  }

  applyFilters(): void {
    this.filteredCustomers = filterAndSortCustomers(
      this.customers,
      this.searchTerm,
      this.sortOption
    );
    this.pageIndex = 0;
    this.updateVisibleCustomers();
  }

  private updateVisibleCustomers(): void {
    this.visibleCustomers = paginateCustomers(
      this.filteredCustomers,
      this.pageIndex,
      this.pageSize
    );
  }

  viewCustomer(customer: Customer): void {
    this.dialog.open(CustomerDetailDialogComponent, {
      width: '40.625rem',
      maxWidth: '95vw',
      autoFocus: false,
      restoreFocus: true,
      data: customer
    });
  }

  editCustomer(customer: Customer): void {
    if (!customer.id) {
      return;
    }

    void this.router.navigate(['/customers', customer.id, 'edit']);
  }

  deleteCustomer(customer: Customer): void {
    void customer;
    // luego agregar la funcionalidad de eliminacion de cliente.
  }

  ngOnDestroy(): void {
    this.customersSubscription?.unsubscribe();
  }
}