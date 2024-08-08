import { unixToDate } from "#/api/utils";
import { useEffect, useState } from "react";
import { ENDPOINTS } from "#/api/config";
import { Button } from "flowbite-react";
import Link from "next/link";

export const CommentsComment = (props: {
  profile: { login: string; avatar: string; id: number };
  comment: {
    id: number;
    timestamp: number;
    message: string;
    reply_count: number;
    likes_count: number;
    vote: number;
  };
  isSubComment?: boolean;
  token: string | null;
}) => {
  const [replies, setReplies] = useState([]);
  const [likes, setLikes] = useState(props.comment.likes_count);
  const [vote, setVote] = useState(props.comment.vote);

  useEffect(() => {
    async function _fetchReplies() {
      let url = `${ENDPOINTS.release.info}/comment/replies/${props.comment.id}/0?sort=2`;
      if (props.token) {
        url += `&token=${props.token}`;
      }
      await fetch(url)
        .then((res) => res.json())
        .then((data) => {
          setReplies(data.content);
        });
    }
    if (!props.isSubComment && props.comment.reply_count > 0) {
      _fetchReplies();
    }
  }, []);

  async function _sendVote(action: number) {
    if (props.token) {
      let url = `${ENDPOINTS.release.info}/comment/vote/${props.comment.id}/${action}?token=${props.token}`;
      fetch(url);
    }
  }

  // TODO: make it readable
  function _updateVote(action: string) {
    if (action === "like" && vote == 0) {
      setVote(2);
      setLikes(likes + 1);
      _sendVote(2);
    } else if (action === "dislike" && vote == 0) {
      setVote(1);
      setLikes(likes - 1);
      _sendVote(1);
    } else if (action === "like" && vote == 1) {
      setVote(2);
      setLikes(likes + 2);
      _sendVote(2);
    } else if (action === "dislike" && vote == 2) {
      setVote(1);
      setLikes(likes - 2);
      _sendVote(1);
    } else {
      setVote(0);
      _sendVote(0);
      if (action === "dislike" && vote == 1) {
        setLikes(likes + 1);
      } else if (action === "like" && vote == 2) {
        setLikes(likes - 1);
      } else {
        setLikes(props.comment.likes_count);
      }
    }
  }

  return (
    <article className="p-6 text-sm bg-white rounded-lg sm:text-base dark:bg-gray-900">
      <footer className="flex items-center justify-between mb-2">
        <div className="flex flex-col items-start gap-1 sm:items-center sm:flex-row">
          <Link
            href={`/profile/${props.profile.id}`}
            className="inline-flex items-center mr-3 text-sm font-semibold text-gray-900 dark:text-white hover:underline"
          >
            <img
              className="w-6 h-6 mr-2 rounded-full"
              src={props.profile.avatar}
              alt=""
            />
            {props.profile.login}
          </Link>
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
      <div className="flex items-center justify-between mt-4 space-x-4">
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
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
            />
          </svg>
          Ответить
        </button>
        <div className="flex items-center">
          {props.token && (
            <Button
              color="inline"
              onClick={() => {
                _updateVote("dislike");
              }}
            >
              <span
                className={`w-6 h-6 iconify mdi--dislike ${
                  vote == 1
                    ? "text-red-500 dark:text-red-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              ></span>
            </Button>
          )}
          <p
            className={`text-sm font-medium ${
              likes > 0
                ? "text-green-500 dark:text-green-400"
                : likes < 0
                ? "text-red-500 dark:text-red-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {likes}
          </p>
          {props.token && (
            <Button
              color="inline"
              onClick={() => {
                _updateVote("like");
              }}
            >
              <span
                className={`w-6 h-6 iconify mdi--like ${
                  vote == 2
                    ? "text-green-500 dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              ></span>
            </Button>
          )}
        </div>
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
              reply_count: comment.reply_count,
              likes_count: comment.likes_count,
              vote: comment.vote,
            }}
            isSubComment={true}
            token={props.token}
          />
        ))}
    </article>
  );
};
