"use client"
import { useRouter } from "next/navigation";
import { getJWT } from "../api/utils";

export default function myProfile() {
  const user = getJWT()
  const router = useRouter()

  if (!user) {
    return router.push("/login")
  } else {
    return router.push(`/profile/${user.user_id}`)
  }
}