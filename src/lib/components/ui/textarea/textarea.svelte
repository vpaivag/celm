<script lang="ts">
	import { cn, type WithElementRef, type WithoutChildren } from "#lib/utils.js";
	import type { HTMLTextareaAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		"data-slot": dataSlot = "textarea",
		...restProps
	}: WithoutChildren<WithElementRef<HTMLTextareaAttributes>> = $props();
</script>

<textarea
	bind:this={ref}
	data-slot={dataSlot}
	class={cn(
		"border-input bg-card focus-visible:focus-halo aria-invalid:border-destructive disabled:bg-secondary rounded-tile border-[1.5px] px-3.5 py-3 text-base leading-normal text-foreground transition-[border-color,box-shadow] resize-y flex field-sizing-content min-h-16 w-full outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
		className
	)}
	bind:value
	{...restProps}></textarea>
