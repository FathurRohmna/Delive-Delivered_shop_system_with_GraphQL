import react, { useState } from 'react'

export function useForm(initialOfValues: any) {

  const [values, setValues] = useState<any>(initialOfValues)
  
  const handleInputChange = (event: React.ChangeEvent) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value as string[]
    })
  }

  const resetForm = () => {
    setValues(initialOfValues)
  }

  return {
    values,
    setValues,
    resetForm,
    handleInputChange
  }
}

interface Props {
  children: React.ReactNode
  other: any 
}
