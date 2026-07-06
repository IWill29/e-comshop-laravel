import {
    orderStatusClasses,
    orderStatusLabel,
} from '@/Utils/orderDisplay';

type OrderStatusBadgeProps = Readonly<{
    status: string;
    className?: string;
}>;

export default function OrderStatusBadge({
    status,
    className = 'px-2.5 py-1',
}: OrderStatusBadgeProps) {
    return (
        <span
            className={`inline-flex rounded-full text-xs font-semibold ring-1 ${orderStatusClasses(status)} ${className}`}
        >
            {orderStatusLabel(status)}
        </span>
    );
}
