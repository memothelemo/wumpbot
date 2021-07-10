declare namespace NodeJS {
	interface Process {
		env: {
			/* Put your env entries here! */
			TOKEN: string;
			PREFIX: string;
		};
	}
}
