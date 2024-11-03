<script lang="ts">
	import { fileStore } from '$lib/stores/files.svelte';
	import type { PageData } from '../$types';

	const { data } = $props();

	const { pdfContent, geminiResponse } = data;
</script>

<div class="mx-auto max-w-7xl p-8">
	<h1 class="mb-8 text-4xl font-bold text-gray-800">PDF Content Results</h1>

	{#if pdfContent}
		<div class="rounded-lg border border-gray-200 bg-white p-8 shadow-md">
			<pre class="m-0 whitespace-pre-wrap break-words font-mono">{pdfContent}</pre>
		</div>
	{:else}
		<p class="text-gray-600">No PDF content found. Please upload a PDF file first.</p>
	{/if}

	{#if geminiResponse}
		<div class="rounded-lg border border-gray-200 bg-white p-8 shadow-md">
			<pre class="m-0 whitespace-pre-wrap break-words font-mono">{geminiResponse}</pre>
		</div>
	{/if}

	{JSON.stringify(fileStore)}
</div>
