import {atom,useRecoilState} from 'recoil'

const loginState = atom({
  key:"LoginState",
  default:false
})

export function useLoginModal() {
  const [isOpen, setIsOpen] = useRecoilState(loginState);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  return {
    isOpen,
    onOpen,
    onClose,
  };
}
