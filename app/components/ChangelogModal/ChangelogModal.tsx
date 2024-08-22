"use client";

import { Modal, Accordion } from "flowbite-react";
import Markdown from "markdown-to-jsx";
import { useEffect, useState } from "react";
import Styles from "./ChangelogModal.module.css";

export const ChangelogModal = (props: {
  isOpen: boolean;
  setIsOpen: any;
  version: string;
  previousVersions: Array<string>;
}) => {
  const [currentVersionChangelog, setCurrentVersionChangelog] = useState("");
  const [previousVersionsChangelog, setPreviousVersionsChangelog] = useState<
    Record<string, string>
  >({});

  async function _fetchVersionChangelog(version: string) {
    const res = await fetch(`/changelog/${version}.md`);
    return await res.text();
  }

  useEffect(() => {
    if (props.version != "" && currentVersionChangelog == "") {
      _fetchVersionChangelog(props.version).then((data) => {
        setCurrentVersionChangelog(data);
      });
    }

    if (props.previousVersions.length > 0) {
      props.previousVersions.forEach((version) => {
        _fetchVersionChangelog(version).then((data) => {
          setPreviousVersionsChangelog((prev) => {
            return {
              ...prev,
              [version]: data,
            };
          });
        });
      });
    }
  }, [props.version]);

  return (
    <Modal show={props.isOpen} onClose={() => props.setIsOpen(false)}>
      <Modal.Header>Список изменений v{props.version}</Modal.Header>
      <Modal.Body>
        <Markdown className={Styles.markdown}>
          {currentVersionChangelog}
        </Markdown>
        {Object.keys(previousVersionsChangelog).length == props.previousVersions.length && (
          <Accordion collapseAll={true} className="mt-4">
            {props.previousVersions.map(
              (version) => (
                <Accordion.Panel key={version}>
                  <Accordion.Title>Список изменений v{version}</Accordion.Title>
                  <Accordion.Content>
                    <Markdown className={Styles.markdown}>{previousVersionsChangelog[version]}</Markdown>
                  </Accordion.Content>
                </Accordion.Panel>
              )
            )}
          </Accordion>
        )}
      </Modal.Body>
    </Modal>
  );
};
