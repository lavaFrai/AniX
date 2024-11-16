"use client";

import { Button, Modal, Textarea } from "flowbite-react";
import { ENDPOINTS } from "#/api/config";
import { useEffect, useState } from "react";
import { useSWRConfig } from "swr";
import { Spinner } from "../Spinner/Spinner";
import { unixToDate } from "#/api/utils";
import { useUserStore } from "#/store/auth";

export const ProfileEditLoginModal = (props: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  token: string;
  setLogin: (status: string) => void;
  profile_id: number;
}) => {
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [_login, _setLogin] = useState("");
  const [_loginData, _setLoginData] = useState({
    code: 0,
    avatar: "",
    login: "",
    is_change_available: false,
    last_change_at: 0,
    next_change_available_at: 0,
  });
  const [_loginLength, _setLoginLength] = useState(0);
  const { mutate } = useSWRConfig();
  const userStore = useUserStore();

  useEffect(() => {
    setLoading(true);
    fetch(`${ENDPOINTS.user.settings.login.info}?token=${props.token}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        _setLoginData(data);
        _setLogin(data.login);
        _setLoginLength(data.login.length);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isOpen]);

  function handleInput(e: any) {
    _setLogin(e.target.value);
    _setLoginLength(e.target.value.length);
  }

  function _setLoginSetting() {
    setSending(true);
    if (!_login || _login == "") {
      alert("Никнейм не может быть пустым");
      return;
    }
    fetch(
      `${ENDPOINTS.user.settings.login.change}?login=${encodeURIComponent(
        _login
      )}&token=${props.token}`
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          new Error("failed to send data");
        }
      })
      .then((data) => {
        if (data.code == 3) {
          alert("Данный никнейм уже существует, попробуйте другой");
          setSending(false);
          return;
        }

        mutate(
          `${ENDPOINTS.user.profile}/${props.profile_id}?token=${props.token}`
        );
        userStore.checkAuth();
        props.setLogin(_login);
        setSending(false);
        props.setIsOpen(false);
      })
      .catch((err) => {
        console.log(err);
        setSending(false);
      });
  }

  return (
    <Modal
      dismissible
      show={props.isOpen}
      onClose={() => props.setIsOpen(false)}
      size={"4xl"}
    >
      <Modal.Header>Изменить никнейм</Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        ) : (
          <>
            {!_loginData.is_change_available ? (
              <>
                <p>Вы недавно изменили никнейм</p>
                <p>
                  следующее изменение будет доступно:{" "}
                  <span className="font-bold">
                    {unixToDate(_loginData.next_change_available_at, "full")}
                  </span>
                </p>
              </>
            ) : (
              <>
                <Textarea
                  disabled={sending}
                  rows={1}
                  id="login"
                  className="w-full"
                  name="login"
                  onChange={(e) => handleInput(e)}
                  value={_login}
                  maxLength={20}
                />
                <p className="text-sm text-right text-gray-500 dark:text-gray-300">
                  {_loginLength}/20
                </p>
              </>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        {_loginData.is_change_available && (
          <Button
            color="blue"
            onClick={() => _setLoginSetting()}
            disabled={sending || loading}
          >
            Сохранить
          </Button>
        )}
        <Button color="red" onClick={() => props.setIsOpen(false)}>
          Отмена
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
