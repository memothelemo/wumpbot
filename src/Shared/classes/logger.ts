import kleur from "kleur";

export class Logger {
	constructor(
		private header: string,
		private kleurColorFunction: kleur.Color,
		private verbose = false,
	) {}

	private format(text: string) {
		return `[${this.kleurColorFunction(this.header)}]: ${text}\n`;
	}

	public writeIfVerbose(message: string) {
		if (this.verbose) {
			this.write(`VERBOSE | ${message}`);
		}
	}

	public write(message: string) {
		process.stdout.write(this.format(message));
	}
}
