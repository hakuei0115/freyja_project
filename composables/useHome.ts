interface NewsItem {
  _id: string;
  title: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export const useHome = () => {
  const newsList = ref<NewsItem[]>([]);
  const isLoading = ref<boolean>(false);

  const getNewList = async () => {
    isLoading.value = true;
    try {
      const res = await fetch("https://nuxr3.zeabur.app/api/v1/home/news/");
      const data: { result: NewsItem[] } = await res.json();
      newsList.value = data.result;
    } catch (error) {
      console.error("載入失敗:", error);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    newsList,
    isLoading,
    getNewList
  };
};
