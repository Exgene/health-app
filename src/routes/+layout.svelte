<script lang="ts">
	import { Shield } from 'lucide-svelte';
	import '../app.css';
	let { children } = $props();
</script>

<header
	class="sticky top-0 z-50 flex h-16 items-center bg-white/30 px-4 backdrop-blur-sm dark:bg-gray-900/30 lg:px-6"
>
	<a class="flex items-center justify-center" href="/#">
		<Shield class="h-8 w-8 text-blue-600" />
		<span class="ml-2 text-2xl font-bold text-gray-900 dark:text-white">HealthScan</span>
	</a>
	<nav class="ml-auto flex gap-4 sm:gap-6">
		<a class="text-sm font-medium transition-colors hover:text-blue-600" href="#features">
			Features
		</a>
		<a class="text-sm font-medium transition-colors hover:text-blue-600" href="#how-it-works">
			How It Works
		</a>
		<a class="text-sm font-medium transition-colors hover:text-blue-600" href="#pricing">
			Pricing
		</a>
	</nav>
</header>
{@render children()}
