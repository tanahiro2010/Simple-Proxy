import { load } from "cheerio";

const linkRelatedAttributes = [
    // 一般的なリンク・リソース指定属性
    'href',          // <a>, <link>, <area>, <base>
    'src',           // <img>, <script>, <iframe>, <audio>, <video>, <source>
    'srcset',        // <img>, <source>（レスポンシブ画像）
    'data',          // <object>
    'action',        // <form>
    'formaction',    // <button>, <input type="submit|image">
    'cite',          // <blockquote>, <q>, <del>, <ins>
    'poster',        // <video> のプレビュー画像
    'manifest',      // <html>（アプリケーションキャッシュ）
    'longdesc',      // <img> の説明文URL（非推奨）
    'usemap',        // <img>, <object> のマップ参照
    'profile',       // <head> のメタ情報のURL（非推奨）
    'archive',       // <applet> の追加ファイル（非推奨）
    'codebase',      // <applet>, <object>（非推奨）
    'classid',       // <object>（ActiveXなど）
    'icon',          // `<link rel="icon">` など

    // フレーム・インライン要素関連
    'background',    // <body>, <table>, <td>（非推奨）
    'dynsrc',        // <img>（IE専用、非推奨）
    'lowsrc',        // <img>（非推奨）

    // `<meta>` 属性（リダイレクト等に使うことがある）
    'content'        // <meta http-equiv="refresh" content="5;url=https://example.com">
];

const otherItems: [string, string, string][] = [
    ['[name="location"]', 'name', 'value']
];

async function rendring(response: Response, host: string) {
    const text = await response.text();
    const $ = load(text);
    linkRelatedAttributes.forEach((item: string) => {
        $(`[${item}]`).each((i: number, ele) => {
            const href = $(ele).attr(item);
            if (href) {
                const uri = new URL(href, host);
                $(ele).attr(item, `/?url=${uri.href}`);
            }
        });
    });

    otherItems.forEach((item: [string, string, string]) => {
        $(item[0]).each((i: number, ele) => {
            const key = item[1];
            console.log(key);

            const href = $(ele).attr(item[2]);
            if (href) {
                const uri = new URL(href, host);
                $(ele).attr(item[2], `/?url=${uri.href}`);
            }
        });
    })


    return new Response($.html(), response);
}

export { rendring };