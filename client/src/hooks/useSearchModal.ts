import { atom, useRecoilState } from "recoil";

const searchModalStore = atom({
  key:"SearchModalStore",
  default:false,
})

export const useSearchModal  =() =>{
  const [isOpen ,setIsOpen]  = useRecoilState(searchModalStore);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return {
    isOpen,
    onOpen,
    onClose
  }
}