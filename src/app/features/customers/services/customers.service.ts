import { Injectable, inject } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Observable } from 'rxjs';

import { Customer } from '../interfaces/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private readonly firebaseApp = inject(FirebaseApp);

  getCustomers(): Observable<Customer[]> {
    return new Observable<Customer[]>((subscriber) => {
      let unsubscribe: (() => void) | undefined;
      let isDestroyed = false;

      import('firebase/firestore')
        .then(({ collection, getFirestore, onSnapshot }) => {
          if (isDestroyed) {
            return;
          }

          const customersCollection = collection(
            getFirestore(this.firebaseApp),
            'customers'
          );

          unsubscribe = onSnapshot(
            customersCollection,
            (snapshot) => {
              subscriber.next(
                snapshot.docs.map((document) => ({
                  ...document.data(),
                  id: document.id
                }) as Customer)
              );
            },
            (error) => subscriber.error(error)
          );
        })
        .catch((error: unknown) => subscriber.error(error));

      return () => {
        isDestroyed = true;
        unsubscribe?.();
      };
    });
  }
}