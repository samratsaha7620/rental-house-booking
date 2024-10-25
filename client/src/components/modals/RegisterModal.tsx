import React, { useCallback,useState } from 'react'
import axios from "axios";
import { toast } from 'react-hot-toast';
import Modal from './Modal'
import { useRegisterModal } from '../../hooks/useRegisterModal'
import { useLoginModal } from '../../hooks/useLoginModal';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import Button from '../Button';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

import Input from '../inputs/Input';
import Heading from '../Heading';
import { BACKEND_URL } from '../../config';


const RegisterModal:React.FC = () => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading,setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState:{errors}
  } = useForm<FieldValues>({
    defaultValues:{
      name:"",
      email:"",
      password:""
    }
  })
  const onSubmit:SubmitHandler<FieldValues> = (data) =>{
    setIsLoading(true);
    axios.post(`${BACKEND_URL}/api/v1/auth/signup`,data)
    .then((resp) => {
      const token = resp.data.token;
      if(token){
        localStorage.setItem("authToken" , token);
        toast.success("Registerd");
        registerModal.onClose();
        loginModal.onOpen();
      }
    })
    .catch((error)=>{
      toast.error(error);
    })
    .finally(()=>{
      setIsLoading(false);
    })
  }
  const onToggle = useCallback(()=>{
    registerModal.onClose();
    loginModal.onOpen();
  },[registerModal,loginModal])
  
  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Welcome to Airbnb"
        subtitle="Create an account!"
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
        id="name"
        label="Name"
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
        <p>Already have an account?
          <span 
            onClick={onToggle} 
            className="
              text-neutral-800
              cursor-pointer 
              hover:underline
            "
            > Log in</span>
        </p>
      </div>
    </div>
  )

  return (
    <Modal
    disabled={isLoading}
    isOpen = {registerModal.isOpen}
    title='Register'
    actionlabel='Continue'
    onClose={registerModal.onClose}
    onSubmit={handleSubmit(onSubmit)}
    body={bodyContent}
    footer={footerContent}
    />
  )
}

export default RegisterModal;
