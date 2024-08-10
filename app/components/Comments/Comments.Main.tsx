import { Card, Button, Modal, Spinner } from "flowbite-react";
import { CommentsComment } from "./Comments.Comment";
import { useState, useEffect, useCallback } from "react";
import { ENDPOINTS } from "#/api/config";
import useSWRInfinite from "swr/infinite";

export const CommentsMain = (props: {
  release_id: number;
  token: string | null;
  comments: any;
}) => {
  const [isAllCommentsOpen, setIsAllCommentsOpen] = useState(false);
  return (
    <>
      <Card className="antialiased">
        <div className="w-full">
          <div className="flex flex-col justify-start gap-2 mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-bold text-gray-900 lg:text-2xl dark:text-white">
                Комментарии
              </h2>
              <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
                Популярные и актуальные
              </p>
            </div>
            <Button
              onClick={() => setIsAllCommentsOpen(true)}
              color="light"
              pill={true}
              size={"sm"}
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
            <Button type="submit" color="blue">
              Оставить комментарий
            </Button>
          </form>
          <div className="flex flex-col gap-2">
            {props.comments.map((comment: any) => (
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
                  isSpoiler: comment.is_spoiler,
                  isEdited: comment.is_edited,
                  isDeleted: comment.is_deleted,
                }}
                token={props.token}
              />
            ))}
          </div>
        </div>
      </Card>
      <CommentsAllModal
        isOpen={isAllCommentsOpen}
        setIsOpen={setIsAllCommentsOpen}
        release_id={props.release_id}
        token={props.token}
      />
    </>
  );
};

const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error(
      `An error occurred while fetching the data. status: ${res.status}`
    );
    error.message = await res.json();
    throw error;
  }

  return res.json();
};

const CommentsAllModal = (props: {
  isOpen: boolean;
  setIsOpen: any;
  release_id: number;
  token: string | null;
}) => {
  const [isLoadingEnd, setIsLoadingEnd] = useState(false);
  const [currentRef, setCurrentRef] = useState<any>(null);
  const modalRef = useCallback((ref) => {
    setCurrentRef(ref);
  }, []);

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.content.length) return null;
    let url = `${ENDPOINTS.release.info}/comment/all/${props.release_id}/${pageIndex}?sort=1`;
    if (props.token) {
      url += `&token=${props.token}`;
    }
    return url;
  };

  const { data, error, isLoading, size, setSize } = useSWRInfinite(
    getKey,
    fetcher,
    { initialSize: 2 }
  );

  const [content, setContent] = useState(null);
  useEffect(() => {
    if (data) {
      let allReleases = [];
      for (let i = 0; i < data.length; i++) {
        allReleases.push(...data[i].content);
      }
      setContent(allReleases);
      setIsLoadingEnd(true);
    }
  }, [data]);

  const [scrollPosition, setScrollPosition] = useState(0);
  function handleScroll() {
    const height = currentRef.scrollHeight - currentRef.clientHeight;
    const windowScroll = currentRef.scrollTop;
    const scrolled = (windowScroll / height) * 100;
    setScrollPosition(Math.floor(scrolled));
  }

  useEffect(() => {
    console.log(scrollPosition);
    if (scrollPosition >= 95 && scrollPosition <= 96) {
      setSize(size + 1);
    }
  }, [scrollPosition]);

  return (
    <Modal
      dismissible
      show={props.isOpen}
      onClose={() => props.setIsOpen(false)}
    >
      <Modal.Header>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-gray-900 lg:text-2xl dark:text-white">
            Все комментарии
          </h2>
          <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
            всего: {!isLoadingEnd ? "загрузка..." : data[0].total_count}
          </p>
        </div>
      </Modal.Header>
      <div
        className="flex flex-col gap-2 p-4 overflow-y-auto"
        onScroll={handleScroll}
        ref={modalRef}
      >
        {!isLoadingEnd ? (
          <Spinner />
        ) : content ? (
          content.map((comment: any) => (
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
                isSpoiler: comment.is_spoiler,
                isEdited: comment.is_edited,
                isDeleted: comment.is_deleted,
              }}
              token={props.token}
            />
          ))
        ) : (
          <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
            Комментариев нет
          </p>
        )}
      </div>
      {/* <Modal.Footer>TEXT</Modal.Footer> */}
    </Modal>
  );
};
