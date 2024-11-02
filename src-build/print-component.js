import { createHighlighter } from 'shiki';
import * as fs from 'node:fs';
import { resolvePath } from './resolve-alias.js';

const theme = 'one-dark-pro';

const highlighter = await createHighlighter({
	langs: ['svelte'],
	themes: [theme]
});

/**
 * @param {string} code
 * @returns {string}
 */
function highlight(code) {
	const html = highlighter.codeToHtml(code, {
		lang: 'svelte',
		theme
	});

	return html;
}

/**
 * @returns {import("svelte/compiler").PreprocessorGroup}
 */
const printComponent = () => {
	return {
		name: 'print-self',
		markup({ content, filename }) {
			const replacement = content.replace(/%import\('([^']+)'\)%/g, (match, alias) => {
				try {
					if (!filename) throw Error('filename is undefined');

					const compPath = resolvePath(filename, alias);
					const content = fs.readFileSync(compPath, 'utf-8').replace('$lib', 'svelte-knobs').trim();
					const html = highlight(content);

					return `{@html \`${html}\`}`;
				} catch (err) {
          console.error(err)
					return match;
				}
			});

			return {
				code: replacement
			};
		}
	};
};

export default printComponent;
