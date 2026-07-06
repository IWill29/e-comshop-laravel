import AuthButton from '@/Components/Auth/AuthButton';
import AuthField from '@/Components/Auth/AuthField';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

export default function UpdatePasswordForm() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section>
            <header>
                <h2 className="font-display text-lg font-bold text-stone-900">
                    Update password
                </h2>
                <p className="mt-1 text-sm text-stone-600">
                    Use a long, random password to keep your account secure.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-5">
                <AuthField
                    id="current_password"
                    label="Current password"
                    type="password"
                    name="current_password"
                    value={data.current_password}
                    autoComplete="current-password"
                    onChange={(e) =>
                        setData('current_password', e.target.value)
                    }
                    error={errors.current_password}
                />

                <AuthField
                    id="password"
                    label="New password"
                    type="password"
                    name="password"
                    value={data.password}
                    autoComplete="new-password"
                    onChange={(e) => setData('password', e.target.value)}
                    error={errors.password}
                />

                <AuthField
                    id="password_confirmation"
                    label="Confirm password"
                    type="password"
                    name="password_confirmation"
                    value={data.password_confirmation}
                    autoComplete="new-password"
                    onChange={(e) =>
                        setData('password_confirmation', e.target.value)
                    }
                    error={errors.password_confirmation}
                />

                <div className="flex flex-wrap items-center gap-4 pt-1">
                    <AuthButton
                        type="submit"
                        disabled={processing}
                        className="w-auto min-w-[8rem]"
                    >
                        {processing ? 'Saving…' : 'Update password'}
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
                            Password updated.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
