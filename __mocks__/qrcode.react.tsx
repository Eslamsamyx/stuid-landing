import React from 'react';

export const QRCodeSVG = ({ value, size, ...props }: any) => (
  <div data-testid="qrcode" data-value={value} data-size={size} {...props}>
    QR Code
  </div>
);