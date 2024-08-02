import { Card, Dropdown, Button } from "flowbite-react";
import { ENDPOINTS } from "#/api/config";

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
    target:
      "flex-1",
  },
};

export const ReleaseInfoUserList = (props: {
  userList: number;
  isFavorite: boolean;
  release_id: number;
  token: string | null;
  setUserList: any;
  setIsFavorite: any;
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
      {props.token ? (
        <div className="flex flex-wrap gap-2">
          <Dropdown
            label={lists[props.userList].name}
            dismissOnClick={true}
            theme={DropdownTheme}
            color="blue"
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
          >
            <span
              className={`iconify w-6 h-6 ${
                props.isFavorite ? "mdi--heart" : "mdi--heart-outline"
              }`}
            ></span>
          </Button>
        </div>
      ) : (
        <p>Войдите что-бы добавить в избранное или список</p>
      )}
    </Card>
  );
};
