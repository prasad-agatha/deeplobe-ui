export const dashboardCards = [
  {
    icon: "/images/create-model-tagging-icon.webp",
    name: "Experiment with AI models",
    text: "Explore our pre-trained AI models.",
    button_text: "Test a model",
    path: "/pre-trained-models",
    infer_icon: "/infer-images/create-model-tagging-icon.png",
  },
  {
    icon: "/images/create-model-img.webp",
    name: "Create a model",
    text: "Build a model that suits your requirements in just a few seconds. Create custom ML models by uploading your dataset with just a few clicks.",
    button_text: "Get started",
    path: "/create-model",
    infer_icon: "/infer-images/create-model-img.png",
  },
  {
    icon: "/images/create-model-image-segmentation.webp",
    name:
      "Learn how to use " +
      `${process.env.NEXT_PUBLIC_CLIENT === "Intellect INFER" ? "INFER" : "Deeplobe"}`,
    text:
      "Need help in learning how to use " +
      `${process.env.NEXT_PUBLIC_CLIENT === "Intellect INFER" ? "INFER" : "Deeplobe"}` +
      "? Don't worry. Read our Knowledge base that explains everything step-by-step for you.",
    button_text: "Read quick start doc",
    path: "https://docs.deeplobe.ai/",
    infer_icon: "/infer-images/create-model-image-segmentation.png",
  },
  {
    icon: "/images/create-model-similarity.webp",
    name: "Need help?",
    text: `Need further assistance with ${
      process.env.NEXT_PUBLIC_CLIENT === "Intellect INFER" ? "Intellect INFER" : "Deeplobe"
    }?`,
    button_text: "Contact now",
    path: "/contact-us",
    infer_icon: "/infer-images/create-model-similarity.png",
  },
];

export const createModelCards = [
  {
    icon: "/images/tagging-icon.png",
    infer_icon: "/infer-images/tagging-icon.webp",
    name: "Object detection",
    text: "Detects and localizes multiple objects within the image",
    path: "create-model/object-detection",
    permission: "object_detection",
  },
  {
    icon: "/images/instance-segmentation.png",
    infer_icon: "/infer-images/semantic-segmentation.webp",
    name: "Semantic segmentation",
    text: "Identify and trace the boundaries of specific instances of various objects based on defined categories",
    path: "create-model/segmentation",
    permission: "semantic_segmentation",
  },
  {
    icon: "/images/instance-segmentation.png",
    infer_icon: "/infer-images/instance-segmentation.webp",
    name: "Instance segmentation",
    text: "Identify and trace the boundaries of specific instances of various objects within defined categories",
    path: "create-model/instance",
    permission: "instance_segmentation",
  },
  {
    icon: "/images/ocr-icon.png",
    infer_icon: "/infer-images/ocr-icon.webp",
    name: "Optical character recognition",
    text: "Extract key-value information from the digital documents",
    path: "create-model/ocr",
    permission: "optical_character_recognition",
  },
  {
    icon: "/images/similarity-icon.png",
    infer_icon: "/infer-images/similarity-icon.webp",
    name: "Image similarity",
    text: "Analyze images and identify the degree of similarity between two images",
    path: "create-model/similarity",
    permission: "image_similarity",
  },
  {
    icon: "/images/image-classification.png",
    infer_icon: "/infer-images/image-classification.webp",
    name: "Image classification",
    text: "Classify objects, patterns, or concepts in an image based on the defined classes",
    path: "create-model/classification",
    permission: "image_classification",
  },
  {
    icon: "/images/llmimage.webp",
    infer_icon: "/images/llmimage2.webp",
    name: "Custom generative AI",
    text: "AI Assistant chatbot on your given data",
    path: "create-model/llm",
    permission: "image_classification",
  },
];

