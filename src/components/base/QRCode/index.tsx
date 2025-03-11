import QRCodeSvg from 'react-native-qrcode-svg';

export interface QRCodeProps {
  size: number;
  value: string;
}
export const QRCode = (props: QRCodeProps) => {
  const { size, value } = props;
  return <QRCodeSvg size={size} value={value} />;
};
