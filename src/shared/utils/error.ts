export function showError(error: unknown) {
  return error instanceof Error ? error.message : 'Неизвестная ошибка'
}
