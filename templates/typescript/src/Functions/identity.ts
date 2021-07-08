/**
 * Identity allows to typed out the value
 *
 * Useful if you want to export something typed
 */
export function identity<T>(value: T): T {
	return value;
}
