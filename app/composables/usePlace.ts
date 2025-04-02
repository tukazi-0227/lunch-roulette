import type { Place } from "@/@types/outlet";

const usePlaceStore = (key: string) => {
  return new PlaceStore(key);
}

class PlaceStore {
  _state: Ref<Place>;
  constructor(key: string) {
    this._state = useState<Place>(key, () => ({
      name: "",
      placeId: "",
    }));
  }

  get state() {
    return readonly(this._state);
  }

  get editState() {
    return this._state;
  }

  update(data: Place) {
    this._state.value = data;
  }
}
