
import { Route, Routes, Navigate } from 'react-router-dom';
import { getContacts, saveContact, updateContact, updatePhoto } from './api/ContactService';
import './App.css';
import Header from './components/Header';
import { useEffect, useRef, useState } from 'react';
import ContactList from './components/ContactList';
import ContactDetails from './components/ContactDetails';
import 'react-toastify/dist/ReactToastify.css';
import { toastError, toastSuccess } from './api/ToastService';

import { ToastContainer } from 'react-toastify';


function App() {
  const modalRef = useRef();
  const fileRef = useRef();

  const toggleModal = show => show? modalRef.current.showModal() : modalRef.current.close();
  const [data, setData] = useState([]);
  const [file,setFile] = useState(undefined);
  const [currentPage, setCurrentPage] = useState(0);
  const [values, setValues] = useState({
    name :"",
    email :"",
    address :"",
    title:"",
    status : ""
  });

  const getAllContacts = async(page= 0, size =2) => {
    try{
      setCurrentPage(page);
      const {data} = await getContacts(page, size);

      setData(data);
     
    }catch(error){
      console.log(error)
      toastError("An error occurred , please try again later")
    }
  }
  

  const onChange =(event) =>{
    setValues({ ...values, [event.target.name]: event.target.value});
    
  }

  const handleUpdateContact = async(contact) =>{
    try{
      
      const response = await updateContact(contact);

      toastSuccess("Update Successful")
    }catch(error){
      console.error(error)
      toastError("An error occurred , please try again later")
    }
  }

  const updateImage =async(id, file) =>{
    try{
      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('id',id)

      const {data : photoUrl} = await updatePhoto(formData);
    
      toastSuccess("Update Successful")
       return await photoUrl;
    }catch(error){
      console.log(error)
      toastError("An error occurred , please try again later")
    }
  }

  const handleNewContact = async (event) => {
    event.preventDefault();    
    try{
      const {data} = await saveContact(values);
      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('id',data.id)
      const {data : photoUrl} = await updatePhoto(formData);
 
      toggleModal(false);

      setFile(undefined);
      fileRef.current.value = null;
      
      setValues({
        name :"",
        email :"",
        address :"",
        title:"",
        status : ""
      });
      toastSuccess("Created Contact Successfully")
      getAllContacts();


    }catch(error){
      console.error(error)
      toastError("An error occurred , please try again later")
    }
  }

  useEffect(() => {
    getAllContacts();
  },[])



  return (
    < >
      <Header toggleModal={toggleModal} contactsCount={data.totalElements}/>
      <main className="main">
        <div className="container">
          <Routes>
            <Route path='/' element={<Navigate to={'/contacts'} />} />
            <Route path="/contacts" element={<ContactList data={data}  currentPage={currentPage} getAllContacts={getAllContacts}/>} />
            <Route path="/contacts/:id" element={<ContactDetails updateContact={handleUpdateContact} updateImage={updateImage}/>} />
          </Routes>
        </div>
        </main>

        {/* modal */}
        <dialog ref={modalRef} className='modal' id="modal>">
          <div className='modal__header'>
            <h3>New Contact</h3>
            <i onClick={()=> toggleModal(false)} className="bi bi-x-lg"></i>
          </div>
          <div className="divider"></div>
          <div className="modal__body">
            <form onSubmit={handleNewContact}>
              <div className="user-details">
                <div className="input-box">
                  <span className='details'>Name</span>
                  <input type="text" value={values.name} onChange={onChange} name="name" required />
                </div>
                <div className="input-box">
                  <span className='details'>Email</span>
                  <input type="email" name="email" value={values.email} onChange={onChange} required />
                </div>
                <div className="input-box">
                  <span className='details'>Title</span>
                  <input type="text" name="title" value={values.title} onChange={onChange} required />
                </div>
                <div className="input-box">
                  <span className='details'>Phone Number</span>
                  <input type="text" name="phone" value={values.phone} onChange={onChange} required />
                </div>
                <div className="input-box">
                  <span className='details'>Address</span>
                  <input type="text" name="address" value={values.address} onChange={onChange} required />
                </div>
                <div className="input-box">
                  <span className='details'>Account Status</span>
                  <input type="text" name="status" value={values.status} onChange={onChange} required />
                </div>
                <div className="input-box">
                  <span className='details'>Profile Photo</span>
                 <input type="file" name="photo" onChange={(event) => setFile(event.target.files[0])} ref={fileRef} required />
                </div>

                

              </div>
              <div className='form_footer'>
                  <button type='button' className='btn btn-danger'>Cancel</button>
                  <button type='submit' className='btn '>Save</button>
                </div>
            </form>
          </div>
        </dialog>
      <ToastContainer />
    </>
  );
}


export default App;
