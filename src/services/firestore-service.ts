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

		players.splice(5);

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
