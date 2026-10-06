<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: DialogPrimitive.OverlayProps = $props();
	// Velo navy al 55%, sin desenfoque (pantallas clave 01b y 06).
</script>

<DialogPrimitive.Overlay
	bind:ref
	data-slot="dialog-overlay"
	class={cn("data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 bg-[rgb(14_16_54/.55)] duration-100 fixed inset-0 isolate z-50", className)}
	{...restProps}
/>
