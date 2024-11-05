<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { fileStore } from '$lib/stores/files.svelte';
	import { Apple, BananaIcon, Brain, FileText } from 'lucide-svelte';
	import type { PageData } from '../../$types';

	const { data } = $props();

	const { raw_text, ai_analysis, pdf_file } = data.result;

	const { aiInsights, foodToEat, foodNotToEat, normal } = JSON.parse(ai_analysis);

	const foodsToEat = foodToEat.split(',');
	const foodsNotToEat = foodNotToEat.split(',');

	const pdfUrl = `data:application/pdf;base64,${pdf_file}`;

	// Add state for dialog
	let showPdfDialog = $state(false);
</script>

<div class="min-h-screen bg-blue-50 p-6 sm:p-10">
	<main class="mx-auto max-w-4xl space-y-6">
		<h1 class="mb-8 text-3xl font-bold text-blue-900">Analysis Results</h1>

		<div class="flex gap-2">
			<Button
				onclick={() => (showPdfDialog = true)}
				class="bg-blue-500 text-white hover:bg-blue-600"><FileText class="mr-2" /> View PDF</Button
			>
			<Button variant="outline" asChild>
				<a href={pdfUrl} download>Download PDF</a>
			</Button>
		</div>

		<section class="rounded-lg {normal ? 'bg-green-100' : 'bg-red-100'} p-6 shadow-md">
			<h2
				class="mb-4 flex items-center text-xl font-semibold {normal
					? 'text-green-800'
					: 'text-red-800'}"
			>
				<Brain class="mr-2" /> AI Insights
			</h2>
			<p class={normal ? 'text-green-700' : 'text-red-700'}>
				{aiInsights}
			</p>
		</section>

		<section class="rounded-lg bg-blue-100 p-6 shadow-md">
			<h2 class="mb-4 flex items-center text-xl font-semibold text-blue-800">
				<Apple class="mr-2" /> Food to Eat
			</h2>
			<ul class="list-inside list-disc space-y-2 text-blue-700">
				{#each foodsToEat as food}
					<li>{food}</li>
				{/each}
			</ul>
		</section>

		<section class="rounded-lg bg-red-100 p-6 shadow-md">
			<h2 class="mb-4 flex items-center text-xl font-semibold text-red-800">
				<BananaIcon class="mr-2" /> Food Not to Eat
			</h2>
			<ul class="list-inside list-disc space-y-2 text-red-700">
				{#each foodsNotToEat as food}
					<li>{food}</li>
				{/each}
			</ul>
		</section>

		<section class="rounded-lg bg-white p-6 shadow-md">
			<h2 class="mb-4 flex items-center text-xl font-semibold text-blue-800">
				<FileText class="mr-2" /> Extracted Text
			</h2>
			<div class="rounded-md bg-blue-50 p-4">
				<p class="font-mono text-sm text-blue-700">
					{raw_text}
				</p>
			</div>
		</section>
	</main>
</div>

<!-- Add Dialog component -->
<Dialog.Root bind:open={showPdfDialog}>
	<Dialog.Content class="w-[90vw] max-w-4xl">
		<Dialog.Header>
			<Dialog.Title>PDF Document</Dialog.Title>
		</Dialog.Header>
		<div class="mt-2">
			<iframe
				title="PDF Viewer"
				src={pdfUrl}
				class="h-[80vh] w-full rounded-lg border border-blue-200"
			></iframe>
		</div>
	</Dialog.Content>
</Dialog.Root>
