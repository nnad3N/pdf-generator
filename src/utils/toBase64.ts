const toBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result && typeof reader.result === "string") {
        resolve(reader.result.replace("data:", "").replace(/^.+,/, ""));
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

export default toBase64;
