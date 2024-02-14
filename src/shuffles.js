import { fetchTracksOfPlaylist } from './fetch';

export async function spotifyShuffle2014(id, total) {
	//Fetch tracks
	const playlist = await fetchTracksOfPlaylist(id, total);
	//console.log('playlist', playlist);
	//track array containing objects with artist and id
	const tracks = playlist
		.filter((trackObject) => !trackObject.track.is_local) //Remove local tracks
		.map((trackObject) => {
			//Only keep artist and id of track
			return {
				artist: trackObject.track.artists[0].name,
				uri: trackObject.track.uri,
				artists: trackObject.track.artists,
			};
		});

	//Group by artist
	const groups = Object.groupBy(tracks, (track, index) => {
		return track.artist;
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
			shuffledGroups[artist].map(({ artist, uri, artists }, index) => {
				const offset = uniformRandom(-0.2 / n, 0.2 / n);
				const v = index / n + initialOffset + offset;
				return { artist: artist, uri: uri, v: v, artists: artists };
			}),
		);
		newOrderOfTracks = newOrderOfTracks.flat(1);
	}
	newOrderOfTracks = newOrderOfTracks.sort((track1, track2) => {
		return track1.v - track2.v;
	});

	let temp = newOrderOfTracks.map((track) => {
		return { artist: track.artist, uri: track.uri, artists: track.artists };
	});

	console.log(temp);
}

function uniformRandom(a, b) {
	return a + Math.random() * (b - a);
}
