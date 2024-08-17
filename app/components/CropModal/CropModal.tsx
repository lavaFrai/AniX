import React, { useRef } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Button, Modal } from "flowbite-react";

type Props = {
  src: string;
  setSrc: (src: string) => void;
  setTempSrc: (src: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  height: number;
  width: number;
  aspectRatio: number;
  guides: boolean;
  quality: number;
  forceAspect?: boolean;
};

export const CropModal: React.FC<Props> = (props) => {
  const cropperRef = useRef<ReactCropperElement>(null);

  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      props.setSrc(
        cropperRef.current?.cropper
          .getCroppedCanvas({
            width: props.width,
            height: props.height,
            maxWidth: props.width,
            maxHeight: props.height,
          })
          .toDataURL("image/jpeg", props.quality)
      );
      props.setTempSrc("");
    }
  };

  return (
    <Modal
      dismissible
      show={props.isOpen}
      onClose={() => props.setIsOpen(false)}
      size={"7xl"}
    >
      <Modal.Header>Обрезать изображение</Modal.Header>
      <Modal.Body>
        <Cropper
          src={props.src}
          style={{ height: 400, width: "100%" }}
          responsive={true}
          // Cropper.js options
          initialAspectRatio={props.aspectRatio}
          aspectRatio={props.forceAspect ? props.aspectRatio : undefined}
          guides={props.guides}
          ref={cropperRef}
        />

        <div className="mt-4">
          <h2 className="font-bold text-md">Управление</h2>
          <p>Тяните за углы что-бы выбрать область</p>
          <p>
            Нажмите 2 раза на пустое место, что бы поменять режим выбора области
            на перемещение и обратно
          </p>
          <p>Используйте колёсико мыши что-бы изменить масштаб</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          color={"blue"}
          onClick={() => {
            getCropData();
            props.setIsOpen(false);
          }}
        >
          Сохранить
        </Button>
        <Button
          color={"red"}
          onClick={() => {
            props.setSrc(null);
            props.setTempSrc(null);
            // props.setImageData(null);
            props.setIsOpen(false);
          }}
        >
          Удалить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
