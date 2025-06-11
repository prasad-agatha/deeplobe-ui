export const custom_Imageclassification_response = `  
    {
        "id": <MODEL_PRIMARY_KEY>,
        "input_images": ["<INPUT_IMAGE_URL>"],
        "result": {
          "result": [
            [
              "<CLASS_NAME_1>",
              <CONFIDENCE_SCORE>
            ],
            [
              "<CLASS_NAME_2>",
              <CONFIDENCE_SCORE>
            ]
          ]
        },
        "data":"<EXTRA_DATA_IF_ANY>",
        "extra":"<METRICS_OF_THE_MODEL_IF_ANY>",
        "description": "<MODEL_DESCRIPTION_IF_ANY>",
        "created": "<DATE_TIMESTAMP>",
        "updated": "<DATE_TIMESTAMP>",
        "is_predicted": <BOOLEAN>,
        "is_failed": <BOOLEAN>,
        "aimodel":<MODEL_ID>,
        "user": <USER_ID>
    }
  `;

export const custom_image_similarity_response = `
    {
      "id": <MODEL_PRIMARY_KEY>,
      "input_images": ["<INPUT_IMAGE_URL_1>", "<INPUT_IMAGE_URL_2>"],
      "result": {
          "result": {
            "image1": "<OUTPUT_IMAGE_URL_1>",
            "image2": ["<OUTPUT_IMAGE_URL_2>"],
            "similarity_score": ["<SIMILARITY_SCORE>"],
          },
      },
      "data": "<EXTRA_DATA_IF_ANY>",
      "extra": "<METRICS_OF_THE_MODEL_IF_ANY>",
      "description": "<MODEL_DESCRIPTION_IF_ANY>",
      "created": "<DATE_TIMESTAMP>",
      "updated": "<DATE_TIMESTAMP>",
      "is_predicted": <BOOLEAN>,
      "is_failed": <BOOLEAN>,
      "aimodel": <MODEL_ID>,
      "user": <USER_ID>
    }
    `;

export const custom_Semantic_segmentation_response = `
    {
      "id": <MODEL_PRIMARY_KEY>,
      "input_images": ["<INPUT_IMAGE_URL>"],
      "result": {
        "json": [{ "label": "<LABEL>", "color_mask": "<RGB_COLOR_CODE>" }],
        "image": "<ANNOTATED_IMAGE_URL>",
       },
      "data": "<EXTRA_DATA_IF_ANY>",
      "extra": "<METRICS_OF_THE_MODEL_IF_ANY>",
      "description": "<MODEL_DESCRIPTION_IF_ANY>",
      "created": "<DATE_TIMESTAMP>",
      "updated": "<DATE_TIMESTAMP>",
      "is_failed": <BOOLEAN>,
      "is_predicted": <BOOLEAN>,
      "aimodel": <MODEL_ID>,
      "user": <USER_ID>
    }
    `;

export const custom_Instance_segmentation_response = `
    {
      "id": <MODEL_PRIMARY_KEY>,
      "input_images": ["<INPUT_IMAGE_URL>"],
      "result": {
        "json": [
          {
            "color": "<RGB_COLOR_CODE>",
            "label": "<LABEL_NAME>",
            "coordinates": [
              { "x1": <VALUE>, "y1": <VALUE> },
              { "x2": <VALUE>, "y2": <VALUE> },
              { "x3": <VALUE>, "y3": <VALUE> },
              { "x4": <VALUE>, "y4": <VALUE> },
            ],
            "predicted_score": <PREDICTED_SCORE>,
          },
          {
            "color": "<RGB_COLOR_CODE>",
            "label": "<LABEL_NAME>",
            "coordinates": [
              { "x1": <VALUE>, "y1": <VALUE> },
              { "x2": <VALUE>, "y2": <VALUE> },
              { "x3": <VALUE>, "y3": <VALUE> },
              { "x4": <VALUE>, "y4": <VALUE> },
            ],
            "predicted_score": <PREDICTED_SCORE>,
          },
        ],
        "image": "<ANNOTATED_IMAGE_URL>",
      },
      "data": "<EXTRA_DATA_IF_ANY>",
      "extra": "<METRICS_OF_THE_MODEL_IF_ANY>",
      "description": "<MODEL_DESCRIPTION_IF_ANY>",
      "created": "<DATE_TIMESTAMP>",
      "updated": "<DATE_TIMESTAMP>",
      "is_predicted": <BOOLEAN>,
      "aimodel": <MODEL_ID>,
      "user": <USER_ID>
    }
    `;

export const custom_Optical_character_recognition_response = `
    {
      "id": <MODEL_PRIMARY_KEY>,
      "input_images":["<INPUT_IMAGE_URL>"],
      "result": ["<ANNOTATED_IMAGE_URL>"],
      "data": "<EXTRA_DATA_IF_ANY>",
      "extra": "<METRICS_OF_THE_MODEL_IF_ANY>",
      "description": "<MODEL_DESCRIPTION_IF_ANY>",
      "created": "<DATE_TIMESTAMP>",
      "updated": "<DATE_TIMESTAMP>",
      "is_predicted": <BOOLEAN>,
      "aimodel": <MODEL_ID>,
      "user": <USER_ID>
    }
    `;

