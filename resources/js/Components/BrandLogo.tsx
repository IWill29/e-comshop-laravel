import type { ReactElement, SVGProps } from 'react';

type LogoProps = SVGProps<SVGSVGElement>;

const base = {
    role: 'img' as const,
    viewBox: '0 0 24 24',
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'currentColor',
};

/** Simple Icons paths (MIT) — nike, adidas, newbalance, puma, reebok */
const SIMPLE_ICON_PATHS: Record<string, string> = {
    Nike: 'M24 7.8L6.442 15.276c-1.456.616-2.679.925-3.668.925-1.12 0-1.933-.392-2.437-1.177-.317-.504-.41-1.143-.28-1.918.13-.775.476-1.6 1.036-2.478.467-.71 1.232-1.643 2.297-2.8a6.122 6.122 0 00-.784 1.848c-.28 1.195-.028 2.072.756 2.632.373.261.886.392 1.54.392.522 0 1.11-.084 1.764-.252L24 7.8z',
    Adidas: 'M11.936 17.952c0-.644.517-1.16 1.162-1.16.644 0 1.16.516 1.16 1.16a1.157 1.157 0 01-1.16 1.161 1.157 1.157 0 01-1.162-1.16m4.724 0c0-.645.517-1.162 1.161-1.162s1.161.517 1.161 1.161-.517 1.161-1.16 1.161a1.157 1.157 0 01-1.162-1.16m-10.95 0c0-.645.517-1.162 1.161-1.162s1.16.517 1.16 1.161-.516 1.161-1.16 1.161a1.157 1.157 0 01-1.161-1.16m-4.724 0c0-.645.517-1.162 1.161-1.162s1.161.517 1.161 1.161a1.157 1.157 0 01-1.161 1.161 1.157 1.157 0 01-1.16-1.16m9.55-2.052h-1.01v4.063h1.01v-4.063zM3.3 19.964h1.01v-4.063H3.3v.326a2.087 2.087 0 00-1.2-.374c-1.162 0-2.1.938-2.1 2.1 0 1.168.938 2.099 2.1 2.099.445 0 .858-.135 1.2-.374v.286zm15.674 0h1.01v-4.063h-1.01v.326a2.087 2.087 0 00-1.2-.374c-1.162 0-2.1.938-2.1 2.1a2.092 2.092 0 002.1 2.099c.445 0 .858-.135 1.2-.374v.286zm1.384-1.32c.032.82.732 1.4 1.9 1.4.955 0 1.742-.414 1.742-1.328 0-.636-.358-1.01-1.185-1.17l-.644-.126c-.414-.08-.7-.16-.7-.406 0-.27.278-.39.628-.39.51 0 .716.255.732.557h1.018c-.056-.795-.692-1.328-1.718-1.328-1.057 0-1.686.58-1.686 1.336 0 .922.748 1.073 1.392 1.193l.533.095c.382.072.549.183.549.406 0 .199-.191.397-.645.397-.66 0-.874-.342-.882-.636h-1.034zM8.024 14.517v1.71a2.087 2.087 0 00-1.2-.374c-1.162 0-2.1.938-2.1 2.1 0 1.168.938 2.099 2.1 2.099.444 0 .858-.135 1.2-.374v.286h1.01v-5.447h-1.01zm6.226 0v1.71a2.087 2.087 0 00-1.2-.374c-1.161 0-2.1.938-2.1 2.1a2.092 2.092 0 002.1 2.099c.445 0 .858-.135 1.2-.374v.286h1.01v-5.447h-1.01zm-11.626-1.2l.684 1.2h4.716l-1.869-3.229-3.53 2.028zm7.913 2.21v-1.01h3.713l-3.96-6.855L6.751 9.69l2.776 4.827v1.01h1.01zm5.217-1.01h4.723L14.37 3.948l-3.531 2.036 4.915 8.533z',
    'New Balance': 'M12.169 10.306l1.111-1.937 3.774-.242.132-.236-3.488-.242.82-1.414h6.47c1.99 0 3.46.715 2.887 2.8-.17.638-.979 2.233-3.356 2.899.507.06 1.76.616 1.54 2.057-.384 2.558-3.69 3.774-5.533 3.774l-7.641.006-.38-1.48 4.005-.28.137-.237-4.346-.264-.467-1.755 6.178-.363.137-.231-11.096-.693.534-.925 11.948-.775.138-.231-3.504-.231m5 .385l1.1-.006c.738-.005 1.502-.34 1.783-1.018.259-.632-.088-1.171-.55-1.166h-1.067l-1.266 2.19zm-1.27 2.195l-1.326 2.305h1.265c.589 0 1.64-.292 1.964-1.128.302-.781-.253-1.177-.638-1.177h-1.266zM6.26 16.445l-.77 1.315L0 17.77l.534-.923 5.726-.402zm.385-10.216l4.417.006.336 1.248-5.276-.33.523-.924zm5 2.245l.484 1.832-7.542-.495.528-.92 6.53-.417zm-3.84 5.281l-.957 1.661-5.32-.302.534-.924 5.743-.435z',
    Puma: 'M23.845 3.008c-.417-.533-1.146-.106-1.467.08-2.284 1.346-2.621 3.716-3.417 5.077-.626 1.09-1.652 1.89-2.58 1.952-.686.049-1.43-.084-2.168-.405-1.807-.781-2.78-1.792-3.017-1.97-.487-.37-4.23-4.015-7.28-4.164 0 0-.372-.75-.465-.763-.222-.025-.45.451-.616.501-.15.053-.413-.512-.565-.487-.153.02-.302.586-.6.877-.22.213-.486.2-.637.463-.052.096-.034.265-.093.42-.127.32-.551.354-.555.697 0 .381.357.454.669.72.248.212.265.362.554.461.258.088.632-.187.964-.088.277.081.543.14.602.423.054.256 0 .658-.34.613-.112-.015-.598-.174-1.198-.11-.725.077-1.553.309-1.634 1.11-.041.447.514.97 1.055.866.371-.071.196-.506.399-.716.267-.27 1.772.944 3.172.944.593 0 1.031-.15 1.467-.605.04-.029.093-.102.155-.11a.632.632 0 01.195.088c1.131.897 1.984 2.7 6.13 2.721.582.007 1.25.279 1.796.777.48.433.764 1.125 1.037 1.825.418 1.053 1.161 2.069 2.292 3.203.06.068.99.78 1.06.833.012.01.084.167.053.255-.02.69-.123 2.67 1.365 2.753.366.02.275-.231.275-.41-.005-.341-.065-.685.113-1.04.253-.478-.526-.709-.509-1.756.019-.784-.645-.651-.984-1.25-.19-.343-.368-.532-.35-.946.073-2.38-.517-3.948-.805-4.327-.227-.294-.423-.403-.207-.54 1.24-.815 1.525-1.574 1.525-1.574.66-1.541 1.256-2.945 2.075-3.57.166-.12.589-.44.852-.56.763-.362 1.173-.578 1.388-.788.356-.337.635-1.053.294-1.48z',
    Reebok: 'M14.991 11.48C17.744 10.38 19.458 9.748 24 8.64c-2.467.163-7.922.537-11.682 1.271l2.673 1.57m-8.56 3.651h3.6c.713-1.08 1.422-1.606 2.248-2.191a71.382 71.382 0 00-1.892-.701c-2.297 1.014-3.575 2.375-3.953 2.892m.709-3.928c-3.21 1.147-4.994 2.393-6.199 3.928h3.975c.387-.539 1.862-2.093 4.633-3.174a57.092 57.092 0 00-2.41-.754M8.79 8.788H0c8.862 1.6 13.133 3.66 20 6.572-.587-.439-10.051-6.013-11.209-6.572',
};

