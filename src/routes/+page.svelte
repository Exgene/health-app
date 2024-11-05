<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { fileStore } from '$lib/stores/files.svelte';
	import {
		ChartNoAxesColumnIncreasingIcon,
		ChevronRight,
		FileText,
		Shield,
		Utensils
	} from 'lucide-svelte';

	let selectedFile = $state<File | null>(null);
	let uploadStatus = $state<'unselected' | 'loading' | 'successful' | 'failed'>('unselected');
	let resultId = $state(null);

	const testimonials = [
		{
			quote:
				'HealthScan has completely changed how I approach my health. The insights are invaluable!',
			author: 'Sarah J.',
			role: 'Fitness Enthusiast'
		},
		{
			quote:
				"As a doctor, I recommend HealthScan to all my patients. It's a game-changer in preventive care.",
			author: 'Dr. Michael L.',
			role: 'Cardiologist'
		},
		{
			quote: "The dietary recommendations are spot-on. I've never felt better!",
			author: 'Emily R.',
			role: 'Nutrition Blogger'
		}
	];

	function handleFileSelect(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (file && file.type === 'application/pdf') {
			selectedFile = file;
		} else {
			selectedFile = null;
		}
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		if (!selectedFile) {
			return;
		}

		uploadStatus = 'loading';

		try {
			const formData = new FormData();
			formData.append('pdf', selectedFile);

			await new Promise((resolve) => setTimeout(resolve, 2000));
			fileStore.file = selectedFile;
			console.log(fileStore.file);

			const response = await fetch('/api/process-pdf', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error('Failed to process PDF');
			}

			const data = await response.json();
			resultId = data.id;

			uploadStatus = 'successful';
		} catch (error) {
			console.error('Error processing PDF:', error);
			uploadStatus = 'failed';
		}
	}
</script>

<div
	class="flex min-h-screen flex-col bg-gradient-to-b from-blue-50 to-white dark:from-blue-900 dark:to-gray-900"
