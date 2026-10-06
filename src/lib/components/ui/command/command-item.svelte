<script lang="ts">
	import { Command as CommandPrimitive } from "bits-ui";
	import CheckIcon from '@lucide/svelte/icons/check';
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: CommandPrimitive.ItemProps = $props();
</script>


<CommandPrimitive.Item
	bind:ref
	data-slot="command-item"
	class={cn(
		"data-selected:bg-background data-selected:text-foreground data-selected:*:[svg]:text-foreground relative flex cursor-pointer items-center gap-3 rounded-tile px-3 py-3.5 text-base outline-hidden select-none [&_svg:not([class*='size-'])]:size-4 group/command-item [&_svg]:pointer-events-none [&_svg]:shrink-0",
		"data-disabled:pointer-events-none data-disabled:opacity-50",
		className
	)}
	{...restProps}
>
	{@render children?.()}
	<!-- Solo ocupa espacio si el ítem está marcado; si no, `justify-between` del consumidor no funciona. -->
	<CheckIcon class="ml-auto hidden group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:block" />
</CommandPrimitive.Item>
