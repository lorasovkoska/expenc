// bunch of validation helpers so we don't repeat ourselves
export const validateAmount = (amount: number): string | null => {
  if (amount <= 0) return 'Amount must be greater than 0';
  if (!/^\d+(\.\d{1,2})?$/.test(amount.toString())) {
    return 'Amount can only have up to 2 decimal places';
  }
  return null;
};

export const validateDate = (dateStr: string): string | null => {
  if (!dateStr) return 'Date is required';

  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date > today) {
    return 'Cannot add expenses for future dates';
  }

  return null;
};

export const validateCategory = (category: string, validCategories: string[]): string | null => {
  if (!category) return 'Category is required';
  if (!validCategories.includes(category)) return 'Invalid category';
  return null;
};

export const validateDescription = (description?: string): string | null => {
  if (description && description.length > 100) {
    return 'Description must be 100 characters or less';
  }
  return null;
};

// run all validations at once - returns first error found
export const validateExpenseForm = (
  amount: number,
  category: string,
  dateStr: string,
  description: string | undefined,
  validCategories: string[]
): string | null => {
  return (
    validateAmount(amount) ||
    validateCategory(category, validCategories) ||
    validateDate(dateStr) ||
    validateDescription(description)
  );
};
