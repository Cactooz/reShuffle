import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],

	build: {
		rollupOptions: {
			output: {
				assetFileNames: (assetInfo) => {
					const extension = assetInfo.name.split('.').pop();
					if (['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(extension.toLowerCase()))
						return `assets/images/${assetInfo.name}`;

					return assetInfo.name;
				},
			},
		},
	},
});
