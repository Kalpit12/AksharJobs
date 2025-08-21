import cloudinary
import cloudinary.uploader

def upload_image(image):
    """
    Uploads an image to Cloudinary and returns the image URL.
    
    Parameters:
    - image (FileStorage): The image file to be uploaded.
    
    Returns:
    - str: The secure URL of the uploaded image from Cloudinary.
    - None: If no image is provided.
    
    """
    if image:
        #print("Image exists")
        upload_result = cloudinary.uploader.upload(image)
        print("Image url",upload_result)
        return upload_result["secure_url"]  # Returns the Cloudinary image URL
    return None
