<script lang="ts">
	import { PinInput as InputOTPPrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		cell,
		class: className,
		...restProps
	}: InputOTPPrimitive.CellProps = $props();
</script>

<InputOTPPrimitive.Cell
	{cell}
	bind:ref
	data-slot="input-otp-slot"
	class={cn(
		"border-input bg-card data-active:focus-halo aria-invalid:border-destructive h-[52px] w-11 rounded-tile border-[1.5px] font-mono text-[22px] font-medium transition-all outline-none relative flex items-center justify-center data-active:z-10",
		className
	)}
	{...restProps}
>
	{cell.char}
	{#if cell.hasFakeCaret}
		<div
			class="pointer-events-none absolute inset-0 flex items-center justify-center"
		>
			<div class="animate-caret-blink bg-foreground h-4 w-px duration-1000"></div>
		</div>
	{/if}
</InputOTPPrimitive.Cell>
