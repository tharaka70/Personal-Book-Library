import { Inter } from 'next/font/google'
import { useRouter } from 'next/router'
import { useState } from 'react';
import { useEffect } from "react";
import Navbar from 'components/Navbar'; 
import Stack from '@mui/material/Stack';
import AddBook from 'components/AddBook'; 
import { Dialog } from '@mui/material';

const inter = Inter({ subsets: ['latin'] })

//http://127.0.0.1:8000/api/v1/users/1



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

export default function Home() {
  
  const [userId, setUserId] = useState(false);
  const [token, setToken] = useState(false);
  const [userData, setUserData] = useState(false);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };





  useEffect(() => {
    setUserId( sessionStorage.getItem("user_id"));
    setToken( sessionStorage.getItem("token"));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/v1/users/${userId}`, {
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

  console.log("user data",userData);

  const goToBook = (bookId) =>{
    router.push(`/book?id=${bookId}`);
  }

  
  return (
    userData && (
    <main><Navbar user={userData}/>
    <div className="min-h-screen bg-gray-900">
     <div className=" text-white rounded p-4 text-center my-4 mx-6 border-solid border-2 border-emerald-600">
        <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl break-words font-bold">{userData.username}'s Personal Library </h1>
    </div>
    <div className=" my-4 mx-6 flex items-center justify-center h-full">
    <button className = "rounded bg-emerald-600 mx-2 my-2 p-2 font-bold" onClick={handleOpen} >ADD NEW BOOK</button>
    </div>
    <div className="mx-6 my-2">
    <div >
      {userData.books.map((book, index) => (
        <div className = "grid  sm:grid-cols-10 grid-cols-1 sm:gap-2 p-4" key={index}>
          <div className = "flex col-span-1 items-center justify-center h-full border-solid border-2 border-emerald-600">
            {/* <img src={book.cover_image} width={100} height={200} alt={book.title} /> */}
            {index + 1}
          </div>
          <div className = "col-span-7 rounded bg-stone-600 flex items-center p-4 h-full font-bold">
     
                {book.title} - {book.author}
  
          </div>
          <div className = "col-span-2 ">
            <Stack spacing={1} direction="column">
              <button className = "rounded bg-emerald-600 mx-2 my-2 p-4 font-bold" onClick={()=>{goToBook(book.id)}} >View</button>
            </Stack>
          </div>

        </div>
      ))}
    </div>
    </div>
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
  
          <AddBook token = {token} closefunc = {handleClose} />
      </Dialog>
    </div>
     </div>
    </main>
    )
  )
}
