import Head from "next/head";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Inter } from "next/font/google";
import { generateRandomAlphanumeric } from "@/lib/util";
import { motion, AnimatePresence } from "framer-motion";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useToken,
} from "@livekit/components-react";

import Playground, {
  PlaygroundOutputs,
} from "@/components/playground/Playground";
import { useAppConfig } from "@/hooks/useAppConfig";
import { PlaygroundConnect } from "@/components/PlaygroundConnect";
import { PlaygroundToast, ToastType } from "@/components/toast/PlaygroundToast";

const themeColors = [
  "cyan",
  "green",
  "amber",
  "blue",
  "violet",
  "rose",
  "pink",
  "teal",
];

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [toastMessage, setToastMessage] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);
  const [shouldConnect, setShouldConnect] = useState(false);
  const [liveKitUrl, setLiveKitUrl] = useState(
    process.env.NEXT_PUBLIC_LIVEKIT_URL
  );
  const [customToken, setCustomToken] = useState<string>();

  const [roomName, setRoomName] = useState(
    [generateRandomAlphanumeric(4), generateRandomAlphanumeric(4)].join("-")
  );

  const tokenOptions = useMemo(() => {
    return {
      userInfo: { identity: generateRandomAlphanumeric(16) },
    };
  }, []);

  // set a new room name each time the user disconnects so that a new token gets fetched behind the scenes for a different room
  useEffect(() => {
    if (shouldConnect === false) {
      setRoomName(
        [generateRandomAlphanumeric(4), generateRandomAlphanumeric(4)].join("-")
      );
    }
  }, [shouldConnect]);

  const token = useToken("/api/token", roomName, tokenOptions);
  const appConfig = useAppConfig();
  const outputs = [
    appConfig?.outputs.audio && PlaygroundOutputs.Audio,
    appConfig?.outputs.video && PlaygroundOutputs.Video,
    appConfig?.outputs.chat && PlaygroundOutputs.Chat,
  ].filter((item) => typeof item !== "boolean") as PlaygroundOutputs[];

  const handleConnect = useCallback(
    (connect: boolean, opts?: { url: string; token: string }) => {
      if (connect && opts) {
        setLiveKitUrl(opts.url);
        setCustomToken(opts.token);
      }
      setShouldConnect(connect);
    },
    []
  );

  return (
    <>
      <Head>
        <title>Agent Playground</title>
        <meta name="description" content="Generated by create next app" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative flex flex-col justify-center px-4 items-center h-full w-full bg-black repeating-square-background">
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              className="left-0 right-0 top-0 absolute z-10"
              initial={{ opacity: 0, translateY: -50 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -50 }}
            >
              <PlaygroundToast
                message={toastMessage.message}
                type={toastMessage.type}
                onDismiss={() => {
                  setToastMessage(null);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {liveKitUrl ? (
          <LiveKitRoom
            className="flex flex-col h-full w-full"
            serverUrl={liveKitUrl}
            token={customToken ?? token}
            audio={appConfig?.inputs.mic}
            video={appConfig?.inputs.camera}
            connect={shouldConnect}
            onError={(e) => {
              setToastMessage({ message: e.message, type: "error" });
              console.error(e);
            }}
          >
            <Playground
              title={appConfig?.title}
              githubLink={appConfig?.github_link}
              outputs={outputs}
              showQR={appConfig?.show_qr}
              description={appConfig?.description}
              themeColors={themeColors}
              defaultColor={appConfig?.theme_color ?? "cyan"}
              onConnect={handleConnect}
              metadata={[{ name: "Room Name", value: roomName }]}
            />
            <RoomAudioRenderer />
          </LiveKitRoom>
        ) : (
          <PlaygroundConnect
            accentColor={themeColors[0]}
            onConnectClicked={(url, token) => {
              handleConnect(true, { url, token });
            }}
          />
        )}
      </main>
    </>
  );
}