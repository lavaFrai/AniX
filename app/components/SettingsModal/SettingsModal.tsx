"use client";

import { usePreferencesStore } from "#/store/preferences";
import {
  Modal,
  Button,
  useThemeMode,
  ToggleSwitch,
} from "flowbite-react";

export const SettingsModal = (props: { isOpen: boolean; setIsOpen: any }) => {
  const preferenceStore = usePreferencesStore();

  const { computedMode, setMode } = useThemeMode();

  return (
    <Modal
      dismissible
      show={props.isOpen}
      onClose={() => props.setIsOpen(false)}
    >
      <Modal.Header>Настройки</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="font-bold dark:text-white">Тема</p>
            <Button.Group>
              <Button
                color={computedMode == "light" ? "blue" : "gray"}
                onClick={() => setMode("light")}
              >
                Светлая
              </Button>
              <Button
                color={computedMode == "dark" ? "blue" : "gray"}
                onClick={() => setMode("dark")}
              >
                Темная
              </Button>
            </Button.Group>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-bold dark:text-white">
              Показывать список изменений
            </p>
            <ToggleSwitch
              color="blue"
              theme={{
                toggle: {
                  checked: {
                    color: {
                      blue: "border-blue-700 bg-blue-700",
                    },
                  },
                },
              }}
              onChange={() =>
                preferenceStore.setFlags({
                  showChangelog: !preferenceStore.flags.showChangelog,
                })
              }
              checked={preferenceStore.flags.showChangelog}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold dark:text-white">Отправка аналитики</p>
              <p className="text-gray-500 dark:text-gray-400">
                Требуется перезагрузка для применения
              </p>
            </div>
            <ToggleSwitch
              color="blue"
              theme={{
                toggle: {
                  checked: {
                    color: {
                      blue: "border-blue-700 bg-blue-700",
                    },
                  },
                },
              }}
              onChange={() =>
                preferenceStore.setFlags({
                  enableAnalytics: !preferenceStore.flags.enableAnalytics,
                })
              }
              checked={preferenceStore.flags.enableAnalytics}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
