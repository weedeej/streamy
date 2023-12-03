export const httpConfig = {
  uri: Boolean(process.env.IS_LOCAL) ? "http://localhost:3000" : "https://sstreamy.vercel.app"
}