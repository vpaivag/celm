<script lang="ts">
	import { Command as CommandPrimitive } from "bits-ui";
	import * as InputGroup from "#lib/components/ui/input-group/index.js";
	import SearchIcon from '@lucide/svelte/icons/search';
	import { cn } from "#lib/utils.js";
	import type { Snippet } from "svelte";

	// Campo-globo de la marca (01b): borde navy de 2px y halo amarillo con foco.
	// `leading` reemplaza la lupa, p. ej. con "¿Cuál es la mejor"; `trailing` va al final (✕, esc).
	let {
		ref = $bindable(null),
		class: className,
		wrapperClass,
		value = $bindable(""),
		leading,
		trailing,
		...restProps
	}: CommandPrimitive.InputProps & { wrapperClass?: string; leading?: Snippet; trailing?: Snippet } = $props();
</script>

<div data-slot="command-input-wrapper" class={cn("p-1 pb-0", wrapperClass)}>
	<InputGroup.Root
		class="h-14 rounded-[28px_28px_28px_9px] border-0 shadow-[inset_0_0_0_2px_var(--foreground)] has-[input:focus-visible]:shadow-[inset_0_0_0_2px_var(--foreground),0_0_0_4px_rgb(246_196_52/.45)] lg:h-[68px] lg:rounded-[34px_34px_34px_11px]"
	>
		<CommandPrimitive.Input
			{value}
			data-slot="command-input"
			class={cn(
				"w-full text-base outline-hidden disabled:cursor-not-allowed disabled:opacity-50 lg:text-[22px]",
				className
			)}
			{...restProps}
		>
			{#snippet child({ props })}
				<InputGroup.Input {...props} bind:value bind:ref />
			{/snippet}
		</CommandPrimitive.Input>
		<InputGroup.Addon class="text-foreground pl-[18px] lg:pl-[26px]">
			{#if leading}{@render leading()}{:else}<SearchIcon class="size-4 shrink-0 opacity-50" />{/if}
		</InputGroup.Addon>
		{#if trailing}
			<InputGroup.Addon align="inline-end" class="pr-3.5 lg:pr-2.5">{@render trailing()}</InputGroup.Addon>
		{/if}
	</InputGroup.Root>
</div>
