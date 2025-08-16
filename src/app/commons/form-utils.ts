import { AbstractControl } from "@angular/forms";

export function noSpecialChars(control: AbstractControl) {
  const forbidden = /[^a-zA-Z0-9\s]/.test(control.value);
  return forbidden ? { specialChars: true } : null;
}