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
				description: 'Refining music shuffle algorithms to enhance your listening!',
				icons: [
					{
						src: '/images/reShuffle-icon-64.png',
						sizes: '64x64',
						type: 'image/png',
					},
					{
						src: '/images/reShuffle-icon-192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: '/images/reShuffle-icon-512.png',
						sizes: '512x512',
						type: 'image/png',
					},
					{
						src: '/images/reShuffle-icon-background.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable',
					},
					{
						src: '/images/reShuffle-icon.svg',
						sizes: 'any',
					},
				],
				theme_color: '#101212',
				background_color: '#101212',
				start_url: '/',
				display: 'standalone',
				orientation: 'portrait',
			},
		}),
	],
	build: {
		rollupOptions: {
			output: {
				assetFileNames: (fileInfo) => {
					const extension = fileInfo.name.split('.').pop();
					if (['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(extension.toLowerCase()))
						return `images/[name].[ext]`;

					return `assets/[name]-[hash].[ext]`;
				},
			},
		},
	},
});
