import {atom,useRecoilState} from 'recoil'

const RentModalStore = atom({
  key:"RentModalStore",
  default:false
})

export function useRentModal() {
  const [isOpen, setIsOpen] = useRecoilState(RentModalStore);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  return {
    isOpen,
    onOpen,
    onClose,
  };
}
