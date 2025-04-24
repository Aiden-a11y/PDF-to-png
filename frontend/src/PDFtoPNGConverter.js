import { useState } from "react";

export default function PDFtoPNGConverter() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setImageUrl(null);

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await fetch("http://localhost:5000/convert", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        alert(`변환 실패: ${errorText}`);
        setLoading(false);
        return;
      }

      const blob = await res.blob();
      setImageUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error("업로드 실패:", error);
      alert("서버에 연결할 수 없습니다.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-gray-100 min-h-screen">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-semibold text-center text-blue-600">
            PDF to PNG Converter
          </h1>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="p-3 border-2 border-gray-300 rounded-md"
          />
          <button
            onClick={handleUpload}
            disabled={loading}
            className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition duration-300"
          >
            {loading ? "변환 중..." : "PNG로 변환"}
          </button>
          {imageUrl && (
            <div className="flex flex-col items-center">
              <img src={imageUrl} alt="Converted PNG" className="max-w-full h-auto rounded-md shadow-md mb-4" />
              <a
                href={imageUrl}
                download="label.png"
                className="text-blue-500 underline hover:text-blue-700"
              >
                PNG 다운로드
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
