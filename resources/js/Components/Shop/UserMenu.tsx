import Dropdown from '@/Components/Dropdown';
import { User } from '@/types';
import { Link } from '@inertiajs/react';

type UserMenuProps = {
    user: User;
};

export default function UserMenu({ user }: UserMenuProps) {
    const initials = user.name
        .split(' ')
        .map((part) => part.charAt(0))
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <Dropdown>
            <Dropdown.Trigger>
                <button
                    type="button"
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-100 text-sm font-semibold text-stone-700 transition-[transform,background-color,color] duration-[160ms] ease-out hover:bg-stone-200 hover:text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-[0.97] motion-reduce:active:scale-100"
                    aria-label="Account menu"
                    aria-haspopup="menu"
                >
                    <span className="sr-only">{user.name}</span>
                    <span aria-hidden>{initials}</span>
                </button>
            </Dropdown.Trigger>

            <Dropdown.Content
                align="right"
                width="56"
                contentClasses="rounded-xl border border-stone-200 bg-white py-1.5 shadow-[0_4px_20px_-2px_rgb(0_0_0_/_0.08)]"
            >
                <div className="border-b border-stone-100 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-stone-900">
                        {user.name}
                    </p>
                    <p className="truncate text-xs text-stone-500">{user.email}</p>
                </div>

                <Dropdown.Link
                    href={route('account.orders.index')}
                    className="px-4 py-2.5 text-sm text-stone-700 transition-[background-color,color] duration-150 ease-out hover:bg-stone-50 hover:text-stone-900 focus:bg-stone-50"
                >
                    My orders
                </Dropdown.Link>

                <Dropdown.Link
                    href={route('profile.edit')}
                    className="px-4 py-2.5 text-sm text-stone-700 transition-[background-color,color] duration-150 ease-out hover:bg-stone-50 hover:text-stone-900 focus:bg-stone-50"
                >
                    Profile settings
                </Dropdown.Link>

                <div className="mt-1 border-t border-stone-100 pt-1">
                    <Dropdown.Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="px-4 py-2.5 text-sm text-stone-700 transition-[background-color,color] duration-150 ease-out hover:bg-stone-50 hover:text-stone-900 focus:bg-stone-50"
                    >
                        Sign out
                    </Dropdown.Link>
                </div>
            </Dropdown.Content>
        </Dropdown>
    );
}
