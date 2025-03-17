import os
from mistralai import Mistral

# Retrieve the API key from environment variables
api_key = os.environ["MISTRAL_API_KEY"]

# Specify model
model = "mistral-ocr-latest"

# Initialize the Mistral client
client = Mistral(api_key=api_key)

# # Define the messages for the chat
# messages = [
#     {
#         "role": "user",
#         "content": [
#             {
#                 "type": "text",
#                 "text": "what is the last sentence in the document"
#             },
#             {
#                 "type": "document_url",
#                 "document_url": "https://arxiv.org/pdf/1805.04770"
#             }
#         ]
# #     }
# ]




# ocr_response = client.ocr.process(
#     model="mistral-ocr-latest",
#     document={
#         "type": "image_url",
#         "image_url": "https://media-hosting.imagekit.io//ab955f8fa19a4526/WhatsApp%20Image%202025-03-15%20at%207.59.57%20PM.jpeg?Expires=1836657030&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=hg2Ebi0iZ4Ob3rhBERaDWFH4l3DmoMYq-A~zNQN2wYspPxfMeKAQQ37X3KI6XJrDneCWALTLxB6YpykCqGJ7mCm0eDcoUdvD9svoe7GCRsP2L9xTTIvhihDm4E-IU1eIuKS2r4-c4iJZVpAWgIEGLObKaxInWZF56m-oqjk~J68Yeaajcspbu5hc4HVTyueMMfroVl3hhKsmien7K6pJxg3phtCowots8NXAdBXAV1uJmrFsJvh2vXJ9HXvHageuiYxRxu8XL~JxG4jFp~QdQyKps4m5SMBtmx4nKwoI5e5aRvSitg9ACmRFqiB7CHpZexunVu5d4kFVL0O7kUBszg__"
#     }
# )


client = Mistral(api_key=api_key)

uploaded_pdf = client.files.upload(
    file={
        "file_name": "uploaded_file.pdf",
        "content": open("uploaded_file.pdf", "rb"),
    },
    purpose="ocr"
)  


client.files.retrieve(file_id=uploaded_pdf.id)

signed_url = client.files.get_signed_url(file_id=uploaded_pdf.id)


api_key = os.environ["MISTRAL_API_KEY"]
client = Mistral(api_key=api_key)

ocr_response = client.ocr.process(
    model="mistral-ocr-latest",
    document={
        "type": "document_url",
        "document_url": signed_url.url,
    }
)


# Print the content of the response
print(ocr_response)
for page in ocr_response['pages']:
  draw_ocr_page(ocr_response['pages'])

# Output: 
# The last sentence in the document is:\n\n\"Zaremba, W., Sutskever, I., and Vinyals, O. Recurrent neural network regularization. arXiv:1409.2329, 2014.

import matplotlib.pyplot as plt
import matplotlib.patches as patches
from PIL import Image
import os

# Define page dimensions
page_width, page_height = 1653, 2339  # Based on OCRPageDimensions

def draw_ocr_page(ocr_page):
    fig, ax = plt.subplots(figsize=(8, 10))
    ax.set_xlim(0, page_width)
    ax.set_ylim(0, page_height)
    ax.invert_yaxis()  # Invert y-axis to match image coordinates
    ax.set_xticks([])
    ax.set_yticks([])
    ax.set_title(f"OCR Page {ocr_page['index']}")
    
    # Draw text
    ax.text(50, 100, ocr_page['markdown'], fontsize=10, verticalalignment='top', wrap=True)
    
    # Draw images
    for image_obj in ocr_page['images']:
        img_path = image_obj['id']  # Assuming the images are in the same directory
        if os.path.exists(img_path):
            img = Image.open(img_path)
            img_extent = [
                image_obj['top_left_x'], image_obj['bottom_right_x'],
                image_obj['top_left_y'], image_obj['bottom_right_y']
            ]
            ax.imshow(img, extent=img_extent, aspect='auto')
        else:
            # Draw a placeholder rectangle if image is missing
            rect = patches.Rectangle(
                (image_obj['top_left_x'], image_obj['top_left_y']),
                image_obj['bottom_right_x'] - image_obj['top_left_x'],
                image_obj['bottom_right_y'] - image_obj['top_left_y'],
                linewidth=1, edgecolor='r', facecolor='none', linestyle='dashed'
            )
            ax.add_patch(rect)
            ax.text(image_obj['top_left_x'], image_obj['top_left_y'], '[Image Missing]',
                    fontsize=8, color='red', verticalalignment='top')
    
    plt.show()
