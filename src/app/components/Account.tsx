"use client";
import useSWR from "swr";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import useSWRMutation from "swr/mutation";
import { useAppSelector } from "@hooks/redux-typed-hooks";
import { fetcher, deleteRequest } from "@utils/swr/fetcher";
import { UserAccount } from "@utils/types";
import { AccountIcon } from "@utils/tabler-icons";
import { gsap, useGSAP } from "@utils/gsap";

interface RequestTokenType {
  expires_at: string;
  request_token: string;
  success: string;
}
export default function Account({ className }: { className: string }) {
  const [hasRequestedNewToken, setHasRequestedNewToken] = useState(false);
  const [isDrawerToggled, setIsDrawerToggled] = useState<boolean>(false);
  const theme = useAppSelector((state) => state.theme.theme);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { data: requestTokenData } = useSWR<RequestTokenType>(
    hasRequestedNewToken ? "/api/account/request-token" : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: false,
    },
  );
  const { data: user } = useSWR<UserAccount>("/api/account/details", fetcher);
  const { trigger: logoutUser } = useSWRMutation(
    "/api/account/logout",
    deleteRequest,
  );
  // animation for account drawer
  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true })
        .to(".account-drawer__ul--toggle", {
          autoAlpha: 1,
          y: 0,
        });
    },
    { scope: containerRef },
  );

  useGSAP(() => {
    if (isDrawerToggled) tl.current?.play();
    else tl.current?.reverse();
  }, [isDrawerToggled]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDrawerToggled(false);
      }
    };

    if (isDrawerToggled) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDrawerToggled]);

  useEffect(() => {
    if (!requestTokenData?.success) return;
    const redirectUrl = new URL(
      `https://www.themoviedb.org/authenticate/${requestTokenData.request_token}?redirect_to=http://localhost:3000/auth-callback`,
    );
    window.location.href = redirectUrl.toString();
  }, [requestTokenData]);

  const handleRequestAuth = () => {
    setHasRequestedNewToken(true);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.error("logout failed: ", e);
    }
  };
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button onClick={() => setIsDrawerToggled((prev) => !prev)}>
        {user?.id ? (
          <Image
            src="https://gravatar.com/avatar/457a687caaf5337aa95d29604513724b?d=mp"
            className="size-6 rounded-full"
            alt=""
            width={100}
            height={100}
          />
        ) : (
          <AccountIcon className="text-cta size-6" />
        )}
      </button>
      <ul
        className={`account-drawer__ul--toggle text-heading-md invisible absolute top-full -left-1/2 -translate-y-5 rounded-sm px-1.5 shadow-sm shadow-gray-500 ${theme === "light" ? "bg-primary-shade" : "bg-dark-shade"}`}
      >
        {user?.id ? (
          <>
            <li className="border-b px-1.5">
              <button className="py-1">Profile</button>
            </li>
            <li className="px-1.5">
              <button className="py-1" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="px-1.5">
              <button className="py-1" onClick={handleRequestAuth}>
                Login
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
