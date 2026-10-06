<script lang="ts">
	import { Command as CommandPrimitive, useId } from "bits-ui";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		heading,
		value,
		...restProps
	}: CommandPrimitive.GroupProps & {
		heading?: string;
	} = $props();
</script>

<CommandPrimitive.Group
	bind:ref
	data-slot="command-group"
	class={cn("text-foreground **:[[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 **:[[cmdk-group-heading]]:px-3 **:[[cmdk-group-heading]]:py-1.5", className)}
	value={value ?? heading ?? `----${useId()}`}
	{...restProps}
>
	{#if heading}
		<CommandPrimitive.GroupHeading class="text-muted-foreground px-3 py-1.5 font-mono text-[11px] font-medium tracking-[.04em]">
			{heading}
		</CommandPrimitive.GroupHeading>
	{/if}
	<CommandPrimitive.GroupItems {children} />
</CommandPrimitive.Group>
