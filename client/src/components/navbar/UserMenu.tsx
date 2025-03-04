import { useCallback, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";

import { useLoginModal } from "../../hooks/useLoginModal";
import {useRegisterModal} from "../../hooks/useRegisterModal"
import { useRentModal } from "../../hooks/useRentModal";

import MenuItem from "./MenuItem";
import Avatar from "../Avatar";

import { userAuthState } from "../../recoil/atoms";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

const UserMenu: React.FC = () => {
  const navigate = useNavigate();
  const rentModal = useRentModal();
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const [isOpen, setIsOpen] = useState(false);
  const [userState,setUserState] = useRecoilState(userAuthState);
  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);
  
  return ( 
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div 
          onClick={() => userState.isAuthenticated ? rentModal.onOpen() : loginModal.onOpen()}
          className="
            hidden
            md:block
            text-sm 
            font-semibold 
            py-3 
            px-4 
            rounded-full 
            hover:bg-neutral-100 
            transition 
            cursor-pointer
          "
        >
          Airbnb your home
        </div>
        <div 
        onClick={toggleOpen}
        className="
          p-4
          md:py-1
          md:px-2
          border-[1px] 
          border-neutral-200 
          flex 
          flex-row 
          items-center 
          gap-3 
          rounded-full 
          cursor-pointer 
          hover:shadow-md 
          transition
          "
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            <Avatar src="/public/avatar.png" />
          </div>
        </div>
      </div>
      {isOpen && (
        <div 
          className="
            absolute 
            rounded-xl 
            shadow-md
            w-[40vw]
            md:w-3/4 
            bg-white 
            overflow-hidden 
            right-0 
            top-12 
            text-sm
          "
        >
          <div className="flex flex-col cursor-pointer">
          {userState.isAuthenticated ? (
              <>
                <MenuItem 
                  label="My trips" 
                  onClick={() => navigate("/trips")}
                />
                <MenuItem 
                  label="My favorites" 
                  onClick={() => navigate("/favorites")}
                />
                <MenuItem 
                  label="My reservations" 
                  onClick={() => navigate("/reservations")}
                />
                <MenuItem 
                  label="My properties" 
                  onClick={() => navigate("/properties")}
                />
                <MenuItem 
                  label="Airbnb your home" 
                  onClick={rentModal.onOpen}
                />
                <hr />
                <MenuItem 
                  label="Logout" 
                  onClick={() => {
                    setUserState((prevState: any) => ({
                      ...prevState,
                      isAuthenticated:false,
                      userId: "",
                      favoriteIds:[]
                    }))
                    localStorage.removeItem("authToken");
                  }}
                />
              </>
            ):(
              <>
                <MenuItem 
                  label="Login" 
                  onClick={loginModal.onOpen}
                />
                <MenuItem 
                  label="Sign up" 
                  onClick={registerModal.onOpen}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
   );
}
 
export default UserMenu;