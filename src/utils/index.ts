type ImageDataResolve = { 
  base64: FileReader['result'], 
  image : InstanceType<typeof Image> 
}
export type {
  ImageDataResolve
};

export const toBase64 = (file: File, w? : number, h?: number) => new Promise<ImageDataResolve>(
  (resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result;
      const image = w && h ? new Image(w, h) : new Image();
      image.onload = () => {
        resolve({
          base64,
          image
        });
      };
      image.src = base64 as string;
    }
    reader.onerror = (error) => reject(error);
  }
);
