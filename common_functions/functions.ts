export const copyToClipBoard = async (copyMe) => {
  try {
    await navigator.clipboard.writeText(copyMe);
  } catch (err) {}
};
export const emailValidation = (email) => {
  const regex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return !(!email || regex.test(email) === false);
};
export const getRandomColor = () => {
  let letters = "0123456789ABCDEF";
  let color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
export const getImageHeightAndWidth = (obj: any, url: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = function () {
      obj.specifications = { width: img.width, height: img.height };
      resolve(obj);
    };
    img.onerror = function () {
      reject("Image failed to load");
    };
  });
};

// API requires base 64 image input so to convert images to base 64
export const fileToBase64 = async (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (e) => reject(e);
  });

export async function parseURI(d) {
  var reader = new FileReader(); /* https://developer.mozilla.org/en-US/docs/Web/API/FileReader */
  reader.readAsDataURL(
    d
  ); /* https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL */
  return new Promise((res, rej) => {
    /* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise */
    reader.onload = (e) => {
      /* https://developer.mozilla.org/en-US/docs/Web/API/FileReader/onload */
      res(e.target.result);
    };
  });
}
// For image url input convert blob image
export async function getDataBlob(url) {
  var res = await fetch(url);
  var blob = await res.blob();
  var uri = await parseURI(blob);
  return uri;
}
export async function getDataBlob1(url) {
  var res = await fetch(url);
  var blob = await res.blob();
  const newfile = new File([blob], "File name", { type: "image/png" });

  return newfile;
}
// Check provided url is an image url
export const doesImageExist = (url) =>
  new Promise((resolve) => {
    const img = new Image();

    img.src = url;
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  });

export const getModelType = (pathname = "", label = false) => {
  const model_type = pathname.replace("/create-model/", "").replace("/[uuid]", "");
  if (!label)
    return model_type
      .replace("similarity", "image_similarity")
      .replace("object-detection", "object_detection");

  if (model_type === "classification") return "Image classification";
  else if (["object-detection", "object_detection"].includes(model_type)) return "Object detection";
  else if (model_type === "segmentation") return "Semantic segmentation";
  else if (model_type === "instance") return "Instance segmentation";
  else if (["similarity", "image_similarity"].includes(model_type)) return "Image similarity";
  else if (model_type === "ocr") return "Optical character recognition";
};

export const getLabelName = (txt) => {
  return txt.charAt(0).toUpperCase() + txt.slice(1);
};

export const getBlob = (data: any) => {
  const jsonse = JSON.stringify(data);
  return new Blob([jsonse], { type: "application/json" });
};

export const annotatorPaths = (pathname: any) => {
  return (
    pathname.includes("/create-model") ||
    ["/settings", "/my-models", "/api-documentation", "/contact-us"].includes(pathname)
  );
};
export const isRole = (user: any, role: any) => {
  return user && user?.current_workspace_details?.role === role;
};
export const userAccess = (user: any, typ: any) => {
  return user && user?.current_workspace_details?.models[0][typ];
};
export const getDefaultAccess = () => {
  return { create_model: false, delete_model: false, test_model: false, api: false };
};
export const getColor = () => {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
};
export const createSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    background: "#fff",
    border: "1px solid",
    borderRadius: "4px",
    fontSize: "12px",
    minHeight: "27px",

    boxShadow: state.isFocused ? null : null,
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    div: { padding: "0px 4px" },
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "0px 4px",
  }),
  option: (provided) => ({
    ...provided,
    fontSize: "12px",
    padding: "4px",
    borderRadius: "4px",
  }),
  menuList: (provided) => ({
    ...provided,
    padding: "0px",
  }),
};
export const colorShade = (col, amt) => {
  col = col.replace(/^#/, "");
  if (col.length === 3) col = col[0] + col[0] + col[1] + col[1] + col[2] + col[2];

  let [r, g, b] = col.match(/.{2}/g);
  [r, g, b] = [parseInt(r, 16) + amt, parseInt(g, 16) + amt, parseInt(b, 16) + amt];

  r = Math.max(Math.min(255, r), 0).toString(16);
  g = Math.max(Math.min(255, g), 0).toString(16);
  b = Math.max(Math.min(255, b), 0).toString(16);

  const rr = (r.length < 2 ? "0" : "") + r;
  const gg = (g.length < 2 ? "0" : "") + g;
  const bb = (b.length < 2 ? "0" : "") + b;

  return `#${rr}${gg}${bb}`;
};
