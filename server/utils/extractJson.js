export default function extractJson(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    try {
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");

      if (start === -1 || end === -1) return null;

      const jsonString = text.slice(start, end + 1);
      return JSON.parse(jsonString);
    } catch {
      return null;
    }
  }
}