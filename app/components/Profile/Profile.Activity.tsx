"use client";
import { Card } from "flowbite-react";
import Link from "next/link";
import { numberDeclension } from "#/api/utils";

export function ProfileActivity(props: {
  profile_id: number;
  commentCount: number;
  videoCount: number;
  collectionCount: number;
  friendsCount: number;
}) {
  return (
    <Card className="h-fit">
      <h1 className="text-2xl font-bold">Активность</h1>
      <div className="flex items-center gap-4 text-lg">
        <div>
          <p>
            {props.commentCount}{" "}
            {numberDeclension(
              props.commentCount,
              "комментарий",
              "комментария",
              "комментариев"
            )}
          </p>
          <p className="mt-2">{props.videoCount} видео</p>
        </div>
        <div>
          <Link href={`/profile/${props.profile_id}/collections`}>
            <p className="border-b-2 border-gray-300 border-solid dark:border-gray-400 hover:border-gray-500 dark:hover:border-gray-200">
              {props.collectionCount}{" "}
              {numberDeclension(
                props.commentCount,
                "коллекция",
                "коллекции",
                "коллекций"
              )}
            </p>
          </Link>
          <p className="mt-2">
            {props.friendsCount}{" "}
            {numberDeclension(props.commentCount, "друзей", "друга", "друзей")}
          </p>
        </div>
      </div>
    </Card>
  );
}
