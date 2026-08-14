import * as React from 'react';
import { useGetErrorLogsQuery } from '@inithium/store';
import type { ErrorLogWidgetConfig } from '@inithium/models';
import { ErrorLogWidget } from './error-log-widget.js';

export interface ErrorLogWidgetContainerProps {
  readonly config: ErrorLogWidgetConfig;
}

export const ErrorLogWidgetContainer = ({ config }: ErrorLogWidgetContainerProps) => {
  const [page, setPage] = React.useState(1);
  const { data, isLoading, isFetching, error } = useGetErrorLogsQuery({ page, limit: config.pageSize });

  return (
    <ErrorLogWidget
      logs={data?.data ?? []}
      isLoading={isLoading}
      isFetching={isFetching}
      currentPage={page}
      totalPages={data?.totalPages ?? 1}
      onPageChange={setPage}
      errorMessage={error?.message}
    />
  );
};
