import { fetchAudioFeatures, fetchTracksOfPlaylist } from './fetch';

export async function shuffle(id, total, model) {
	let playlist;
	let tracks;
	if (model.currentPlaylistId !== id) {
		playlist = await fetchTracksOfPlaylist(id, total);
		tracks = filterTracks(playlist, id);
		model.setCurrentPlaylistId(id);
	} else {
		tracks = model.queue;
	}
	if (total === 0) return { queue: [], uris: [] };
	switch (localStorage.getItem('shuffle')) {
		case '0':
			return artistSpreadShuffle(tracks);
		case '1':
			return fisherYatesShuffle(tracks);
		case '2':
			return epicShuffle(tracks);
		case '3':
			return albumShuffle(tracks);
		case '4':
			return pureRandomShuffle(tracks);
		default:
			return artistSpreadShuffle(tracks);
	}
}

function filterTracks(playlist, id) {
	return playlist
		.filter(({ track }) => {
			if (!track) return false;
			return !track.is_local;
		}) //Remove invalid and local tracks
		.map(({ track }) => {
			return {
				artists: track.artists,
				duration: track.duration_ms,
				name: track.name,
				playlist: 'spotify:playlist' + id,
				url: track.external_urls.spotify,
				image: track.album.images[2]?.url,
				album: track.album,
				uri: track.uri,
				track_number: track.track_number,
				disc_number: track.disc_number,
				id: track.id,
			};
		});
}

export function artistSpreadShuffle(tracks) {
	//Group by artist
	const groups = Object.groupBy(tracks, (track) => {
		return track.artists[0].name;
	});

	//Shuffle each group
	const shuffledGroups = {};
	for (const artist in groups) {
		//Group by album
		const albumGroups = Object.groupBy(groups[artist], (track) => {
			return track.album.name;
		});
		//Spread the albums
		shuffledGroups[artist] = fisherYates(spread(albumGroups, groups[artist].length));
	}
	const spreadTracks = spread(shuffledGroups, tracks.length);

	for (let i = 0; i < tracks.length - 2; i++) {
		const currentArtists = spreadTracks[i].artists;
		const nextArtists = spreadTracks[i + 1].artists;
		const nextNextArtists = spreadTracks[i + 2].artists;

		if (currentArtists.length < 2 && nextArtists.length < 2) continue;

		//Check if next song have matching artists
		if (
			!currentArtists.some((artist) =>
				nextArtists.some((nextArtist) => artist.id === nextArtist.id),
			)
		)
			continue;

		//Check if two songs forward have matching artists
		if (
			currentArtists.some((artist) =>
				nextNextArtists.some((nextArtist) => artist.id === nextArtist.id),
			)
		)
			continue;

		//Swap the next two songs
		[spreadTracks[i + 1], spreadTracks[i + 2]] = [spreadTracks[i + 2], spreadTracks[i + 1]];
	}

	//Create array of uris
	const uris = spreadTracks.map((track) => {
		return track.uri;
	});

	return { queue: spreadTracks, uris: uris };
}

export async function epicShuffle(tracks) {
	let combinedData = tracks;
	//Only fetch if audio features are missing
	if (!combinedData[0].acousticness) {
		//Get all ids
		let ids = [];
		combinedData.forEach((track) => {
			ids = [...ids, track.id];
		});

		//Fetch audio features
		const audioFeatures = await fetchAudioFeatures(ids);
		//Combine audio features with track
		combinedData = tracks.map((track, index) => {
			return { ...track, ...audioFeatures[index] };
		});
	}

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
			currentPlayingSong.danceability,
			currentPlayingSong.energy / 2,
			currentPlayingSong.mode,
			currentPlayingSong.valence / 2,
			0,
		];
		let sum = 0;
		const longestDistance = Math.sqrt(3 + Math.pow(3, 2));
		//Calculate distances to remaining songs
		weights = combinedData.map((audioFeaturesAndTrack, index) => {
			const track2 = [
				audioFeaturesAndTrack.danceability,
				audioFeaturesAndTrack.energy / 2,
				audioFeaturesAndTrack.mode,
				audioFeaturesAndTrack.valence / 2,
				currentPlayingSong.artists[0].name === audioFeaturesAndTrack.artists[0].name ? 3 : 0,
			];
			const d = longestDistance - distance(track1, track2) + 0.3 * weights[index];
			sum += d;
			return d;
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

	const uris = queue.map((track) => {
		return track.uri;
	});
	return { queue: queue, uris: uris };
}

export function fisherYatesShuffle(tracks) {
	const queue = fisherYates(tracks);
	const uris = queue.map((track) => {
		return track.uri;
	});
	return { queue: queue, uris: uris };
}

export function albumShuffle(tracks) {
	//Group by album
	const albums = Object.groupBy(tracks, (track) => {
		return track.album.name;
	});

	//Sort albums on disc and track number
	const sortedAlbums = {};
	for (const album in albums) {
		sortedAlbums[album] = albums[album].sort((track1, track2) => {
			return track1.disc_number - track2.disc_number || track1.track_number - track2.track_number;
		});
	}

	//Group albums on artist
	const artistsAlbum = Object.groupBy(fisherYates(Object.values(sortedAlbums)), (album) => {
		return album[0].artists[0].name;
	});

	//Spread the artists
	const spreadedArtists = Object.values(spread(artistsAlbum, tracks.length));

	//Add tracks to queue
	let queue = [];
	for (const tracks in spreadedArtists) {
		queue = [...queue, ...Object.values(spreadedArtists[tracks])];
	}

	//Get uris of songs
	const uris = queue.map((track) => {
		return track.uri;
	});
	return { queue: queue, uris: uris };
}

export function pureRandomShuffle(tracks) {
	let queue = new Array(tracks.length);
	for (let i = 0; i < tracks.length; i++)
		queue[i] = tracks[Math.floor(Math.random() * tracks.length)];
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

function fisherYates(array) {
	let result = [];
	while (array.length !== 0) {
		const index = Math.floor(Math.random() * array.length);
		result = [array[index], ...result];
		array.splice(index, 1);
	}
	return result;
}

function spread(groups, length) {
	let newOrder = new Array(length);
	//For every attribute
	for (const attribute in groups) {
		const n = groups[attribute].length;
		const initialOffset = uniformRandom(0, 1 / n);
		newOrder.push(
			groups[attribute].map((object, index) => {
				const offset = uniformRandom(-0.2 / n, 0.2 / n);
				const v = index / n + initialOffset + offset;
				return { ...object, v: v };
			}),
		);
		newOrder = newOrder.flat(1);
	}
	newOrder = newOrder.sort((object1, object2) => {
		return object1.v - object2.v;
	});

	//Remove v attribute
	newOrder.forEach((object) => {
		delete object.v;
	});
	return newOrder;
}
