import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  step = 1,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
        ? defaultValue
        : [min, max],
    [value, defaultValue, min, max]
  );

  const currentValue = _values[0];

  return (
    <div className={cn("w-full flex flex-col items-center", className)}>
      <div className="flex justify-between w-full mb-2">
        <span className="text-xs text-muted-foreground">{min}</span>
        <span className="text-xs text-muted-foreground">{max}</span>
      </div>
      <SliderPrimitive.Root
        data-slot="slider"
        defaultValue={defaultValue}
        value={value}
        min={min}
        max={max}
        step={step}
        className={cn(
          "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50"
        )}
        {...props}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className={cn(
            "bg-muted relative grow overflow-hidden rounded-full h-1.5 w-full"
          )}
        >
          <SliderPrimitive.Range
            data-slot="slider-range"
            className={cn("bg-primary absolute h-full")}
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            key={index}
            data-slot="slider-thumb"
            className="border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
          />
        ))}
      </SliderPrimitive.Root>
      <div className="w-full flex justify-center mt-2">
        <span className="text-xs font-mono text-primary">{currentValue}</span>
      </div>
    </div>
  );
}

export { Slider };
