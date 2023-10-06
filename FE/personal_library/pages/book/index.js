import { Inter } from 'next/font/google'
import { useRouter } from 'next/router'
import { useState } from 'react';
import { useEffect } from "react";
import Navbar from 'components/Navbar'; 
import Stack from '@mui/material/Stack';
import EditBook from 'components/EditBook'; 
import { Dialog } from '@mui/material';



const inter = Inter({ subsets: ['latin'] })


//http://52.66.202.110:8000/api/v1/users/1



/*
{
  "username": "kamal",
  "email": "tharakadissanayale70@gmail.com",
  "full_name": "Kamal hasan new",
  "disabled": false,
  "id": 1,
  "books": [
    {
      "title": "harry potter 2",
      "author": "J K polling",
      "published_date": "2023-10-05",
      "isbn": "XXS-34-SD-as2",
      "cover_image": "https://cdnssd.comm?id=3435",
      "id": 2,
      "owner_id": 1
    }
  ]
}


*/

export default function Book() {

  
  const [userId, setUserId] = useState(false);
  const [token, setToken] = useState(false);
  const [bookData, setBookData] = useState(false);
  const [userData, setUserData] = useState(false);
  const [bookId, setBookId] = useState(false);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);




  useEffect(() => {
    setUserId( sessionStorage.getItem("user_id"));
    setToken( sessionStorage.getItem("token"));
    const {id} = router.query;
    setTimeout(() => {
      console.log(router.query);
      console.log("id i am setting",id);
      setBookId(id);
      
    }, 1000);
   
   
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://52.66.202.110:8000/api/v1/users/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
            'Content-Type': 'application/json'
            // Add other headers if needed
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          throw new Error('Network response was not ok.');
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    if (token) {
      fetchData(); // Call the async function inside useEffect only if the token is available
    }
  }, [token]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://52.66.202.110:8000/api/v1/book/${bookId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
            'Content-Type': 'application/json'
            // Add other headers if needed
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBookData(data);
        } else {
          throw new Error('Network response was not ok.');
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    if (token) {
      fetchData(); // Call the async function inside useEffect only if the token is available
    }
  }, [bookId]);

  const handleDelete = async ()=>{
    try {
      const response = await fetch(`http://52.66.202.110:8000/api/v1/book/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const deletedBook = await response.json();
        console.log('book deleted successfully:', deletedBook);
        setTimeout(() => {
            router.push('/dashboard');
        }, 20);
 
      } else {
        console.error('Failed to delete book:', response.status);
        setAccessToken("INVALID");
        // Handle error: response.status, response.statusText, etc.
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      // Handle other errors like network issues, etc.
    }

  }




  console.log("book data",bookData);

  
  return (
    bookData && (
    <main><Navbar user={userData}/>
    <div className="min-h-screen bg-gray-900">
     <div className=" text-white rounded p-4 text-center mx-16 text-emerald-300">
        <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl break-words font-bold">{bookData.title}</h1>
    </div>
    <div className = "flex col-span-1 items-center justify-center h-full p-2 m-6">
            <img src={bookData.cover_image} width={200} height={300} alt={bookData.title} />
          </div>
   
          <div className = "flex col-span-1 items-center justify-center h-full  p-2 my-6 mx-16">
          <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl break-words font-bold">Book Details</h1>
          </div>
          <div className = "flex col-span-1 items-center justify-center h-full p-2 m-6">
            <table>
              <tr>
                <td className='border-separate border-spacing-6 border border-slate-500 px-16 py-2 mx-6 my-4 text-emerald-300'>Title</td>
                <td className='border-separate border-spacing-6 border border-slate-500 px-16 py-2 mx-6 my-4'>{bookData.title}</td>
              </tr>
              <tr>
                <td className='border-separate border-spacing-6 border border-slate-500 px-16 py-2 mx-6 my-4 text-emerald-300'>Author</td>
                <td className='border-separate border-spacing-6 border border-slate-500 px-16 py-2 mx-6 my-4'>{bookData.author}</td>
              </tr>
              <tr>
                <td className='border-separate border-spacing-6 border border-slate-500 px-16 py-2 mx-6 my-4 text-emerald-300'>Published Date</td>
                <td className='border-separate border-spacing-6 border border-slate-500 px-16 py-2 mx-6 my-4'>{bookData.published_date}</td>
              </tr>
              <tr>
                <td className='border-separate border-spacing-6 border border-slate-500 px-16 py-2 mx-6 my-4 text-emerald-300'>ISBN</td>
                <td className='border-separate border-spacing-6 border border-slate-500 px-16 py-2 mx-6 my-4'>{bookData.isbn}</td>
              </tr>
              <tr>
                <td className='border-separate border-spacing-6 border border-slate-500 px-16 py-2 mx-6 my-4 text-emerald-300'>Rating</td>
                <td className='border-separate border-spacing-6 border border-slate-500 px-16 py-2 mx-6 my-4'>{bookData.rating}/10</td>
              </tr>
            
            </table>   
          </div>
          <div className = "flex col-span-1 items-center justify-center h-full p-2 m-6 ">
            <Stack spacing={1} direction="row">
              {/* <button className = "rounded bg-green-500 mx-2 my-2 p-4 font-bold w-40" onClick={()=>{goToBook(bookData.id)}} >View</button> */}
              <button onClick={handleOpen} className = "rounded bg-green-600 mx-2 my-2 p-2 font-bold w-40" >Edit</button>
              <button onClick={()=>{handleDelete()}} className = "rounded bg-red-600 mx-4 my-2 p-2 font-bold w-40" >Delete</button>
            </Stack>
          </div>
       
           <div>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                disableScrollLock={true}
              >
                  <EditBook token = {token} closefunc = {handleClose} book = {bookData} bookId = {bookId} setBookData = {setBookData}/>
              </Dialog>
            </div>
        </div>
    </main>
    )
  )
}
