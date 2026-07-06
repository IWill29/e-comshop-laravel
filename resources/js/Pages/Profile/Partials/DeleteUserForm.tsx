import AuthField from '@/Components/Auth/AuthField';
import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export default function DeleteUserForm() {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section>
            <header>
                <h2 className="font-display text-lg font-bold text-stone-900">
                    Delete account
                </h2>
                <p className="mt-1 text-sm text-stone-600">
                    Permanently remove your account and all associated data.
                    This action cannot be undone.
                </p>
            </header>

            <button
                type="button"
                onClick={confirmUserDeletion}
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl border border-red-200 bg-red-50 px-5 text-sm font-semibold text-red-700 transition-[transform,background-color,border-color] duration-[160ms] ease-out hover:border-red-300 hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 active:scale-[0.97] motion-reduce:active:scale-100"
            >
                Delete account
            </button>

            <Modal show={confirmingUserDeletion} onClose={closeModal} maxWidth="md">
                <form onSubmit={deleteUser} className="p-6 sm:p-8">
                    <h2 className="font-display text-xl font-bold text-stone-900">
                        Delete your account?
                    </h2>

                    <p className="mt-2 text-sm leading-relaxed text-stone-600">
                        Enter your password to confirm. All order history and
                        account data will be permanently removed.
                    </p>

                    <div className="mt-6">
                        <AuthField
                            id="delete_password"
                            label="Password"
                            type="password"
                            name="password"
                            value={data.password}
                            autoComplete="current-password"
                            isFocused
                            onChange={(e) => setData('password', e.target.value)}
                            error={errors.password}
                        />
                    </div>

                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-red-600 px-5 text-sm font-semibold text-white shadow-sm transition-[transform,background-color] duration-[160ms] ease-out hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 motion-reduce:active:scale-100"
                        >
                            {processing ? 'Deleting…' : 'Delete account'}
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
