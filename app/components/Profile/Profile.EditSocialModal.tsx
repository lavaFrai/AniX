"use client";

import { Button, Modal, Label, TextInput } from "flowbite-react";
import { Spinner } from "../Spinner/Spinner";
import { ENDPOINTS } from "#/api/config";
import { useEffect, useState } from "react";

export const ProfileEditSocialModal = (props: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  token: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [socials, setSocials] = useState({
    vkPage: "",
    tgPage: "",
    discordPage: "",
    instPage: "",
    ttPage: "",
  });

  function _addUrl(username: string, social: string) {
    if (!username) {
      return "";
    }
    if (username.startsWith("h")) {
      return username;
    }
    switch (social) {
      case "vk":
        return `https://vk.com/${username}`;
      case "tg":
        return `https://t.me/${username}`;
      case "inst":
        return `https://instagram.com/${username}`;
      case "tt":
        return `https://tiktok.com/@${username}`;
    }
  }

  function _removeUrl(link: string) {
    if (link.startsWith("https://")) {
      const split = link.split("/");
      return split[split.length - 1];
    } else {
      return link;
    }
  }

  useEffect(() => {
    setLoading(true);
    fetch(`${ENDPOINTS.user.settings.socials.info}?token=${props.token}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        setSocials({
          vkPage: data.vk_page,
          tgPage: data.tg_page,
          discordPage: data.discord_page,
          instPage: data.inst_page,
          ttPage: data.tt_page,
        });
        setLoading(false);
      });
  }, [props.isOpen]);

  function handleInput(e: any) {
    const social = {
      ...socials,
      [e.target.name]: e.target.value
    }
    setSocials(social);
  }

  function _setSocialSetting() {
    const data = {
      vkPage: _removeUrl(socials.vkPage),
      tgPage: _removeUrl(socials.tgPage),
      discordPage: _removeUrl(socials.discordPage),
      instPage: _removeUrl(socials.instPage),
      ttPage: _removeUrl(socials.ttPage),
    };

    setUpdating(true);
    fetch(`${ENDPOINTS.user.settings.socials.edit}?token=${props.token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) {
          setUpdating(false);
          props.setIsOpen(false);
        } else {
          new Error("failed to send data");
        }
      })
      .catch((err) => {
        console.log(err);
        setUpdating(false);
      });
  }

  return (
    <Modal
      dismissible
      show={props.isOpen}
      onClose={() => props.setIsOpen(false)}
      size={"4xl"}
    >
      <Modal.Header>Соц. сети</Modal.Header>
      <Modal.Body>
        <p className="p-2 text-gray-400 border-2 border-gray-200 rounded-md">
          Укажите ссылки на свои социальные сети, чтобы другие пользователи
          могли с вами связаться
        </p>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        ) : (
          <div className="flex flex-col gap-4 py-4">
            <div>
              <div className="block mb-2">
                <Label htmlFor="vk-page" value="ВКонтакте" />
              </div>
              <TextInput
                id="vk-page"
                name="vkPage"
                onChange={(e) => handleInput(e)}
                value={_addUrl(socials.vkPage, "vk")}
                placeholder="Ссылка или никнейм"
              />
            </div>
            <div>
              <div className="block mb-2">
                <Label htmlFor="tg-page" value="Telegram" />
              </div>
              <TextInput
                id="tg-page"
                name="tgPage"
                onChange={(e) => handleInput(e)}
                value={_addUrl(socials.tgPage, "tg")}
                placeholder="Ссылка или никнейм"
              />
            </div>
            <div>
              <div className="block mb-2">
                <Label htmlFor="discord-page" value="Discord" />
              </div>
              <TextInput
                id="discord-page"
                name="discordPage"
                onChange={(e) => handleInput(e)}
                value={socials.discordPage}
                placeholder="Никнейм"
              />
            </div>
            <div>
              <div className="block mb-2">
                <Label htmlFor="inst-page" value="Instagram" />
              </div>
              <TextInput
                id="inst-page"
                name="instPage"
                onChange={(e) => handleInput(e)}
                value={_addUrl(socials.instPage, "inst")}
                placeholder="Ссылка или никнейм"
              />
            </div>
            <div>
              <div className="block mb-2">
                <Label htmlFor="tt-page" value="TikTok" />
              </div>
              <TextInput
                id="tt-page"
                name="ttPage"
                onChange={(e) => handleInput(e)}
                value={_addUrl(socials.ttPage, "tt")}
                placeholder="Ссылка или никнейм"
              />
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          color="blue"
          onClick={() => _setSocialSetting()}
          disabled={updating}
        >
          Сохранить
        </Button>
        <Button color="red" onClick={() => props.setIsOpen(false)}>
          Отмена
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
