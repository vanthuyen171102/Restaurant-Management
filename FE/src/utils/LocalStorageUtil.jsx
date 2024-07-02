class LocalStorageUtil {
  // Lưu dữ liệu vào localStorage
  static save(key, data) {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }

  // Lấy dữ liệu từ localStorage
  static get(key) {
    try {
      const serializedData = localStorage.getItem(key);
      if (serializedData === null) {
        return undefined;
      }
      return JSON.parse(serializedData);
    } catch (error) {
      console.error("Error getting from localStorage:", error);
      return undefined;
    }
  }

  // Xóa dữ liệu khỏi localStorage
  static remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  }
}

export default LocalStorageUtil;
