export const httpConfig = {
  uri: process.env.IS_LOCAL === "true" ? "http://localhost:3000" : "https://sstreamy.vercel.app"
}