export const preTrainedModels = [
  {
    icon: "/images/Signature-Detection.webp",
    infer_icon: "/infer-images/Background-Removal.webp",
    name: "Signature detection",
    text: "Detects the signature from the given image/document",
    path: "/pre-trained-models/signature-detection",
    tabs: ["all", "computer-vision"],
  },
  {
    icon: "/images/Background-Removal.webp",
    infer_icon: "/infer-images/Background-Removal.webp",
    name: "Image background removal",
    text: "Remove the background  from the given image",
    path: "/pre-trained-models/image-background-removal",
    tabs: ["all", "computer-vision"],
  },
  {
    icon: "/images/voter-data-extractor.webp",
    infer_icon: "/infer-images/voter-data-extractor.webp",
    name: "Voter ID data extractor",
    text: "Extract Voter ID data from the given image",
    path: "/pre-trained-models/voter-ocr",
    tabs: ["all", "ocr"],
  },
  {
    icon: "/images/pan-data-extractor.webp",
    infer_icon: "/infer-images/pan-data-extractor.webp",
    name: "PAN data extractor",
    text: "Extract PAN data from the given image",
    path: "/pre-trained-models/pan-ocr",
    tabs: ["all", "ocr"],
  },
  {
    icon: "/images/aadhaar-data-extractor.webp",
    infer_icon: "/infer-images/aadhaar-data-extractor.webp",
    name: "Aadhaar data extractor",
    text: "Extract Aadhaar data from the given image",
    path: "/pre-trained-models/aadhar-ocr",
    tabs: ["all", "ocr"],
  },
  {
    icon: "/images/ImageSearchSimilarity.svg",
    infer_icon: "/infer-images/image-similarity-model.png",
    name: "Image Similarity Search",
    text: "Discover visually similar images from the database instantly",
    path: "/pre-trained-models/image-search-similarity",
    tabs: ["all", "computer-vision"],
  },
  // {
  //   icon: "images/llmimage2.webp",
  //   infer_icon: "images/llmimage2.webp",
  //   name: "Large language model (LLM)",
  //   text: "AI Assistant chatbot on SEC filing ",
  //   path: "/pre-trained-models/large-language-model",
  //   tabs: ["all", "text-analysis"],
  // },

  {
    icon: "/images/pii.webp",
    infer_icon: "/infer-images/pii.png",
    name: "PII data extractor",
    text: "Extract Personal Identifiable Information (PII) data from the given text and pdf files",
    path: "/pre-trained-models/pii-data-extractor",
    tabs: ["all", "text-analysis"],
  },
  {
    icon: "/images/Auto-table-extractor.webp",
    infer_icon: "/infer-images/pii.png",
    name: "Auto-table extractor",
    text: "Extract tables from unstructured pdf documents",
    path: "/pre-trained-models/auto-table-extractor",
    tabs: ["all", "text-analysis"],
  },
  {
    icon: "/images/sentimental-analysis.webp",
    infer_icon: "/infer-images/sentimental-analysis.png",
    name: "Sentiment analysis model",
    text: "Extract sentiment and classify the connotation of text as negative, neutral, or positive",
    path: "/pre-trained-models/sentiment-analysis",
    tabs: ["all", "text-analysis"],
  },
  {
    icon: "/images/image-similarity-model.webp",
    infer_icon: "/infer-images/image-similarity-model.png",
    name: "Image similarity model",
    text: "Compares two images and returns a value that indicates visual similarly",
    path: "/pre-trained-models/image-similarity",
    tabs: ["all", "computer-vision"],
  },
  {
    icon: "/images/facial-detection.webp",
    infer_icon: "/infer-images/facial-detection.png",
    name: "Facial detection model",
    text: "Recognizes faces within an image",
    path: "/pre-trained-models/facial-detection",
    tabs: ["all", "computer-vision"],
  },
  {
    icon: "/images/demographic-recognition.webp",
    infer_icon: "/infer-images/demographic-recognition.png",
    name: "Demographic recognition model ",
    text: "Identifies the age, gender, and cultural appearance of people in an image",
    path: "/pre-trained-models/demographic-recognition",
    tabs: ["all", "computer-vision"],
  },
  {
    icon: "/images/facial-exp.webp",
    infer_icon: "/infer-images/facial-exp.png",
    name: "Facial expression recognition",
    text: "Identifies human facial expression from a given image",
    path: "/pre-trained-models/facial-expression-recognition",
    tabs: ["all", "computer-vision"],
  },
  {
    icon: "/images/pose-detect.webp",
    infer_icon: "/infer-images/pose-detect.png",
    name: "Pose detection model",
    text: "Detects various human body poses within an image",
    path: "/pre-trained-models/pose-detection",
    tabs: ["all", "computer-vision"],
  },
  {
    icon: "/images/text-moderation.webp",
    infer_icon: "/infer-images/text-moderation.png",
    name: "Text moderation model",
    text: "Analyzes and calculates a probability score that text contains toxic, insulting, obscene or threatening content",
    path: "/pre-trained-models/text-moderation",
    tabs: ["all", "text-analysis"],
  },
  {
    icon: "/images/ppl-vehicle.webp",
    infer_icon: "/infer-images/ppl-vehicle.png",
    name: "People and vehicle detection",
    text: "Detects vehicles and people within an image",
    path: "/pre-trained-models/people-vehicle-detection",
    tabs: ["all", "computer-vision"],
  },
  {
    icon: "/images/wound-detect.webp",
    infer_icon: "/infer-images/wound-detect.png",
    name: "Wound detection",
    text: "Locates and segments the size and color of wounds within an image",
    path: "/pre-trained-models/wound-segmentation",
    tabs: ["all", "computer-vision"],
  },
];

export const preTrainedModelsData = [
  {
    label: "PII data extractor",
    value: "pre_pii_extraction",
  },
  {
    label: "Auto-table extractor",
    value: "pre_table_extraction",
  },
  {
    label: "Sentiment analysis model",
    value: "pre_sentimental_analysis",
  },
  {
    label: "Image similarity model",
    value: "pre_image_similarity",
  },
  {
    label: "Facial detection model",
    value: "pre_facial_detection",
  },
  {
    label: "Demographic recognition model ",
    value: "pre_demographic_recognition",
  },
  {
    label: "Facial expression recognition",
    value: "pre_facial_expression",
  },
  {
    label: "Pose detection model",
    value: "pre_pose_detection",
  },
  {
    label: "Text moderation model",
    value: "pre_text_moderation",
  },
  {
    label: "People and vehicle detection",
    value: "pre_people_vehicle_detection",
  },
  {
    label: "Wound detection",
    value: "pre_wound_detection",
  },
];
