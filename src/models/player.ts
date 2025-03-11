export default interface Player {
	player: {
		id: number;
		name: string;
		firstname: string;
		lastname: string;
		age: number;
		birth: {
			date: string;
			place: string;
			country: string;
		};
		nationality: string;
		height: string;
		photo: string;
	};
	statistics: [
		{
			team: {
				id: number;
				name: string;
				logo: string;
			};
			games: {
				appearences: number;
				lineups: number;
				minutes: number;
				position: string;
				rating: string;
			};
			goals: {
				total: number;
				assists: number;
			};
		}
	];
}
