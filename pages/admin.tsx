import { useState } from 'react'
import Image from 'next/image'
import Head from 'next/head'
import { gql, useQuery, useMutation } from '@apollo/client'
import toast, { Toaster } from 'react-hot-toast'

import { 
  AiOutlineUsergroupAdd, 
  AiOutlineUnorderedList, 
  AiOutlineShoppingCart, 
  AiOutlinePlus
} from 'react-icons/ai'

import Popup from '../components/Popup'
import ProductForm from '../components/Form/ProductForm'

import useTable from '../components/CustomHook/useTable'
import AdminPrivateRoute from '../components/AdminPrivateRoute'
import { Controllers } from '../components/Controllers'

const productsHeadCells = [
  { id: 'product', label: 'Product' },
  { id: 'image', label: 'Image' },
  { id: 'orders', label: 'Orders' },
  { id: 'action', label: 'Actions' }
]

const userHeadCells = [
  { id: 'username', label: 'Username' },
  { id: 'fullName', label: 'Full Name '},
  { id: 'email', label: 'Email' },
  { id: 'role', label: 'Role' }
]

const orderHeadCells = [
  { id: 'user', label: 'User' },
  { id: 'product', label: 'Product' },
  { id: 'address', label: 'Address' },
  { id: 'status', label: 'Status' }
]

const AllProductsQuery = gql`
  query {
    getAllProducts {
      items {
        id
        name
        price
        imageUrl
        _count {
          orders
        }
      }
      count {
        product_length
      }
    }
  }
`

const AllOrdersQuery = gql`
  query {
    getAllOrders {
      orders {
        id
        productId
        product {
          name
          price
          imageUrl
        }
        address {
          zipCode
          district
          city
          county
        }
        user {
          email
        }
        status
      }
      count {
        orders_length
      }
    }
  }
`

const AllUsersQuery = gql`
  query {
    getAllUsers {
      users {
        username
        email
        role
        id
        fullName
      }
      count {
        users_length
      }
    }
  }
`

const UpdateUserRoleMutation = gql`
  mutation(
    $userId: String!
    $role: String!
  ) {
    updateUserRole(
      userId: $userId
      role: $role
    ) {
      role
    }
  }
`

const UpdateOrderStatusMutation = gql`
  mutation(
    $orderId: String!
    $status: String!
  ) {
    updateStatusOrder(
      orderId: $orderId
      status: $status
    ) {
      status
    }
  }
`

const DeleteProductMutation = gql`
  mutation(
    $productId: String!
  ) {
    deleteProduct(
      productId: $productId
    ) {
      message
    }
  }
`

