import { queryClient } from './main.jsx';

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
			return await result.json();
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
					.filter((item) => item.tracks.total < 80)
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

export async function playPlaylist(uri, total) {
	const token = localStorage.getItem('accessToken');
	await fetch('https://api.spotify.com/v1/me/player/play', {
		method: 'PUT',
		headers: { Authorization: `Bearer ${token}` },
		body: JSON.stringify({
			context_uri: uri,
			offset: {
				position: Math.floor(Math.random() * total),
			},
		}),
	});
}

export async function playPause() {
	const player = await fetchPlayer();
	if (player.is_playing) {
		fetchUrl('player/pause', 'PUT');
		return false;
	} else {
		fetchUrl('player/play', 'PUT');
		return true;
	}
}

export function playNext() {
	fetchUrl('player/next', 'POST');
}

export function playPrevious() {
	fetchUrl('player/previous', 'POST');
}
