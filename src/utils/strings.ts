export function capitalizeFirstLetter(str: string): string {
  if (!str) return str; // handle empty string
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const getPreviewText = (html: string, wordLimit = 200) => {
  const temp = document.createElement('div');
  temp.innerHTML = html;

  const text = temp.textContent || temp.innerText || '';
  return text.split(/\s+/).slice(0, wordLimit).join(' ');
};
