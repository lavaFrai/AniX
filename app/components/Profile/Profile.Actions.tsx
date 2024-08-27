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
  is_me_blocked: boolean;
  is_blocked: boolean;
}) => {
  const router = useRouter();
  const profileIdIsSmaller = props.my_profile_id < props.profile_id;
  const [friendRequestDisabled, setFriendRequestDisabled] = useState(false);
  const [blockRequestDisabled, setBlockRequestDisabled] = useState(false);

  function _getFriendStatus() {
    const num = props.friendStatus;

    if (num == null) {
      return null;
    }
    let z = true;
    if (num == 2) {
      return 1;
    }
    let z3 =
      (num == 0 && profileIdIsSmaller) || (num == 1 && !profileIdIsSmaller);
    if ((num != 1 || profileIdIsSmaller) && (num != 0 || !profileIdIsSmaller)) {
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
    setFriendRequestDisabled(true);
    setBlockRequestDisabled(true);

    FriendStatus == 1
      ? (url += "/remove/")
      : isRequestedStatus
      ? (url += "/remove/")
      : (url += "/send/");

    url += `${props.profile_id}?token=${props.token}`;
    fetch(url).then((res) => {
      setTimeout(() => {
        window.location.reload();
      }, 100);
    });
  }

  function _addToBlocklist() {
    let url = `${ENDPOINTS.user.profile}/blocklist`;
    setBlockRequestDisabled(true);
    setFriendRequestDisabled(true);

    !props.is_blocked ? (url += "/add/") : (url += "/remove/");

    url += `${props.profile_id}?token=${props.token}`;
    fetch(url).then((res) => {
      setTimeout(() => {
        window.location.reload();
      }, 100);
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
              isRequestedStatus) &&
              !props.is_me_blocked &&
              !props.is_blocked && (
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
            <Button
              color={!props.is_blocked ? "red" : "blue"}
              disabled={blockRequestDisabled}
              onClick={() => _addToBlocklist()}
            >
              {!props.is_blocked ? "Заблокировать" : "Разблокировать"}
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};
