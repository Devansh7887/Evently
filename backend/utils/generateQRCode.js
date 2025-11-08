import qrcode from 'qrcode';

const generateQRCode = async (data) => {
  try {
    // Generate QR code as a Data URL
    const qrCodeDataURL = await qrcode.toDataURL(JSON.stringify(data));
    return qrCodeDataURL;
  } catch (err) {
    console.error('Error generating QR code:', err);
    throw new Error('Could not generate QR code');
  }
};

export default generateQRCode;