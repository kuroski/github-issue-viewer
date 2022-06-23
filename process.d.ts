declare namespace NodeJS {
  export interface ProcessEnv {
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    GITHUB_ID: string;
    GITHUB_SECRET: string;
  }
}

declare module "@uppy/locales/lib/pt_BR" {
  export default Locale;
}
