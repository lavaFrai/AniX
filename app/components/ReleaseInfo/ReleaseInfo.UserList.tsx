import { Card, Dropdown, Button } from "flowbite-react";
import { ENDPOINTS } from "#/api/config";
import Link from "next/link";

const lists = [
  { list: 0, name: "Не смотрю" },
  { list: 1, name: "Смотрю" },
  { list: 2, name: "В планах" },
  { list: 3, name: "Просмотрено" },
  { list: 4, name: "Отложено" },
  { list: 5, name: "Брошено" },
];

const DropdownTheme = {
  floating: {
    target: "flex-1",
  },
};

export const ReleaseInfoUserList = (props: {
  userList: number;
  isFavorite: boolean;
  release_id: number;
  token: string | null;
  setUserList: any;
  setIsFavorite: any;
  collection_count: number;
}) => {
  function _addToFavorite() {
    if (props.token) {
      props.setIsFavorite(!props.isFavorite);
      if (props.isFavorite) {
        fetch(
          `${ENDPOINTS.user.favorite}/delete/${props.release_id}?token=${props.token}`
        );
      } else {
        fetch(
          `${ENDPOINTS.user.favorite}/add/${props.release_id}?token=${props.token}`
        );
      }
    }
  }

  function _addToList(list: number) {
    if (props.token) {
      props.setUserList(list);
      fetch(
        `${ENDPOINTS.user.bookmark}/add/${list}/${props.release_id}?token=${props.token}`
      );
    }
  }

  return (
    <Card className="h-full">
      <div className="flex flex-wrap gap-1">
        <Button color={"blue"} size="sm" className="w-full lg:w-auto ">
          <Link href={`/release/${props.release_id}/collections`}>
            Показать в коллекциях{" "}
            <span className="p-1 ml-1 text-gray-500 rounded bg-gray-50">
              {props.collection_count}
            </span>
          </Link>
        </Button>
        {props.token && (
          <Button color={"blue"} size="sm" className="w-full lg:w-auto lg:flex-1">
            В коллекцию{" "}
            <span className="w-6 h-6 iconify mdi--bookmark-add "></span>
          </Button>
        )}
        {props.token ? (
          <>
            <Dropdown
              label={lists[props.userList].name}
              dismissOnClick={true}
              theme={DropdownTheme}
              color="blue"
              size="sm"
            >
              {lists.map((list) => (
                <Dropdown.Item
                  key={list.list}
                  onClick={() => _addToList(list.list)}
                >
                  {list.name}
                </Dropdown.Item>
              ))}
            </Dropdown>
            <Button
              color="blue"
              onClick={() => {
                _addToFavorite();
              }}
              size="sm"
            >
              <span
                className={`iconify w-6 h-6 ${
                  props.isFavorite ? "mdi--heart" : "mdi--heart-outline"
                }`}
              ></span>
            </Button>
          </>
        ) : (
          <p>Войдите что-бы добавить список, избранное или коллекцию</p>
        )}
      </div>
    </Card>
  );
};
