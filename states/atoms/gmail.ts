import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();
export const gmailAtom = atom({
  key: "gmailAtom",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const classifiedMailAtom = atom({
  key: "classifiedMailAtom",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
