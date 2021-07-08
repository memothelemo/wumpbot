declare namespace NodeJS {
	interface Process {
		env: {
			/* Put your env entries here! */
			BOT_TOKEN: string;
			PREFIX: string;
		};
	}
}