const Admin = () => {
  const [ openForm, setOpenForm ] = useState(false)
  const [ formType, setFormType ] = useState(null)

  const productData = useQuery(AllProductsQuery)
  const orderData = useQuery(AllOrdersQuery)
  const usersData = useQuery(AllUsersQuery)

  const [updateUserRole] = useMutation(UpdateUserRoleMutation)
  const [updateOrderStatus] = useMutation(UpdateOrderStatusMutation)
  const [deleteProduct] = useMutation(DeleteProductMutation)

  const ProductTable = useTable(productsHeadCells)
  const UserTable = useTable(userHeadCells)
  const OrderTable = useTable(orderHeadCells)

  const handleForm = (type) => {
    setOpenForm(true)
    setFormType(type)
  }

  const updateUserRoleHandler = async (e, userId) => {
    try {
      const variables = { userId: userId, role: e.target.value }
      toast.promise(updateUserRole({ variables }), {
        loading: 'Updated User Role..',
        success: 'Updated User Role successfully!🎉',
        error: 'Something went wrong 😥 Please try again',
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  const updateOrderStatusHandler = async (e, orderId) => {
    try {
      const variables = { orderId: orderId, status: e.target.value }
      toast.promise(updateOrderStatus({ variables }), {
        loading: 'Updated Order Status..',
        success: 'Updated Order Status successfully!🎉',
        error: 'Something went wrong 😥 Please try again',
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleDeleteProduct = async (productId) => {
    try {
      const variables = { productId }
      toast.promise(deleteProduct({ variables }), {
        loading: 'Deleting Product..',
        success: 'Delete Product Successfull!🎉',
        error: 'Something went wrong 😥 Please try again',
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  const PopupForm = ({ type, openPopup, setOpenPopup }) => (
    <Popup
      open={openPopup}
      setOpen={setOpenPopup}
    >
      <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-center">
          <div className="mt-3 text-center sm:mt-0 w-full">
            <h1 className="text-gray-800 text-2xl font-bold">Admin Form</h1>
          </div>
        </div>
        {type === "ProductForm" && <ProductForm setOpen={setOpenPopup} />}
      </div>
    </Popup>
  )

  return (
    <div className="block relative">
      <Head>
        <title>Admin - Delive</title>
      </Head>
      <div className="relative w-full h-full">
        <Toaster />
        <div className="grid grid-cols-3">
          <div className="col-span-2 bg-gray-300 bg-opacity-20 h-full border-r border-gray-300">
            <div className="max-w-4xl mx-auto">
              <div className="my-10">
                <div className="flex w-full justify-between my-4">
                  <h3 className="font-semibold text-gray-800">Quick Stats</h3>
                  <h3 className="text-white font-semibold bg-pink-500 px-2 rounded-full">Todays</h3>
                </div>
                <div className="w-full grid grid-cols-3 gap-12 my-8">
                  <div className="bg-yellow-500 bg-opacity-50 px-3 py-4 rounded-lg text-gray-700">
                    <h4 className="font-bold text-sm">Users</h4>
                    <div className="my-4 text-white">
                      <AiOutlineUsergroupAdd size={50} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold my-2">{usersData.data && usersData.data.getAllUsers.count.users_length}</h3>
                      <p className="text-xs">Shot Views</p>
                    </div>
                  </div>

                  <div className="bg-pink-500 bg-opacity-50 px-3 py-4 rounded-lg text-gray-700">
                    <h4 className="font-bold text-sm">Products</h4>
                    <div className="my-4 text-white">
                      <AiOutlineShoppingCart size={50} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold my-2">{productData.data && productData.data.getAllProducts.count.product_length}</h3>
                      <p className="text-xs">Shot Views</p>
                    </div>
                  </div>

                  <div className="bg-green-500 bg-opacity-50 px-3 py-4 rounded-lg text-gray-700">
                    <h4 className="font-bold text-sm">Order List</h4>
                    <div className="my-4 text-white">
                      <AiOutlineUnorderedList size={50} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold my-2">{orderData.data && orderData.data.getAllOrders.count.orders_length}</h3>
                      <p className="text-xs">Shot Views</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <div className="w-full">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="col-span-3 px-3 bg-white shadow-lg">
                        <UserTable.TblContainer>
                          <UserTable.TblHead />
                          <tbody>
                            {usersData.data && usersData.data.getAllUsers.users.map(user => (
                              <tr key={user.id}>
                                <td className="py-2">
                                  <p className="text-gray-900 font-semibold">{user.username}</p>
                                </td>
                                <td className="py-2">
                                  <p>{user.fullName}</p>
                                </td>
                                <td className="py-2">
                                  <p>{user.email}</p>
                                </td>
                                <td className="py-2">
                                  <select value={user.role} onChange={(e) => updateUserRoleHandler(e, user.id)}>
                                    <option value="USER">USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                  </select>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </UserTable.TblContainer>
                      </div>
                      
                      <div className="bg-blue-700 bg-opacity-60 w-full h-full px-4 py-8 flex items-center rounded-lg">
                        <div className="text-white font-semibold font-serif">
                          <h1 className="text-xl">Greate Choose </h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="w-full h-44">
                    <div className="grid-cols-1 grid gap-4">
                      <div className="px-4 bg-white shadow-lg">
                        <div className="flex w-full justify-end mt-2">
                          <button onClick={() => handleForm("ProductForm")} className="ml-2 flex items-center px-4 py-1 border rounded-lg bg-blue-700 bg-opacity-70 text-white">
                            <p className="w-max text-xs m-0 font-bold mr-2">Add New</p>
                            <AiOutlinePlus size={20} />
                          </button>
                        </div>
                        <ProductTable.TblContainer>
                          <ProductTable.TblHead />
                          <tbody>
                            {productData.data && productData.data.getAllProducts.items.map((product) => (
                              <tr key={product.id}>
                                <td className="py-2">
                                  <div>
                                    <p className="text-gray-900 font-semibold">{product.name}</p>
                                    <p className="text-gray-700 font-normal">{product.price}</p>
                                  </div>
                                </td>
                                <td className="py-2">
                                  <div className="relative overflow-hidden w-10 h-10">
                                    <Image layout="fill" alt="Image Data" className="w-full h-full" src={product.imageUrl} />
                                  </div>
                                </td>
                                <td className="py-2">
                                  <p>{product._count.orders}</p>
                                </td>
                                <td className="py-2">
                                  <Controllers.ActionButton
                                    type="danger"
                                    onClick={() => handleDeleteProduct(product.id)}
                                  >
                                    Delete
                                  </Controllers.ActionButton>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </ProductTable.TblContainer>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative w-full h-full px-8">
            <div className="fixed max-w-xl w-full overflow-y-scroll">
              <h1 className="my-8 text-gray-800 font-bold text-2xl">Orders List</h1>
              <div className="w-full">
                <div className="w-full mx-1">
                  <OrderTable.TblContainer>
                    <OrderTable.TblHead />
                    <tbody>
                      {orderData.data && orderData.data.getAllOrders.orders.map(order => (
                        <tr key={order.id}>
                          <td className="py-4">
                            <div className="">
                              <p>{order.user.email}</p>
                              <p>{order.user.username}</p>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center">
                              <div className="relative overflow-hidden w-10 h-10">
                                <Image layout="fill" alt="Image Data" className="w-full h-full" src={order.product.imageUrl} />
                              </div>
                              <div className="ml-2">
                                <p className="m-0">{order.product.name}</p>
                                <p className="m-0">Rp. {order.product.price}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <p className="m-0">{order.address.district}, </p>
                            <p className="m-0">{order.address.city}, </p>
                            <p className="m-0">{order.address.county}, {order.address.zipCode}</p>
                          </td>
                          <td className="py-4">
                            <select value={order.status} onChange={(e) => updateOrderStatusHandler(e, order.id)}>
                              <option value="DELIVERED">DELIVERED</option>
                              <option value="APPROVED">APPROVED</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </OrderTable.TblContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PopupForm 
        openPopup={openForm} 
        setOpenPopup={setOpenForm} 
        type={formType} 
      />
    </div>
  )
}

export default AdminPrivateRoute(Admin)
