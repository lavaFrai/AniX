"use client";
import { useUserStore } from "#/store/auth";
import { useEffect, useState } from "react";
import { Spinner } from "../components/Spinner/Spinner";
import { fetchDataViaGet } from "../api/utils";
import { ENDPOINTS } from "#/api/config";

import { ProfileUser } from "#/components/Profile/Profile.User";
import { ProfileBannedBanner } from "#/components/Profile/ProfileBannedBanner";
import { ProfilePrivacyBanner } from "#/components/Profile/Profile.PrivacyBanner";

export const ProfilePage = (props: any) => {
  const authUser = useUserStore((state) => state);
  const [user, setUser] = useState(null);
  const [isMyProfile, setIsMyProfile] = useState(false);

  useEffect(() => {
    async function _getData() {
      let url = `${ENDPOINTS.user.profile}/${props.id}`;
      if (authUser.token) {
        url += `?token=${authUser.token}`;
      }
      const data = await fetchDataViaGet(url);
      setUser(data.profile);
      setIsMyProfile(data.is_my_profile);
    }
    _getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

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
        <ProfilePrivacyBanner is_privacy={isPrivacy} />
      </div>
      <div className="mt-4">
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
          chips={
            {
              hasChips: hasChips,
              isMyProfile: isMyProfile,
              isVerified: user.is_verified,
              isSponsor: user.is_sponsor,
              isBlocked: user.is_blocked,
              roles: user.roles
            }
          }
        />
      </div>
    </>
  );
};
