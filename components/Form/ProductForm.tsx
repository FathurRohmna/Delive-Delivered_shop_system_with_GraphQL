import { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import toast, { Toaster } from 'react-hot-toast'

import { useForm } from '../CustomHook/useForm'
import { Controllers } from '../Controllers'

const initialOfValues = {
  name: '',
  price: '',
  description: '',
  imageUrl: undefined
}

const CreateProductMutation = gql`
  mutation(
    $name: String!
    $price: Int!
    $descrption: String!
    $imageUrl: String!
  ) {
    createProduct(
      name: $name
      price: $price
      descrption: $descrption
      imageUrl: $imageUrl
    ) {
      name
      price
      descrption
      imageUrl
    }
  }
`

const ProductForm = ({ setOpen }) => {
  const [createProduct] = useMutation(CreateProductMutation)

  const createProductHandle = async (data) => {
    const { name, price, descrption, imageUrl } = data
    const variables = { name, price: parseInt(price), descrption, imageUrl }

    try {
      await toast.promise(createProduct({ variables }), {
        loading: 'Creating new product..',
        success: 'Product successfully created!🎉',
        error: 'Something went wrong 😥 Please try agai                                n',
      })
      setOpen(false)
      resetForm()                          
    } catch (error) {
      console.log(error.message)
    }
  }

  const {
    values,
    setValues,
    resetForm,
    handleInputChange
  } = useForm(initialOfValues)

  const handleFileInputChange= (e: React.ChangeEvent ) => {
    const reader = new FileReader()
    const file = e.target.files[0]

    console.log(file);

    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setValues({...values, imageUrl: reader.result})
    }
    reader.onerror = () => {
      console.error('AHHHHHHHH!!');
      setErrMsg('something went wrong!');
    };
  }

  const onSubmit = e => {
    e.preventDefault()
    createProductHandle(values)
  }

  return (
    <form onSubmit={onSubmit}>
      <Toaster />
      <div className="grid w-full grid-cols-2 gap-4">
        <Controllers.InputText
          name="name"
          placeholder="Product Name"
          onChange={handleInputChange}
        />
        <Controllers.InputText
          name="price"
          placeholder="Price"
          onChange={handleInputChange}
        />
      </div>
      <div className="grid w-full grid-cols-1 gap-4">
        <textarea name="descrption" id="descrption" cols="30" rows="10" className="border border-gray-200 focus:outline-none rounded-lg p-4 mb-6 mt-2" placeholder="Description Product" onChange={handleInputChange}></textarea>
      </div>
      <div className="grid w-full grid-cols-3 gap-4">
        <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-md shadow-md tracking-wide uppercase border border-blue cursor-pointer hover:bg-purple-600 hover:text-white text-purple-600 ease-linear transition-all duration-150">
          <svg fill="#FFF" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
          </svg>
          <span className="mt-2 text-base leading-normal">Upload Image</span>
          <input 
            type="file" 
            name="imageUrl"
            className="hidden"
            onClick={(event)=> { 
              event.currentTarget.value = null
            }}
            onChange={handleFileInputChange} 
          />
        </label>
      </div>
      <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button
          type="submit"
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Post
        </button>
        <button
          type="button"
          className="w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={() => {
            setOpen(false)
            resetForm()
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default ProductForm
