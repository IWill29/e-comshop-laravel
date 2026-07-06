import AuthButton from '@/Components/Auth/AuthButton';
import AuthField from '@/Components/Auth/AuthField';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Join ParaditX for faster checkout and order history."
            alternate={{
                prompt: 'Already have an account?',
                linkLabel: 'Sign in',
                href: route('login'),
            }}
        >
            <Head title="Sign up" />

            <form onSubmit={submit} className="space-y-5">
                <AuthField
                    id="name"
                    label="Full name"
                    name="name"
                    value={data.name}
                    autoComplete="name"
                    isFocused
                    required
                    staggerIndex={0}
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
                    required
                    staggerIndex={1}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                />

                <AuthField
                    id="password"
                    label="Password"
                    type="password"
                    name="password"
                    value={data.password}
                    autoComplete="new-password"
                    required
                    staggerIndex={2}
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
                    required
                    staggerIndex={3}
                    onChange={(e) =>
                        setData('password_confirmation', e.target.value)
                    }
                    error={errors.password_confirmation}
                />

                <div
                    className="auth-enter pt-1"
                    style={{ animationDelay: '250ms' }}
                >
                    <AuthButton type="submit" disabled={processing}>
                        {processing ? 'Creating account…' : 'Create account'}
                    </AuthButton>
                </div>

                <p
                    className="auth-enter text-center text-xs leading-relaxed text-stone-400"
                    style={{ animationDelay: '300ms' }}
                >
                    By creating an account, you agree to our terms and privacy
                    policy.
                </p>
            </form>
        </AuthLayout>
    );
}
