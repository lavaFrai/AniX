"use client";

import useSWR from "swr";
import { Spinner } from "#/components/Spinner/Spinner";
const fetcher = (...args: any) =>
  fetch([...args] as any).then((res) => res.json());
import { useUserStore } from "#/store/auth";
import { useEffect, useState } from "react";

import { ReleaseInfoBasics } from "#/components/ReleaseInfo/ReleaseInfo.Basics";
import { ReleaseInfoInfo } from "#/components/ReleaseInfo/ReleaseInfo.Info";
import { ReleasePlayer } from "#/components/ReleasePlayer/ReleasePlayer";
import { ReleaseInfoUserList } from "#/components/ReleaseInfo/ReleaseInfo.UserList";
import { ReleaseInfoRating } from "#/components/ReleaseInfo/ReleaseInfo.Rating";
import { ReleaseInfoRelated } from "#/components/ReleaseInfo/ReleaseInfo.Related";
import { ReleaseInfoScreenshots } from "#/components/ReleaseInfo/ReleaseInfo.Screenshots";
import { CommentsMain } from "#/components/Comments/Comments.Main";

export const ReleasePage = (props: any) => {
  const token = useUserStore((state) => state.token);
  const [userList, setUserList] = useState(0);
  const [userFavorite, setUserFavorite] = useState(false);

  function useFetch(id: number) {
    let url: string;

    url = `/api/release/${id}`;
    if (token) {
      url += `?token=${token}`;
    }
    const { data, isLoading, error } = useSWR(url, fetcher);
    return [data, isLoading, error];
  }
  const [data, isLoading, error] = useFetch(props.id);

  useEffect(() => {
    if (data) {
      const el = document.getElementById("note");
      if (el) {
        el.innerHTML = data.release.note;
      }
      setUserList(data.release.profile_list_status || 0);
      setUserFavorite(data.release.is_favorite);
    }
  }, [data]);

  return data ? (
    <main className="container px-4 pt-4 pb-24 mx-auto sm:pb-4">
      <div className="flex flex-col lg:grid lg:grid-cols-[70%_30%] gap-2 grid-flow-row-dense">
        <div className="[grid-column:1] [grid-row:span_2]">
          <ReleaseInfoBasics
            image={data.release.image}
            title={{
              ru: data.release.title_ru,
              original: data.release.title_original,
            }}
            description={data.release.description}
            note={data.release.note}
          />
        </div>
        <div className="[grid-column:2]">
          <ReleaseInfoInfo
            country={data.release.country}
            aired_on_date={data.release.aired_on_date}
            year={data.release.year}
            episodes={{
              total: data.release.episodes_total,
              released: data.release.episodes_released,
            }}
            season={data.release.season}
            status={data.release.status.name}
            duration={data.release.duration}
            category={data.release.category.name}
            broadcast={data.release.broadcast}
            studio={data.release.studio}
            author={data.release.author}
            director={data.release.director}
            genres={data.release.genres}
          />
        </div>
        <div className="[grid-column:2]">
          <ReleaseInfoUserList
            userList={userList}
            isFavorite={userFavorite}
            release_id={data.release.id}
            token={token}
            setUserList={setUserList}
            setIsFavorite={setUserFavorite}
          />
        </div>
        {data.release.status.name.toLowerCase() != "анонс" && (
          <div className="[grid-column:1] [grid-row:span_4]">
            <ReleasePlayer id={props.id} />
          </div>
        )}
        {data.release.status.name.toLowerCase() != "анонс" && (
          <div className="[grid-column:2]">
            <ReleaseInfoRating
              release_id={props.id}
              grade={data.release.grade}
              token={token}
              votes={{
                1: data.release.vote_1_count,
                2: data.release.vote_2_count,
                3: data.release.vote_3_count,
                4: data.release.vote_4_count,
                5: data.release.vote_5_count,
                total: data.release.vote_count,
                user: data.release.your_vote,
              }}
            />
          </div>
        )}
        {data.release.screenshot_images.length > 0 && (
          <div className="[grid-column:2]">
            <ReleaseInfoScreenshots images={data.release.screenshot_images} />
          </div>
        )}

        {data.release.related_releases.length > 0 && (
          <div className="[grid-column:2] [grid-row:span_4]">
            <ReleaseInfoRelated
              release_id={props.id}
              related={data.release.related}
              related_releases={data.release.related_releases}
            />
          </div>
        )}

        <div className="[grid-column:1] [grid-row:span_2]">
          <CommentsMain
            release_id={props.id}
            token={token}
            comments={data.release.comments}
          />
        </div>
      </div>
    </main>
  ) : (
    <main className="flex h-[100dvh] w-full justify-center items-center">
      <Spinner />
    </main>
  );
};
