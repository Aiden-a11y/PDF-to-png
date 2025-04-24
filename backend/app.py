from flask import Flask, request, send_file
from flask_cors import CORS  # CORS import 추가
from werkzeug.utils import secure_filename
from pdf2image import convert_from_bytes
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# Label sizes (width, height)
LABEL_SIZES = {
    "5400x1200": (5400, 1200),
    "800x2400": (800, 2400),
    "1200x1800": (1200, 1800),
    "800x1400": (800, 1400),
    "800x1200": (800, 1200),
}

@app.route('/convert', methods=['POST'])
def convert_pdf():
    pdf_file = request.files['pdf']
    if not pdf_file:
        return "No file uploaded", 400

    # 선택된 사이즈 받기
    size = request.form.get('size', '800x1200')  # 기본값은 800x1200

    if size not in LABEL_SIZES:
        return "Invalid size", 400

    images = convert_from_bytes(pdf_file.read())
    if len(images) > 2:
        return "Only 1 or 2-page PDFs are supported", 400

    # Merge two images vertically if needed
    if len(images) == 2:
        widths = [img.width for img in images]
        heights = [img.height for img in images]
        merged = Image.new('RGB', (max(widths), sum(heights)))
        y_offset = 0
        for img in images:
            merged.paste(img, (0, y_offset))
            y_offset += img.height
    else:
        merged = images[0]

    # 선택한 사이즈로 리사이즈
    resized = merged.resize(LABEL_SIZES[size], Image.LANCZOS)

    img_io = io.BytesIO()
    resized.save(img_io, 'PNG')
    img_io.seek(0)
    return send_file(img_io, mimetype='image/png', as_attachment=True, download_name='label.png')

if __name__ == '__main__':
    app.run(debug=True)

