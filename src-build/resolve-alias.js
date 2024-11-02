import * as path from 'node:path';

const aliasMap = {
	$lib: 'src/lib'
};

/**
 * @param {string} pth
 * @returns {string}
 */
function resolveAlias(pth) {
	const entries = Object.entries(aliasMap);
	for (const [alias, path] of entries) {
		if (!pth.includes(alias)) continue;
		return pth.replace(alias, path);
	}

	return pth;
}

/**
 * @param {string} filename
 * @param {string} pth
 * @returns {string}
 */
export function resolvePath(filename, pth) {
	if (pth.startsWith('./') || pth.startsWith('../')) {
		const currentDir = path.dirname(filename);
		const compPath = path.join(currentDir, pth);

		return compPath;
	}

	return resolveAlias(pth);
}
