import { Card, Button, Modal, Spinner } from "flowbite-react";
import { CommentsComment } from "./Comments.Comment";
import { useState, useEffect, useCallback } from "react";
import { ENDPOINTS } from "#/api/config";
import useSWRInfinite from "swr/infinite";
import { CommentsAddModal } from "./Comments.Add";

export const CommentsMain = (props: {
  release_id: number;
  token: string | null;
  comments: any;
  type?: "release" | "collection";
}) => {
  const [isAllCommentsOpen, setIsAllCommentsOpen] = useState(false);
  const [isAddCommentsOpen, setIsAddCommentsOpen] = useState(false);
  const type = props.type || "release";

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
            <div className="flex items-end gap-2">
              {props.token && (
                <Button onClick={() => setIsAddCommentsOpen(true)} color="blue">
                  Оставить комментарий
                </Button>
              )}
              <Button onClick={() => setIsAllCommentsOpen(true)} color="light">
                Показать все
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {props.comments.map((comment: any) => (
              <CommentsComment
                key={comment.id}
                release_id={props.release_id}
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
                isSubComment={type != "release"}
                type={type}
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
        type={props.type}
      />
      <CommentsAddModal
        isOpen={isAddCommentsOpen}
        setIsOpen={setIsAddCommentsOpen}
        release_id={props.release_id}
        token={props.token}
        type={props.type}
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
  type?: "release" | "collection";
}) => {
  const [isLoadingEnd, setIsLoadingEnd] = useState(false);
  const [currentRef, setCurrentRef] = useState<any>(null);
  const modalRef = useCallback((ref) => {
    setCurrentRef(ref);
  }, []);

  const type = props.type || "release";

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.content.length) return null;
    let url;
    if (type == "release") {
      url = `${ENDPOINTS.release.info}/comment/all/${props.release_id}/${pageIndex}?sort=1`;
    } else if (type == "collection") {
      url = `${ENDPOINTS.collection.base}/comment/all/${props.release_id}/${pageIndex}?sort=1`;
    }
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
    if (scrollPosition >= 95 && scrollPosition <= 96) {
      setSize(size + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <p className="text-sm font-light text-gray-600 dark:text-gray-300">
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
              release_id={props.release_id}
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
              type={type}
            />
          ))
        ) : (
          <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
            Комментариев нет
          </p>
        )}
      </div>
    </Modal>
  );
};
