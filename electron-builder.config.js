const pkg = require('./package.json');

const iconPath = "images/poison-svgrepo-com.svg"

module.exports = {
	directories: {
		output: 'dist/electron'
	},
	extraMetadata: {
		main: 'electron-build/main/electron.js'
	},
	files: ['electron-build/**/*', 'node_modules/**/*', 'public/**/*'],
	linux: {
		artifactName: `Cyoanide-${pkg.version}-Linux-\${arch}.zip`,
		icon: iconPath,
		target: [{arch: ['arm64', 'ia32', 'x64'], target: 'zip'}]
	},
	nsis: {
		oneClick: false,
		allowToChangeInstallationDirectory: true
	},
	win: {
		artifactName: `Cyoanide-${pkg.version}-Windows.exe`,
		icon: iconPath,
		target: {arch: ['x64'], target: 'nsis'}
	}
};