"use client";
import { Avatar, Card, Button } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Chip } from "../Chip/Chip";

export const ProfileUser = (props: {
  isOnline: boolean;
  avatar: string;
  login: string;
  status: string;
  socials: {
    isPrivate: boolean;
    hasSocials: boolean;
    socials: {
      name: string;
      nickname: any;
      icon: string;
      urlPrefix?: string | undefined;
    }[];
  };
  chips: {
    hasChips: boolean;
    isMyProfile: boolean;
    isVerified: boolean;
    isSponsor: boolean;
    isBlocked: boolean;
    roles?: {
      id: number;
      name: string;
      color: string;
    }[];
  };
  rating: number;
}) => {
  const router = useRouter();
  console.log(props.chips);
  return (
    <Card className="w-full sm:w-[512px]">
      {props.chips.hasChips && (
        <div className="flex gap-1 overflow-x-auto scrollbar-thin">
          {props.chips.isMyProfile && (
            <Chip bg_color="bg-blue-500" name="Мой профиль" />
          )}
          {props.chips.isVerified && (
            <Chip bg_color="bg-green-500" name="Верифицирован" />
          )}
          {props.chips.isSponsor && (
            <Chip bg_color="bg-yellow-500" name="Спонсор Anixart" />
          )}
          {props.chips.isBlocked && (
            <Chip bg_color="bg-yellow-500" name="Заблокирован" />
          )}
          {props.chips.roles &&
            props.chips.roles.length > 0 &&
            props.chips.roles.map((role: any) => (
              <Chip
                key={role.id}
                bg_color={`bg-[var(--role-color)]`}
                name={role.name}
                style={
                  {
                    "--role-color": `#${role.color}`,
                  } as React.CSSProperties
                }
              />
            ))}
        </div>
      )}
      <Avatar
        alt=""
        img={props.avatar}
        rounded={true}
        size={"lg"}
        className="relative flex-col items-center justify-center sm:justify-start sm:flex-row"
        bordered={true}
        color={props.isOnline ? "success" : "light"}
      >
        <div className="space-y-1 text-2xl font-medium whitespace-pre-wrap dark:text-white">
          <div className="text-center sm:text-left">
            {props.login}{" "}
            <span
              className={`border rounded-md px-2 py-1 text-sm ${
                props.rating > 0
                  ? "border-green-500 text-green-500"
                  : "border-red-500 text-red-500"
              }`}
            >
              {props.rating}
            </span>
          </div>
          <div className="text-sm text-gray-500 whitespace-pre-wrap sm:text-md dark:text-gray-400 ">
            {props.status}
          </div>
        </div>
      </Avatar>
      {props.socials.hasSocials && !props.socials.isPrivate && (
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin">
          {props.socials.socials
            .filter((social: any) => {
              if (social.nickname == "") {
                return false;
              }
              return true;
            })
            .map((social: any) => {
              if (social.name == "discord" && social.nickname != "")
                return (
                  <Button
                    color="light"
                    key={social.name}
                    onClick={() => {
                      window.navigator.clipboard.writeText(social.nickname);
                      alert("Скопировано!");
                    }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span
                        className={`iconify h-4 w-4 sm:h-6 sm:w-6 ${social.icon} dark:fill-white`}
                      ></span>
                      {social.nickname}
                    </div>
                  </Button>
                );
              return (
                <Link
                  key={social.name}
                  href={`${social.urlPrefix}${social.nickname}`}
                  target="_blank"
                >
                  <Button color="light">
                    <div className="flex items-center justify-center gap-2">
                      <span
                        className={`iconify h-4 w-4 sm:h-6 sm:w-6 ${social.icon} dark:fill-white`}
                      ></span>
                      {social.nickname}
                    </div>
                  </Button>
                </Link>
              );
            })}
        </div>
      )}
    </Card>
  );
};
