import httpClient from "../configs/http-client";
import type PlayerResponse from "../models/player-response";

export class ApiSportsService {
	async getTopScorers(seasonId: number, leagueId: number) {
		return (
			await httpClient.get<PlayerResponse>(
				`players/topscorers?season=${seasonId}&league=${leagueId}`
			)
		).data.response;
	}

	async getSeasons() {
		return (await httpClient.get(`leagues/seasons`)).data.response;
	}
}

export default new ApiSportsService();
