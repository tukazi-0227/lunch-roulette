import type { Outlet } from "@/@types/outlet";
import { Timestamp } from "firebase/firestore";
export const useOutletStore = (key: string) => {
  return new OutletStore(key);
}

class OutletStore {
  _state: Ref<Outlet>;
  constructor(key: string) {
    this._state = useState<Outlet>(key, () => ({
      id: "",
      name: "",
      place: "",
      detail: "",
      imageUrl: "",
      createdAt: Timestamp.now(),
    }));
  }

  get state() {
    return readonly(this._state);
  }

  get editState() {
    return this._state;
  }

  update(data: Outlet) {
    this._state.value = data;
  }
} 