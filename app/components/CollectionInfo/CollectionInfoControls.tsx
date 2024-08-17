"use client";
import { Card, Button } from "flowbite-react";
import { useState } from "react";
import { useUserStore } from "#/store/auth";
import { ENDPOINTS } from "#/api/config";
import { useRouter } from "next/navigation";

export const CollectionInfoControls = (props: {
  isFavorite: boolean;
  id: number;
  authorId: number;
  isPrivate: boolean;
}) => {
  const [isFavorite, setIsFavorite] = useState(props.isFavorite);
  const userStore = useUserStore();
  const router = useRouter();

  async function _addToFavorite() {
    if (userStore.user) {
      setIsFavorite(!isFavorite);
      if (isFavorite) {
        fetch(
          `${ENDPOINTS.collection.favoriteCollections}/delete/${props.id}?token=${userStore.token}`
        );
      } else {
        fetch(
          `${ENDPOINTS.collection.favoriteCollections}/add/${props.id}?token=${userStore.token}`
        );
      }
    }
  }

  async function _deleteCollection() {
    if (userStore.user) {
      fetch(
        `${ENDPOINTS.collection.delete}/${props.id}?token=${userStore.token}`
      );
      router.push("/collections");
    }
  }

  return (
    <Card className="w-full h-fit ">
      <Button color={"blue"} onClick={() => _addToFavorite()}>
        <span
          className={`iconify w-6 h-6 mr-2 ${
            isFavorite ? "mdi--heart" : "mdi--heart-outline"
          }`}
        ></span>
        {!isFavorite ? "Добавить в избранное" : "Убрать из избранного"}
      </Button>
      {props.isPrivate && (
        <p>Это приватная коллекция, доступ к ней имеете только вы</p>
      )}
      {userStore.user && userStore.user.id == props.authorId && (
        <div className="flex flex-wrap gap-2">
          <Button
            color={"blue"}
            className="w-full sm:max-w-64"
            onClick={() =>
              router.push("/collections/create?mode=edit&id=" + props.id)
            }
          >
            <span className="w-6 h-6 mr-2 iconify mdi--pencil"></span>{" "}
            Редактировать
          </Button>
          <Button
            color={"red"}
            className="w-full sm:max-w-64"
            onClick={() => _deleteCollection()}
          >
            <span className="w-6 h-6 mr-2 iconify mdi--trash"></span> Удалить
          </Button>
        </div>
      )}
    </Card>
  );
};
