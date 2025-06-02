export function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}

export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}