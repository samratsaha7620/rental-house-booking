import React, { useCallback, useMemo, useState } from 'react';
import { BiImageAlt } from "react-icons/bi";

import { useForm, FieldValues, SubmitHandler } from 'react-hook-form';
import { useRentModal } from '../../hooks/useRentModal';
import Modal from './Modal';
import Heading from '../Heading';
import { categories } from '../navbar/Categories';
import CategoryInput from '../inputs/CategoryInput';
import CountrySelect from '../inputs/CountrySelect';
import Counter from '../inputs/Counter';
import Input from '../inputs/Input';
import axios from 'axios';
import { BACKEND_URL } from '../../config';
import toast from 'react-hot-toast/headless';
import { useSetRecoilState } from 'recoil';
import { allListingState } from '../../recoil/atoms';

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO =  2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

const RentModal:React.FC = () => {
  const rentModal = useRentModal();
  const setAllListings = useSetRecoilState(allListingState);
  const [isLoading, setIsLoading] = useState(false);
  const [step,setStep] = useState(STEPS.CATEGORY);
  const [imagesrc , setImagesrc] = useState("");
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState:{
    errors,
    },
    reset} =  useForm<FieldValues>({
    defaultValues:{
      category:"",
      location:null,
      guestCount:1,
      roomCount:1,
      bathroomCount:1,
      imagesrc:"",
      price:1,
      title:"",
      description:"",
    }
  })
  const location = watch('location');
  const category = watch('category');
  const guestCount = watch('guestCount');
  const roomCount = watch('roomCount');
  const bathroomCount = watch('bathroomCount');
  
  const setCustomValue = (id:string, value:any) =>{
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    })
  }
  
  const onBack = () =>{
    setStep((value) => value-1)
  }

  const onNext = () =>{
    setStep((value) => value+1)
  }

  const handleInputChangeFile = useCallback((input:HTMLInputElement)=>{
    console.log(input.files?.item(0))
    return async(event:Event) =>{
      event.preventDefault();
      const file :File|null | undefined = input.files?.item(0);
      if(!file) return;
      try{
        //@ts-ignore
        const responsedata = await axios.post(`${BACKEND_URL}/api/v1/img/generate-presigned-url`,
          {
            imageName:file.name,
            imageType: file.type
          },{
          headers:{
            'Authorization':"Bearer "+ localStorage.getItem("authToken")
          },
        })
        
        const {getSignedURLForListing}  =responsedata.data;
        if(getSignedURLForListing){
          toast.loading("Uploading...");
          await axios.put(getSignedURLForListing, file, {
            headers: {
              'Content-Type': file.type,
            },
          });
          toast.success("Upload Completed");
          const url = new URL(getSignedURLForListing);
          const myFilePath = `${url.origin}${url.pathname}`

          setImagesrc(myFilePath);

          setValue("imagesrc",myFilePath);

        }
      }catch(error){
        toast.error("Error Uploading File")
      }
    }
  },[])

  const handleImageUpload = useCallback(() =>{
    const input = document.createElement("input");
    input.setAttribute("type","file");
    input.setAttribute("accept","image/*")

    const handlerFn = handleInputChangeFile(input);

    input.addEventListener("change",handlerFn);

    input.click();

  },[handleInputChangeFile])


  const onSubmit:SubmitHandler<FieldValues> = (data) =>{
    if(step !== STEPS.PRICE){
      return onNext();
    }
    setIsLoading(true);

    axios.post(`${BACKEND_URL}/api/v1/listings/add-property` ,data,{
      headers:{
        "Authorization": "Bearer " +localStorage.getItem("authToken")
      }
    })
    .then((resp) =>{
      toast.success('Listing created!');
      setAllListings((prevState) => ({
        ...prevState,
        resp
      }))
      reset();
      window.location.reload();
      setStep(STEPS.CATEGORY);
      rentModal.onClose();
    })
    .catch(() =>{
      toast.error("Something went wrong.")
    })
    .finally(()=>{
      setIsLoading(false);
    })
  }

  const actionlabel = useMemo(() =>{
    if(step === STEPS.PRICE){
      return "Create"
    }
    return "Next"
  },[step])

  const secondaryActionLabel = useMemo(() =>{
    if(step === STEPS.CATEGORY){
      return undefined;
    }
    return 'Back';
  },[step]);


  let bodyContent = (
  <div className='flex flex-col gap-8'>
    <Heading title='Whicj of these best describes your place'
    subtitle='Pick a category'
    />
    <div className='
    grid grid-cols-1 md:grid-cols-2
    gap-3 max-h-[50vh]
    overflow-y-auto
    '>
      {categories.map((item) =>(
        <div key={item.label} className='col-span-1'> 
         <CategoryInput
         onClick={(category) => 
          setCustomValue('category',category)
         }
         selected = {category === item.label}
         label={item.label}
         icon = {item.icon}
         />
        </div>
      ))}
    </div>
  </div>
  )

  if(step === STEPS.LOCATION){
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Where is your place located?"
          subtitle="Help guests find you!"
        />
        <CountrySelect 
          value={location} 
          onChange={(value) => setCustomValue('location', value)} 
        />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Share some basics about your place"
          subtitle="What amenitis do you have?"
        />
        <Counter 
          onChange={(value) => setCustomValue('guestCount', value)}
          value={guestCount}
          title="Guests" 
          subtitle="How many guests do you allow?"
        />
        <hr />
        <Counter 
          onChange={(value) => setCustomValue('roomCount', value)}
          value={roomCount}
          title="Rooms" 
          subtitle="How many rooms do you have?"
        />
        <hr />
        <Counter 
          onChange={(value) => setCustomValue('bathroomCount', value)}
          value={bathroomCount}
          title="Bathrooms" 
          subtitle="How many bathrooms do you have?"
        />
      </div>
    )
  }
  
  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Add a photo of your place"
          subtitle="Show guests what your place looks like!"
        />
        {imagesrc && (
          <div className='inset-0 w-full h-full'>
            <img src={imagesrc} alt='image preview' style={{ objectFit: 'cover' }}/>
          </div>
        )}
        <BiImageAlt
          onClick={handleImageUpload}
          {...register("imagesrc")}
        />
      </div>
    )
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="How would you describe your place?"
          subtitle="Short and sweet works best!"
        />
        <Input
          id="title"
          label="Title"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="description"
          label="Description"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    )
  }
  
  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Now, set your price"
          subtitle="How much do you charge per night?"
        />
        <Input
          id="price"
          label="Price"
          formatPrice 
          type="number" 
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    )
  }

  return (
    <Modal
     disabled={isLoading}
     isOpen ={rentModal.isOpen}
     title='Airbnb your home'
     actionlabel={actionlabel}
     onSubmit={handleSubmit(onSubmit)}
     onClose={rentModal.onClose}
     secondaryActionLabel={secondaryActionLabel}
     secondaryAction={step === STEPS.CATEGORY ? undefined: onBack}
     body={bodyContent}
    />
  )
}

export default RentModal;