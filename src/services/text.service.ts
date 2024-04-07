import axios from "axios";

interface TextResponse {
  status: string;
  text: string;
}

async function getText() {
  try {
    const { data } = await axios.get<TextResponse>("https://fish-text.ru/get", {
      params: {
        format: "json",
        type: "sentence",
        number: 1,
      },
    });

    return data;
  } catch (error) {
    console.error(error);
  }
}

export { getText };
