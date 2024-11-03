// file.svelte.ts
export const fileStore = new (class {
	file?: File = $state();
})();
