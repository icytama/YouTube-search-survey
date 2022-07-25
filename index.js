import Innertube from "youtubei.js";
import * as xlsx from "xlsx";

/**
 * the extractor need 2 params, an array containing the keyword you are looking for and the place where you will save the created file
 * 
 * @param {arrays} keyword 📕 array of keywords you want to search
 * @param {string} path 🤔 place where i can save the result
 * @returns 🙂 the path what you expect a LG 2 Doors fridge?
 */
export default async function extractor(keyword, path) {
  return new Promise(async (resolve, reject) => {
    try {
      const youtube = await new Innertube();
      const workbook = xlsx.utils.book_new();

      // 😶 for each give me error so i do this 
      for (let i = 0; i < keyword.length; i++) {
        let e = keyword[i];

        const data = [];
        let search = await youtube.search(e);
        search.videos.forEach((ele) => {
          data.push({
            Title: ele.title,
            View: ele.metadata.view_count.split(" ")[0],
            Duration: ele.metadata.duration.simple_text,
            "Publish Date": ele.metadata.published,
            Url: ele.url,
          });
        });

        // 😶‍🌫️ JSON is cool but i need a CSV file
        const worksheet = xlsx.utils.json_to_sheet(data);

        // 😴 sometime you search with some teribble long keyword
        let name = /^[a-zA-Z+$]/.test(e) ? e.slice(0, 20) : e;

        // 😶 are you serius using special characters?
        xlsx.utils.book_append_sheet(workbook, worksheet, name.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, ' '));
      }

      // 🌞 let's create the file
      xlsx.write(workbook, {
        bookType: "xlsx",
        type: "buffer",
      });
      xlsx.write(workbook, {
        bookType: "xlsx",
        type: "binary",
      });

      path = path.includes(".xlsx") ? path : path + ".xlsx";

      // 😎 save it
      xlsx.writeFile(workbook, path);
      resolve(path);
    } catch (error) {
        reject(error);
    }
  });
}