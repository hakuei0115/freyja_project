export const useBookingStore = defineStore("booking", {
    state: () => ({
        roomsList: [],
        roomsDetail: [],
        bookingResult: null,
    }),

    actions: {
        setBookingResult(bookingResult) {
            this.bookingResult = bookingResult;
        },

        async fetchRoomList() {
            try {
                const { data, error } = await useAsyncData("room", () =>
                    $fetch("https://nuxr3.zeabur.app/api/v1/rooms")
                );

                if (error.value) {
                    console.error("Error fetching room list:", error.value);
                    return;
                }

                this.roomsList = data.value.result || [];
            } catch (err) {
                console.error("Exception in fetchRoomList:", err);
            }
        },

        async fetchRoomDetail(id) {
            const { data, error } = await useAsyncData("roomDetail", () =>
                $fetch(`https://nuxr3.zeabur.app/api/v1/rooms/${id}`)
            );

            if (error.value) {
                console.error("Error fetching room detail:", error.value);
                return;
            }

            this.roomsDetail = data.value.result || [];
        }
    },
});
