import firebaseClient from "../configs/firebase-client";
import apiSportsService from "./api-sports-service";
import { deleteDoc, doc, getFirestore, setDoc } from "firebase/firestore";
import { collection, getDocs, query } from "firebase/firestore";
import Player from "../models/player";
import leagues from "../configs/leagues";

export class FirestoreService {
	private firestoreDb;

	constructor() {
		this.firestoreDb = getFirestore(firebaseClient);
	}

	async createDb() {
		const leaguesRef = collection(this.firestoreDb, "leagues");

		leagues.forEach(async (league) => {
			const leagueDocRef = doc(leaguesRef, league.value.toString());

			await setDoc(leagueDocRef, league);

			const seasonsRef = collection(leagueDocRef, "seasons");

			var seasonsData: number[] = await apiSportsService.getSeasons();
			seasonsData = seasonsData.filter((val: number) => {
				return val <= new Date().getFullYear() - 1 && val >= 2010;
			});

			seasonsData.forEach(async (season) => {
				const seasonDocRef = doc(seasonsRef, season.toString());

				await setDoc(seasonDocRef, { season: season });

				const playerData = await apiSportsService.getTopScorers(
					season,
					league.value
				);

				const playerRef = collection(seasonDocRef, "players");

				playerData.forEach(async (player: any) => {
					const playerDocRef = doc(playerRef, player.player.id.toString());
					await setDoc(playerDocRef, player);
				});
			});
		});
	}

	async addPlayersInSeason(leagueId: number, seasonId: number) {
		const playerData = await apiSportsService.getTopScorers(seasonId, leagueId);

		const playersRef = collection(
			this.firestoreDb,
			`leagues/${leagueId}/seasons/${seasonId}/players`
		);

		for (const player of playerData) {
			const playerDocRef = doc(playersRef, player.player.id.toString());
			await setDoc(playerDocRef, player);
		}
	}

	async getTopScorers(seasonId: number, leagueId: number) {
		const q = query(
			collection(
				this.firestoreDb,
				"leagues",
				leagueId.toString(),
				"seasons",
				seasonId.toString(),
				"players"
			)
		);

		const querySnapshot = await getDocs(q);

		const players = querySnapshot.docs.map<Player>(
			(doc) => doc.data() as Player
		);

		players.sort((a, b) => {
			const goalsA = a.statistics[0]?.goals.total || 0;
			const goalsB = b.statistics[0]?.goals.total || 0;
			const assistsA = a.statistics[0]?.goals.assists || 0;
			const assistsB = b.statistics[0]?.goals.assists || 0;

			if (goalsB !== goalsA) {
				return goalsB - goalsA;
			} else {
				return assistsB - assistsA;
			}
		});

		players.splice(10);

		return players;
	}

	async getSeasons(leagueId: number) {
		const q = query(
			collection(this.firestoreDb, "leagues", leagueId.toString(), "seasons")
		);

		const querySnapshot = await getDocs(q);

		const seasons = querySnapshot.docs.map<number>(
			(doc) => doc.data().season as number
		);

		return seasons;
	}

	async updateSeason(leagueId: number, seasonId: number) {
		await this.deletePlayersInSeason(leagueId, seasonId);
		await this.addPlayersInSeason(leagueId, seasonId);
	}

	async updateLatestSeason() {
		let seasonId: number;

		if (new Date().getMonth() >= 8) {
			seasonId = new Date().getFullYear();
		} else {
			seasonId = new Date().getFullYear() - 1;
		}

		leagues.forEach(async (league) => {
			await this.updateSeason(league.value, seasonId);
			console.log(`Updated ${league.name} data for season ${seasonId}.`);
			await new Promise((f) => setTimeout(f, 30000));
		});
	}

	async deletePlayersInSeason(leagueId: number, seasonId: number) {
		const playersRef = collection(
			this.firestoreDb,
			`leagues/${leagueId}/seasons/${seasonId}/players`
		);

		const playersSnapshot = await getDocs(playersRef);

		playersSnapshot.forEach(async (playerDoc) => {
			await deleteDoc(playerDoc.ref);
		});
	}
}

export default new FirestoreService();
