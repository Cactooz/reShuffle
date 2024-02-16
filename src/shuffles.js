import { fetchAudioFeatures, fetchTracksOfPlaylist } from './fetch';

export default async function shuffle(id, total) {
	switch (localStorage.getItem('shuffle')) {
		case 0:
			return spotifyShuffle2014(id, total);
		case 1:
			return fisherYatesShuffle(id, total);
		case 2:
			return epicShuffle(id, total);
		default:
			return fisherYatesShuffle(id, total);
	}
}

export async function spotifyShuffle2014(id, total) {
	//Fetch tracks
	const playlist = await fetchTracksOfPlaylist(id, total);
	//track array containing objects with artist and id
	const tracks = playlist
		.filter((trackObject) => !trackObject.track.is_local) //Remove local tracks
		.map((trackObject) => {
			return {
				artists: trackObject.track.artists,
				duration: trackObject.track.duration_ms,
				name: trackObject.track.name,
				playlist: 'spotify:playlist' + id,
				url: trackObject.track.external_urls.spotify,
				image: trackObject.track.album.images[2]?.url,
				uri: trackObject.track.uri,
			};
		});

	//Group by artist
	const groups = Object.groupBy(tracks, (track, index) => {
		return track.artists[0].name;
	});

	//Shuffle each group
	const shuffledGroups = {};
	for (const artist in groups)
		shuffledGroups[artist] = groups[artist].sort((a, b) => 0.5 - Math.random()); //Use FYS here, or recursive

	let newOrderOfTracks = new Array(tracks.length);
	//For every artist
	for (const artist in shuffledGroups) {
		const n = shuffledGroups[artist].length;
		const initialOffset = uniformRandom(0, 1 / n);
		newOrderOfTracks.push(
			shuffledGroups[artist].map((track, index) => {
				const offset = uniformRandom(-0.2 / n, 0.2 / n);
				const v = index / n + initialOffset + offset;
				return { ...track, v: v };
			}),
		);
		newOrderOfTracks = newOrderOfTracks.flat(1);
	}
	newOrderOfTracks = newOrderOfTracks.sort((track1, track2) => {
		return track1.v - track2.v;
	});

	newOrderOfTracks.forEach((track) => {
		delete track.v;
	});

	const uris = newOrderOfTracks.map((track) => {
		return track.uri;
	});

	return { queue: newOrderOfTracks, uris: uris };
}

export async function epicShuffle(id, total) {
	//Fetch playlist
	const playlist = await fetchTracksOfPlaylist(id, total);
	const tracks = playlist.filter((trackObject) => !trackObject.track.is_local); //Remove local tracks

	//Get all ids
	let ids = [];
	tracks.forEach((trackObject) => {
		ids = [...ids, trackObject.track.id];
	});

	//Fetch audio features
	const audioFeatures = await fetchAudioFeatures(ids);

	//Combine audio features with track
	let combinedData = tracks.map((trackObject, index) => {
		return { ...trackObject, ...audioFeatures[index] };
	});

	//Choose random 1st song
	let currentPlayingSongIndex = Math.floor(Math.random() * combinedData.length);
	let currentPlayingSong = combinedData[currentPlayingSongIndex];

	//Remove that song and add it to the queue
	combinedData.splice(currentPlayingSongIndex, 1);
	let queue = [currentPlayingSong];

	let weights = new Array(combinedData.length).fill(0); //Will hold weight for each remaining song. remaining and weight same index

	while (combinedData.length !== 0) {
		//Coordinates of currentlyPlaying song
		//acousticness, danceability, energy, instrumentalness, liveness, mode, speechiness, valence, artist
		const track1 = [
			currentPlayingSong.acousticness,
			currentPlayingSong.danceability,
			currentPlayingSong.energy,
			currentPlayingSong.instrumentalness,
			currentPlayingSong.liveness,
			currentPlayingSong.mode,
			currentPlayingSong.speechiness,
			currentPlayingSong.valence,
			0,
		];
		let sum = 0;
		const longestDistance = Math.sqrt(8 + Math.pow(3, 2));
		//Calculate distances to remaining songs
		weights = combinedData.map((audioFeaturesAndTrack, index) => {
			const track2 = [
				audioFeaturesAndTrack.acousticness,
				audioFeaturesAndTrack.danceability,
				audioFeaturesAndTrack.energy,
				audioFeaturesAndTrack.instrumentalness,
				audioFeaturesAndTrack.liveness,
				audioFeaturesAndTrack.mode,
				audioFeaturesAndTrack.speechiness,
				audioFeaturesAndTrack.valence,
				currentPlayingSong.track.artists[0].name === audioFeaturesAndTrack.track.artists[0].name
					? 3
					: 0,
			];
			const d = longestDistance - distance(track1, track2) + 0.3 * weights[index];
			sum += d;
			return d; //TODO: Can add so that previous weight matter, d + 0.3weights[index]
		});

		//Select weighted random song
		const weight = Math.random() * sum;
		let prev = 0;
		let songIndex = -1;
		for (let i = 0; i < weights.length; i++) {
			if (prev + weights[i] >= weight) {
				songIndex = i;
				break;
			}
			prev += weights[i];
		}

		//Add to queue and remove from remaining
		currentPlayingSong = combinedData[songIndex];
		combinedData.splice(songIndex, 1);
		queue.push(currentPlayingSong);
	}
	queue = queue.map((audioFeaturesAndTrack) => {
		return {
			artists: audioFeaturesAndTrack.track.artists,
			duration: audioFeaturesAndTrack.track.duration_ms,
			name: audioFeaturesAndTrack.track.name,
			playlist: 'spotify:playlist' + id,
			url: audioFeaturesAndTrack.track.external_urls.spotify,
			image: audioFeaturesAndTrack.track.album.images[2]?.url,
			uri: audioFeaturesAndTrack.track.uri,
		};
	});

	const uris = queue.map((track) => {
		return track.uri;
	});
	return { queue: queue, uris: uris };
}

export async function fisherYatesShuffle(id, total) {
	const playlist = await fetchTracksOfPlaylist(id, total);

	const tracks = playlist
		.filter((trackObject) => !trackObject.track.is_local) //Remove local tracks
		.map((trackObject) => {
			return {
				artists: trackObject.track.artists,
				duration: trackObject.track.duration_ms,
				name: trackObject.track.name,
				playlist: 'spotify:playlist' + id,
				url: trackObject.track.external_urls.spotify,
				image: trackObject.track.album.images[2]?.url,
				uri: trackObject.track.uri,
			};
		});

	let queue = [];

	while (tracks.length !== 0) {
		const index = Math.floor(Math.random() * tracks.length);
		queue = [tracks[index], ...queue];
		tracks.splice(index, 1);
	}

	const uris = queue.map((track) => {
		return track.uri;
	});
	return { queue: queue, uris: uris };
}

//Length of arrays is number of axis
function distance(track1, track2) {
	const sum = track1.reduce((accumulator, x, yIndex) => {
		return accumulator + Math.pow(x - track2[yIndex], 2);
	}, 0);
	return Math.sqrt(sum);
}

function uniformRandom(a, b) {
	return a + Math.random() * (b - a);
}