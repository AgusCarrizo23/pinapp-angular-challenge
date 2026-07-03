import { Directive, ElementRef, HostListener, inject } from '@angular/core';

import { sanitizeLettersInput } from '../utils/customer-form-validators';

@Directive({
  selector: 'input[appLettersOnly]'
})
export class LettersOnlyInputDirective {
  private readonly elementRef = inject(ElementRef<HTMLInputElement>);

  @HostListener('beforeinput', ['$event'])
  preventInvalidInput(event: InputEvent): void {
    if (event.isComposing || event.data === null) {
      return;
    }

    if (sanitizeLettersInput(event.data) !== event.data) {
      event.preventDefault();
    }
  }

  @HostListener('input')
  sanitizeInput(): void {
    const input = this.elementRef.nativeElement;
    const currentValue = input.value;
    const sanitizedValue = sanitizeLettersInput(currentValue);

    if (currentValue === sanitizedValue) {
      return;
    }

    const cursorPosition = input.selectionStart ?? currentValue.length;
    const sanitizedPrefix = sanitizeLettersInput(
      currentValue.slice(0, cursorPosition)
    );

    input.value = sanitizedValue;
    input.setSelectionRange(sanitizedPrefix.length, sanitizedPrefix.length);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
}