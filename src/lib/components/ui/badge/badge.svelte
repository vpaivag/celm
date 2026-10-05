<script lang="ts" module>
	import { type VariantProps, tv } from "tailwind-variants";

	export const badgeVariants = tv({
		base: "gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-sm font-semibold leading-none transition-all has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&>svg]:size-3.5! group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap focus-visible:focus-halo [&>svg]:pointer-events-none",
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground [a]:hover:bg-primary-hover",
				secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-accent",
				destructive: "bg-state-error text-state-error-foreground",
				outline: "border-border text-foreground [a]:hover:bg-muted",
				ghost: "hover:bg-muted hover:text-muted-foreground",
				link: "text-primary underline-offset-4 hover:underline",
				// estados de marca · cada uno significa una sola cosa
				verified: "bg-secondary text-foreground",
				// "En construcción" es el único estado con borde punteado
				building: "border-[1.5px] border-dashed border-state-building text-state-building py-[5px]",
				nodata: "bg-state-nodata text-state-nodata-foreground",
				review: "bg-state-review text-state-review-foreground",
				error: "bg-state-error text-state-error-foreground",
				success: "bg-state-success text-state-success-foreground",
				chip: "bg-secondary text-foreground px-3.5 py-2 [a]:hover:bg-accent",
			},
			size: {
				default: "",
				sm: "px-2.5 py-1 text-xs",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	});

	export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];
	export type BadgeSize = VariantProps<typeof badgeVariants>["size"];
</script>

<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLAnchorAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		href,
		class: className,
		variant = "default",
		size = "default",
		children,
		...restProps
	}: WithElementRef<HTMLAnchorAttributes> & {
		variant?: BadgeVariant;
		size?: BadgeSize;
	} = $props();
</script>

<svelte:element
	this={href ? "a" : "span"}
	bind:this={ref}
	data-slot="badge"
	{href}
	class={cn(badgeVariants({ variant, size }), className)}
	{...restProps}
>
	{@render children?.()}
</svelte:element>
