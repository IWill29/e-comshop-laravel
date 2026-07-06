import InputError from '@/Components/InputError';
import AuthInput from '@/Components/Auth/AuthInput';
import { InputHTMLAttributes } from 'react';

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
    staggerIndex?: number;
    isFocused?: boolean;
};

export default function AuthField({
    label,
    error,
    staggerIndex = 0,
    id,
    className = '',
    isFocused,
    ...inputProps
}: AuthFieldProps) {
    const fieldId = id ?? inputProps.name;

    return (
        <div
            className="auth-enter"
            style={{ animationDelay: `${50 + staggerIndex * 50}ms` }}
        >
            <label
                htmlFor={fieldId}
                className="block text-sm font-medium text-stone-700"
            >
                {label}
            </label>
            <AuthInput
                id={fieldId}
                isFocused={isFocused}
                className={`mt-1.5 ${className}`}
                {...inputProps}
            />
            <InputError message={error} className="mt-1.5 text-red-600" />
        </div>
    );
}
