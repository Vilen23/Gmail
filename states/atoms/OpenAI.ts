import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export const OpenAIAtom = atom({
  key: "OpenAIAtom",
  default: "",
  effects_UNSTABLE: [persistAtom],
});
