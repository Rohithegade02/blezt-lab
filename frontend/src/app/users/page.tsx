'use client'
import { PencilIcon, XMarkIcon } from '@heroicons/react/16/solid'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { deleteUser, getAllUser } from '../api/user'
import { Profile, User } from '../types/type'
import { useDispatch } from 'react-redux'
import {
  setSelectedUser,
  setSelectedProfileUser,
} from '../lib/features/user/userSlice'

export default function Page() {
  const dispatch = useDispatch()
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)

  const router = useRouter()
  const [users, setUsers] = useState<Array<User>>([])
  //get api
  const getData = useCallback(async () => {
    const response = await getAllUser()
    setUsers(response)
  }, [])
  useEffect(() => {
    getData()
  }, [getData])

  const allUsers = useMemo(() => users, [users])
  const handleViewProfile = useCallback(
    (userProfile: Profile) => {
      console.log(userProfile)
      dispatch(setSelectedProfileUser(userProfile))
      router.push(`/users/profile`)
    },
    [dispatch, router],
  )

  const handleCreateUser = useCallback(() => {
    router.push('/users/create')
  }, [router])
  const handleEditUser = useCallback(
    (user: User) => {
      dispatch(setSelectedUser(user)) // Set user in the global state
      router.push(`/users/edit`) // Navigate to the edit page
    },
    [dispatch, router],
  )

  return (
    <div>
      <div className='flex gap-5 p-10 items-center'>
        <div>
          <p>Users</p>
        </div>
        <div>
          <button
            className='py-2 px-5 border-2 border-black rounded-md bg-blue-400 text-white'
            onClick={() => handleCreateUser()}
          >
            Create User
          </button>
        </div>
      </div>

      {/* Table */}
      <div className='p-10'>
        <table className='min-w-full table-auto border-collapse border border-gray-200'>
          <thead>
            <tr>
              <th className='border border-gray-300 px-4 py-2'>Username</th>
              <th className='border border-gray-300 px-4 py-2'>Phone</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map(user => (
              <tr key={user.id}>
                <td className='border border-gray-300 px-4 py-2'>
                  {user.username}
                </td>
                <td className='border border-gray-300 px-4 py-2'>
                  {user.phone}
                </td>
                <td>
                  <PencilIcon
                    height={20}
                    width={20}
                    onClick={() => handleEditUser(user)}
                  />
                </td>
                <td>
                  <XMarkIcon
                    height={20}
                    width={20}
                    onClick={() => setShowDeleteModal(!showDeleteModal)}
                  />
                </td>
                {showDeleteModal && (
                  <div className='fixed inset-0 z-10 flex items-center justify-center'>
                    <div
                      className='absolute inset-0 bg-black opacity-50'
                      onClick={() => setShowDeleteModal(false)}
                    ></div>
                    {/* Modal */}
                    <div className='relative shadow-lg z-20'>
                      <DeleteModal
                        setShowDeleteModal={setShowDeleteModal}
                        userId={user.id}
                      />
                    </div>{' '}
                  </div>
                )}
                <td>
                  <button
                    className='text-blue-400'
                    onClick={() => handleViewProfile(user)}
                  >
                    View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const DeleteModal = ({
  setShowDeleteModal,
  userId,
}: {
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>
  userId: number
}) => {
  const deleteUserFunction = useCallback(async (userId: number) => {
    await deleteUser(userId)
  }, [])
  return (
    <div className='flex flex-col w-96 h-40 items-center justify-center gap-2 bg-yellow-200 rounded-2xl border-2 border-gray-400'>
      <div>
        <h1>Are you sure want to delete?</h1>
      </div>
      <div className='flex justify-between items-center w-48'>
        <button
          className='text-gray-500 border border-gray-500 bg-white px-5 py-2 rounded-md'
          onClick={() => setShowDeleteModal(false)}
        >
          No
        </button>
        <button
          className='text-gray-500 border border-gray-500 bg-red-300 px-5 py-2 rounded-md'
          onClick={() => deleteUserFunction(userId)}
        >
          Yes
        </button>
      </div>
    </div>
  )
}
