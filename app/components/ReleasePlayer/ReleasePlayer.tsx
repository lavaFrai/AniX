"use client";

import { Spinner } from "#/components/Spinner/Spinner";
import { useUserStore } from "#/store/auth";
import { Card, Dropdown, Button } from "flowbite-react";
import { ENDPOINTS } from "#/api/config";
import { useState, useEffect } from "react";

const DropdownTheme = {
  floating: {
    target: "w-full md:min-w-[256px] md:w-fit",
  },
};

async function _fetch(url: string) {
  const data = fetch(url)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Error fetching data");
      }
    })
    .catch((err) => console.log(err));
  return data;
}

export const ReleasePlayer = (props: { id: number }) => {
  const token = useUserStore((state) => state.token);
  const [voiceoverInfo, setVoiceoverInfo] = useState(null);
  const [selectedVoiceover, setSelectedVoiceover] = useState(null);
  const [sourcesInfo, setSourcesInfo] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);
  const [episodeInfo, setEpisodeInfo] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  useEffect(() => {
    async function _fetchInfo() {
      const voiceover = await _fetch(
        `${ENDPOINTS.release.episode}/${props.id}`
      );
      setVoiceoverInfo(voiceover.types);
      setSelectedVoiceover(voiceover.types[0]);
    }
    _fetchInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function _fetchInfo() {
      const sources = await _fetch(
        `${ENDPOINTS.release.episode}/${props.id}/${selectedVoiceover.id}`
      );
      setSourcesInfo(sources.sources);
      setSelectedSource(sources.sources[0]);
    }
    if (selectedVoiceover) {
      _fetchInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVoiceover]);

  useEffect(() => {
    async function _fetchInfo(url: string) {
      const episodes = await _fetch(url);

      if (episodes.episodes.length === 0) {

        const remSources = sourcesInfo.filter((source) => source.id !== selectedSource.id);
        setSourcesInfo(remSources);
        setSelectedSource(remSources[0]);

        return;
      }

      setEpisodeInfo(episodes.episodes);
      setSelectedEpisode(episodes.episodes[0]);
    }
    if (selectedSource) {
      let url = `${ENDPOINTS.release.episode}/${props.id}/${selectedVoiceover.id}/${selectedSource.id}`;
      if (token) {
        url = `${ENDPOINTS.release.episode}/${props.id}/${selectedVoiceover.id}/${selectedSource.id}?token=${token}`;
      }
      _fetchInfo(url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSource, token]);

  async function _addToHistory(episode: any) {
    if (episode && token) {
      _fetch(
        `${ENDPOINTS.statistic.addHistory}/${props.id}/${selectedSource.id}/${episode.position}?token=${token}`
      );
      _fetch(
        `${ENDPOINTS.statistic.markWatched}/${props.id}/${selectedSource.id}/${episode.position}?token=${token}`
      );
    }
  }

  return (
    <Card>
      {!voiceoverInfo || !sourcesInfo || !episodeInfo ? (
        <div className="flex items-center justify-center w-full aspect-video">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            <Dropdown label={`Озвучка: ${selectedVoiceover.name}`} color="blue" theme={DropdownTheme}>
              {voiceoverInfo.map((voiceover: any) => (
                <Dropdown.Item
                  key={`voiceover_${voiceover.id}`}
                  onClick={() => setSelectedVoiceover(voiceover)}
                >
                  {voiceover.name}
                </Dropdown.Item>
              ))}
            </Dropdown>
            <Dropdown label={`Плеер: ${selectedSource.name}`} color="blue" theme={DropdownTheme}>
              {sourcesInfo.map((source: any) => (
                <Dropdown.Item
                  key={`source_${source.id}`}
                  onClick={() => setSelectedSource(source)}
                >
                  {source.name}
                </Dropdown.Item>
              ))}
            </Dropdown>
          </div>
          <div className="aspect-video">
            <iframe
              allowFullScreen={true}
              src={selectedEpisode.url}
              className="w-full h-full rounded-md"
            ></iframe>
          </div>
          <div>
            <div className="flex gap-2 p-2 overflow-x-auto scrollbar-thin">
              {episodeInfo.map((episode: any) => (
                <Button
                  color={
                    selectedEpisode.position === episode.position
                      ? "blue"
                      : "light"
                  }
                  theme={{base: "min-w-fit disabled:opacity-100"}}
                  key={`episode_${episode.position}`}
                  onClick={() => {
                    setSelectedEpisode(episode);
                    episode.is_watched = true;
                    _addToHistory(episode);
                  }}
                  disabled={selectedEpisode.position === episode.position}
                >
                  {episode.name ? episode.name : `${selectedSource.name != "Sibnet" ? episode.position : episode.position + 1} серия`}
                  {episode.is_watched && (
                    <span className="w-5 h-5 ml-2 iconify material-symbols--check-circle"></span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </>
      )}
    </Card>
  );
};
