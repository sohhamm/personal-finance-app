export type ClassName = string | boolean | null | undefined

/**
 * Conditionally join classNames into a single string
 * @param {...ClassName} args The expressions to evaluate
 * @returns {string} The joined classNames
 */
export function cx(...args: ClassName[]): string {
  return args.filter((arg): arg is string => typeof arg === 'string' && Boolean(arg)).join(' ')
}
