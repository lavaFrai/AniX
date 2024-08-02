import { unixToDate } from "#/api/utils";
import { useEffect, useState } from "react";
import { ENDPOINTS } from "#/api/config";

export const CommentsComment = (props: {
  profile: { login: string; avatar: string; id: number };
  comment: {
    id: number;
    timestamp: number;
    message: string;
    likes: number;
    reply_count: number;
  };
  isSubComment?: boolean;
}) => {
  const [replies, setReplies] = useState([]);
  useEffect(() => {
    async function _fetchReplies() {
      await fetch(
        `${ENDPOINTS.release.info}/comment/replies/${props.comment.id}/0?sort=2`
      )
        .then((res) => res.json())
        .then((data) => {
          setReplies(data.content);
        });
    }
    if (!props.isSubComment && props.comment.reply_count > 0) {
      _fetchReplies();
    }
  }, []);

  return (
    <article className="p-6 text-sm bg-white rounded-lg sm:text-base dark:bg-gray-900">
      <footer className="flex items-center justify-between mb-2">
        <div className="flex flex-col items-start gap-1 sm:items-center sm:flex-row">
          <p className="inline-flex items-center mr-3 text-sm font-semibold text-gray-900 dark:text-white">
            <img
              className="w-6 h-6 mr-2 rounded-full"
              src={props.profile.avatar}
              alt={props.profile.login}
            />
            {props.profile.login}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <time
              dateTime={props.comment.timestamp.toString()}
              title={unixToDate(props.comment.timestamp, "full")}
            >
              {unixToDate(props.comment.timestamp)}
            </time>
          </p>
        </div>
      </footer>
      <p className="text-gray-500 whitespace-pre-wrap dark:text-gray-400">
        {props.comment.message}
      </p>
      <div className="flex items-center mt-4 space-x-4">
        <button
          type="button"
          className="flex items-center text-sm font-medium text-gray-500 hover:underline dark:text-gray-400"
        >
          <svg
            className="mr-1.5 w-3.5 h-3.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 18"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
            />
          </svg>
          Ответить
        </button>
      </div>
      {replies.length > 0 &&
        replies.map((comment: any) => (
          <CommentsComment
            key={comment.id}
            profile={comment.profile}
            comment={{
              id: comment.id,
              timestamp: comment.timestamp,
              message: comment.message,
              likes: comment.likes_count,
              reply_count: comment.reply_count,
            }}
            isSubComment={true}
          />
        ))}
    </article>
  );
};
