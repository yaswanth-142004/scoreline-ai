import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from PIL import Image
from mistralai import Mistral

# Retrieve API key
api_key = os.environ["MISTRAL_API_KEY"]

# Initialize the Mistral client
client = Mistral(api_key=api_key)

# Upload PDF
uploaded_pdf = client.files.upload(
    file={
        "file_name": "uploaded_file.pdf",
        "content": open("uploaded_file.pdf", "rb"),
    },
    purpose="ocr"
)

# Retrieve the signed URL
signed_url = client.files.get_signed_url(file_id=uploaded_pdf.id).url

# Process the document with OCR
ocr_response = client.ocr.process(
    model="mistral-ocr-latest",
    document={"type": "document_url", "document_url": signed_url}
)

# Define page dimensions
page_width, page_height = 1653, 2339  # Based on OCRPageDimensions

def draw_ocr_page(ocr_page):
    """Visualizes OCR results with text and images."""
    fig, ax = plt.subplots(figsize=(8, 10))
    ax.set_xlim(0, page_width)
    ax.set_ylim(0, page_height)
    ax.invert_yaxis()  # Match coordinate system
    ax.set_xticks([])
    ax.set_yticks([])
    ax.set_title(f"OCR Page {ocr_page.index}")

    # Draw extracted text
    ax.text(50, 100, ocr_page.markdown, fontsize=10, verticalalignment='top', wrap=True)

    # Draw images
    for image_obj in ocr_page.images:
        img_path = image_obj.id  # Assuming images are in the same directory
        if os.path.exists(img_path):
            img = Image.open(img_path)
            img_extent = [
                image_obj.top_left_x, image_obj.bottom_right_x,
                image_obj.top_left_y, image_obj.bottom_right_y
            ]
            ax.imshow(img, extent=img_extent, aspect='auto')
        else:
            # Draw placeholder rectangle if image is missing
            rect = patches.Rectangle(
                (image_obj.top_left_x, image_obj.top_left_y),
                image_obj.bottom_right_x - image_obj.top_left_x,
                image_obj.bottom_right_y - image_obj.top_left_y,
                linewidth=1, edgecolor='r', facecolor='none', linestyle='dashed'
            )
            ax.add_patch(rect)
            ax.text(image_obj.top_left_x, image_obj.top_left_y, '[Image Missing]',
                    fontsize=8, color='red', verticalalignment='top')

    plt.show()

# Render each OCR page
for page in ocr_response.pages:  # Use dot notation
    draw_ocr_page(page)
