function jsRendring(jsCode: string, baseUrl: string): string {
  return jsCode.replace(
    /(['"`])((?:https?:\/\/|\/|\.\.?\/)[^\s'"`<>]*)\1/g,
    (match, quote, url) => {
      try {
        const absoluteUrl = url.startsWith('http')
          ? url
          : new URL(url, baseUrl).href;

        return `${quote}./?url=${absoluteUrl}${quote}`;
      } catch {
        return match; // 不正なURLの場合はそのまま
      }
    }
  );
}

export { jsRendring };