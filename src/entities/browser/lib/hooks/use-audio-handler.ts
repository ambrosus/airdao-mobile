import { RefObject, useEffect } from 'react';
import { WebView } from '@metamask/react-native-webview';
import { useAppState } from '@hooks';
import { isAndroid } from '@utils';

export function useAudioHandler(ref: RefObject<WebView>) {
  const { appState } = useAppState();

  useEffect(() => {
    if (!isAndroid) return;

    const isMuted = appState === 'background';

    const jsCode = `
          (function() {
            if (typeof Howler !== 'undefined') {
              Howler.mute(${isMuted});
            }
            if (typeof Tone !== 'undefined' && Tone.Destination) {
              Tone.Destination.mute = ${isMuted};
            }
            if (typeof window.muteAudio === 'function' && ${isMuted}) {
              window.muteAudio();
            }
            if (typeof window.unmuteAudio === 'function' && ${!isMuted}) {
              window.unmuteAudio();
            }
          })();
          true;
        `;

    ref.current?.injectJavaScript(jsCode);
  }, [appState, ref]);
}
