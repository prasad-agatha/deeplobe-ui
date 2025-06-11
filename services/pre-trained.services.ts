// services
import PreTrainedAPIService from "services/pre-trained.service";
// next
import Router from "next/router";
import APIService from "services/api.service";
import {
  DEMOGRAPHIC_RECOGNITION,
  EMOTION_RECOGNITION,
  FACE_DETECTION,
  IMAGE_SIMILARITY,
  IMAGE_SEARCH_SIMILARITY,
  PEOPLE_VEHICLE_DETECTION,
  PII_EXTRACTOR,
  POSE_DETECTION,
  SENTIMENT_ANALYSIS,
  TABLE_EXTRACTOR,
  TEXT_MODERATION,
  WOUND_SEGMENTATION,
  AADHAR_OCR,
  PAN_OCR,
  VOTER_OCR,
  IMAGE_BACKGROUND_REMOVAL,
  SIGNATURE_DETECTION,
} from "@constants/api_routes";

class PRETRAINEDService extends APIService {
  sentimentalAnalysis(data = {}): Promise<any> {
    // return this.post("https://deeplobe-lambda-api-v1.herokuapp.com/sentimentalAnalysis", data);
    // return this.post("/pretrained-models/pre_sentimental_analysis", true, data)
    return this.post(SENTIMENT_ANALYSIS, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }

  facialDetection(data = {}): Promise<any> {
    // return this.post("https://deeplobe-lambda-api-v1.herokuapp.com/facialDetection", data);
    // return this.post("/pretrained-models/pre_facial_detection", true, data)
    return this.post(FACE_DETECTION, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }

  textModeration(data = {}): Promise<any> {
    // return this.post("https://deeplobe-lambda-api-v1.herokuapp.com/textModeration", data);
    // return this.post("/pretrained-models/pre_text_moderation", true, data);
    return this.post(TEXT_MODERATION, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }
  imageSimilarity(data = {}): Promise<any> {
    // return this.post("https://deeplobe-lambda-api-v1.herokuapp.com/imageSimilarity", data);
    // return this.post("/pretrained-models/pre_image_similarity", true, data)
    return (
      this.post(IMAGE_SIMILARITY, true, data)
        // .then((res) => {
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          // throw error.response.data;
        })
    );
  }
  imageSearchSimilarity(data = {}): Promise<any> {
    return this.post(IMAGE_SEARCH_SIMILARITY, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }
  piiExtractor(data = {}): Promise<any> {
    // return this.post("https://deeplobe-lambda-api-v1.herokuapp.com/demographicRecognition", data)
    // return this.post("/pretrained-models/pre_demographic_recognition", true, data)
    return this.post(PII_EXTRACTOR, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }
  demographicRecognition(data = {}): Promise<any> {
    // return this.post("https://deeplobe-lambda-api-v1.herokuapp.com/demographicRecognition", data)
    // return this.post("/pretrained-models/pre_demographic_recognition", true, data)
    return this.post(DEMOGRAPHIC_RECOGNITION, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }
  facialExpressionRecognition(data = {}): Promise<any> {
    //return this.post("https://deeplobe-lambda-api-v1.herokuapp.com/facialExpressionRecognition",data)
    // return this.post("/pretrained-models/pre_facial_expression", true, data)
    return this.post(EMOTION_RECOGNITION, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }
  poseDetection(data = {}): Promise<any> {
    // return this.post("https://deeplobe-lambda-api-v1.herokuapp.com/poseDetection", data);
    // return this.post("/pretrained-models/pre_pose_detection", true, data)
    return this.post(POSE_DETECTION, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }
  peoplevehicledetection(data = {}): Promise<any> {
    // return this.post("https://deeplobe-lambda-api-v1.herokuapp.com/people-vehicle-detection",data);
    // return this.post("/pretrained-models/pre_people_vehicle_detection", true, data)
    return this.post(PEOPLE_VEHICLE_DETECTION, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }
  aadharOCR(data = {}): Promise<any> {
    return this.post(AADHAR_OCR, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }
  panOCR(data = {}): Promise<any> {
    return this.post(PAN_OCR, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }
  voterOCR(data = {}): Promise<any> {
    return this.post(VOTER_OCR, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }
  imagebackgroundremoval(data = {}): Promise<any> {
    return this.post(IMAGE_BACKGROUND_REMOVAL, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }
  signatureDetection(data = {}): Promise<any> {
    return this.post(SIGNATURE_DETECTION, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }
  wounddetection(data = {}): Promise<any> {
    // return this.post("https://deeplobe-lambda-api-v1.herokuapp.com/woundDetection", data);
    // return this.post("/pretrained-models/pre_wound_detection", true, data)
    return this.post(WOUND_SEGMENTATION, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }
  tableExtractor(data = {}): Promise<any> {
    return this.post(TABLE_EXTRACTOR, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }
}

export default PRETRAINEDService;
