import { Check, X } from 'lucide-react';
import { Button, PaginationControl, SearchFilterBar, Spinner, useEntityListState } from '@inithium/ui';
import { useFriendsMutation, useFriendsPaginatedResource } from './use-friends-fetch.js';
import { FriendListRow } from './friend-list-row.js';
import { DEFAULT_FRIEND_SEARCH_FIELD, FRIEND_SEARCH_FIELDS } from './friend-search-fields.js';
import type { PendingFriendRequest } from '../friendship.model.js';

const PAGE_LIMIT = 10;

export const PendingRequestsView = () => {
  const listState = useEntityListState(DEFAULT_FRIEND_SEARCH_FIELD);
  const resource = useFriendsPaginatedResource<PendingFriendRequest>('/friends/pending', {
    page: listState.currentPage,
    limit: PAGE_LIMIT,
    field: listState.searchField,
    search: listState.searchValue
  });
  const mutation = useFriendsMutation(resource.refetch);

  return (
    <div className="flex flex-col gap-4">
      <SearchFilterBar
        fields={FRIEND_SEARCH_FIELDS}
        field={listState.searchField}
        value={listState.searchValue}
        onFieldChange={listState.handleSearchFieldChange}
        onValueChange={listState.handleSearchValueChange}
      />
      {resource.isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : resource.data?.data.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">No pending requests</p>
      ) : (
        <div className="flex flex-col gap-2">
          {resource.data?.data.map((request) => (
            <FriendListRow
              key={request.friendshipId}
              user={request}
              renderAction={() => (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Accept"
                    loading={mutation.pendingKey === request.friendshipId}
                    onClick={() =>
                      mutation.execute(request.friendshipId, `/friends/requests/${request.friendshipId}/accept`, 'POST')
                    }
                  >
                    <Check className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Decline"
                    loading={mutation.pendingKey === request.friendshipId}
                    onClick={() => mutation.execute(request.friendshipId, `/friends/requests/${request.friendshipId}`, 'DELETE')}
                  >
                    <X className="size-4" />
                  </Button>
                </>
              )}
            />
          ))}
        </div>
      )}
      <div className="flex justify-center">
        <PaginationControl
          currentPage={listState.currentPage}
          totalPages={resource.data?.totalPages ?? 1}
          onPageChange={listState.handlePageChange}
        />
      </div>
    </div>
  );
};
