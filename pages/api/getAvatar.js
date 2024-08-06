// fetchAvatar.js

export const fetchAvatar = async (size = 100) => {
    const response = await fetch(`https://picsum.photos/${size}/${size}?random=${Math.random()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch avatar');
    }
    return response.url;
  };
  