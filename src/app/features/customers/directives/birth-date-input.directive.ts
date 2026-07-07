import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  inject
} from '@angular/core';

import {
  formatBirthDateInput,
  isValidPartialBirthDate
} from '../utils/birth-date-input';

@Directive({
  selector: 'input[appBirthDateInput]'
})
export class BirthDateInputDirective {
  private readonly elementRef = inject(ElementRef<HTMLInputElement>);
  private readonly maxYear = new Date().getFullYear();
  private dispatchingInput = false;

  @HostBinding('attr.inputmode') readonly inputMode = 'numeric';
  @HostBinding('attr.maxlength') readonly maxLength = 10;

  @HostListener('beforeinput', ['$event'])
  controlInput(event: InputEvent): void {
    if (event.isComposing) {
      return;
    }

    if (event.inputType.startsWith('insert') && event.data !== null) {
      this.insert(event, event.data);
      return;
    }

    if (event.inputType === 'deleteContentBackward') {
      this.delete(event, true);
      return;
    }

    if (event.inputType === 'deleteContentForward') {
      this.delete(event, false);
    }
  }

  @HostListener('input')
  sanitizeFallbackInput(): void {
    if (this.dispatchingInput) {
      return;
    }

    const input = this.elementRef.nativeElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 8);
    const sanitizedValue = isValidPartialBirthDate(digits, this.maxYear)
      ? formatBirthDateInput(digits)
      : '';

    if (input.value === sanitizedValue) {
      return;
    }

    input.value = sanitizedValue;
    this.dispatchInput(input);
  }

  private insert(event: InputEvent, insertedValue: string): void {
    const input = this.elementRef.nativeElement;
    const currentDigits = this.getDigits(input.value);
    const { start, end } = this.getSelectedDigitRange(input);
    const insertedDigits = this.getDigits(insertedValue);
    const nextDigits = (
      currentDigits.slice(0, start)
      + insertedDigits
      + currentDigits.slice(end)
    ).slice(0, 8);

    event.preventDefault();

    if (!insertedDigits || !isValidPartialBirthDate(nextDigits, this.maxYear)) {
      return;
    }

    this.updateInput(nextDigits, start + insertedDigits.length);
  }

  private delete(event: InputEvent, backwards: boolean): void {
    const input = this.elementRef.nativeElement;
    const currentDigits = this.getDigits(input.value);
    let { start, end } = this.getSelectedDigitRange(input);

    event.preventDefault();

    if (start === end) {
      if (backwards && start > 0) {
        start -= 1;
      } else if (!backwards && end < currentDigits.length) {
        end += 1;
      } else {
        return;
      }
    }

    const nextDigits = currentDigits.slice(0, start) + currentDigits.slice(end);
    this.updateInput(nextDigits, start);
  }

  private updateInput(digits: string, cursorAfterDigit: number): void {
    const input = this.elementRef.nativeElement;
    const formattedValue = formatBirthDateInput(digits);
    const cursorPosition = this.getCursorPosition(formattedValue, cursorAfterDigit);

    input.value = formattedValue;
    input.setSelectionRange(cursorPosition, cursorPosition);

    this.dispatchInput(input);
  }

  private dispatchInput(input: HTMLInputElement): void {
    this.dispatchingInput = true;

    try {
      input.dispatchEvent(new Event('input', { bubbles: true }));
    } finally {
      this.dispatchingInput = false;
    }
  }

  private getSelectedDigitRange(input: HTMLInputElement): {
    start: number;
    end: number;
  } {
    const selectionStart = input.selectionStart ?? input.value.length;
    const selectionEnd = input.selectionEnd ?? selectionStart;

    return {
      start: this.getDigits(input.value.slice(0, selectionStart)).length,
      end: this.getDigits(input.value.slice(0, selectionEnd)).length
    };
  }

  private getCursorPosition(value: string, digitCount: number): number {
    if (digitCount === 0) {
      return 0;
    }

    let digitsSeen = 0;

    for (let index = 0; index < value.length; index += 1) {
      if (/\d/.test(value[index])) {
        digitsSeen += 1;
      }

      if (digitsSeen === digitCount) {
        let position = index + 1;

        while (value[position] === '/') {
          position += 1;
        }

        return position;
      }
    }

    return value.length;
  }

  private getDigits(value: string): string {
    return value.replace(/\D/g, '');
  }
}