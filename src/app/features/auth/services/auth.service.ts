import { Injectable, inject } from '@angular/core';
import {
  Auth,
  User,
  authState,
  signInWithEmailAndPassword,
  signOut
} from '@angular/fire/auth';
import { FirebaseError } from 'firebase/app';
import { Observable, from, map, shareReplay, catchError, throwError } from 'rxjs';

import { AuthUser } from '../interfaces/auth-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly auth = inject(Auth);

  readonly currentUser$: Observable<AuthUser | null> = authState(this.auth).pipe(
    map((firebaseUser) => this.mapFirebaseUser(firebaseUser)),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly isAuthenticated$: Observable<boolean> = this.currentUser$.pipe(
    map((authUser) => authUser !== null)
  );

  login(email: string, password: string): Observable<AuthUser> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map(({ user }) => this.mapFirebaseUser(user)),
      map((authUser) => {
        if (!authUser) {
          throw new Error('No fue posible obtener la informacion del usuario autenticado.');
        }

        return authUser;
      }),
      catchError((error: unknown) => throwError(() => this.handleFirebaseError(error)))
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      catchError((error: unknown) => throwError(() => this.handleFirebaseError(error)))
    );
  }

  getCurrentUser(): AuthUser | null {
    return this.mapFirebaseUser(this.auth.currentUser);
  }

  private mapFirebaseUser(firebaseUser: User | null): AuthUser | null {
    if (!firebaseUser) {
      return null;
    }

    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName
    };
  }

  private handleFirebaseError(error: unknown): Error {
    if (!(error instanceof FirebaseError)) {
      return new Error('Ocurrio un error desconocido. Intentalo nuevamente.');
    }

    switch (error.code) {
      case 'auth/user-not-found':
        return new Error('No existe un usuario registrado con ese correo electronico.');
      case 'auth/wrong-password':
        return new Error('La contrasena ingresada es incorrecta.');
      case 'auth/invalid-credential':
      case 'auth/invalid-login-credentials':
        return new Error('Las credenciales ingresadas no son validas.');
      case 'auth/too-many-requests':
        return new Error('Demasiados intentos. Intentalo nuevamente mas tarde.');
      case 'auth/network-request-failed':
        return new Error('No se pudo conectar con el servicio. Verifica tu conexion a internet.');
      default:
        return new Error('Ocurrio un error desconocido. Intentalo nuevamente.');
    }
  }
}
