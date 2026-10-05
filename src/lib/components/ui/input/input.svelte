<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from "svelte/elements";

	type InputType = Exclude<HTMLInputTypeAttribute, "file">;

	type Props = WithElementRef<
		Omit<HTMLInputAttributes, "type"> &
			({ type: "file"; files?: FileList } | { type?: InputType; files?: undefined })
	>;

	let {
		ref = $bindable(null),
		value = $bindable(),
		type,
		files = $bindable(),
		class: className,
		"data-slot": dataSlot = "input",
		...restProps
	}: Props = $props();
</script>

{#if type === "file"}
	<input
		bind:this={ref}
		data-slot={dataSlot}
		class={cn(
			"border-input bg-card focus-visible:focus-halo aria-invalid:border-destructive aria-invalid:shadow-[0_0_0_0.5px_var(--destructive)] disabled:bg-secondary h-12 rounded-tile border-[1.5px] px-3.5 py-1 text-base text-foreground transition-[border-color,box-shadow] file:h-6 file:text-sm file:font-medium w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
			className
		)}
		type="file"
		bind:files
		bind:value
		{...restProps}
	/>
{:else}
	<input
		bind:this={ref}
		data-slot={dataSlot}
		class={cn(
			"border-input bg-card focus-visible:focus-halo aria-invalid:border-destructive aria-invalid:shadow-[0_0_0_0.5px_var(--destructive)] disabled:bg-secondary h-12 rounded-tile border-[1.5px] px-3.5 py-1 text-base text-foreground transition-[border-color,box-shadow] file:h-6 file:text-sm file:font-medium w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
			className
		)}
		{type}
		bind:value
		{...restProps}
	/>
{/if}
