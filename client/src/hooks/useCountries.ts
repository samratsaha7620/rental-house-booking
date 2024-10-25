import countries from "world-countries"


const AllCountries = countries.map((country) => (
  {
    value:country.cca2,
    label: country.name.common,
    flag:country.flag,
    region:country.region
  }
))


const useCountries = () =>{
  const getAll = () => AllCountries;

  const getByValue =(value:string) =>{
    return AllCountries.find((country) => country.value === value);
  }

  return {
    getAll,
    getByValue
  }
}


export default useCountries;