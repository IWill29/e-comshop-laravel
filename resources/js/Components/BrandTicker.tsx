import BrandLogo, { STORE_BRANDS } from '@/Components/BrandLogo';

interface BrandTickerProps {
    brands?: readonly string[];
}

function TickerTrack({ brands, ariaHidden = false }: Readonly<{ brands: readonly string[]; ariaHidden?: boolean }>) {
    return (
        <ul
            className="flex shrink-0 animate-marquee items-center gap-10 pr-10 group-hover:[animation-play-state:paused] motion-reduce:animate-none sm:gap-14 sm:pr-14"
            aria-hidden={ariaHidden || undefined}
        >
            {brands.map((brand, i) => (
                <li key={`${brand}-${i}`} className="flex shrink-0 items-center">
                    <BrandLogo
                        brand={brand}
                        className="h-[1.29rem] w-auto text-white/35 transition duration-300 hover:text-white/60 sm:h-[1.55rem] md:h-[1.85rem]"
                    />
                </li>
            ))}
        </ul>
    );
}

export default function BrandTicker({ brands = STORE_BRANDS }: Readonly<BrandTickerProps>) {
    const track = [...brands];

    return (
        <div className="relative border-t border-white/10 py-4 sm:py-5">
            <div
                className="group flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
                aria-label="Partner brands"
            >
                <TickerTrack brands={track.concat(track)} />
                <TickerTrack brands={track.concat(track)} ariaHidden />
            </div>
        </div>
    );
}
