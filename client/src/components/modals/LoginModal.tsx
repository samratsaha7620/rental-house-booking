import React, { useCallback, useState } from 'react'
import Modal from './Modal';
import Button from '../Button';
import Input from '../inputs/Input';
import Heading from '../Heading';
import { useRegisterModal } from '../../hooks/useRegisterModal';
import { useLoginModal } from '../../hooks/useLoginModal';
import { FieldValues, SubmitHandler,useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { AiFillGithub } from 'react-icons/ai';
import axios from 'axios';
import { useSetRecoilState } from 'recoil';
import { BACKEND_URL } from '../../config';
import {toast} from 'react-hot-toast';
import { userAuthState } from '../../recoil/atoms';

const LoginModal:React.FC = () => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading,setIsLoading] = useState(false);
  const setUserState = useSetRecoilState(userAuthState);
  const {
    register,
    handleSubmit,
    reset,
    formState:{errors}
  } = useForm<FieldValues>({
    defaultValues:{
      email:"",
      password:""
    }
  })
  const onSubmit:SubmitHandler<FieldValues> = (data) =>{
    setIsLoading(true);
    axios.post(`${BACKEND_URL}/api/v1/auth/signin`,data)
    .then((resp) =>{
      setIsLoading(false);
      console.log(resp.status);
      console.log(resp.data);
      if(resp.status === 200){
        toast.success('Logged in');
        localStorage.setItem("authToken",resp.data.token);
        setUserState(({prevState}:{prevState:{}}) =>({
          ...prevState,
          isAuthenticated:true,
          userId: resp.data.user.id,
          favoriteIds:resp.data.user.favoriteIds
        }))
        reset();
        loginModal.onClose();
      }
    })
    .catch((error) =>{
      setIsLoading(false);
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || 'Login failed');
      } else {
        toast.error('An unexpected error occurred');
      }
    })
  }
  const onToggle = useCallback(()=>{
    loginModal.onClose();
    registerModal.onOpen();
  },[loginModal,registerModal]) 

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Welcome Back"
        subtitle="Login to your account"
      />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        label="Password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  )
  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <Button 
        outline 
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => {}} 
      />
      <Button 
        outline 
        label="Continue with Github"
        icon={AiFillGithub}
        onClick={() => {}}
      />
      <div 
        className="
          text-neutral-500 
          text-center 
          mt-4 
          font-light
        "
      >
        <p>First time using Airbnb?
          <span 
            onClick={onToggle} 
            className="
              text-neutral-800
              cursor-pointer 
              hover:underline
            "
            > Create an account</span>
        </p>
      </div>
    </div>
  )

  return (
    <Modal
    disabled={isLoading}
    isOpen = {loginModal.isOpen}
    title='Login'
    actionlabel='Continue'
    onClose={loginModal.onClose}
    onSubmit={handleSubmit(onSubmit)}
    body={bodyContent}
    footer={footerContent}
    />
  )
}

export default LoginModal;
