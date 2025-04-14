import { RefObject, useEffect } from 'react';
import { WebView } from '@metamask/react-native-webview';
import { useAppState } from '@hooks';
import { isAndroid } from '@utils';

export function useAudioHandler(ref: RefObject<WebView>) {
  const { appState } = useAppState();

  useEffect(() => {
    if (!isAndroid) return;

    const isMuted = appState === 'background';

    const injectedAudioHandlerScript = `
      (function() {
        const audioHandlers = {
          Howler: () => Howler?.mute(${isMuted}),
          Tone: () => Tone?.Destination && (Tone.Destination.mute = ${isMuted}),
          Custom: () => {
            ${isMuted} ? window.muteAudio?.() : window.unmuteAudio?.();
          }
        };

        Object.values(audioHandlers).forEach(handler => handler());
      })();
      true;
    `;

    ref.current?.injectJavaScript(injectedAudioHandlerScript);
  }, [appState, ref]);
}
