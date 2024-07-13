import { NextResponse } from "next/server";
import { fetchDataViaPost } from "../utils";
import { ENDPOINTS } from "../config";

export async function GET(request) {
  const page = parseInt(request.nextUrl.searchParams.get(["page"])) || 0;
  const status = request.nextUrl.searchParams.get(["status"]) || null;
  const token = request.nextUrl.searchParams.get(["token"]) || null;

  let statusId;
  if (status == "last" || !status) {
    statusId = null;
  } else if (status == "finished") {
    statusId = 1;
  } else if (status == "ongoing") {
    statusId = 2;
  } else if (status == "announce") {
    statusId = 3;
  } else {
    return NextResponse.json({ message: "Bad status" }, { status: 400 });
  }

  let url = new URL(`${ENDPOINTS.filter}/${page}`);
  if (token) {
    url.searchParams.set("token", token);
  }

  const data = {
    country: null,
    season: null,
    sort: 0,
    studio: null,
    age_ratings: [],
    category_id: null,
    end_year: null,
    episode_duration_from: null,
    episode_duration_to: null,
    episodes_from: null,
    episodes_to: null,
    genres: [],
    profile_list_exclusions: [],
    start_year: null,
    status_id: statusId,
    types: [],
    is_genres_exclude_mode_enabled: false,
  };

  const response = await fetchDataViaPost(url.toString(), data);
  return NextResponse.json(response);
}
