interface RoomInfo {
  title: string;
  isProvide: boolean;
}

interface Rooms {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageUrlList: string[];
  areaInfo: string;
  bedInfo: string;
  maxPeople: number;
  price: number;
  status: number;
  layoutInfo: RoomInfo[];
  facilityInfo: RoomInfo[];
  amenityInfo: RoomInfo[];
  createdAt: string;
  updatedAt: string;
}

export const useRoom = () => {
  const roomsList = ref<Rooms[]>([]);
  const roomDetail = ref<Rooms | null>(null);
  const isLoading = ref<boolean>(false);

  const getRooms = async () => {
    isLoading.value = true;
    await fetch("https://nuxr3.zeabur.app/api/v1/rooms")
      .then((res) => res.json())
      .then((data) => {
        roomsList.value = data.result;
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        isLoading.value = false;
      });
  }

  const getRoomDetail = async (id: string) => {
    isLoading.value = true
    try {
      const { data, error } = await useFetch<{ result: Rooms }>(`https://nuxr3.zeabur.app/api/v1/rooms/${id}`)

      if (error.value) throw error.value
      roomDetail.value = data.value?.result || null
    } catch (err) {
      console.error('取得房型詳情失敗:', err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    roomsList,
    roomDetail,
    isLoading,
    getRooms,
    getRoomDetail,
  }
}