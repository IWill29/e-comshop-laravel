import ShopLayout from '@/Layouts/ShopLayout';
import { PageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const user = usePage().props.auth.user;

    const initials = user.name
        .split(' ')
        .map((part) => part.charAt(0))
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <ShopLayout>
            <Head title="Profile settings" />

            <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
                <Link
                    href={route('account.orders.index')}
                    className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition hover:text-stone-900 focus:outline-none focus-visible:text-indigo-600"
                >
                    <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        aria-hidden
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                        />
                    </svg>
                    Back to orders
                </Link>

                <div className="mt-6 rounded-2xl border border-stone-200/80 bg-white p-6 shadow-[0_4px_20px_-2px_rgb(0_0_0_/_0.08)] sm:p-8">
                    <div className="flex items-center gap-4">
                        <div
                            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 font-display text-lg font-bold text-white"
                            aria-hidden
                        >
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <h1 className="truncate font-display text-2xl font-extrabold tracking-tight text-stone-900 sm:text-3xl">
                                Profile settings
                            </h1>
                            <p className="mt-1 truncate text-sm text-stone-500">
                                {user.email}
                            </p>
                        </div>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-stone-600 sm:text-base">
                        Manage your account details, password, and preferences.
                    </p>
                </div>

                <div className="mt-6 space-y-6">
                    <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-[0_4px_20px_-2px_rgb(0_0_0_/_0.08)] sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>

                    <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-[0_4px_20px_-2px_rgb(0_0_0_/_0.08)] sm:p-8">
                        <UpdatePasswordForm />
                    </div>

                    <div className="rounded-2xl border border-red-200/60 bg-white p-6 shadow-[0_4px_20px_-2px_rgb(0_0_0_/_0.08)] sm:p-8">
                        <DeleteUserForm />
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
}
