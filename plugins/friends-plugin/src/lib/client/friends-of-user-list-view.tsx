import { Button, PaginationControl, SearchFilterBar, Spinner, useEntityListState } from '@inithium/ui';
import { useFriendsMutation, useFriendsPaginatedResource } from './use-friends-fetch.js';
import { FriendListRow } from './friend-list-row.js';
import { DEFAULT_FRIEND_SEARCH_FIELD, FRIEND_SEARCH_FIELDS } from './friend-search-fields.js';
import type { FriendSummary } from '../friendship.model.js';

const PAGE_LIMIT = 10;

export interface FriendsOfUserListViewProps {
  readonly path: string;
  readonly emptyMessage: string;
  readonly canManage?: boolean;
}

export const FriendsOfUserListView = ({ path, emptyMessage, canManage = false }: FriendsOfUserListViewProps) => {
  const listState = useEntityListState(DEFAULT_FRIEND_SEARCH_FIELD);
  const resource = useFriendsPaginatedResource<FriendSummary>(path, {
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
        <p className="py-10 text-center text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <div className="flex flex-col gap-2">
          {resource.data?.data.map((friend) => (
            <FriendListRow
              key={friend.friendshipId}
              user={friend}
              renderAction={
                canManage
                  ? () => (
                      <Button
                        type="button"
                        variant="outlined"
                        color="destructive"
                        size="sm"
                        loading={mutation.pendingKey === friend.friendshipId}
                        onClick={() => mutation.execute(friend.friendshipId, `/friends/${friend.friendshipId}`, 'DELETE')}
                      >
                        Remove Friend
                      </Button>
                    )
                  : undefined
              }
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
