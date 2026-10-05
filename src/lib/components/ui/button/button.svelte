<script lang="ts" module>
	import { type VariantProps, tv } from "tailwind-variants";
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";

	export const buttonVariants = tv({
		// Primario navy (uno por pantalla), secundario contorno, terciario como enlace.
		// Destructivo solo en contorno rojo y siempre con confirmación. Ningún botón es amarillo.
		// 48px en público (default), 36px en backoffice (sm).
		base: "focus-visible:focus-halo aria-invalid:ring-destructive/20 aria-invalid:ring-3 rounded-full border-0 bg-clip-padding font-semibold active:not-aria-[haspopup]:translate-y-px [&_svg:not([class*='size-'])]:size-4 group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-all outline-none select-none cursor-pointer disabled:cursor-not-allowed disabled:bg-secondary disabled:text-disabled-foreground disabled:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary-hover",
				outline: "bg-card text-foreground shadow-[inset_0_0_0_1.5px_var(--foreground)] hover:bg-secondary dark:bg-transparent aria-expanded:bg-secondary",
				secondary: "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]",
				ghost: "text-foreground hover:bg-secondary aria-expanded:bg-secondary",
				destructive: "bg-card text-destructive-ink shadow-[inset_0_0_0_1.5px_var(--destructive)] hover:bg-state-error dark:bg-transparent",
				"destructive-solid": "bg-destructive text-white hover:bg-destructive-ink dark:text-[#3a1620]",
				link: "rounded-none text-foreground underline underline-offset-4 hover:text-highlight-ink",
			},
			size: {
				default: "h-12 gap-2 px-[22px] text-base",
				sm: "h-9 gap-1.5 px-4 text-sm",
				md: "h-10 gap-1.5 px-4 text-sm",
				icon: "size-12 text-xl",
				"icon-sm": "size-9",
			},
		},
		compoundVariants: [
			{ variant: "link", size: "default", class: "px-3" },
			{ variant: "link", size: "sm", class: "px-0 text-[13px]" },
		],
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
	export type ButtonSize = VariantProps<typeof buttonVariants>["size"];

	export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: ButtonVariant;
			size?: ButtonSize;
		};
</script>

<script lang="ts">
	let {
		class: className,
		variant = "default",
		size = "default",
		ref = $bindable(null),
		href = undefined,
		type = "button",
		disabled,
		children,
		...restProps
	}: ButtonProps = $props();
</script>

{#if href}
	<a
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		href={disabled ? undefined : href}
		aria-disabled={disabled}
		role={disabled ? "link" : undefined}
		tabindex={disabled ? -1 : undefined}
		{...restProps}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		{type}
		{disabled}
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}
