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

  createCustomer(customer: Customer): Observable<void> {
    return new Observable<void>((subscriber) => {
      let isDestroyed = false;

      import('firebase/firestore')
        .then(async ({ addDoc, collection, getFirestore, serverTimestamp }) => {
          await addDoc(
            collection(getFirestore(this.firebaseApp), 'customers'),
            {
              name: customer.name,
              lastName: customer.lastName,
              age: customer.age,
              birthDate: customer.birthDate,
              createdAt: serverTimestamp()
            }
          );

          if (!isDestroyed) {
            subscriber.next();
            subscriber.complete();
          }
        })
        .catch((error: unknown) => subscriber.error(error));

      return () => {
        isDestroyed = true;
      };
    });
  }

  updateCustomer(id: string, customer: Partial<Customer>): Observable<void> {
    return new Observable<void>((subscriber) => {
      let isDestroyed = false;

      import('firebase/firestore')
        .then(async ({ doc, getFirestore, serverTimestamp, updateDoc }) => {
          await updateDoc(
            doc(getFirestore(this.firebaseApp), 'customers', id),
            {
              ...(customer.name !== undefined && { name: customer.name }),
              ...(customer.lastName !== undefined && { lastName: customer.lastName }),
              ...(customer.age !== undefined && { age: customer.age }),
              ...(customer.birthDate !== undefined && { birthDate: customer.birthDate }),
              updatedAt: serverTimestamp()
            }
          );

          if (!isDestroyed) {
            subscriber.next();
            subscriber.complete();
          }
        })
        .catch((error: unknown) => subscriber.error(error));

      return () => {
        isDestroyed = true;
      };
    });
  }

  deleteCustomer(id: string): Observable<void> {
    return new Observable<void>((subscriber) => {
      let isDestroyed = false;

      import('firebase/firestore')
        .then(async ({ deleteDoc, doc, getFirestore }) => {
          await deleteDoc(doc(getFirestore(this.firebaseApp), 'customers', id));

          if (!isDestroyed) {
            subscriber.next();
            subscriber.complete();
          }
        })
        .catch((error: unknown) => subscriber.error(error));

      return () => {
        isDestroyed = true;
      };
    });
  }
}