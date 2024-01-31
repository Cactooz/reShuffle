import { queryClient } from './main.jsx';

export async function fetchPlaylists() {
	return (
		queryClient.getQueryData('playlists') ??
		(await queryClient.fetchQuery({
			queryKey: 'playlists',
			queryFn: async () => {
				const token = localStorage.getItem('accessToken');

				let offset = 0;
				let lists = [];
				let json;

				do {
					const result = await fetch(
						`https://api.spotify.com/v1/me/playlists?limit=50&offset=${offset}`,
						{
							method: 'GET',
							headers: { Authorization: `Bearer ${token}` },
						},
					);

					json = await result.json();

					lists = [...lists, ...json.items];
					offset += 50;
				} while (json.next && offset < 1000);

				const longPlaylists = lists
					.filter((item) => item.tracks.total > 80)
					.map((item) => mapPlaylists(item));
				const shortPlaylists = lists
					.filter((item) => item.tracks.total < 80)
					.map((item) => mapPlaylists(item));

				function mapPlaylists(item) {
					return {
						id: item.id,
						image: item.images[0]?.url,
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
