import AuthButton from '@/Components/Auth/AuthButton';
import AuthField from '@/Components/Auth/AuthField';
import Checkbox from '@/Components/Checkbox';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
}: Readonly<{
    status?: string;
    canResetPassword: boolean;
}>) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to track orders and check out faster."
            alternate={{
                prompt: "Don't have an account?",
                linkLabel: 'Sign up',
                href: route('register'),
            }}
        >
            <Head title="Sign in" />

            {status && (
                <div
                    className="auth-enter mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
                    style={{ animationDelay: '50ms' }}
                    role="status"
                >
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <AuthField
                    id="email"
                    label="Email"
                    type="email"
                    name="email"
                    value={data.email}
                    autoComplete="username"
                    isFocused
                    staggerIndex={0}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                />

                <AuthField
                    id="password"
                    label="Password"
                    type="password"
                    name="password"
                    value={data.password}
                    autoComplete="current-password"
                    staggerIndex={1}
                    onChange={(e) => setData('password', e.target.value)}
                    error={errors.password}
                />

                <div
                    className="auth-enter flex items-center justify-between gap-4"
                    style={{ animationDelay: '150ms' }}
                >
                    <label className="flex cursor-pointer items-center gap-2.5">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            className="rounded border-stone-300 text-indigo-600 focus:ring-indigo-500/20"
                            onChange={(e) =>
                                setData(
                                    'remember',
                                    (e.target.checked || false) as false,
                                )
                            }
                        />
                        <span className="text-sm text-stone-600">
                            Remember me
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="shrink-0 text-sm font-medium text-indigo-600 transition hover:text-indigo-500 focus:outline-none focus-visible:underline"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                <div
                    className="auth-enter pt-1"
                    style={{ animationDelay: '200ms' }}
                >
                    <AuthButton type="submit" disabled={processing}>
                        {processing ? 'Signing in…' : 'Sign in'}
                    </AuthButton>
                </div>
            </form>
        </AuthLayout>
    );
}
