import { Card, Button } from "flowbite-react";
import { CommentsComment } from "./Comments.Comment";
export const CommentsMain = (props: {
  release_id: number;
  token: string | null;
  comments: any;
}) => {
  return (
    <Card className="antialiased">
      <div className="max-w-2xl px-4 mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold text-gray-900 lg:text-2xl dark:text-white">
              Комментарии
            </h2>
            <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
              Популярные и актуальные
            </p>
          </div>
          <Button
            size={"sm"}
            className="text-gray-500 border border-gray-600 rounded-full"
            color="inline"
          >
            Показать все
          </Button>
        </div>
        <form className="mb-6">
          <div className="px-4 py-2 mb-4 bg-white border border-gray-200 rounded-lg rounded-t-lg dark:bg-gray-800 dark:border-gray-700">
            <label htmlFor="comment" className="sr-only">
              Ваш комментарий
            </label>
            <textarea
              id="comment"
              rows={4}
              className="w-full px-0 text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
              placeholder="Написать комментарий..."
              required
            ></textarea>
          </div>
          <Button
            type="submit"
            color="blue"
          >
            Оставить комментарий
          </Button>
        </form>
        {props.comments.map((comment: any) => (
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
          />
        ))}
      </div>
    </Card>
  );
};
