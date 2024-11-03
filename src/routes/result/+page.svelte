<script lang="ts">
	import { fileStore } from '$lib/stores/files.svelte';
	import { Apple, BananaIcon, Brain, FileText } from 'lucide-svelte';
	import type { PageData } from '../$types';

	const { data } = $props();

	const { pdfContent, geminiResponse } = data;

	const { aiInsights, foodToEat, foodNotToEat } = JSON.parse(geminiResponse);

	const foodsToEat = foodToEat.split(',');
	const foodsNotToEat = foodNotToEat.split(',');
</script>

<div class="min-h-screen bg-blue-50 p-6 sm:p-10">
	<main class="mx-auto max-w-4xl space-y-6">
		<h1 class="mb-8 text-3xl font-bold text-blue-900">Analysis Results</h1>

		<section class="rounded-lg bg-white p-6 shadow-md">
			<h2 class="mb-4 flex items-center text-xl font-semibold text-blue-800">
				<Brain class="mr-2" /> AI Insights
			</h2>
			<p class="text-blue-700">
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
			<h2 class="mb-4 flex items-center text-xl font-semibold text-blue-800">
				<BananaIcon class="mr-2" /> Food Not to Eat
			</h2>
			<ul class="list-inside list-disc space-y-2 text-blue-700">
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
					{pdfContent}
				</p>
			</div>
		</section>
	</main>
</div>
