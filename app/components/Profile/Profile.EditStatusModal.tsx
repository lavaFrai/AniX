"use client";

import { Button, Modal, Textarea } from "flowbite-react";
import { ENDPOINTS } from "#/api/config";
import { useEffect, useState } from "react";

export const ProfileEditStatusModal = (props: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  token: string;
  status: string;
  setStatus: (status: string) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [_status, _setStatus] = useState("");
  const [_stringLength, _setStringLength] = useState(0);

  useEffect(() => {
    _setStatus(props.status);
    _setStringLength(props.status.length);
  }, [props.isOpen]);

  function handleInput(e: any) {
    _setStatus(e.target.value);
    _setStringLength(e.target.value.length);
  }

  function _setStatusSetting() {
    setLoading(true);
    fetch(ENDPOINTS.user.settings.statusEdit, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: _status,
      }),
    })
      .then((res) => {
        if (res.ok) {
          setLoading(false);
          props.setStatus(_status);
          props.setIsOpen(false);
        } else {
          new Error("failed to send data");
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  return (
    <Modal
      dismissible
      show={props.isOpen}
      onClose={() => props.setIsOpen(false)}
      size={"4xl"}
    >
      <Modal.Header>Изменить статус</Modal.Header>
      <Modal.Body>
        <Textarea
          rows={3}
          id="status"
          className="w-full"
          name="status"
          onChange={(e) => handleInput(e)}
          value={_status}
          maxLength={80}
        />
        <p className="text-sm text-right text-gray-500 dark:text-gray-300">
          {_stringLength}/80
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button color="blue" onClick={() => _setStatusSetting()}>Сохранить</Button>
        <Button color="red" onClick={() => props.setIsOpen(false)}>
          Отмена
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
