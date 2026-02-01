// src/utils/image.util.js
export const resolveImageUrl = (path, fallback) => {
    if (!path) return fallback || null;
    if (path.startsWith("http")) return path;
    return `https://pub-fed047aa2ebd4dcaad827464c190ea28.r2.dev/${path.replace(/^\/+/, "")}`;
};
