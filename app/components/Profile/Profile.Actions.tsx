"use client";
import { ENDPOINTS } from "#/api/config";
import { Card, Button } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// null - не друзья
// 0 - заявка в друзья authUserId < profileId
// 1 - заявка в друзья authUserId > profileId
// 2 - друзья

// если id профиля больше id юзера, то 0 иначе 1

export const ProfileActions = (props: {
  isMyProfile: boolean;
  isFriendRequestsDisallowed: boolean;
  profile_id: number;
  my_profile_id: number;
  friendStatus: number;
  token: string;
}) => {
  const router = useRouter();
  const z2 = props.my_profile_id < props.profile_id;
  let profileIdIsSmaller = z2 ? true : false;

  const [friendRequestDisabled, setfriendRequestDisabled] = useState(false);

  function _getFriendStatus() {
    const num = props.friendStatus;

    if (num == null) {
      return null;
    }
    let z = true;
    if (num == 2) {
      return 1;
    }
    let z3 = (num == 0 && z2) || (num == 1 && !z2);
    if ((num != 1 || z2) && (num != 0 || !z2)) {
      z = false;
    }
    if (z3) {
      return 2;
    }
    if (z) {
      return 3;
    }
    return 0;
  }
  const FriendStatus = _getFriendStatus();
  const isRequestedStatus =
    FriendStatus != null
      ? profileIdIsSmaller
        ? profileIdIsSmaller && FriendStatus != 0
        : !profileIdIsSmaller && FriendStatus == 2
      : null;
  // ^ This is some messed up shit

  function _addToFriends() {
    let url = `${ENDPOINTS.user.profile}/friend/request`;
    setfriendRequestDisabled(true);

    FriendStatus == 1
      ? (url += "/remove/")
      : isRequestedStatus
      ? (url += "/remove/")
      : (url += "/send/");

    url += `${props.profile_id}?token=${props.token}`;
    fetch(url).then((res) => {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  }

  return (
    <Card className="h-fit">
      {isRequestedStatus != null && !isRequestedStatus && FriendStatus != 1 && (
        <p>Отправил(-а) вам заявку в друзья</p>
      )}
      <div className="flex gap-2">
        {props.isMyProfile && <Button color={"blue"}>Редактировать</Button>}
        {!props.isMyProfile && (
          <>
            {(!props.isFriendRequestsDisallowed ||
              FriendStatus == 1 ||
              isRequestedStatus) && (
              <Button
                disabled={friendRequestDisabled}
                color={
                  FriendStatus == 1
                    ? "red"
                    : isRequestedStatus
                    ? "light"
                    : "blue"
                }
                onClick={() => _addToFriends()}
              >
                {FriendStatus == 1
                  ? "Удалить из друзей"
                  : isRequestedStatus
                  ? "Заявка отправлена"
                  : "Добавить в друзья"}
              </Button>
            )}
            <Button color={"red"}>Заблокировать</Button>
          </>
        )}
      </div>
    </Card>
  );
};
