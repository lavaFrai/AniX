"use client";
import { useUserStore } from "#/store/auth";
import { useEffect, useState } from "react";
import { Spinner } from "../components/Spinner/Spinner";
import { ENDPOINTS } from "#/api/config";
import useSWR from "swr";

import { ProfileUser } from "#/components/Profile/Profile.User";
import { ProfileBannedBanner } from "#/components/Profile/ProfileBannedBanner";
import { ProfilePrivacyBanner } from "#/components/Profile/Profile.PrivacyBanner";
import { ProfileActivity } from "#/components/Profile/Profile.Activity";
import { ProfileStats } from "#/components/Profile/Profile.Stats";
import { ProfileWatchDynamic } from "#/components/Profile/Profile.WatchDynamic";
import { ProfileActions } from "#/components/Profile/Profile.Actions";
import { ProfileReleaseRatings } from "#/components/Profile/Profile.ReleaseRatings";
import { ProfileReleaseHistory } from "#/components/Profile/Profile.ReleaseHistory";
import { ProfileEditModal } from "#/components/Profile/Profile.EditModal";

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

export const ProfilePage = (props: any) => {
  const authUser = useUserStore();
  const [user, setUser] = useState(null);
  const [isMyProfile, setIsMyProfile] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  let url = `${ENDPOINTS.user.profile}/${props.id}`;
  if (authUser.token) {
    url += `?token=${authUser.token}`;
  }
  const { data } = useSWR(url, fetcher);

  useEffect(() => {
    if (data) {
      setUser(data.profile);
      setIsMyProfile(data.is_my_profile);
    }
  }, [data]);

  if (!user) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <Spinner />
      </main>
    );
  }

  const hasSocials =
    user.vk_page != "" ||
    user.tg_page != "" ||
    user.tt_page != "" ||
    user.inst_page != "" ||
    user.discord_page != "" ||
    false;
  const socials = [
    {
      name: "vk",
      nickname: user.vk_page,
      icon: "fa6-brands--vk",
      urlPrefix: "https://vk.com/",
    },
    {
      name: "telegram",
      nickname: user.tg_page,
      icon: "fa6-brands--telegram",
      urlPrefix: "https://t.me/",
    },
    {
      name: "discord",
      nickname: user.discord_page,
      icon: "fa6-brands--discord",
    },
    {
      name: "tiktok",
      nickname: user.tt_page,
      icon: "fa6-brands--tiktok",
      urlPrefix: "https://tiktok.com/@",
    },
    {
      name: "instagram",
      nickname: user.inst_page,
      icon: "fa6-brands--instagram",
      urlPrefix: "https://instagram.com/",
    },
  ];

  const hasChips =
    user.is_verified ||
    user.is_blocked ||
    (user.roles && user.roles.length > 0) ||
    isMyProfile;
  const isPrivacy =
    user.is_stats_hidden || user.is_counts_hidden || user.is_social_hidden;

  return (
    <>
      <div className="flex flex-col gap-2">
        <ProfileBannedBanner
          is_banned={user.is_banned}
          is_perm_banned={user.is_perm_banned}
          ban_reason={user.ban_reason}
          ban_expires={user.ban_expires}
        />
        <ProfilePrivacyBanner
          is_privacy={isPrivacy}
          is_me_blocked={user.is_me_blocked}
        />
      </div>
      <div
        className={`flex flex-wrap gap-2 ${
          isPrivacy || user.is_banned || user.is_perm_banned ? "mt-4" : ""
        }`}
      >
        <div className="flex flex-col gap-2 w-full xl:w-[50%]">
          <ProfileUser
            isOnline={user.is_online}
            avatar={user.avatar}
            login={user.login}
            status={user.status}
            socials={{
              isPrivate: user.is_social_hidden,
              hasSocials: hasSocials,
              socials: socials,
            }}
            chips={{
              hasChips: hasChips,
              isMyProfile: isMyProfile,
              isVerified: user.is_verified,
              isSponsor: user.is_sponsor,
              isBlocked: user.is_blocked,
              roles: user.roles,
            }}
            rating={user.rating_score}
          />
          {!user.is_counts_hidden && (
            <ProfileActivity
              profile_id={user.id}
              commentCount={user.comment_count}
              videoCount={user.video_count}
              collectionCount={user.collection_count}
              friendsCount={user.friend_count}
            />
          )}
          {!user.is_stats_hidden && (
            <div className="flex-col hidden gap-2 xl:flex">
              {user.votes && user.votes.length > 0 && (
                <ProfileReleaseRatings ratings={user.votes} token={authUser.token} profile_id={user.id} />
              )}
              {user.history && user.history.length > 0 && (
                <ProfileReleaseHistory history={user.history} />
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col w-full gap-2 xl:flex-1 xl:w-auto ">
          {authUser.token && (
            <ProfileActions
              isMyProfile={isMyProfile}
              profile_id={user.id}
              isFriendRequestsDisallowed={user.is_friend_requests_disallowed}
              friendStatus={user.friend_status}
              my_profile_id={authUser.user.id}
              token={authUser.token}
              is_me_blocked={user.is_me_blocked}
              is_blocked={user.is_blocked}
              edit_isOpen={isOpen}
              edit_setIsOpen={setIsOpen}
            />
          )}
          {!user.is_stats_hidden && (
            <>
              <ProfileStats
                lists={[
                  user.watching_count,
                  user.plan_count,
                  user.completed_count,
                  user.hold_on_count,
                  user.dropped_count,
                ]}
                watched_count={user.watched_episode_count}
                watched_time={user.watched_time}
                profile_id={user.id}
              />
              <ProfileWatchDynamic watchDynamic={user.watch_dynamics || []} />
              <div className="flex flex-col gap-2 xl:hidden">
                {user.votes && user.votes.length > 0 && (
                  <ProfileReleaseRatings ratings={user.votes} token={authUser.token} profile_id={user.id} />
                )}
                {user.history && user.history.length > 0 && (
                  <ProfileReleaseHistory history={user.history} />
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <ProfileEditModal isOpen={isOpen && isMyProfile} setIsOpen={setIsOpen} token={authUser.token} profile_id={user.id}/>
    </>
  );
};
