import { Button, PaginationControl, SearchFilterBar, Spinner, useEntityListState } from '@inithium/ui';
import { useFriendsMutation, useFriendsPaginatedResource } from './use-friends-fetch.js';
import { FriendListRow } from './friend-list-row.js';
import { DEFAULT_FRIEND_SEARCH_FIELD, FRIEND_SEARCH_FIELDS } from './friend-search-fields.js';
import type { UserSearchResult } from '../friendship.model.js';

const PAGE_LIMIT = 10;

export const SearchAndAddFriendsView = () => {
  const listState = useEntityListState(DEFAULT_FRIEND_SEARCH_FIELD);
  const resource = useFriendsPaginatedResource<UserSearchResult>('/friends/users/search', {
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
      ) : !listState.searchValue ? (
        <p className="py-10 text-center text-sm text-muted-foreground">Search for people to add as friends</p>
      ) : resource.data?.data.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">No users found</p>
      ) : (
        <div className="flex flex-col gap-2">
          {resource.data?.data.map((user) => (
            <FriendListRow
              key={user.userId}
              user={user}
              renderAction={() =>
                user.friendshipStatus === 'accepted' ? (
                  <Button
                    type="button"
                    variant="outlined"
                    color="destructive"
                    size="sm"
                    loading={mutation.pendingKey === user.userId}
                    onClick={() => mutation.execute(user.userId, `/friends/${user.friendshipId}`, 'DELETE')}
                  >
                    Remove Friend
                  </Button>
                ) : user.friendshipStatus === 'pending-outgoing' ? (
                  <Button type="button" variant="outlined" size="sm" disabled>
                    Request Sent
                  </Button>
                ) : user.friendshipStatus === 'pending-incoming' ? (
                  <Button type="button" variant="outlined" size="sm" disabled>
                    Respond in Pending
                  </Button>
                ) : (
                  <Button
                    type="button"
                    color="primary"
                    size="sm"
                    loading={mutation.pendingKey === user.userId}
                    onClick={() => mutation.execute(user.userId, '/friends/requests', 'POST', { recipientId: user.userId })}
                  >
                    Add Friend
                  </Button>
                )
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
