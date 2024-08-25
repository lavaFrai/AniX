"use client";
import { Card, Button } from "flowbite-react";
import { useRouter } from "next/navigation";

export const ProfileActions = (props: {
  isMyProfile: boolean;
  isFriendRequestsDisallowed: boolean;
  profile_id: number;
}) => {
  return (
    <Card className="h-fit">
      <div className="flex gap-2">
        {props.isMyProfile && <Button color={"blue"}>Редактировать</Button>}
        {!props.isMyProfile && (
          <>
            {!props.isFriendRequestsDisallowed && (
              <Button color={"blue"}>Добавить в друзья</Button>
            )}
            <Button color={"red"}>Заблокировать</Button>
          </>
        )}
      </div>
    </Card>
  );
};