function TimberlandLogo(props: LogoProps) {
    return (
        <svg {...base} {...props}>
            <title>Timberland</title>
            <path d="M12 2 7.5 11h2.2L8.2 20h7.6l-1.5-9H17L12 2zm0 3.2 2.8 5.8h-5.6L12 5.2z" />
        </svg>
    );
}

function DrMartensLogo(props: LogoProps) {
    return (
        <svg {...base} {...props}>
            <title>Dr. Martens</title>
            <path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm1.5 1.5h9v2.2l-4.5 1.8-4.5-1.8V7.5zm0 4.2 4.5 1.8 4.5-1.8V16h-9v-4.3z" />
        </svg>
    );
}

function BirkenstockLogo(props: LogoProps) {
    return (
        <svg {...base} {...props}>
            <title>Birkenstock</title>
            <path d="M3 14.5c2-3 5-4.5 9-4.5s7 1.5 9 4.5v2.5H3V14.5zm2.2 0c1.6-1.8 3.8-2.7 6.8-2.7s5.2.9 6.8 2.7H5.2z" />
        </svg>
    );
}

function ConverseLogo(props: LogoProps) {
    return (
        <svg {...base} {...props}>
            <title>Converse</title>
            <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 1.8a8.2 8.2 0 1 1 0 16.4 8.2 8.2 0 0 1 0-16.4zm0 3.5 1.1 2.3 2.5.4-1.8 1.8.4 2.5-2.2-1.2-2.2 1.2.4-2.5-1.8-1.8 2.5-.4L12 7.3z" />
        </svg>
    );
}