>
	<main class="flex-1">
		<!-- <div id="chatbot-container" class="fixed bottom-0 right-0 z-50 h-72 w-96">
			<iframe
				title="chatbot"
				src="https://cdn.botpress.cloud/webchat/v2.2/shareable.html?configUrl=https://files.bpcontent.cloud/2024/10/27/15/20241027151708-K7MZ8AH0.json"
				allow="microphone; camera"
				style="width: 100%; height: 100%; border: none; border-radius: 10px;"
			>
			</iframe>
		</div> -->
		<section class="relative w-full overflow-hidden py-12 md:py-24 lg:py-32 xl:py-48">
			<div class="container relative z-10 px-4 md:px-6">
				<div class="flex flex-col items-center space-y-4 text-center">
					<div class="space-y-2">
						<h1
							class="bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-3xl font-bold tracking-tighter text-transparent sm:text-4xl md:text-5xl lg:text-6xl/none"
						>
							Your Personal Health Assistant
						</h1>
						<p class="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
							Scan your medical reports, get personalized insights, and receive tailored dietary
							recommendations.
						</p>
					</div>
					<div class="space-x-4">
						<Button
							size="lg"
							class="bg-blue-600 text-white hover:bg-blue-700"
							onclick={() =>
								document?.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}
						>
							Get Started
							<ChevronRight class="ml-2 h-4 w-4" />
						</Button>
						<Button
							size="lg"
							variant="outline"
							class="border-blue-600 text-blue-600 hover:bg-blue-50"
							onclick={() =>
								document?.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
						>
							Learn More
						</Button>
					</div>
				</div>
			</div>
			<div
				class="bg-grid-blue-600/[0.02] dark:bg-grid-white/[0.02] absolute inset-0 bg-[size:40px_40px]"
			></div>
			<div
				class="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-blue-100 to-transparent dark:from-blue-900"
			></div>
			<div
				class="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-blue-100 to-transparent dark:from-blue-900"
			></div>
		</section>
		<section id="features" class="w-full bg-white py-12 dark:bg-gray-800 md:py-24 lg:py-32">
			<div class="container px-4 md:px-6">
				<h2 class="mb-8 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
					Key Features
				</h2>
				<div class="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
					<div class="group flex flex-col items-center text-center">
						<div
							class="mb-4 rounded-full bg-blue-100 p-3 transition-transform group-hover:scale-110 dark:bg-blue-800"
						>
							<FileText class="h-8 w-8 text-blue-600 dark:text-blue-400" />
						</div>
						<h3 class="text-lg font-bold">PDF Scanning</h3>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							Easily upload and scan your medical reports in PDF format.
						</p>
					</div>
					<div class="group flex flex-col items-center text-center">
						<div
							class="mb-4 rounded-full bg-blue-100 p-3 transition-transform group-hover:scale-110 dark:bg-blue-800"
						>
							<ChartNoAxesColumnIncreasingIcon class="h-8 w-8 text-blue-600 dark:text-blue-400" />
						</div>
						<h3 class="text-lg font-bold">Detailed Reports</h3>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							Get comprehensive analysis and insights from your medical data.
						</p>
					</div>
					<div class="group flex flex-col items-center text-center">
						<div
							class="mb-4 rounded-full bg-blue-100 p-3 transition-transform group-hover:scale-110 dark:bg-blue-800"
						>
							<Utensils class="h-8 w-8 text-blue-600 dark:text-blue-400" />
						</div>
						<h3 class="text-lg font-bold">Dietary Recommendations</h3>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							Receive personalized advice on what to eat and what to avoid.
						</p>
					</div>
				</div>
			</div>
		</section>
		<section id="how-it-works" class="w-full bg-blue-50 py-12 dark:bg-gray-900 md:py-24 lg:py-32">
			<div class="container px-4 md:px-6">
				<h2 class="mb-8 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
					How It Works
				</h2>
				<div class="grid gap-6 lg:grid-cols-3">
					<div class="flex flex-col items-center text-center">
						<div
							class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white"
						>
							1
						</div>
						<h3 class="text-lg font-bold">Upload Your Reports</h3>
						<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
							Simply upload your medical reports in PDF format to our secure platform.
						</p>
					</div>
					<div class="relative flex flex-col items-center text-center">
						<div
							class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white"
						>
							2
						</div>
						<h3 class="text-lg font-bold">AI Analysis</h3>
						<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
							Our advanced AI analyzes your reports and generates comprehensive insights.
						</p>
						<div
							class="absolute left-0 top-1/2 -z-10 hidden h-0.5 w-full bg-blue-200 lg:block"
						></div>
					</div>
					<div class="flex flex-col items-center text-center">
						<div
							class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white"
						>
							3
						</div>
						<h3 class="text-lg font-bold">Get Personalized Advice</h3>
						<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
							Receive tailored health recommendations, including dietary advice and lifestyle tips.
						</p>
					</div>
				</div>
			</div>
		</section>
		<section
			id="cta"
			class="relative w-full overflow-hidden bg-blue-600 py-12 text-white md:py-24 lg:py-32"
		>
			<div class="container relative z-10 px-4 md:px-6">
				<div class="flex flex-col items-center space-y-4 text-center">
					<div class="space-y-2">
						<h2 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
							Upload Your Health Report Now
						</h2>
						<p class="mx-auto max-w-[600px] text-blue-100 md:text-xl">
							Join thousands of users who have transformed their health with HealthScan.
						</p>
					</div>
					<div class="w-full max-w-sm space-y-2">
						<form class="flex w-full max-w-sm flex-col space-y-2" onsubmit={handleSubmit}>
							<div class="relative">
								<input
									type="file"
									accept=".pdf"
									class="sr-only"
									id="file-upload"
									onchange={handleFileSelect}
								/>
								<label
									for="file-upload"
									class="flex w-full cursor-pointer items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:bg-blue-50"
								>
									<FileText class="mr-2 h-5 w-5" />
									{selectedFile ? selectedFile.name : 'Choose PDF file'}
								</label>
							</div>
							<!-- {#if uploadStatus}
								<p class="text-sm text-center {uploadStatus.includes('successful') ? 'text-green-200' : uploadStatus.includes('failed') ? 'text-red-200' : 'text-blue-200'}">
									{uploadStatus}
								</p>
							{/if} -->
							<Button
								class="w-full border-blue-400 bg-white text-blue-600 hover:bg-blue-50"
								type={uploadStatus === 'successful' ? 'button' : 'submit'}
								disabled={!selectedFile || uploadStatus === 'loading'}
								onclick={() => {
									if (uploadStatus === 'successful') {
										window.location.href = `/result/${resultId}`;
										uploadStatus = 'unselected';
										selectedFile = null;
									}
								}}
							>
								{#if uploadStatus === 'loading'}
									<div class="flex items-center">
										<div
											class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"
										></div>
										Analyzing...
									</div>
								{:else if uploadStatus === 'successful'}
									Open Results
								{:else}
									Analyze My Report
								{/if}
							</Button>
						</form>
						<p class="text-xs text-blue-100">
							By uploading, you agree to our{' '}
							<a
								class="underline underline-offset-2 transition-colors hover:text-white"
								href="/tos"
							>
								Terms & Conditions
							</a>
						</p>
					</div>
				</div>
			</div>
			<div
				class="absolute inset-0 bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"
			></div>
		</section>
		<section id="testimonials" class="w-full bg-white py-12 dark:bg-gray-800 md:py-24 lg:py-32">
			<div class="container px-4 md:px-6">
				<h2 class="mb-8 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
					What Our Users Say
				</h2>
				<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					{#each testimonials as testimonial, index}
						<div
							class="flex flex-col items-center rounded-lg bg-blue-50 p-6 text-center dark:bg-gray-700"
						>
							<div class="mb-4">
								<svg
									class="h-12 w-12 text-blue-500"
									fill="currentColor"
									viewBox="0 0 32 32"
									aria-hidden="true"
								>
									<path
										d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"
									/>
								</svg>
							</div>
							<p class="mb-4 text-lg">{testimonial.quote}</p>
							<div>
								<p class="font-semibold">{testimonial.author}</p>
								<p class="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</section>
	</main>
	<footer class="w-full bg-gray-100 py-6 dark:bg-gray-800">
		<div class="container flex flex-col items-center justify-between px-4 md:flex-row md:px-6">
			<div class="mb-4 flex items-center md:mb-0">
				<Shield class="mr-2 h-6 w-6 text-blue-600" />
				<span class="text-xl font-bold">HealthScan</span>
			</div>
			<nav class="flex gap-4 sm:gap-6">
				<a class="text-sm underline-offset-4 hover:underline" href="/tos"> Terms of Service </a>
				<a class="text-sm underline-offset-4 hover:underline" href="/privacy"> Privacy Policy </a>
				<a class="text-sm underline-offset-4 hover:underline" href="/contact"> Contact Us </a>
			</nav>
			<p class="mt-4 text-xs text-gray-500 dark:text-gray-400 md:mt-0">
				© 2024 HealthScan. All rights reserved.
			</p>
		</div>
	</footer>
</div>
