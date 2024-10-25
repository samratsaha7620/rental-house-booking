import {atom,useRecoilState} from 'recoil'

const registerState = atom({
  key:"RegisterState",
  default:false
})

export function useRegisterModal() {
  const [isOpen, setIsOpen] = useRecoilState(registerState);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  return {
    isOpen,
    onOpen,
    onClose,
  };
}
