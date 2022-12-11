UploadImage.onchange = (evt) => {
  const [file] = UploadImage.files;
  if (file) {
    avatar.src = URL.createObjectURL(file);
  }
};
