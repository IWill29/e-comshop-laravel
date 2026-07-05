import { useState } from 'react';
import { formatPrice } from '@/Hooks/useFormatPrice';

interface SizeSelectorProps {
    sizes: number[];
    selectedSize: number | null;
    onSelect: (size: number) => void;
    disabled?: boolean;
}

export default function SizeSelector({
    sizes,
    selectedSize,
    onSelect,
    disabled = false,
}: Readonly<SizeSelectorProps>) {
    return (
        <div>
            <div className="flex items-baseline justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">
                    Size (EU)
                </p>
                <a
                    href="/size-guide"
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                >
                    Size guide
                </a>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
                {sizes.map((size) => {
                    const isSelected = selectedSize === size;

                    return (
                        <button
                            key={size}
                            type="button"
                            disabled={disabled}
                            onClick={() => onSelect(size)}
                            className={`flex h-11 min-w-11 items-center justify-center rounded-xl px-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                                isSelected
                                    ? 'bg-stone-900 text-white'
                                    : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                            } disabled:cursor-not-allowed disabled:opacity-50`}
                            aria-pressed={isSelected}
                        >
                            {size}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export function useSizeSelection(sizes: number[]) {
    const [selectedSize, setSelectedSize] = useState<number | null>(null);

    return {
        selectedSize,
        setSelectedSize,
        isValid: selectedSize !== null && sizes.includes(selectedSize),
    };
}
