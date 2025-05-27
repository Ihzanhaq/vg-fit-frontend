export const getCroppedImg = (imageSrc, croppedAreaPixels) => {
  const image = new Image();
  image.src = imageSrc;

  return new Promise((resolve) => {
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const ctx = canvas.getContext("2d");

      const pixelCropX = croppedAreaPixels.x * scaleX;
      const pixelCropY = croppedAreaPixels.y * scaleY;
      const pixelCropWidth = croppedAreaPixels.width * scaleX;
      const pixelCropHeight = croppedAreaPixels.height * scaleY;

      canvas.width = pixelCropWidth;
      canvas.height = pixelCropHeight;

      ctx.drawImage(
        image,
        pixelCropX,
        pixelCropY,
        pixelCropWidth,
        pixelCropHeight,
        0,
        0,
        pixelCropWidth,
        pixelCropHeight
      );

      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg");
    };
  });
};
