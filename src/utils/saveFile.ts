interface SaveFile {
  filename: string;
  file: string;
}

const saveFile = ({ file, filename }: SaveFile) => {
  const blob = new Blob([Buffer.from(file, "base64")], {
    type: "application/pdf",
  });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = filename;
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export default saveFile;
