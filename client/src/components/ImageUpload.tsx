import { useEffect, useState } from "react";
import styled from "styled-components";

export const ImageUpload: React.FC<{ setImage: (e: any) => void }> = ({
  setImage,
}) => {
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState<string>();

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  // @ts-expect-error @error event type
  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0]);
    setImage(e.target.files[0]);
  };

  return (
    <div>
      <input type="file" onChange={onSelectFile} />
      {selectedFile && <Image src={preview} />}
    </div>
  );
};

const Image = styled.img`
  font-family: sans-serif;
  font-weight: 400;
  border-radius: 4px;
  padding: 5px;
  width: 150px;
  margin-bottom: 1rem;
  color: #aaa;
  margin-top: 1rem;
`;
