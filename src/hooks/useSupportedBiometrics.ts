import * as LocalAuth from 'expo-local-authentication';
import { useEffect, useState } from 'react';

export function useSupportedBiometrics() {
  const [supportedBiometrics, setSupportedBiometrics] = useState<
    LocalAuth.AuthenticationType[]
  >([]);

  const getSupportedBiometrics = async () => {
    const result = await LocalAuth.supportedAuthenticationTypesAsync();
    setSupportedBiometrics(result);
  };

  useEffect(() => {
    getSupportedBiometrics();
  }, []);

  return supportedBiometrics;
}
