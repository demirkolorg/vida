import { Badge } from '@/components/ui/badge';
import { statusStyles } from '@/components/table/Functions';

export const StatusCell = ({ status }) => {
    return (
        <Badge variant="outline" className={`${statusStyles[status] || 'bg-gray-500'} text-white text-xs`}>
            {status || '-'}
        </Badge>)
}
