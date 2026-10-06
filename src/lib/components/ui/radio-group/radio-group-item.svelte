<script lang="ts">
	import { RadioGroup as RadioGroupPrimitive } from "bits-ui";
	import { cn, type WithoutChildrenOrChild } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithoutChildrenOrChild<RadioGroupPrimitive.ItemProps> = $props();
	// Marcado = anillo navy de 6px, sin punto interior (pantalla 07d).
</script>

<RadioGroupPrimitive.Item
	bind:ref
	data-slot="radio-group-item"
	class={cn(
		"border-input bg-card data-checked:border-foreground data-checked:border-[6px] aria-invalid:border-destructive focus-visible:focus-halo flex size-5 rounded-full group-has-[:focus-visible]/field-label:ring-0 group-has-[:focus-visible]/field-label:not-data-checked:border-input group-has-[:focus-visible]/field-label:data-checked:border-primary group/radio-group-item peer relative aspect-square shrink-0 border-[1.5px] transition-[border-width] outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50",
		className
	)}
	{...restProps}
/>
