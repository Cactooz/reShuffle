import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'reShuffle',
				short_name: 'reShuffle',
				description:
					'A project dedicated to refining music shuffle algorithms to enhance the user experience.',
				icons: [
					{
						src: './public/images/reshuffle-icon-64.png',
						sizes: '64x64',
						type: 'image/png',
					},
					{
						src: './public/images/reshuffle-icon-192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: './public/images/reshuffle-icon-512.png',
						sizes: '512x512',
						type: 'image/png',
					},
					{
						src: './public/images/reShuffle-icon-background.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable',
					},
					{
						src: './public/images/reShuffle-icon.svg',
						sizes: 'any',
					},
				],
				theme_color: '#101212',
				background_color: '#101212',
				start_url: 'https://reshuffle.one',
				display: 'standalone',
				orientation: 'portrait',
			},
		}),
	],
	/*build: {
		rollupOptions: {
			output: {
				assetFileNames: (fileInfo) => {
					const extension = fileInfo.name.split('.').pop();
					if (['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(extension.toLowerCase()))
						return `images/${fileInfo.name}`;

					return fileInfo.name;
				},
			},
		},
	},*/
});
