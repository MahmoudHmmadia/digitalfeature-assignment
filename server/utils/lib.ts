import { config } from "dotenv";
import type { Request } from "express";
import { existsSync, mkdir, unlink } from "fs";
import multer, { diskStorage } from "multer";
import { join } from "path";
import { v4 as unique } from "uuid";
import { transporter } from "../config/mail.config";
import { DIRNAME } from "../server";
config();

export function getToken(req: Request) {
  const bearerHeader = req.headers["authorization"];

  const token = bearerHeader?.split(" ")[1];

  return token;
}

export function removeFakeEmails(account: any) {
  return {
    ...account,
    email: account.email?.split("@")[1].startsWith("fake")
      ? ""
      : account.email || "",
  };
}

export function getLang(req: Request) {
  const langHeader: "en" | "ar" = req.headers["accept-language"] as "en" | "ar";

  return langHeader == "en" || langHeader == "ar" ? langHeader : "en";
}

export async function paginate({
  req,
  model,
  query = {},
  populate,
  select,
  orderBy,
  prismaModel,
}: {
  req: Request;
  model?: any;
  query?: any;
  populate?: any;
  select?: any;
  orderBy?: any;
  prismaModel?: any;
}) {
  const page = parseInt((req.query.page as string) || "1", 10);
  const limit = parseInt((req.query.limit as string) || "10", 10);
  const startIndex = parseInt(
    (req.query.startIndex as string) || `${(page - 1) * limit}`,
    10,
  );

  if (prismaModel) {
    // ✅ Prisma - Fixed to properly handle select/include
    const totalCount = await prismaModel.count({ where: query });
    const pagesNumber = Math.ceil(totalCount / limit);

    // Build the findMany options
    const findManyOptions: any = {
      where: query,
      skip: startIndex,
      take: limit,
      orderBy: orderBy || { createdAt: "desc" },
    };

    // Handle select vs include for Prisma
    if (select) {
      findManyOptions.select = select;
    } else if (populate) {
      findManyOptions.include = populate;
    }

    const data = await prismaModel.findMany(findManyOptions);

    return { data, pagesNumber, totalCount };
  }
  if (model) {
    // ✅ Mongoose
    const totalCount = await model.countDocuments(query);
    const pagesNumber = Math.ceil(totalCount / limit);

    const data = await model
      .find(query)
      .skip(startIndex)
      .limit(limit)
      .sort(orderBy || { _id: -1 })
      .populate(populate)
      .select(select || "");

    return { data, pagesNumber, totalCount };
  }

  throw new Error("Invalid configuration for pagination");
}

export function createMulter({
  dir,
  folder = "images",
}: {
  dir?: string;
  folder?: string;
}) {
  const storage = diskStorage({
    destination(_req, _file, callback) {
      const destination = dir
        ? join(DIRNAME, "public", folder, dir)
        : join(DIRNAME, "public", folder);

      mkdir(destination, { recursive: true }, (err) => {
        if (err) {
          return callback(err, destination);
        }
        callback(null, destination);
      });
    },

    filename(_req, file, callback) {
      const fileExtension = file.originalname.split(".").pop();
      const uniqueFilename = `${unique()}.${fileExtension}`;
      callback(null, uniqueFilename);
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 50 },
  });

  return upload;
}

export async function sendMail({
  email,
  html,
  subject,
}: {
  email: string;
  subject: string;
  html: string;
}) {
  const mailOptions = {
    from: process.env.EMAIL_FORM,
    to: email,
    subject,
    html,
  };

  await transporter
    .sendMail(mailOptions)
    .then(() => {
      console.log(`SENDED EMAIL TO ${email}`);
    })
    .catch((e: any) => {
      console.log(e);
    });
}

export function generateCode(length: number) {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let code = "";

  for (let index = 0; index < length; index++) {
    const letter = arr[Math.floor(Math.random() * arr.length)];
    code += letter;
  }

  return code;
}

export function deleteFile({
  dirName,
  url,
  folder = "images",
}: {
  dirName?: string;
  url: string;
  folder?: string;
}) {
  const pathName = dirName
    ? join(
        DIRNAME,
        "public",
        folder,
        dirName,
        url.split("/")[url.split("/").length - 1],
      )
    : join(
        DIRNAME,
        "public",
        folder,
        url.split("/")[url.split("/").length - 1],
      );

  if (existsSync(pathName)) {
    unlink(pathName, (err) => {
      if (err) {
        console.log(err.message);
        throw new Error(err.message);
      }
    });
  }
}

export function imagesUrl() {
  return `${
    process.env.MODE === "DEV" ? process.env.DEV_URL : process.env.URL
  }/${process.env.IMAGES_PATH}`;
}

export function assetsUrl() {
  return `${
    process.env.MODE === "DEV" ? process.env.DEV_URL : process.env.URL
  }/${process.env.ASSETS_PATH}`;
}

export function shapeLocation(account: any) {
  try {
    if (account.location?.coordinates?.length > 0)
      return {
        ...account,
        location: {
          lat: account.location.coordinates[1],
          lng: account.location.coordinates[0],
          display_name: account.location.display_name,
        },
      };
    else return account;
  } catch (err: any) {
    if (err.message.includes("account.toObject is not a function")) {
      if (account.location?.coordinates?.length > 0)
        return {
          ...account,
          location: {
            lat: account.location?.coordinates[1],
            lng: account.location?.coordinates[0],
            display_name: account.location.display_name,
          },
        };
      return account;
    }
  }
}

export function convertLocation(location: any, initValue?: any) {
  let parsedLocation: any;
  try {
    parsedLocation =
      typeof location == "string" ? JSON.parse(location) : location;
  } catch (error) {
    console.log(error);
    parsedLocation = location || null;
  }

  return parsedLocation
    ? {
        type: "Point",
        coordinates: [parsedLocation.lng, parsedLocation.lat],
        display_name: parsedLocation.display_name,
      }
    : initValue
      ? initValue
      : null;
}

export function getWhere(key: string) {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(key);

  const where = isObjectId ? { id: key } : { slug: key };
  return where;
}

export function transformTranslations(data: any, lang: "en" | "ar"): any {
  if (data == null) return data;
  if (data instanceof Date) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => transformTranslations(item, lang));
  }

  if (typeof data !== "object") return data;

  const result: any = {};

  for (const key in data) {
    if (key !== "translations") {
      if (data[key] && typeof data[key] === "object") {
        result[key] = transformTranslations(data[key], lang);
      } else {
        result[key] = data[key];
      }
    }
  }

  if (data.translations && typeof data.translations === "object") {
    const translations = data.translations;
    const targetLang = translations[lang] || translations["en"] || {};

    for (const [fieldName, fieldValue] of Object.entries(targetLang)) {
      result[fieldName] = fieldValue;
    }
  }

  return result;
}
