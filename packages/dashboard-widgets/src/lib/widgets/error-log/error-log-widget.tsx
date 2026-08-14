import { DataTable, ScrollArea, Skeleton, Text, type DataTableColumn } from '@inithium/ui';
import type { ErrorLog } from '@inithium/models';

export interface ErrorLogWidgetProps {
  readonly logs: readonly ErrorLog[];
  readonly isLoading: boolean;
  readonly isFetching?: boolean;
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onPageChange: (page: number) => void;
  readonly errorMessage?: string;
}

const columns: readonly DataTableColumn<ErrorLog>[] = [
  {
    key: 'message',
    header: 'Message',
    render: (log) => (
      <span className="block max-w-xs truncate" title={log.message}>
        {log.message}
      </span>
    )
  },
  {
    key: 'source',
    header: 'Source',
    render: (log) => (
      <span className="block max-w-xs truncate" title={`${log.appId} ${log.route}`}>
        {log.appId} · {log.route}
      </span>
    )
  },
  {
    key: 'updatedAt',
    header: 'Last Seen',
    render: (log) => new Date(log.updatedAt).toLocaleString()
  },
  {
    key: 'occurrenceCount',
    header: 'Occurrences',
    align: 'right',
    render: (log) => log.occurrenceCount
  }
];

export const ErrorLogWidget = ({
  logs,
  isLoading,
  isFetching,
  currentPage,
  totalPages,
  onPageChange,
  errorMessage
}: ErrorLogWidgetProps) => {
  if (isLoading) {
    return <Skeleton className="h-full min-h-40 w-full" />;
  }

  if (errorMessage) {
    return (
      <div className="flex h-full min-h-40 items-center justify-center text-center">
        <Text size="sm" color="destructive">
          {errorMessage}
        </Text>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <DataTable
        columns={columns}
        rows={logs}
        getRowId={(log) => log._id}
        isLoading={false}
        isFetching={isFetching}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        emptyMessage="No critical errors recorded"
      />
    </ScrollArea>
  );
};