export const custom_Image_tagging_response = `
    {
      "id": <MODEL_PRIMARY_KEY>,
      "input_images": ["<INPUT_IMAGE_URL>"],
      "result": {
        "json": [
          {
            "color": "RGB_COLOR_CODE",
            "label": "<LABEL_NAME>",
            "coordinates": "[COORDINATES_OF_DATA]",
            "predicted_score": <PREDICTED_SCORE>,
          },
        ],
        "image": "<ANNOTATED_IMAGE_URL>",
      },
      "data":"<EXTRA_DATA_IF_ANY>",
      "extra": "<METRICS_OF_THE_MODEL_IF_ANY>",
      "description": "<MODEL_DESCRIPTION_IF_ANY>",
      "created": "<DATE_TIMESTAMP>",
      "updated": "<DATE_TIMESTAMP>",
      "is_predicted": <BOOLEAN>,
      "aimodel": <MODEL_ID>,
      "user": <USER_ID>
    }
    `;

// PRE TRAINED MODELS STARTS HERE

export const pretrained_pii_extractor_response = `
    {
      "coordinate": [
        {
          "entity_name": "<ENTITY_NAME>",
          "page": <PAGE_NO>,
          "text": "<TEXT>",
          "x1": <VALUE>,
          "x2": <VALUE>,
          "y1": <VALUE>,
          "y2": <VALUE>,
        },
        {
          "entity_name": "<ENTITY_NAME>",
          "page": <PAGE_NO>,
          "text": "<TEXT>",
          "x1": <VALUE>,
          "x2": <VALUE>,
          "y1": <VALUE>,
          "y2": <VALUE>,
        },
      ],
      "s3_url": "<OUTPUT_PDF_URL>",
    };
    `;
export const pretrained_table_extractor_response = `
    {
      "results": [
        {
          "Page 1": [
            {
              "Table 1": ["<EXTRACTED_TABLE_DATA>"],
            },
          ],
        },
      ],
      "s3_url": "<OUTPUT_PDF_URL>",
    };
    `;
export const pretrained_Sentiment_analysis_response = `
    [
      {
        "NEGATIVE": "<NEGATIVE_SCORE>",
        "POSITIVE": "<POSITIVE_SCORE>"
       },
    ];
    `;

export const pretrained_Image_similarity_response = `
    {
      "image1": "<INPUT_IMAGE_1_URL>",
      "image2": "<INPUT_IMAGE_2_URL>",
      "score": "<SIMILARITY_SCORE>"
    }
    `;

export const pretrained_Facial_detection_response = `
    {
      "annotated_img_url": "<ANNOTATED_INPUT_IMAGE_URL>",
      "no_of_faces": <DETECTED_FACE_NUMBER>,
      "original_image_url": "<ORIGINAL_INPUT_IMAGE_URL>",
    };
    `;

export const pretrained_Demographic_recognition_response = `
    {
      "annotated_img_url": "<ANNOTATED_INPUT_IMAGE_URL>",
      "faces": [
        {
          "age": <AGE>,
          "face_url": "<IMAGE_URL>",
          "gender": "<GENDER>",
          "race": "<COLOR>",
        },
        {
          "age": <AGE>,
          "face_url": "<IMAGE_URL>",
          "gender": "<GENDER>",
          "race": "<COLOR>",
        },
      ],
      "no_of_faces": <DETECTED_FACE_NUMBER>,
      "original_image_url": "<ORIGINAL_INPUT_IMAGE_URL>",
    };
    `;

export const pretrained_Facial_expression_response = `
    {
      "annotated_img_url": "<ANNOTATED_INPUT_IMAGE_URL>",
      "faces": [
        {
          "emotion": {
            "dominant_emotion": "<DOMINANT_EMOTION>",
            "emotion": {
              "angry": <EMOTION_SCORE>,
              "disgust": <EMOTION_SCORE>,
              "fear": <EMOTION_SCORE>,
              "happy": <EMOTION_SCORE>,
              "neutral": <EMOTION_SCORE>,
              "sad": <EMOTION_SCORE>,
              "surprise": <EMOTION_SCORE>,
            },
          },
          "face_url": "<DETECTED_FACE_IMAGE>",
        },
      ],
      "no_of_faces": <DETECTED_FACE_NUMBER>,
      "original_image_url": "<ORIGINAL_INPUT_IMAGE_URL>",
    };
    `;

export const pretrained_Pose_detection_response = `
    {
      "original_img_url": "<ORIGINAL_INPUT_IMAGE_URL>",
      "skeletal_img_url": "<ANNOTATED_INPUT_IMAGE_URL>"
    }
    `;

export const pretrained_Text_moderation_response = `
    [
      {
        "NON_HATE": "<NON_HATE_SCORE>",
        "HATE": "<HATE_SCORE>"
      }
    ]
    `;

export const pretrained_People_vehicle_detection_response = `
    {
      "original_image_url":  "<ORIGINAL_INPUT_IMAGE_URL>",
      "annotated_image_url": "<ANNOTATED_INPUT_IMAGE_URL>",
      "no_of_people": <PEOPLE_DETECTED_NUMBER>,
      "no_of_vehicles": <VEHICLES_DETECTED_NUMBER>
    }
    `;

export const pretrained_Wound_detection_response = `
    {
      "original_image_url":  "<ORIGINAL_INPUT_IMAGE_URL>",
      "annotated_image_url": "<ANNOTATED_INPUT_IMAGE_URL>",
      "area": <WOUND_DETECTED_AREA>,
      "color": ["<DETECTED_WOUND_COLOR>", "<DETECTED_WOUND_COLOR>"]
    }
    `;
export const background_removal_response = `
    {
    "s3_url": "<BACKGROUND_REMOVED_IMAGE_URL>"
    }
    `;
