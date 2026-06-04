import os
import mimetypes

def detect_file_type(file):
    """
    Detect the file type based on file extension or MIME type.
    Returns:
      - image extensions as is (e.g. 'jpg', 'png', 'dcm')
      - document extensions as is (e.g. 'pdf', 'docx', 'json')
      - 'image' if mime indicates image but ext unknown
      - 'pdf', 'json', 'doc' based on mime if extension unknown
      - 'unknown' if undetectable
    """

    filename = getattr(file, 'filename', '') or ''
    ext = os.path.splitext(filename)[-1].lower().replace(".", "")

    IMAGE_EXTENSIONS = {
        "png", "jpeg", "jpg", "bmp", "gif", "tiff", "tif", "webp", "heic", "avif",
        "dcm", "dicom", "cr2", "cr3", "nef", "arw", "raf", "psd", "svg", "eps", "ico",
        "icns", "fits", "exr", "hdr", "xcf", "apng", "mng",
        "bmv", "pmv"  # add any custom medical image formats here
    }

    DOCUMENT_EXTENSIONS = {
        "pdf", "txt", "doc", "docx", "rtf", "odt", "dot", "dotx", "md",
        "json", "xml", "csv", "log"
    }

    if ext in IMAGE_EXTENSIONS:
        return ext  # return exact extension for image files

    if ext in DOCUMENT_EXTENSIONS:
        return ext  # return exact extension for documents

    # Fallback to mime type if extension unknown or missing
    mime_type, _ = mimetypes.guess_type(filename)
    if mime_type:
        if mime_type.startswith("image"):
            return "image"
        if "pdf" in mime_type:
            return "pdf"
        if "json" in mime_type or "text" in mime_type:
            return "json"
        if "word" in mime_type or "doc" in mime_type:
            return "doc"

    return "unknown"