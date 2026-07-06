import AuthButton from '@/Components/Auth/AuthButton';
import AuthField from '@/Components/Auth/AuthField';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
}: Readonly<{
    mustVerifyEmail: boolean;
    status?: string;
}>) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section>
            <header>
                <h2 className="font-display text-lg font-bold text-stone-900">
                    Profile information
                </h2>
                <p className="mt-1 text-sm text-stone-600">
                    Update your name and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-5">
                <AuthField
                    id="name"
                    label="Name"
                    name="name"
                    value={data.name}
                    autoComplete="name"
                    isFocused
                    onChange={(e) => setData('name', e.target.value)}
                    error={errors.name}
                />

                <AuthField
                    id="email"
                    label="Email"
                    type="email"
                    name="email"
                    value={data.email}
                    autoComplete="username"
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                />

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                        <p className="text-sm text-amber-900">
                            Your email address is unverified.{' '}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="font-medium text-indigo-600 transition hover:text-indigo-500 focus:outline-none focus-visible:underline"
                            >
                                Resend verification email
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <p className="mt-2 text-sm font-medium text-emerald-700">
                                A new verification link has been sent to your
                                email address.
                            </p>
                        )}
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-4 pt-1">
                    <AuthButton
                        type="submit"
                        disabled={processing}
                        className="w-auto min-w-[8rem]"
                    >
                        {processing ? 'Saving…' : 'Save changes'}
                    </AuthButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-150"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition ease-in-out duration-150"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm font-medium text-emerald-600">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
