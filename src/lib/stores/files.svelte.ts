export function createFileStore() {
	let file = $state<File | null>(null);

	return {
		get file() {
			return file;
		},
		set: (f: File) => (file = f)
	};
}