function AsicsLogo(props: LogoProps) {
    return (
        <svg {...base} {...props}>
            <title>ASICS</title>
            <path d="M2.5 16.5c2.8-4.5 5.8-6.5 9.5-6.5s6.7 2 9.5 6.5H2.5zm2.5-3c2-2.8 4.2-4 7-4s5 1.2 7 4H5zm2.5-2.8c1.4-1.6 2.8-2.2 4.5-2.2s3.1.6 4.5 2.2H7.5z" />
        </svg>
    );
}

function VansLogo(props: LogoProps) {
    return (
        <svg {...base} {...props}>
            <title>Vans</title>
            <path d="M4 6h16l-2 12H6L4 6zm3.5 2 1.2 8h1.4l1.2-8H7.5zm4 0 1.2 8h1.4l1.2-8h-3.8z" />
        </svg>
    );
}

function ClarksLogo(props: LogoProps) {
    return (
        <svg {...base} {...props}>
            <title>Clarks</title>
            <text x="12" y="16" textAnchor="middle" fontSize="7" fontWeight="700" fontFamily="Outfit, sans-serif" fill="currentColor">CLARKS</text>
        </svg>
    );
}

function TevaLogo(props: LogoProps) {
    return (
        <svg {...base} {...props}>
            <title>Teva</title>
            <text x="12" y="16" textAnchor="middle" fontSize="8" fontWeight="700" fontFamily="Outfit, sans-serif" fill="currentColor">TEVA</text>
        </svg>
    );
}

function SkechersLogo(props: LogoProps) {
    return (
        <svg {...base} {...props}>
            <title>Skechers</title>
            <text x="12" y="15.5" textAnchor="middle" fontSize="5.5" fontWeight="700" fontFamily="Outfit, sans-serif" fill="currentColor">SKECHERS</text>
        </svg>
    );
}

const CUSTOM_LOGOS: Record<string, (props: LogoProps) => ReactElement> = {
    Timberland: TimberlandLogo,
    'Dr. Martens': DrMartensLogo,
    Birkenstock: BirkenstockLogo,
    Converse: ConverseLogo,
    ASICS: AsicsLogo,
    Vans: VansLogo,
    Clarks: ClarksLogo,
    Teva: TevaLogo,
    Skechers: SkechersLogo,
};

/** All shoe brands in the demo catalog, in display order. */
export const STORE_BRANDS = [
    'Nike',
    'Adidas',
    'New Balance',
    'Puma',
    'Timberland',
    'Dr. Martens',
    'Birkenstock',
    'Converse',
    'Reebok',
    'ASICS',
    'Vans',
    'Clarks',
    'Teva',
    'Skechers',
] as const;

interface BrandLogoProps extends LogoProps {
    brand: string;
}

export default function BrandLogo({ brand, className, ...props }: Readonly<BrandLogoProps>) {
    const Custom = CUSTOM_LOGOS[brand];

    if (Custom) {
        return <Custom className={className} aria-label={brand} {...props} />;
    }

    const path = SIMPLE_ICON_PATHS[brand];

    if (path) {
        return (
            <svg {...base} className={className} aria-label={brand} {...props}>
                <title>{brand}</title>
                <path d={path} />
            </svg>
        );
    }

    return (
        <svg {...base} className={className} aria-label={brand} {...props}>
            <text x="12" y="16" textAnchor="middle" fontSize="6" fontWeight="600" fontFamily="Outfit, sans-serif" fill="currentColor">
                {brand.toUpperCase()}
            </text>
        </svg>
    );
}
