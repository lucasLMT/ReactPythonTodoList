export class FormValidator {
  static fieldIsEmpty(fieldValue) {
    if (fieldValue === undefined || fieldValue.trim().length === 0)
      return fieldValue.length === 0;
  }
}
