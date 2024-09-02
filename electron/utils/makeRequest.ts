import { net } from "electron";
import { objectToFormUrlEncoded } from ".";

type RequestMethod = "GET" | "POST";

interface RequestOptions {
  method?: RequestMethod;
  url: string;
  headers?: Record<string, string>;
  body?: any; // 可以根据需要调整类型
  query?: any; // 可以根据需要调整类型
}

const makeRequest = async (options: RequestOptions): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (options.method !== "POST" && options.query) {
      let query = objectToFormUrlEncoded(options.query);
      options.url += ("?" + query);
    }


    const request = net.request({
      method: options.method || "GET",
      url: options.url,

      headers: options.headers || {},
    });

    if (options.method === "POST" && options.body) {
      request.write(objectToFormUrlEncoded(options.body));
    }

    request.on("response", (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch (error) {
          resolve(data); // 如果不是 JSON，则直接返回原始数据
        }
      });
    });

    request.on("error", (error) => {
      reject(error);
    });

    request.end();
  });
};
export { makeRequest, RequestOptions };
