declare module "@vitalets/google-translate-api" {
  function translate(text: string, options?: any): Promise<any>;
  export default translate;
}