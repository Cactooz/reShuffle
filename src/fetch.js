import { queryClient } from './main.jsx';
import shuffle from './shuffles.js';

const timeout = 400;

async function fetchUrl(path, method) {
	const token = localStorage.getItem('accessToken');
	return await fetch(`https://api.spotify.com/v1/me/${path}`, {
		method: method,
		headers: { Authorization: `Bearer ${token}` },
	});
}

export async function fetchPlayer() {
	return await queryClient.fetchQuery({
		queryKey: 'playback',
		staleTime: 1000,
		queryFn: async () => {
			const result = await fetchUrl('player', 'GET');
			if (result.status === 200) return await result.json();

			return undefined;
		},
	});
}

export async function fetchPlaylists() {
	return (
		queryClient.getQueryData('playlists') ??
		(await queryClient.fetchQuery({
			queryKey: 'playlists',
			queryFn: async () => {
				let offset = 0;
				let lists = [];
				let json;

				do {
					const result = await fetchUrl(`playlists?limit=50&offset=${offset}`, 'GET');
					json = await result.json();

					lists = [...lists, ...json.items];
					offset += 50;
				} while (json.next && offset < 500);

				const longPlaylists = lists
					.filter((item) => item.tracks.total > 80)
					.map((item) => mapPlaylists(item));
				const shortPlaylists = lists
					.filter((item) => item.tracks.total <= 80)
					.map((item) => mapPlaylists(item));

				function mapPlaylists(item) {
					return {
						id: item.id,
						image: item.images.length > 1 ? item.images[1]?.url : item.images[0]?.url,
						name: item.name,
						tracks: item.tracks,
						url: item.external_urls.spotify,
						uri: item.uri,
					};
				}

				return [longPlaylists, shortPlaylists];
			},
		}))
	);
}

export async function fetchTracksOfPlaylist(id, total) {
	const token = localStorage.getItem('accessToken');
	return (
		queryClient.getQueryData(id) ??
		(await queryClient.fetchQuery({
			queryKey: id,
			queryFn: async () => {
				let offset = 0;
				let fields =
					'items(track(id, name, uri, artists, is_local, track_number, disc_number, duration_ms, external_urls, album(images, name)))';
				let json;
				let items = [];
				do {
					const result = await fetch(
						`https://api.spotify.com/v1/playlists/${id}/tracks?offset=${offset}&fields=${fields}`,
						{ method: 'GET', headers: { Authorization: `Bearer ${token}` } },
					);
					json = await result.json();
					items = [...items, ...json.items];
					offset += 100;
				} while (offset < total);
				return items;
			},
		}))
	);
}

export async function fetchAudioFeatures(ids) {
	const token = localStorage.getItem('accessToken');
	return (
		queryClient.getQueryData(ids.toString()) ??
		(await queryClient.fetchQuery({
			queryKey: ids.toString(),
			queryFn: async () => {
				const total = ids.length;
				let offset = 0;
				let items = [];
				let json;
				do {
					const result = await fetch(
						`https://api.spotify.com/v1/audio-features?ids=${ids
							.slice(offset, offset + 100)
							.toString()}`,
						{ method: 'GET', headers: { Authorization: `Bearer ${token}` } },
					);
					json = await result.json();
					items = [...items, ...json.audio_features];
					offset += 100;
				} while (offset < total);
				return items;
			},
		}))
	);
}

export async function playPlaylist(uri, total, model) {
	const token = localStorage.getItem('accessToken');
	const { queue, uris } = await shuffle(uri.replace('spotify:playlist:', ''), total, model);
	if (queue.length === 0) return model.setExecutingPlay(false);
	model.setQueue(queue);
	fetchUrl('player/shuffle?state=false', 'PUT');
	await fetch(`https://api.spotify.com/v1/me/player/play`, {
		method: 'PUT',
		headers: { Authorization: `Bearer ${token}` },
		body: JSON.stringify({
			uris: uris,
		}),
	});
	setTimeout(() => {
		model.setExecutingPlay(false);
	}, timeout);
}

export async function playPause(model) {
	const player = await fetchPlayer();
	if (player.is_playing) {
		fetchUrl('player/pause', 'PUT');
		setTimeout(() => {
			model.setExecutingPlayPause(false);
		}, timeout);
		return false;
	} else {
		fetchUrl('player/play', 'PUT');
		setTimeout(() => {
			model.setExecutingPlayPause(false);
		}, timeout);
		return true;
	}
}

export async function playNext(model) {
	fetchUrl('player/next', 'POST');
	setTimeout(() => {
		model.setExecutingNext(false);
	}, timeout);
}

export async function playPrevious(model) {
	fetchUrl('player/previous', 'POST');
	setTimeout(() => {
		model.setExecutingPrevious(false);
	}, timeout);
}

export async function transferPlayback(device) {
	const token = localStorage.getItem('accessToken');
	return await fetch('https://api.spotify.com/v1/me/player', {
		method: 'PUT',
		headers: { Authorization: `Bearer ${token}` },
		body: JSON.stringify({
			device_ids: [device],
		}),
	});
}
