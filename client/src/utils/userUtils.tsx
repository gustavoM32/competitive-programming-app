const CF_HANDLE_STORAGE_KEY = "cfHandle";

export const getCfHandleFromStorage = (): string => {
  return localStorage.getItem(CF_HANDLE_STORAGE_KEY) ?? "";
};

export const setCfHandleToStorage = (handle: string) => {
  localStorage.setItem(CF_HANDLE_STORAGE_KEY, handle);
};
