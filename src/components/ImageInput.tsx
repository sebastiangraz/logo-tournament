// components/ImageInput.tsx
import React from "react";

interface ImageInputProps {
  onLogoInput: (logos: { url: string; name: string }[]) => void;
}

export const ImageInput: React.FC<ImageInputProps> = ({ onLogoInput }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const uploadedLogos: { url: string; name: string }[] = [];
      for (let i = 0; i < files.length; i++) {
        uploadedLogos.push({
          url: URL.createObjectURL(files[i]),
          name: files[i].name,
        });
      }
      onLogoInput(uploadedLogos);
    }
  };

  return (
    <div className="row">
      <input
        type="file"
        accept=".png,.svg"
        multiple
        onChange={handleInputChange}
      />
    </div>
  );
};
