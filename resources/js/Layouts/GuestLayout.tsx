import AuthLayout, { AuthLayoutProps } from '@/Layouts/AuthLayout';
import { PropsWithChildren } from 'react';

type GuestLayoutProps = PropsWithChildren<
    Partial<Pick<AuthLayoutProps, 'title' | 'subtitle' | 'alternate'>>
>;

export default function GuestLayout({
    children,
    title = 'Your account',
    subtitle,
    alternate,
}: GuestLayoutProps) {
    return (
        <AuthLayout title={title} subtitle={subtitle} alternate={alternate}>
            {children}
        </AuthLayout>
    );
}
